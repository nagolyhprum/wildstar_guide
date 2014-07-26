wildstar.controller("edit", ["$scope", "$routeParams", "$http", function($scope, $routeParams, $http) {
	$scope.$watch($scope.plural, function() {
		if($scope[$scope.plural]) {
			$scope.object = {
				name : $scope[$scope.plural][$routeParams[$scope.singular]].name,
				description : $scope[$scope.plural][$routeParams[$scope.singular]].description,
				_id : $scope[$scope.plural][$routeParams[$scope.singular]]._id
			};
		}
	});
	$scope.save = function() {	
		$scope.loader.show();
		$scope[$scope.plural][$routeParams[$scope.singular]] = $scope.object;
		var request = {};
		request.accessToken = Cookies.getItem("accessToken");
		request[$scope.singular] = $scope.object;
		$http.post($scope.plural + "/save", request).success(function() {
			$scope.loader.hide();			
		});
	};	
}]);