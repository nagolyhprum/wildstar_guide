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
	$scope.save = function() {	
		$scope.classes[$routeParams.class] = $scope.class;
		$http.post("classes/save", {
			class : $scope.class,
			accessToken : Cookies.getItem("accessToken")
		}).success(function(data) {
			
		});
	};		
}]);