wildstar.controller("dungeons", ["$scope", "$http", function($scope, $http) {	
	$scope.navbar.activate($scope.set("title", "Dungeons"));
	if(!$scope.dungeons) {	
		$scope.loader.show();
		$http.post("dungeons/list").success(function(dungeons) {
			$scope.set("dungeons", dungeons);
			$scope.loader.hide();
		});
	}
}]);