var wildstar = angular.module("wildstar", ["ngRoute"]).run(["$rootScope", "$http", function($rootScope, $http) {	
	$rootScope.title = "";
	$rootScope.setTitle = function(title) {
		$rootScope.title = title;
	};
	$rootScope.characterindex = -1;
	$rootScope.setCharacterIndex = function(characterindex) {
		$rootScope.characterindex = characterindex;
	};
	$rootScope.expires = -1;		
	$rootScope.loadCharacters = function() {
		$http.post("users/characters", {
			accessToken : Cookies.getItem("accessToken")
		}).success(function(characters) {
			if(characters.error) {
				$rootScope.isLoggedIn = false;
				console.log(characters.error);
			} else {
				$rootScope.characters = characters;
			}
		});
	};
	$rootScope.setLoggedIn = function(isLoggedIn) {
		$rootScope.isLoggedIn = isLoggedIn;
	};
	if($rootScope.isLoggedIn = Cookies.hasItem("accessToken")) {
		$rootScope.loadCharacters();
	}

	$http.post("dungeons/list").success(function(dungeons) {
		$rootScope.dungeons = dungeons;
	});
	$http.post("raids/list").success(function(raids) {
		$rootScope.raids = raids;
	});	
	$http.post("factions/list").success(function(factions) {
		$rootScope.factions = factions;
	});
	$http.post("classes/list").success(function(classes) {
		$rootScope.classes = classes;
	});
	$http.post("races/list").success(function(races) {
		$rootScope.races = races;
	});
	$http.post("tradeskills/list").success(function(tradeskills) {
		$rootScope.tradeskills = tradeskills;
	});
	$http.post("paths/list").success(function(paths) {
		$rootScope.paths = paths;
	});
	$http.post("battlegrounds/list").success(function(battlegrounds) {
		$rootScope.battlegrounds = battlegrounds;
	});
	$http.post("professions/list").success(function(professions) {
		$rootScope.professions = professions;
	});
	
	$rootScope.navbar = [{
		title : "Tradeskills",
		url : "tradeskills",
		active : true,
		visible : true
	}, {
		title : "Arenas & Battlegrounds",
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
	}];
	$rootScope.characters = [];		
	$rootScope.setTimeout = (function() {
		var timeout, interval;
		return function() {
			$("#timeout").modal("hide");
			clearTimeout(timeout);
			clearInterval(interval);
			timeout = setTimeout(function() {
				$("#timeout").modal("show");
				$rootScope.expires = (1000 * 60 * 30) / 2;
				interval = setInterval(function() {
					$rootScope.expires--;
					if($rootScope.expires <= 0) {
						$rootScope.isLoggedIn = false;
						$("#timeout").modal("hide");
					}
					$rootScope.$apply();
				}, 1000);
			}, (1000 * 60 * 30) / 2);
		};
	});
	$rootScope.logout = function() {
		$rootScope.isLoggedIn = false;
		Cookies.removeItem("accessToken");
	};
	$rootScope.navbar.activate = function(title) {
		for(var i = 0; i < this.length; i++) {
			this[i].active = this[i].title == title;
		}
	};
	$rootScope.refresh = function() {			
		$http.post("users/refresh", {accessToken:Cookies.getItem("accessToken")});			
		$rootScope.setTimeout();
	};
	$rootScope.$on("$locationChangeStart", function (event) {
		$rootScope.refresh();
		$("#loader").show();
	});
	$rootScope.$on("$locationChangeSuccess", function (event) {
		$("#loader").hide();
	});
	//HIDE / SHOW NAVBAR ITEMS
}]);

wildstar.config(["$routeProvider", function($routeProvider) {
	$routeProvider
	
	.when("/tradeskills", {
		templateUrl : "partials/tradeskills/view.html"
	}).when("/tradeskills/:tradeskill/:profession", {
		templateUrl : "partials/tradeskill_details/view.html"
	})
	
	.when("/battlegrounds", {
		templateUrl : "partials/battlegrounds/view.html"
	}).when("/battlegrounds/:battleground", {
		templateUrl : "partials/battleground_details/view.html"
	})
	
	.when("/classes", {
		templateUrl : "partials/classes/view.html"
	}).when("/classes/:class", {
		templateUrl : "partials/class_details/view.html"
	})
	
	.when("/raids",{
		templateUrl : "partials/raids/view.html"
	}).when("/raid/:raid",{
		templateUrl : "partials/raids_details/view.html"
	})
	
	.when("/dungeons",{
		templateUrl : "partials/dungeons/view.html"
	}).when("/dungeon/:dungeon",{
		templateUrl : "partials/dungeon_details/view.html"
	})
	
	.when("/home",{
		templateUrl : "partials/home/view.html"
	}).otherwise({
		redirectTo : "/home"
	});
}]);	

Array.prototype.findByName = function(name) {
	for(var i = 0; i < this.length; i++) {
		if(this[i].name == name) {
			return this[i];
		}
	}
};

	













