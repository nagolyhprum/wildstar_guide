wildstar.controller("article_details", ["$scope", "$routeParams", function($scope, $routeParams) {
	$scope.$watch("articles", function() {
		if($scope.articles) {
			$scope.article = {
				name : $scope.articles[$routeParams.article].name,
				description : $scope.articles[$routeParams.article].description
			};
		}
	});
	$scope.save = function() {	
		$scope.articles[$routeParams.article] = $scope.article;
		//TODO SAVE
	};		
}]);