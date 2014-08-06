wildstar.controller("arenas", ["$scope", "$http", function($scope, $http) {	
	$scope.navbar.activate($scope.set("title", "Arenas & Battlegrounds"));
	$scope.singular = "arena";
	$scope.plural = "arenas";
}]);