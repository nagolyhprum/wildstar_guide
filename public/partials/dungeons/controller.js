wildstar.controller("dungeons", ["$scope", "$http", function($scope, $http) {
	$scope.global.navbar.activate($scope.global.title = "Dungeons");
	$http.post("dungeons/list").success(function(dungeons) {
		$scope.dungeons = dungeons;
	});
}]);