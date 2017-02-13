angular.module('app')
    .service('Session', function() {
        this.user = window.user;
    })