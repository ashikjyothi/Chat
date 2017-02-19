angular.module('app').controller('frontpageController', ['$scope', '$document', 'Socket', 'Session', '$state', '$timeout', function($scope, $document, Socket, Session, $state, $timeout) {
    $scope.user = Session.user.username;
    $scope.enterRoom = function(room) {
        Socket.emit('joinRoom', room, function(res) {
            $state.go('chat')
        })
    }
    Socket.emit("getRooms", {}, function(res) {
        console.log("getRooms");
        console.log(res.roomname);
        $scope.rooms = res;
    })
    Socket.emit("getUsers", {}, function(res) {
        console.log("getUsers");
        console.log(res);
        $scope.users = res;
    })
}]);