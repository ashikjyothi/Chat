angular.module('app')
.controller('loginController', ['$scope', '$document', 'Socket', 'Session', '$state', '$timeout', '$http', function($scope, $document, Socket, Session, $state, $timeout, $http){

	$scope.errorText = '';
	if(angular.isUndefined($scope.username) || angular.isUndefined($scope.password)){
		$scope.errorText = "Enter Valid Details"
	}else{

	}
}