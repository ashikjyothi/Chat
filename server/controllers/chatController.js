'use strict';

var Users = require('./usersController');

module.exports = function(socket, conn) {
	
	var clientInfo = {};

    function addUser(un, cb) {
        var post = {
            socketid: un.socketid,
            username: un.username,
            room: un.room
        };
        conn.query("INSERT INTO User SET ?", [post], function(error, result) {
            if (error) {
                console.log("Error Saving Data", error)
                cb("error");
            } else {
                console.log("DATA SAVED IN MYDB");
                // console.log(result);
                cb("success");
            }
        });
    }

    function addMessage(message, cb) {
        var post = {
            sender: message.sender,
            text: message.text,
            time: message.time,
            room: message.room
        };
        conn.query("INSERT INTO Chat SET ?", [post], function(err, result) {
            if (err) {
                console.log("Error:", err);
            } else {
                console.log("CHAT SAVED IN MYDB");
                console.log(result);
                cb('success');
            }
        });
    }
    
    socket.on('initSocket', function(user) {
        console.log("NEW SOCKET ID::" + socket.id);
        conn.query("UPDATE User SET socketid = ? WHERE id = ?", [socket.id, user], function(err, result) {
            if (err) {
                console.error('ERROR!::::::::::' + err);
            } else {
                var user = Users.getUser(user);
                user.setSocketId(socket.id)                ;
                console.log("SOCKETID CHANGED IN MYDB");
                // console.log(result); 
            }
        });
    })
    
    socket.on('joinRoom', function(req) {
        clientInfo.socketID = {
            name: req.name,
            room: req.room
        };
        socket.join(req.room);
        socket.broadcast.to(req.room).emit('chatMessage', {
            sender: "System",
            text: req.name + " has joined chat!",
            time: "",
            room: req.room
        })
    })
    
    console.log("Connected");
    
    socket.on('register', function(Ud, fn) {
        Ud.socketid = socketID;
        // console.log("Ud.socketID:"+Ud.socketid);
        console.log("received register request")
        addUser(Ud, function(response) {
            fn(response);
        })
    })
    
    socket.on('PrivateMsg', function(pm, fn) {
        console.log("Received emitted privatemsg from:" + pm.sender);
        /*===============================================
        =            Find PM USER from my_db            =
        ===============================================*/
        conn.query('SELECT * FROM `User` WHERE `username` = ?', [pm.user], function(error, result) {
            if (error) {
                console.log("Private message not send-Invalid User");
            } else {
                console.log("FOUND PM RECEIVER FROM MYDB");
                console.log("MYDB PM RESULTLEN:" + result.length);
                console.log("Private User name" + result[0].username);
                var socketID = result[0].socketid;
                console.log("Private User SocketID" + result[0].socketid);
                io.to(socketID).emit('chatMessage', {
                    sender: pm.sender,
                    text: pm.msg,
                    time: "Private Message",
                    room: pm.room
                })
                fn(result);
            }
        });
    })
    
    socket.on('chatMessage', function(message, fn) {
        addMessage(message, function(response) {
            if (response == 'success') {
                socket.broadcast.emit('chatMessage', message)
                fn('success');
            } else {
                fn('error');
            }
        })
    })
    
    socket.on('getMessages', function(input, fn) {
        /*==========================================
        =            get msgs from mydb            =
        ==========================================*/
        conn.query('SELECT * FROM `Chat`', function(error, results) {
            if (error) {
                console.log("error:", error);
                fn(error);
            } else {
                console.log("FETCHED MSGS FROM MYDB");
                // console.log(results);
                fn(results);
            }
        });
    })
    
    socket.on('logout', function(user, cb) {
        /*=============================================
        =            delete user from mydb            =
        =============================================*/
        conn.query('DELETE FROM User WHERE socketid = ?', [socket.id], function(error, results, fields) {
            if (error) {
                console.log('User remove err:::', error);
            } else {
                console.log("USER DELETED FROM MYDB");
                cb();
            }
        })
        console.log('disconnect')
    })
}