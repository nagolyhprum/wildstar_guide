wildstar.controller("articles", ["$scope", "$http", function($scope, $http) {
	$scope.navbar.activate($scope.set("title", "News"));
	if(!$scope.articles) {
		$scope.loader.show();
		$http.post("articles/list").success(function(articles) {
			$scope.set("articles", articles);
			$scope.loader.hide();
		});
	}
}]);	