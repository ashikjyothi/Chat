angular.module('app')
.controller('chatController', ['$scope', '$document', 'Socket', 'Session', '$state', '$timeout', function($scope, $document, Socket, Session, $state, $timeout) {
    $scope.user = Session.user.username;
    // $scope.room = Session.room;
    $scope.disconnect = function() {
        Socket.emit('logout', $scope.user, function() {
            console.log('Logout success')
            Session.clearUser(function() {
                $state.go('login', {});
            })
        })
    }
    $scope.sendMessage = function(text) {
        if (text && text.substr(0, 1) === '/') {
            var privatemsg = {};
            privatemsg.sender = $scope.user;
            privatemsg.user = text.substr(1, text.indexOf(' '));
            privatemsg.user = privatemsg.user.trim();
            privatemsg.msg = text.substring(text.indexOf(' '));
            privatemsg.room = $scope.room;
            $scope.messageInput = "";
            Socket.emit("PrivateMsg", privatemsg, function(response) {
                console.log("PrivateMsg response:" + response);
            });
        } else {
            var timestamp = moment().valueOf();
            var momentTime = moment.utc(timestamp);
            momentTime = momentTime.local().format('h:mm a');
            var newMessage = {
                sender: $scope.user,
                text: text,
                time: momentTime,
                room: $scope.room
            }
            Socket.emit("chatMessage", newMessage, function(response) {
                if (response == 'success') {
                    $scope.messages.push(newMessage)
                    $scope.messageInput = "";
                    $timeout(() => {
                        var container = document.getElementById('messageContainer');
                        container.scrollTop = container.scrollHeight - container.clientHeight;
                    });
                }
            });
        }
    }
    $scope.getMessages = function() {
        Socket.emit('getMessages', {}, function(messages) {
            console.log('Messages:', messages)
            $scope.messages = messages;
            $timeout(() => {
                var container = document.getElementById('messageContainer');
                if (container) {
                    container.scrollTop = container.scrollHeight - container.clientHeight;
                }
            });
        })
    }
    $scope.getMessages();
    Socket.on('chatMessage', function(message) {
        $scope.messages.push(message);
        $timeout(() => {
            var container = document.getElementById('messageContainer');
            container.scrollTop = container.scrollHeight - container.clientHeight;
        });
    })

    $scope.toggleModal = function() {
        var modal = document.getElementById('myModal')
        modal.style.display = 'block';
        $document.on('click', function(e) {
            if (e.target == modal) {
                modal.style.display = 'none';
                $document.off('click');
            }
        })
    }
}])