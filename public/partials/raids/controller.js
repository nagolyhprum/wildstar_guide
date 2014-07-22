wildstar.controller("raids", ["$scope", "$http", function($scope, $http) {
	$scope.navbar.activate($scope.set("title", "Raids"));	
	if(!$scope.raids) {
		$scope.loader.show();
		$http.post("raids/list").success(function(raids) {
			$scope.set("raids", raids);
			$scope.loader.hide();
		});	
	}
}]);