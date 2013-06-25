// grab the room from the URL
// var room = location.search && location.search.split('?')[1];

// create our webrtc connection
var webrtc = new WebRTC({
    // the id/element dom element that will hold "our" video
    localVideoEl: 'localVideo',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: 'remotes',
    // immediately ask for camera access
    autoRequestMedia: true,
    log: false
});

// when it's ready, join if we got a room from the URL
webrtc.on('readyToCall', function () {
    // you can name it anything
    if (room){
        webrtc.joinRoom(room);
        $('.videos').show();
    }
});

// Since we use this twice we put it here
function setRoom(name) {
    $('#createRoom').remove();
    $('#roomTitle').text(name);
    $('#subTitle').text('Link to join: ' + location.href);
    $('body').addClass('active');
}

if (room) {
    setRoom(room);
} else {
    $('#createRoom').submit(function () {
        var val = $('#roomName').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
        webrtc.createRoom(val, function (err, name) {
            var newUrl = location.pathname + '?' + name;
            if (!err) {
                history.replaceState({foo: 'bar'}, null, newUrl);
                setRoom(name);
            }
        });
        return false;
    });
}
webrtc.on('readyToCall', function(conversation_id){
    socket.emit('user.set', 'videoID', conversation_id);
    $('#localVideo video').attr('id', conversation_id);
});
// webrtc.on('videoAdded', function(element, conversation) {
// });

// webrtc.on('videoRemoved', function(el) {
// });
