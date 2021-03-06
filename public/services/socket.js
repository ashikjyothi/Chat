angular.module('app')
.service('Socket', function($timeout, Session) {
    var socket = io();
    socket.on('connect', function() {
        if (Session.user) {
            socket.emit('initSocket', Session.user)
            console.log("INITSOCKET::",Session.user);

        }
    })
    this.emit = function(event, data, cb) {
        console.log("Emitting::", event, data);
        socket.emit(event, {id: Session.user.id ,name:Session.user.name, data:data }, function(response) {
            if (cb) {
                $timeout(function() {
                    cb(response);
                })
            }
        });
    }
    this.on = function(event, callback) {
        socket.on(event, function(cb) {
            $timeout(function() {
                callback(cb);
            })
        })
    }
})