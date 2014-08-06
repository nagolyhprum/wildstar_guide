var timeoutTime = 1000 * 60 * 30;

var wildstar = angular.module("wildstar", ["ngRoute", "ngSanitize", "ngAnimate"]).run(["$rootScope", "$http", function($rootScope, $http) {		
	$rootScope.set = function(attr, val) {
		return $rootScope[attr] = val;
	};	
	$rootScope.minPermissions = 10;
	$rootScope.md = function(obj) {
		$http.get("md_to_html", {
			params : {
				md : obj.description
			}
		}).success(function(html) {
			obj.html_description = html;
		});
	};
	$rootScope.loader = {
		show : function() {
			this.waiting++;
			if(this.waiting > 0) {
				$("#loader").show();
			}
		},
		hide : function() {
			this.waiting--;
			if(this.waiting <= 0) {
				setTimeout(function() {
					$("#loader").hide();
				}, 100);
			}
		},
		waiting : 0
	};
	$rootScope.title = "";
	$rootScope.characterindex = -1;
	$rootScope.expires = -1;		
	$rootScope.loadCharacters = function() {
		$rootScope.loader.show();
		$http.post("users/characters", {
			accessToken : Cookies.getItem("accessToken")
		}).success(function(characters) {
			if(characters.error) {
				$rootScope.isLoggedIn = false;
			} else {
				$rootScope.characters = characters;
			}
			$rootScope.loader.hide();
		});
	};
	if($rootScope.isLoggedIn = Cookies.hasItem("accessToken")) {
		$rootScope.permission = Cookies.getItem("permission")
		$rootScope.loadCharacters();
	}
	$rootScope.navbar = [{
		title : "Tradeskills",
		url : "tradeskills",
		active : false,
		visible : true
	}, {
		title : "Classes",
		url : "classes",
		active : false,
		visible : true
	}, {
		title : "Arenas",
		url : "arenas",
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
	}, {
		title : "Forums",
		url : "forums",
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
				$rootScope.expires = Math.floor(timeoutTime / 1000 / 2);
				interval = setInterval(function() {
					$rootScope.expires--;
					if($rootScope.expires <= 0) {
						$rootScope.isLoggedIn = false;
						$("#timeout").modal("hide");
					}
					$rootScope.$apply();
				}, 1000);
				$rootScope.$apply();
			}, timeoutTime / 2);
		};
	}());
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
		$rootScope.loader.show();
		$rootScope.refresh();		
		window.scrollTo(0, 0);
	});
	$rootScope.$on("$locationChangeSuccess", function (event) {
		$rootScope.loader.hide();
	});
	//HIDE / SHOW NAVBAR ITEMS
}]);

wildstar.config(["$routeProvider", function($routeProvider) {
	$routeProvider.when("/tradeskills", {
		templateUrl : "partials/tradeskills/view.html"
	}).when("/tradeskills/:tradeskill/:profession", {
		templateUrl : "partials/tradeskills/details/view.html"
	}).when("/arenas", {
		templateUrl : "partials/arenas/view.html"
	}).when("/arenas/:battleground", {
		templateUrl : "partials/arenas/details/view.html"
	}).when("/raids",{
		templateUrl : "partials/raids/view.html"
	}).when("/raids/:raid",{
		templateUrl : "partials/raids/details/view.html"
	}).when("/dungeons",{
		templateUrl : "partials/dungeons/view.html"
	}).when("/dungeons/:dungeon",{
		templateUrl : "partials/dungeons/details/view.html"
	}).when("/classes", {
		templateUrl : "partials/classes/view.html"
	}).when("/classes/:class", {
		templateUrl : "partials/classes/details/view.html"
	}).when("/articles",{
		templateUrl : "partials/articles/view.html"
	}).when("/articles/:article",{
		templateUrl : "partials/articles/details/view.html"
	}).when("/forums",{
		templateUrl : "partials/forums/view.html"
	}).when("/forums/:forum",{
		templateUrl : "partials/forums/details/view.html"
	}).otherwise({
		redirectTo : "/articles"
	});
}]);

Array.prototype.findByName = function(name) {
	for(var i = 0; i < this.length; i++) {
		if(this[i].name == name) {
			return this[i];
		}
	}
};

String.prototype.md2html = (function() {
	var converter = Markdown.getSanitizingConverter();  
	return function() {
		return converter.makeHtml(this);
	};	              
}());

wildstar.directive("wmd", function() {
	return function($scope, $element, $attributes) {	
		new Markdown.Editor(Markdown.getSanitizingConverter()).run();
	};
});	

wildstar.directive("list", function() {
	return {
		templateUrl : "directives/list/view.html",
		restrict : "E"
	};
});

wildstar.directive("edit", function() {
	return {
		templateUrl : "directives/edit/view.html",
		restrict : "E"
	};
});

wildstar.directive("comments", function() {
	return {
		templateUrl : "directives/comments/view.html",
		restrict : "E"
	};
});

wildstar.controller("teamspeak", ["$scope", function($scope) {
	$scope.toggle = function() {
		if($scope.state) {
			$scope.state = "";
		} else {
			$scope.state = "css-class";
		}
	};
}]);