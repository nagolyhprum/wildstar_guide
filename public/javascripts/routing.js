(function() {
	var wildstar = angular.module("wildstar", ["ngRoute"]).run(["$rootScope", function($rootScope) {
		$rootScope.global = {};
	}]);
	
	wildstar.config(["$routeProvider", function($routeProvider) {
		$routeProvider.when("/home", {
			templateUrl : "partials/home.html"
		}).otherwise({
			redirectTo : "/home"
		});
	}]);	

	wildstar.controller("home", ["$scope", function($scope) {
		$scope.global.title = "Home";
		$scope.tradeskills = [{
			name : "Crafting / Production",
			professions : [
				"Weaponsmith",
				"Armorer",
				"Outfitter",
				"Tailor",
				"Technologist",
				"Architect"
			]
		}, {
			name : "Gathering",
			professions : [
				"Mining",
				"Survivalist",
				"Relic Hunter"
			]
		}, {
			name : "Hobbies",
			professions : [
				"Cooking",
				"Farming",
				"Fishing"
			]
		}, {
			name : "Other",
			professions : [
				"Runecrafting",
				"Salvaging"
			]
		}];
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