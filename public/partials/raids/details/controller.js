wildstar.controller("raid_details", ["$scope", "$routeParams", function($scope, $routeParams) {
	$scope.$watch("raids", function() {
		if($scope.raids) {
			$scope.raid = {
				name : $scope.raids[$routeParams.raid].name,
				description : $scope.raids[$routeParams.raid].description
			};
		}
	});
	$scope.save = function() {	
		$scope.raids[$routeParams.raid] = $scope.raid;
		//TODO SAVE
	};		
}]);