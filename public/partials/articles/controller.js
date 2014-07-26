wildstar.controller("articles", ["$scope", "$http", function($scope, $http) {
	$scope.navbar.activate($scope.set("title", "News"));
	$scope.singular = "article";
	$scope.plural = "articles";
}]);	