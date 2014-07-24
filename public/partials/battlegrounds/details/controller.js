wildstar.controller("battleground_details", ["$scope", "$routeParams", function($scope, $routeParams) {
	$scope.$watch("battlegrounds", function() {
		if($scope.battlegrounds) {
			$scope.battleground = {
				name : $scope.battlegrounds[$routeParams.battleground].name,
				description : $scope.battlegrounds[$routeParams.battleground].description
			};
		}
	});
	$scope.save = function() {	
		$scope.battlegrounds[$routeParams.battleground] = $scope.battleground;
		//TODO SAVE
	};		
}]);