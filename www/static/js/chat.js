var URL = window.location.protocol + "//" + window.location.host;
console.log("Connecting to " + URL);
var socket = io.connect(URL);

var username = '';
var letters = '0123456789ABCDEF'.split('');
for (var i = 0; i < 6; i++ ) {
   username += letters[Math.round(Math.random() * 15)];
}

var parser = document.createElement('a');
parser.href = location.href;
var room = parser.search.substr(1);
// pathname

// Query room list on connect
socket.on('connect', function(){
    socket.emit('roomlist');
});

// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function(){
    // call the server-side function 'adduser' and send room name and username
    if(room){
        socket.emit('adduser', room, username);
    }
    // prompt("What's your name?")
});

// listener, whenever the server emits 'roomlist', this updates the room list
socket.on('roomlist', function(rooms){
    $('.rooms').empty();
    $.each(rooms, function(key, value) {
        $('.rooms').append('<a href="?' + key + '">' + key + '</a>');
    });
});

// listener, whenever the server emits 'updatechat', this updates the chat body
socket.on('updatechat', function (username, message) {
    $('.messages').append('<div class="message"><b>'+ username + ':</b> ' + message + '</div>');
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
    $('#addroom').click( function() {
        var room_name = $('#room').val();
        $('#room').val('');
        // tell server to execute 'addroom' and send along one parameter
        socket.emit('addroom', room_name);
        // automatically join server
        parser.href = '?' + room_name;
        location.href = parser;
        $(this).add('#room').remove();
    });
    // if a room is joined
    if(room){
        $('#addroom').add('#room').remove();
        $('.chat').show();
    }
});
