var STATIC_ROOT = __dirname + '/static/';

var port = process.env.PORT || 8080; // BUG : set to 5000 but not defined in env. (foreman)
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var userManager = require(STATIC_ROOT + '/js/user');

// Serve static files
app.use(express.static(STATIC_ROOT));

// Start server
console.log("Listening on port " + port);
server.listen(port);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// usernames which are currently connected to the chat
var rooms = {};
var SERVER = {'username': 'SERVER'};

io.sockets.on('connection', function (socket) {

	// Room crud
	socket.on('room.get', function(){
		socket.emit('room.list', rooms);
	});
	socket.on('room.delete', function(room){
		// TODO : notify room's occupants the room is closed ?
		if(socket.room){
			delete rooms[socket.room.name];
			delete socket.room;
		}
		io.sockets.emit('room.list', rooms);
	});

	// User crud (per room)
	socket.on('user.all', function(){
		if(socket.room) socket.in(socket.room).broadcast.emit('user.list', socket.room.users);
		else socket.in(socket.room).broadcast.emit('user.list', {});
	});
	socket.on('user.get', function(){
		socket.in(socket.room).emit('user.user', socket.user);
	});
	socket.on('user.set', function (attribute, value){
		socket.user = socket.room.editUser(socket.user.userID, attribute, value);
		socket.in(socket.room).broadcast.emit('user.list', socket.room.users);
	});
	socket.on('user.add', function (room, username) {
		// Save your room and join it
		if (!(room in rooms)){
			rooms[room] = new userManager(room);
			io.sockets.emit('room.list', rooms);
		}
		socket.room = rooms[room];
		socket.user = socket.room.addUser(username);
		// rooms[room][socket.user.userID] = socket.user;
		// rooms[room] = room;
		socket.join(socket.room);
		// echo to client they've connected
		socket.emit('user.updatechat', SERVER, 'you have connected to ' + socket.room.name);
		// echo globally (all clients) that a person has connected
		socket.in(socket.room).broadcast.emit('user.updatechat', SERVER, socket.user.username + ' has connected');
		// Emit new user list for the room
		socket.in(socket.room).broadcast.emit('user.list', socket.room.users);
	});
	// when the client emits 'user.talk', this listens and executes
	socket.on('user.talk', function (message) {
		socket.in(socket.room).broadcast.emit('user.updatechat', socket.user, message);
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		if(socket.user){
			// echo globally that this client has left
			socket.in(socket.room).broadcast.emit('user.updatechat', SERVER, socket.user.username + ' has disconnected');
			socket.room.removeUser(socket.user.userID);
			socket.in(socket.room).broadcast.emit('user.list', socket.room.users);
			delete socket.user;
		}
		// remove the username from room usernames list
		// console.log(socket.room, socket.user.username);
		// if(socket.room && socket.user){
		// 	delete rooms[socket.room][socket.user.userID];
		// 	// Delete the room if it's empty
		// 	// console.log(socket.room, rooms[socket.room])
		// 	if(socket.room && rooms[socket.room].length === 0){
		// 		delete rooms[socket.room];
		// 	}
		// 	delete socket.room;
		// }
		// Emit new user list for the room
		socket.in(socket.room).emit('user.list', socket.room.users);
	});
});
