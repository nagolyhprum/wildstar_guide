wildstar.controller("articles", ["$scope", "$http", function($scope, $http) {
	$scope.navbar.activate($scope.set("title", "News"));
	$scope.article = {};
	if(!$scope.articles) {
		$scope.loader.show();
		$http.post("articles/list").success(function(articles) {
			$scope.set("articles", articles);
			$scope.loader.hide();
		});
	}
	$scope.save = function() {	
		$scope.loader.show();
		$scope.articles.push($scope.article);
		$http.post("articles/save", {
			article : $scope.article,
			accessToken : Cookies.getItem("accessToken")
		}).success(function(data) {
			$scope.article._id = data;
			$scope.loader.hide();
		});
	};	
}]);	