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
    $('form').remove();
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

webrtc.on('videoAdded', function(el) {
    var divID = $(el).attr("id");
    var addedVideos = $('.chatContainer:not(.empty):not(#chatRoom0)');
    var addedIDs = [];
    addedVideos.each(function(key, elem){
        if($(elem).attr('id')){
            addedIDs.push($(elem).attr('id').substr(8));
        }
    });
    var userToAdd = {};
    $(userManager.users).each(function(key, user){
        if (addedIDs.indexOf(user.userID) < 0){
            userToAdd = user;
        }
    });
    var search = $('#chatRooms .empty');
    if (search.length > 0){
        search.attr('id', 'chatRoom' + userToAdd.userID);
        search.removeClass('empty');
    } else {
        var div = '<div class="row"><div class="span6"><div id="chatRoom'+ userToAdd.userID +'" class="chatContainer"></div></div><div class="span6"><div id="" class="empty chatContainer"></div></div></div>';
        $('#chatRooms').append(div);
    }
    // $('#chatRoom'+ userToAdd.userID).css({'border': '5px solid '+ userToAdd.color});

    $(el).clone().appendTo('#chatRoom'+ userToAdd.userID);
    $(el).remove();
});

webrtc.on('videoRemoved', function(el) {
  userManager.removeUser(el);
  return true;
});
