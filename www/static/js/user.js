function chatUser(user) {
    this.color = "#FFFFFF";
    this.divID = "";
    this.userID = user.userID;
    this.username = user.username;
    this.randomizecolor = function () {
        var letters = '0123456789ABCDEF'.split('');
            this.color = '#';
            for (var i = 0; i < 6; i++ ) {
                this.color += letters[Math.round(Math.random() * 15)];
            }
    };
    this.userDiv="";
}
var userManager = {
    users: [],
    addUser: function(user) {
        newUser = new chatUser(user);
        newUser.randomizecolor();
        this.users.push(newUser);
        return newUser;
    },
    addMainUser: function(user) {
        this.user = this.addUser(user);
    },
    removeUser: function(userID) {
        // Remove the div from the userID
    }
};

//var shuffle = getFluidGridFunction('#remotes >');
//$(window).on('resize', shuffle);
//webrtc.on('videoAdded', shuffle);
//webrtc.on('videoRemoved', shuffle);

function talk(id, text)
{
    if (id === 0)
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
