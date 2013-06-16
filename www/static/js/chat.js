var URL = window.location.protocol + "//" + window.location.host;
console.log("Connecting to " + URL);
var socket = io.connect(URL);

// Generate random username
var username = '';
var letters = '0123456789ABCDEF'.split('');
for (var i = 0; i < 6; i++ ) {
   username += letters[Math.round(Math.random() * 15)];
}

var parser = document.createElement('a');
parser.href = location.href;
var room = parser.search.substr(1);

// Query room list on connect
socket.on('connect', function(){
    socket.emit('roomlist');
});

socket.on('connect', function(){
    // call the server-side function 'adduser' and send room name and username
    if(room){
        socket.emit('adduser', room, username, function(user) {
            userManager.addMainUser(user);
        });
    }
    // prompt("What's your name?")
});

// listener, whenever the server emits 'roomlist', this updates the room list
socket.on('roomlist', function(rooms){
    $('#roomsDropdown').empty();
    $.each(rooms, function(key, value) {
        $('#roomsDropdown').append('<li role="presentation"><a role="menuitem" tabindex="-1" href="?' + key + '">' + key + '</a></li>');
    });
});

// listener, whenever the server emits 'updatechat', this updates the chat body
socket.on('updatechat', function (user, message) {
    $('.messages').append('<div class="message"><b>'+ user.username + ':</b> ' + message + '</div>');
    $('#chatTable').append('<tr><td>'+ user.username + ':</b> ' + message + '</td></tr>');
    talk(user, message);
});

// listener, whenever the server emits 'updateusers', this updates the username list
socket.on('updateusers', function(data) {
    $('.users').empty();
    $.each(data, function(key, value) {
        $('.users').append('<div>' + key + '</div>');
    });
});

// on load of page
$(function(){
    // when the client clicks SEND
    $('#datasend').click( function() {
        var message = $('#data').val();
        $('#data').val('');
        // tell server to execute 'sendchat' and send along one parameter
        socket.emit('sendchat', message);
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
        socket.emit('addroom', room_name);
        // automatically join server
        parser.search = '?' + room_name;
        location.href = parser.href;
        e.preventDefault();
    });
});
