wildstar.controller("list", ["$scope", "$http", function($scope, $http) {
	$scope.object = {};
	if(!$scope[$scope.plural]) {
		$scope.loader.show();
		$http.post("/list", {
			collection : $scope.plural,
			accessToken : Cookies.getItem("accessToken")
		}).success(function(objects) {
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
		$http.post("/save", {
			object : $scope.object,
			accessToken : Cookies.getItem("accessToken"),
			collection : $scope.plural
		}).success(function(data) {
			$scope.object._id = data;
			$scope.object.comments = [];
			$scope.loader.hide();
			$scope.object = {};
		});
	};	
}]);	