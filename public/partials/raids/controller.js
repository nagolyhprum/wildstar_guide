wildstar.controller("raids", ["$scope", "$http", function($scope, $http) {
	$scope.navbar.activate($scope.set("title", "Raids"));	
	$scope.raid = {};
	if(!$scope.raids) {
		$scope.loader.show();
		$http.post("raids/list").success(function(raids) {
			$scope.set("raids", raids);
			$scope.loader.hide();
		});	
	}
	$scope.save = function() {	
		$scope.loader.show();
		$scope.raids.push($scope.raid);
		$http.post("raids/save", {
			raid : $scope.raid,
			accessToken : Cookies.getItem("accessToken")
		}).success(function(data) {
			$scope.raid = data;
			$scope.loader.hide();
		});
	};
}]);