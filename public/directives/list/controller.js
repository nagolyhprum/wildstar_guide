wildstar.controller("list", ["$scope", "$http", function($scope, $http) {
	$scope.object = {};
	if(!$scope[$scope.plural]) {
		$scope.loader.show();
		$http.post($scope.plural + "/list").success(function(objects) {
			$scope.set($scope.plural, objects);
			$scope.objects = objects;
			$scope.loader.hide();
		});
	} else {
		$scope.objects = $scope[$scope.plural];
	}
	$scope.save = function() {	
		$scope.loader.show();
		$scope[$scope.plural].push($scope.object);
		var request = {};
		request[$scope.singular] = $scope.object;
		request.accessToken = Cookies.getItem("accessToken");
		$http.post($scope.plural + "/save", request).success(function(data) {
			$scope.object._id = data;
			$scope.loader.hide();
			$scope.object = {};
		});
	};	
}]);	