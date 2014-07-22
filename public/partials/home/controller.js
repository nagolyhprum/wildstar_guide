wildstar.controller("home", ["$scope", "$http", function($scope, $http) {
	$scope.navbar.activate($scope.set("title", "Home"));
}]);	