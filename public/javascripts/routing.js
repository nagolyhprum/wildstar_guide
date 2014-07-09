(function() {
	var wildstar = angular.module("wildstar", ["ngRoute"]).run(["$rootScope", function($rootScope) {
		$rootScope.global = {};
	}]);
	
	wildstar.config(["$routeProvider", function($routeProvider) {
		$routeProvider.when("/tradeskills", {
			templateUrl : "partials/tradeskills.html"
		}).otherwise({
			redirectTo : "/tradeskills"
		});
	}]);	

	wildstar.controller("tradeskills", ["$scope", "$http", function($scope, $http) {
		$scope.global.title = "Home";
		$http.post("tradeskills/list").success(function(tradeskills) {
			$scope.tradeskills = tradeskills;
		});
	}]);
	
	wildstar.filter("sort", function() {
		return function(r, name) {
			if(name) {
				r.sort(function(a, b) {
					return a[name] > b[name] ? 1 : -1;
				});
			} else {
				r.sort();
			}
			return r;
		};
	});
}());