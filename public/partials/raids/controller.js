wildstar.controller("raids", ["$scope", "$http", function($scope, $http) {
	$scope.navbar.activate($scope.set("title", "Raids"));	
	$scope.singular = "raid";
	$scope.plural = "raids";
}]);