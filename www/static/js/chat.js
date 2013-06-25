var URL = window.location.protocol + "//" + window.location.host;
console.log("Connecting to " + URL);
var socket = io.connect(URL);

// Generate random username
var username = '';
var letters = '0123456789ABCDEF'.split('');
for (var i = 0; i < 6; i++ ) {
   username += letters[Math.round(Math.random() * 15)];
}

// Get room from url
var parser = document.createElement('a');
parser.href = location.href;
var room = parser.search.substr(1);

// Query room list on connect
socket.on('connect', function(){
    socket.emit('room.get');

    // console.log(socket.room);
    // call the server-side function 'user.add' and send room name and username
    if(room){
        // if(!socket.room)socket.emit('room.add', room);
        socket.emit('user.add', room, username);
    }
    // console.log(socket.room);
});

// listener, whenever the server emits 'roomlist', this updates the room list
socket.on('room.list', function(rooms){
    $('#roomsDropdown').empty();
    $.each(rooms, function(key, value) {
        $('#roomsDropdown').append('<li role="presentation"><a role="menuitem" tabindex="-1" href="?' + key + '">' + key + '</a></li>');
    });
});

// listener, whenever the server emits 'user.list', this updates the user list
socket.on('user.all', function(userList) {
    $('.users').empty();
    $.each(userList, function(username, user) {
        $('.users').append('<div>' + username + '</div>');
    });
});

// listener, whenever the server emits 'updatechat', this updates the chat body
socket.on('user.updatechat', function (user, message) {
    $('#messages').append('<p class="message"><span class="username">'+ user.username + ':</span> ' + message + '</p>');
    // talk(user, message);
});

// on load of page
$(function(){
    // when the client clicks SEND
    $('#datasend').click( function() {
        var message = $('#data').val();
        $('#data').val('');
        // tell server to execute 'sendchat' and send along one parameter
        socket.emit('user.talk', message);
    });

    // when the client hits ENTER on their keyboard
    $('#data').keypress(function(e) {
        if(e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
        }
    });

    // when the client adds a room
    $('#createRoom').submit(function(e) {
        var room_name = $('#roomName').val();
        $('#roomName').val('');
        // tell server to execute 'addroom' and send along one parameter
        socket.emit('room.add', room_name);
        // automatically join server
        parser.search = '?' + room_name;
        location.href = parser.href;
        e.preventDefault();
    });
});


// this.talk = function(text){
//     if (user.username === userManager.user.username){
//         $('#localVideo').attr('data-original-title', text);
//         $('#localVideo').tooltip("show");
//     } else {
//         var temp = $('#chatRoom' + user.userID);
//         $(temp).attr('data-original-title', text);
//         $(temp).tooltip("show");
//     }
// };
