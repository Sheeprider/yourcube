// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

function chatUser() {
    this.color = "#FFFFFF";
    this.divID = "0";
    this.userID = "0";
    this.userName = "Pipo";
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
    adduser: function(el) {
        // add the div from the userID with a border
        // Take the first available div
        newUser = new(chatUser);
        newUser.randomizecolor();
        this.users.push(newUser);
        var userCount = this.users.length;
        newUser.userID = el.id;

        var searchResult = $(".empty");
        if (searchResult.length != 0) {
            // On attribue la room à quelqu'un
            searchResult.removeClass("empty");
            searchResult.css({'border': '5px solid '+newUser.color});
            newUser.divID = searchResult;
        } else
        {
            // Soit on créé 2 chatrooms...
            $("#chatRooms").append('<div class="row"><div class="span6"><div id="chatRoom'+userCount+'" class="empty chatContainer"><div id="chatName'+userCount+'" class="chatName"></div></div></div><div class="span6"><div id="chatRoom'+(userCount+1)+'" class="empty chatContainer"><div id="chatName'+(userCount+1)+'" class="chatName"></div></div></div></div>');

            // et on en attribue une
            searchResult = $(".empty");
            searchResult.first().removeClass("empty");
            searchResult.first().css({'border': '5px solid '+newUser.color});
            newUser.divID = searchResult.first();
       }

      // get User name for newUser.userName

      $(el).clone().prependTo("#chatRoom" + userCount);
      $("#chatRoom" + userCount).addClass(el.id);
      $("#chatName" + userCount).html(newUser.userName);
      $(el).remove();
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

