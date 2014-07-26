wildstar.controller("dungeons", ["$scope", "$http", function($scope, $http) {	
	$scope.navbar.activate($scope.set("title", "Dungeons"));
	$scope.plural = "dungeons";
	$scope.singular = "dungeon";
}]);