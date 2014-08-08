wildstar.controller("edit", ["$scope", "$routeParams", "$http", "$location", "$cookies", function($scope, $routeParams, $http, $location, $cookies) {
	var i;
	$scope.$watch($scope.plural, function(value) {
		if(value) {
			var object;
			for(i = 0; i < value.length; i++) {
				if(value[i]._id == $routeParams[$scope.singular]) {
					object = value[i];
					break;
				}
			}
			$scope.object = {
				name : object.name,
				description : object.description,
				_id : object._id,
				comments : object.comments
			};
			$scope.editable = object.editable;
			$scope.valid = true;
		}
	});
	$scope.save = function() {	
		$scope.loader.show();
		$scope[$scope.plural][i] = $scope.object;
		var request = {};
		request.accessToken = $cookies.accessToken;
		request.object = $scope.object;
		request.collection = $scope.plural;
		$http.post("/save", request).success(function() {
			$scope.loader.hide();			
		}).error(function() {
			$scope.loader.hide();			
		});
	};	
	$scope.delete = function() {
		$scope.loader.show();					
		$scope[$scope.plural].splice(i, 1);
		var request = {};
		request.accessToken = $cookies.accessToken;
		request._id = $scope.object._id;
		request.collection = $scope.plural;		
		$http.post("/delete", request).success(function() {			
			$scope.loader.hide();	
		});		
		$scope.valid = false;
	};	
}]);