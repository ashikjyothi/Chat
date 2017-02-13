angular.module('app')
.service('Socket', function($timeout, Session) {
    var socket = io();
    socket.on('connect', function() {
        if (Session.user) {
            socket.emit('initSocket', Session.user.id)
        }
    })
    this.emit = function(event, data, cb) {
        console.log("Emitting::", event, data);
        socket.emit(event, data, function(response) {
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