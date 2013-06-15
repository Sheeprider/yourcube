var URL = window.location.protocol + "//" + window.location.host;
console.log("Connecting to " + URL);
var socket = io.connect(URL);

var username = 'ghjkl';
var room = 'room1';
// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function(){
    // call the server-side function 'adduser' and send room name and username
    socket.emit('adduser', room, username);
    // prompt("What's your name?")
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
});
