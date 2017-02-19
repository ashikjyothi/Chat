angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('empty', {
                url: '/',
            })
            .state('login', {
                url: '/login',
                views: {
                    'content': {
                        templateUrl: 'components/login/login.html'
                    }
                }
            })
            .state('frontpage', {
                url: '/frontpage',
                views: {
                    'content': {
                        templateUrl: 'components/frontpage/frontpage.html'
                    }
                }
            })
            .state('chat', {
                url: '/chat',
                views: {
                    'content': {
                        templateUrl: 'components/chat/chat.html'
                    }
                }
            })

    }])
    .run(['$rootScope', '$state', 'Session', function ($rootScope, $state, Session) {
        $rootScope.$on('$stateChangeStart', function (e, toState) {
            console.log('inside .run')
            if (toState.url == '/') {
                e.preventDefault();
                if (Session.user) {
                    $state.go('frontpage')
                } else {
                    $state.go('login')
                }
            } else if (!Session.user && toState.url != '/login') {
                e.preventDefault();
                $state.go('login')
            } else if (Session.user && toState.url == '/login') {
                e.preventDefault();
                $state.go('chat')
             } //else if (Session.user && toState.url == '/frontpage') {
            //     e.preventDefault();
            //     $state.go('frontpage') 
            // }
            return;
        });
    }])
