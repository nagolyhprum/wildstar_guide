wildstar.controller("classes", ["$scope", "$http", function($scope, $http) {
	$scope.navbar.activate($scope.set("title", "Classes"));		
	if(!$scope.classes) {
		$scope.loader.show();
		$http.post("classes/list").success(function(classes) {
			$scope.set("classes", classes);
			$scope.loader.hide();
		});	
	}
	$scope.save = function() {	
		$scope.classes.push($scope.class);
		$http.post("classes/save", {
			class : $scope.class,
			accessToken : Cookies.getItem("accessToken")
		}).success(function(data) {
			
		});
	};
}]);