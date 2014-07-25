wildstar.controller("dungeons", ["$scope", "$http", function($scope, $http) {	
	$scope.navbar.activate($scope.set("title", "Dungeons"));
	if(!$scope.dungeons) {	
		$scope.loader.show();
		$http.post("dungeons/list").success(function(dungeons) {
			$scope.set("dungeons", dungeons);
			$scope.loader.hide();
		});
	}
	$scope.save = function() {	
		$scope.dungeons.push($scope.dungeon);
		$http.post("dungeons/save", {
			dungeon : $scope.dungeon,
			accessToken : Cookies.getItem("accessToken")
		}).success(function(data) {
			
		});
	};
}]);