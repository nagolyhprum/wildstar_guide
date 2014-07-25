wildstar.controller("class_details", ["$scope", "$routeParams", "$http", function($scope, $routeParams, $http) {
	$scope.$watch("classes", function() {
		if($scope.classes) {
			$scope.class = {
				name : $scope.classes[$routeParams.class].name,
				description : $scope.classes[$routeParams.class].description,
				_id : $scope.classes[$routeParams.class]._id
			};
		}
	});	
}]);