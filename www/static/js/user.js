function chatUser() {
    this.color = "#FFFFFF";
    this.divID = "0";
    this.userID = "0";
    this.randomizecolor = function () {
        var letters = '0123456789ABCDEF'.split('');
            this.color = '#';
            for (var i = 0; i < 6; i++ ) {
                this.color += letters[Math.round(Math.random() * 15)];
            }
    }
    this.userDiv="";
}
var usersManager = {
    number:0,
    users: Array(),
    adduser: function(userID) {
        // add the div from the userID with a border
        // Take the first available div
        newUser = new(chatUser);
        newUser.randomizecolor();
        this.users.push(newUser);

        /*
        var searchResult = $(".empty");
        if (searchResult.length != 0) {
            // On attribue la room à quelqu'un
            searchResult.removeClass("empty");
            searchResult.css({'border': '5px solid '+newUser.color});
            newUser.divID = searchResult;
        } else
        {
            // Soit on créé 2 chatrooms...
            var userCount = this.users.length;
            $("#chatRooms").append('<div class="row"><div class="span6"><div id="chatRoom'+userCount+'" class="empty chatContainer"></div></div><div class="span6"><div id="chatRoom'+(userCount+1)+'" class="empty chatContainer"></div></div></div>');

            // et on en attribue une
            searchResult = $(".empty");
            searchResult.first().removeClass("empty");
            searchResult.first().css({'border': '5px solid '+newUser.color});
            newUser.divID = searchResult.first();
       }
       */

    },
    removeUser: function(userID) {
        // Remove the div from the userID
    }
}

//var shuffle = getFluidGridFunction('#remotes >');
//$(window).on('resize', shuffle);
//webrtc.on('videoAdded', shuffle);
//webrtc.on('videoRemoved', shuffle);

function talk(id, text)
{
    if (id == 0)
    {
        $('#localVideo').attr('data-original-title', text);
        $('#localVideo').tooltip("show");
    } else
    {
        var temp = $('#remotes >');
        $(temp[1]).attr('data-original-title', text);
        $(temp[1]).tooltip("show");
    }
}
