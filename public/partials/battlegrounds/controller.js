wildstar.controller("battlegrounds", ["$scope", "$http", function($scope, $http) {	
	$scope.navbar.activate($scope.set("title", "Arenas & Battlegrounds"));
	$scope.battleground = {};
	if(!$scope.battlegrounds) {
		$scope.loader.show();
		$http.post("battlegrounds/list").success(function(battlegrounds) {
			$scope.set("battlegrounds", battlegrounds);
			$scope.loader.hide();
		});
	}
	$scope.save = function() {	
		$scope.loader.show();
		$scope.battlegrounds.push($scope.battleground);
		$http.post("battlegrounds/save", {
			battleground : $scope.battleground,
			accessToken : Cookies.getItem("accessToken")
		}).success(function(data) {
			$scope.battleground = data;
			$scope.loader.hide();
		});
	};
}]);