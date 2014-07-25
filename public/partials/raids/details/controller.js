wildstar.controller("raid_details", ["$scope", "$routeParams", "$http", function($scope, $routeParams, $http) {
	$scope.$watch("raids", function() {
		if($scope.raids) {
			$scope.raid = {
				name : $scope.raids[$routeParams.raid].name,
				description : $scope.raids[$routeParams.raid].description,
				_id : $scope.raids[$routeParams.raid]._id
			};
		}
	});
	$scope.save = function() {	
		$scope.loader.show();
		$scope.raids[$routeParams.raid] = $scope.raid;
		$http.post("raids/save", {
			raid : $scope.raid,
			accessToken : Cookies.getItem("accessToken")
		}).success(function(data) {
			$scope.loader.hide();		
		});
	};		
}]);