wildstar.controller("forums", ["$scope", "$http", function($scope, $http) {	
	$scope.navbar.activate($scope.set("title", "Forums"));
	$scope.singular = "forum";
	$scope.plural = "forums";
	$scope.minPermissions = 5;
}]);