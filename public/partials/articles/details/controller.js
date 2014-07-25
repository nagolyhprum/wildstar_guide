wildstar.controller("article_details", ["$scope", "$routeParams", function($scope, $routeParams) {
	$scope.$watch("articles", function() {
		if($scope.articles) {
			$scope.article = {
				name : $scope.articles[$routeParams.article].name,
				description : $scope.articles[$routeParams.article].description
				_id : $scope.articles[$routeParams.article]._id
			};
		}
	});
	$scope.save = function() {	
		$scope.articles[$routeParams.article] = $scope.article;
		$http.post("articles/save", {
			article : $scope.article,
			accessToken : Cookies.getItem("accessToken")
		}).success(function(data) {
			
		});
	};	
}]);