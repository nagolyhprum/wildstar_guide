wildstar.controller("battleground_details", ["$scope", "$routeParams", "$http", function($scope, $routeParams, $http) {
	$scope.$watch("battlegrounds", function() {
		if($scope.battlegrounds) {
			$scope.battleground = {
				name : $scope.battlegrounds[$routeParams.battleground].name,
				description : $scope.battlegrounds[$routeParams.battleground].description,
				_id : $scope.battlegrounds[$routeParams.battleground]._id
			};
		}
	});
	$scope.save = function() {	
		$scope.battlegrounds[$routeParams.battleground] = $scope.battleground;
		$http.post("battlegrounds/save", {
			battleground : $scope.battleground,
			accessToken : Cookies.getItem("accessToken")
		}).success(function(data) {
			
		});
	};	
}]);