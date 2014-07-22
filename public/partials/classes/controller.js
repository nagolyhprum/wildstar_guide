wildstar.controller("classes", ["$scope", "$http", function($scope, $http) {
	$scope.navbar.activate($scope.set("title", "Classes"));		
	if(!$scope.classes) {
		$scope.loader.show();
		$http.post("classes/list").success(function(classes) {
			$scope.set("classes", classes);
			$scope.loader.hide();
		});	
	}
}]);