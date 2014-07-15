(function() {
	var wildstar = angular.module("wildstar", ["ngRoute"]).run(["$rootScope", "$http", function($rootScope, $http) {
		$rootScope.global = {
			navbar : [{
				title : "Tradeskills",
				url : "tradeskills",
				active : true,
				visible : true
			}, {
				title : "Battlegrounds",
				url : "battlegrounds",
				active : false,
				visible : true
			}, {
				title : "Classes",
				url : "classes",
				active : false,
				visible : true
			}, {
				title : "Raids",
				url : "raids",
				active : false,
				visible : true
			}, {
				title : "Dungeons",				
				url : "dungeons",
				active : false,
				visible : true
			}]
		};
		$http.post("/users/isLoggedIn").success(function(data) {
			$rootScope.global.isLoggedIn = data;
		});
		$rootScope.logout = function() {
			$http.post("/users/logout");
			$rootScope.global.isLoggedIn = false;
		};
		$rootScope.global.navbar.activate = function(title) {
			for(var i = 0; i < this.length; i++) {
				this[i].active = this[i].title == title;
			}
		};
		$rootScope.$on("$locationChangeStart", function (event) {
			$("#loader").show();
		});
		$rootScope.$on("$locationChangeSuccess", function (event) {
			//TODO : REMOVE TIMEOUT
			setTimeout(function() {
				$("#loader").hide();
			}, 1000);
		});
		//HIDE / SHOW NAVBAR ITEMS
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
		}).when("/dungeons",{
			templateUrl : "partials/dungeons.html"
		}).otherwise({
			redirectTo : "/tradeskills"
		});
	}]);	

	wildstar.controller("tradeskills", ["$scope", "$http", function($scope, $http) {
		$scope.global.navbar.activate($scope.global.title = "Tradeskills");
		$http.post("tradeskills/list").success(function(tradeskills) {
			$scope.tradeskills = tradeskills;
		});
	}]);	
	
	wildstar.controller("battlegrounds", ["$scope", "$http", function($scope, $http) {
		$scope.global.navbar.activate($scope.global.title = "Battlegrounds");
		$http.post("battlegrounds/list").success(function(battlegrounds) {
			$scope.battlegrounds = battlegrounds;
		});
	}]);
	
	wildstar.controller("classes", ["$scope", "$http", function($scope, $http) {
		$scope.global.navbar.activate($scope.global.title = "Classes");
		$http.post("classes/list").success(function(classes) {
			$scope.classes = classes;
		});
	}]);
	
	wildstar.controller("raids", ["$scope", "$http", function($scope, $http) {
		$scope.global.navbar.activate($scope.global.title = "Raids");
		$http.post("raids/list").success(function(raids) {
			$scope.raids = raids;
		});
	}]);
	
	wildstar.controller("dungeons", ["$scope", "$http", function($scope, $http) {
		$scope.global.navbar.activate($scope.global.title = "Dungeons");
		$http.post("dungeons/list").success(function(dungeons) {
			$scope.dungeons = dungeons;
		});
	}]);
	
	wildstar.controller("signup", ["$scope", "$http", function($scope, $http) {
		$scope.signup = function() {
			$http.post("users/signup", {
				username : $scope.username,
				password : $scope.password
			}).success(function(data) {
				if(!data.error) {
					$scope.global.isLoggedIn = true;
				}
			});
		};
	}]);
	
	wildstar.controller("login", ["$scope", "$http", function($scope, $http) {
		$scope.login = function() {
			$http.post("users/login", {
				username : $scope.username,
				password : $scope.password
			}).success(function(data) {				
				if(!data.error) {
					$scope.global.isLoggedIn = true;
				}
			});
		};
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