wildstar.controller("comments", ["$scope", "$routeParams", "$http", "$cookies", function($scope, $routeParams, $http, $cookies) {	
	var i;
	$scope.$watch($scope.plural, function(value) {
		if(value) {
			for(i = 0; i < value.length; i++) {
				if(value[i]._id == $routeParams[$scope.singular]) {
					$scope.comments = value[i].comments;
					break;
				}
			}
			
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
			_id : $scope[$scope.plural][i]._id,
			accessToken : $cookies.accessToken
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