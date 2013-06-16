var port = process.env.PORT || 8080; // BUG : set to 5000 but not defined in env. (foreman)
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// Serve static files
app.use(express.static(__dirname + '/static'));

// Start server
console.log("Listening on port " + port);
server.listen(port);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// usernames which are currently connected to the chat
var rooms = {};

io.sockets.on('connection', function (socket) {

	// when the user query room list or roomlist get updated
	socket.on('roomlist', function(){
		io.sockets.emit('roomlist', rooms);
	});
	socket.on('addroom', function(room){
		rooms[room] = {};
		io.sockets.emit('roomlist', rooms);
	});

	// join to room and save the room name
	socket.on('adduser', function (room, username) {
		// we store the username in the socket session for this client
		socket.username = username;
		// add the client's username to the global list
		if(!rooms[room]){
			rooms[room] = {}
		}
		rooms[room][username] = username;
		// Save your room and join it
		socket.room = room;
		// rooms[room] = room;
		socket.join(socket.room);
		// echo to client they've connected
		socket.in(socket.room).emit('updatechat', 'SERVER', 'you have connected to ' + socket.room);
		// echo globally (all clients) that a person has connected
		socket.in(socket.room).broadcast.emit('updatechat', 'SERVER', username + ' has connected');
		// update the list of users in chat, client-side
		io.sockets.in(socket.room).emit('updateusers', rooms[socket.room]);
	});

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (message) {
		// console.log(socket);
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat', socket.username, message);
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from room usernames list
		// console.log(socket.room, socket.username);
		if(socket.room && socket.username){
			delete rooms[socket.room][socket.username];
			// Delete the room if it's empty
			// console.log(socket.room, rooms[socket.room])
			if(socket.room && rooms[socket.room].length === 0){
				delete rooms[socket.room]
			}
			delete socket.room;
		}
		// update list of users in chat, client-side
		socket.in(socket.room).emit('updateusers', rooms[socket.room]);
		// echo globally that this client has left
		socket.broadcast.in(socket.room).emit('updatechat', 'SERVER', socket.username + ' has disconnected');
	});
});
