function toggleHistory() {
    $('.chatroomContainer').toggle();

}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

function chatUser(user) {
    this.color = "#FFFFFF";
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
    removeUser: function(el) {
        // Remove the div from the userID
        var name='.'+el.id;
        $(name).addClass("empty");
        $(name).removeClass(el.id);
        $(el).remove();

        // Delete user when el.id = userID
        for (var i=0;i<this.users.length;i++)
        {
            if ( this.users[i]["userID"] == el.id )
            {
                this.users.remove(i);
                break;
            }
        }
    }
};

//var shuffle = getFluidGridFunction('#remotes >');
//$(window).on('resize', shuffle);
//webrtc.on('videoAdded', shuffle);
//webrtc.on('videoRemoved', shuffle);

function talk(user, text){
    if (user === userManager.user){
        $('#localVideo').attr('data-original-title', text);
        $('#localVideo').tooltip("show");
    } else {
        var temp = $('#remotes #chatRoom' + user.userID);
        $(temp).attr('data-original-title', text);
        $(temp).tooltip("show");
    }
}
