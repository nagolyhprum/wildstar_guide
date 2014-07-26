wildstar.controller("battlegrounds", ["$scope", "$http", function($scope, $http) {	
	$scope.navbar.activate($scope.set("title", "Arenas & Battlegrounds"));
	$scope.singular = "battleground";
	$scope.plural = "battlegrounds";
}]);