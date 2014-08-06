wildstar.controller("comments", ["$scope", "$routeParams", "$http", function($scope, $routeParams, $http) {	
	$scope.$watch($scope.plural, function(value) {
		if(value) {
			$scope.comments = value[$routeParams[$scope.singular]].comments;
		}
	});
	$scope.my = {};
	$scope.add = function(indices) {
		$scope.my.indices = indices;
		$scope.my.editing = null;
	};
	$scope.edit = function(comment, indices) {
		$scope.my.indices = indices;
		$scope.my.editing = comment;
		$scope.my.comment = comment.comment;
	};
	$scope.cancel = function() {
		$scope.my = {};
	};
	$scope.save = function(comments) {
		var request = {		
			indices : $scope.my.indices,
			collection : $scope.plural,
			_id : $scope[$scope.plural][$routeParams[$scope.singular]]._id,
			accessToken : Cookies.getItem("accessToken")
		};
		if($scope.my.editing) {
			request.comment = $scope.my.comment;
		} else {
			request.comments = $scope.my.comment;
		}
		$http.post("/comment", request).success(function() {
			if($scope.my.editing) {
				$scope.my.editing.comment = $scope.my.comment;
			} else {
				comments.push({
					comment : $scope.my.comment,
					time : new Date(),
					comments : [],
					editable : true
				});
			}
			$scope.cancel();
		});
	};
}]);