wildstar.controller("battlegrounds", ["$scope", "$http", function($scope, $http) {	
	$scope.navbar.activate($scope.set("title", "Arenas & Battlegrounds"));
	if(!$scope.battlegrounds) {
		$scope.loader.show();
		$http.post("battlegrounds/list").success(function(battlegrounds) {
			$scope.set("battlegrounds", battlegrounds);
			$scope.loader.hide();
		});
	}
}]);