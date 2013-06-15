var port = process.env.PORT || 8080; // BUG : set to 5000 but not defined in env.
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
var usernames = {};

io.sockets.on('connection', function (socket) {
	// join to room and save the room name
	socket.on('adduser', function (room, username) {
		// we store the username in the socket session for this client
		socket.username = username;
		// add the client's username to the global list
		usernames[username] = username;
		// Save your room and join it
		socket.set('room', room);
		socket.join(room);
		// echo to client they've connected
		socket.in(socket.room).emit('updatechat', 'SERVER', 'you have connected');
		// echo globally (all clients) that a person has connected
		socket.broadcast.in(socket.room).emit('updatechat', 'SERVER', username + ' has connected');
		// update the list of users in chat, client-side
		io.sockets.in(socket.room).emit('updateusers', usernames);
	});

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (message) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat', socket.username, message);
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
	});
});
