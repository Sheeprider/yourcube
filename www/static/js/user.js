var letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// function toggleHistory() {
//     $('.chatroomContainer').toggle();
// }

// Array Remove - By John Resig (MIT Licensed)
// Array.prototype.remove = function(from, to) {
//     var rest = this.slice((to || from) + 1 || this.length);
//     this.length = from < 0 ? this.length + from : from;
//     return this.push.apply(this, rest);
// };

var chatUser = function(username, room) {
    this.color = "#FFFFFF";
    this.userID = '';
    this.videoID = '';
    this.username = username;
    this.randomizeID();
};
chatUser.prototype.randomizeID = function () {
    for (var i = 0; i < 20; i++ ) {
        this.userID += letters[Math.round(Math.random() * 36)];
    }
};
chatUser.prototype.randomizecolor = function () {
    this.color = '#';
    for (var i = 0; i < 6; i++ ) {
        this.color += letters[Math.round(Math.random() * 15)];
    }
};

var userManager = function(name){
    this.name = name;
    this.users = {};
};
userManager.prototype.addUser = function(username) {
    newUser = new chatUser(username);
    newUser.randomizecolor();
    this.users[newUser.userID] = newUser;
    return newUser;
};
userManager.prototype.editUser = function(userID, attribute, value) {
    this.users[userID][attribute] = value;
    return this.users[userID];
};
userManager.prototype.removeUser = function(userID) {
    delete this.users[userID];
    // Remove the div from the userID
    // var name='.'+el.id;
    // $(name).addClass("empty");
    // $(name).removeClass(el.id);
    // $(el).remove();

    // // Delete user when el.id = userID
    // for (var i=0;i<this.users.length;i++)
    // {
    //     if ( this.users[i]["userID"] == el.id )
    //     {
    //         this.users.remove(i);
    //         break;
    //     }
    // }
};

module.exports = userManager;
