wildstar.controller("edit", ["$scope", "$routeParams", "$http", function($scope, $routeParams, $http) {
	$scope.$watch($scope.plural, function(value) {
		if(value) {
			var object = value[$routeParams[$scope.singular]];
			$scope.object = {
				name : object.name,
				description : object.description,
				_id : object._id
			};
		}
	});
	$scope.save = function() {	
		$scope.loader.show();
		$scope[$scope.plural][$routeParams[$scope.singular]] = $scope.object;
		var request = {};
		request.accessToken = Cookies.getItem("accessToken");
		request[$scope.singular] = $scope.object;
		request.collection = $scope.plural;
		$http.post("/save", request).success(function() {
			$scope.loader.hide();			
		});
	};	
}]);