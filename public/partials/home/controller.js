wildstar.controller("home", ["$scope", "$http", function($scope, $http) {
	$scope.global.navbar.activate($scope.global.title = "Home");
	$http.post("home/list").success(function(home) {
		$scope.home = home;
	});
}]);	