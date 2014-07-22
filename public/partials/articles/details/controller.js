wildstar.controller("article_details", ["$scope", "$routeParams", function($scope, $routeParams) {
	$scope.article = $routeParams.article;
}]);