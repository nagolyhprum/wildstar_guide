(function() {
	var wildstar = angular.module("wildstar", ["ngRoute"]).run(["$rootScope", function($rootScope) {
		$rootScope.global = {};
	}]);
	
	wildstar.config(["$routeProvider", function($routeProvider) {
		$routeProvider.when("/tradeskills", {
			templateUrl : "partials/tradeskills.html"
		}).when("/battlegrounds", {
			templateUrl : "partials/battlegrounds.html"
		}).when("/classes", {
			templateUrl : "partials/classes.html"
		}).when("/raids",{
			templateUrl : "partials/raids.html"
		}).otherwise({
			redirectTo : "/tradeskills"
		});
	}]);	

	wildstar.controller("tradeskills", ["$scope", "$http", function($scope, $http) {
		$scope.global.title = "Tradeskills";
		$http.post("tradeskills/list").success(function(tradeskills) {
			$scope.tradeskills = tradeskills;
		});
	}]);	
	
	wildstar.controller("battlegrounds", ["$scope", "$http", function($scope, $http) {
		$scope.global.title = "Battlegrounds";
		$http.post("battlegrounds/list").success(function(battlegrounds) {
			$scope.battlegrounds = battlegrounds;
		});
	}]);
	
	wildstar.controller("classes", ["$scope", "$http", function($scope, $http) {
		$scope.global.title = "Classes";
		$http.post("classes/list").success(function(classes) {
			$scope.classes = classes;
		});
	}]);
	
	wildstar.controller("raids", ["$scope", "$http", function($scope, $http) {
		$scope.global.title = "Raids";
		$http.post("raids/list").success(function(raids) {
			$scope.raids = raids;
		});
	}]);
	
	wildstar.filter("sort", function() {
		return function(r, name) {
			r = r || [];
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