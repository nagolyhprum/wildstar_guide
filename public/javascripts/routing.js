var Cookies = {
	getItem: function (sKey) {
		return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
	}, setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
		if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
			return false;
		}
		var sExpires = "";
		if (vEnd) {
			switch (vEnd.constructor) {
			case Number:
				sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
				break;
			case String:
				sExpires = "; expires=" + vEnd;
				break;
			case Date:
				sExpires = "; expires=" + vEnd.toUTCString();
				break;
			}
		}
		document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
		return true;
	}, removeItem: function (sKey, sPath, sDomain) {
		if (!sKey || !this.hasItem(sKey)) {
			return false;
		}
		document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
		return true;
	}, hasItem: function (sKey) {
		return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
	}, keys: /* optional method: you can safely remove it! */ function () {
		var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
		for (var nIdx = 0; nIdx < aKeys.length; nIdx++) {
			aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
		}
		return aKeys;
	}
};

(function() {
	var wildstar = angular.module("wildstar", ["ngRoute"]).run(["$rootScope", "$http", function($rootScope, $http) {		
		$rootScope.global = {
			navbar : [{
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
			}]
		};
		$rootScope.global.characterindex = -1;
		$rootScope.global.characters = [];		
		$rootScope.global.expires = -1;
		$rootScope.global.setTimeout = (function() {
			var timeout, interval;
			return function() {
				clearTimeout(timeout);
				clearInterval(interval);
				timeout = setTimeout(function() {
					$("#refresh").modal("show");
					$rootScope.global.expires = (1000 * 60 * 30) / 2;
					interval = setInterval(function() {
						$rootScope.global.expires--;
						$rootScope.$apply();
					}, 1000);
				}, (1000 * 60 * 30) / 2);
			};
		});
		$rootScope.loadCharacters = function() {
			$http.post("users/characters", {
				accessToken : Cookies.getItem("accessToken")
			}).success(function(characters) {
				if(characters.error) {
					$rootScope.global.isLoggedIn = false;
					console.log(characters.error);
				} else {
					$rootScope.global.characters = characters;
				}
			});
		};
		if($rootScope.global.isLoggedIn = Cookies.hasItem("accessToken")) {
			$rootScope.loadCharacters();
		}
		$rootScope.logout = function() {
			$rootScope.global.isLoggedIn = false;
			Cookies.removeItem("accessToken");
		};
		$rootScope.global.navbar.activate = function(title) {
			for(var i = 0; i < this.length; i++) {
				this[i].active = this[i].title == title;
			}
		};
		$rootScope.refresh = function() {			
			$http.post("users/refresh", {accessToken:Cookies.getItem("accessToken")});			
			$rootScope.global.setTimeout();
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
		}).when("/guidetemplate",{
			templateUrl : "partials/guidetemplate.html"
		}).when("/home",{
			templateUrl : "partials/home.html"
		}).otherwise({
			redirectTo : "/home"
		});
	}]);	

	wildstar.controller("home", ["$scope", "$http", function($scope, $http) {
		$scope.global.navbar.activate($scope.global.title = "Home");
		$http.post("home/list").success(function(home) {
			$scope.home = home;
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
	
	wildstar.controller("guidetemplate", ["$scope", "$http", function($scope, $http) {
		$scope.global.navbar.activate($scope.global.title = "Guidetemplate");
		$http.post("guidetemplate/list").success(function(guidetemplate) {
			$scope.guidetemplate = guidetemplate;
		});
	}]);
	
	wildstar.controller("account", ["$scope", "$http", function($scope, $http) {
		$("[data-toggle='tooltip']").tooltip();
		$scope.login = function() {
			$http.post("users/login", {
				username : $scope.username,
				password : $scope.password
			}).success(function(data) {		
				if(!data.errors) {
					//TODO : CONFIRM ACCOUNT CREATION / LOG IN
					$scope.global.setTimeout();
					$scope.global.isLoggedIn = true;	
					Cookies.setItem("accessToken", data.accessToken, (1000 * 60 * 30));
					Cookies.setItem("permission", data.permission, (1000 * 60 * 30));				
					$scope.loadCharacters();
					$("#account").modal("hide");
				} else {				
					$scope.errors = data.errors;
					$("[ng-model='username']").tooltip("destroy").tooltip({
						title : data.errors.username[0],
						placement : "right",
						viewport : "body"
					});
					$("[ng-model='password']").tooltip("destroy").tooltip({
						title : data.errors.password[0],
						placement : "right",
						viewport : "body"
					});
				}
			});
		};
	}]);
	
    var factions = {
		exile : {
			name: "Exile",
			description: "DRIVEN FROM THEIR HOMEWORLDS BY THE DOMINION, THE EXILES ARE A RAGTAG ALLIANCE OF REFUGEES, OUTLAWS AND MERCENARIES THAT HAVE COME TO PLANET NEXUS TO FIND A NEW HOME. A GUTSY GROUP OF OUTCASTS AND MERCENARIES WHO HAVE COME TO NEXUS TO FIND A NEW HOME.",
			races : {
				human : {
					name: "Human",
					description: "AFTER CENTURIES OF WANDERING THE FRINGE IN THEIR RAMSHACKLE FLEET, HUMANS ARE READY TO SETTLE DOWN ON NEXUS USING GRIT, BACKBONE, AND SOME OLD-FASHIONED ELBOW GREASE. AND IF THOSE DOMINION BASTARDS ARE LOOKING FOR A FIGHT? BRING IT ON! OUTCASTS. RENEGADES. SCRUFFY.",
					classes : ["Engineer", "Medic", "Stalker", "Esper", "Spellslinger", "Warrior"]
				}, granok : {
					name: "Granok",
					description: "BANISHED FROM THEIR HOMEWORLD AFTER A BLOODY WAR WITH THE DOMINION, THE GRANOK ARE A RACE OF SKULL-CRACKING, HARD-CHARGING GALACTIC MERCENARIES THAT HAVE COME TO NEXUS TO KICK ASS AND DRINK BEER. NOT NECESSARILY IN THAT ORDER. ROCK-SKINNED. FEARLESS. HUNG OVER.",
					classes : ["Engineer", "Medic", "Warrior"]
				}, aurin : {
					name: "Aurin",
					description: "SMALL BUT SCRAPPY, THE AURIN ARE A RACE OF FOREST DWELLERS WHOSE HOMEWORLD WAS RAVAGED BY THE DOMINION. THEY MIGHT BE INTO HUGGING TREES, BUT THEY'RE MORE THAN READY TO BARE TOOTH AND CLAW TO DEFEND THEIR NEW HOME ON NEXUS. SMALL. SCRAPPY. TREE-HUGGING.",
					classes : ["Esper", "Spellslinger", "Stalker"]
				}, mordesh : {
					name: "Mordesh",
					description: "CURSED WITH A DEGENERATIVE DISEASE AFTER DELVING INTO THE FORBIDDEN SECRETS OF ALCHEMY, THE MORDESH HAVE COME TO NEXUS TO FIND A CURE. BEING A SPACE ZOMBIE CAN BE COMPLICATED. UNLEASHING DARK AND DEADLY DISCIPLINES ON THE DOMINION? MUCH SIMPLER.INTELLECTUAL. MOROSE. DECOMPOSING.",
					classes : ["Engineer", "Medic", "Spellslinger", "Stalker", "Warrior"]
				}	
			}
		}, dominion : {
			name: "Dominion",
			description: "THE DOMINION IS A POWERFUL INTERSTELLAR EMPIRE THAT HAS RULED THE GALAXY FOR TWO THOUSAND YEARS, AND NOW CLAIMS PLANET NEXUS AS ITS RIGHTFUL LEGACY. A POWERFUL EMPIRE FOUNDED BY THE ELDAN THAT CLAIMS NEXUS AS ITS RIGHTFUL LEGACY.",				
			races: {
				cassian : {
					name: "Cassian",
					description: "LONG AGO, THE CASSIANS WERE CHOSEN BY THE ELDAN TO ESTABLISH THE DOMINION - AND THEY'RE GOING TO MAKE SURE THE PATHETIC VERMIN INFESTING THE GALAXY DON'T FORGET IT. DESTINY IS A TERRIBLY HEAVY BURDEN, AND THE CASSIANS BEAR IT WITH STYLE. WEALTHY. DISCIPLINED. SUPERIOR.",
					classes : ["Engineer", "Medic", "Stalker", "Esper", "Spellslinger", "Warrior"]
				}, mechari : {
					name: "Mechari",
					description: "ENGINEERED BY THE ELDAN THEMSELVES, THE MECHARI ARE A RACE OF HIGHLY-EFFICIENT KILLING MACHINES THAT MAKE IT THEIR BUSINESS TO ELIMINATE TRAITORS AND SPIES ON NEXUS. SENSE OF HUMOR? NOT ONE OF THEIR STRONG POINTS. CALCULATING. EFFICIENT. REMORSELESS.",
					classes : ["Engineer", "Medic", "Warrior", "Stalker"]
				}, draken : {
					name: "Draken",
					description: "FORGED IN THE HEAT AND DUST OF THEIR SAVAGE HOMEWORLD, THE DRAKEN HAVE COME TO NEXUS TO PROVE THEY ARE THE MOST BADASS WARRIORS IN THE GALAXY. EVISCERATIONS, DISEMBOWELMENTS, AND DECAPITATIONS WILL DEFINITELY BE INVOLVED. SAVAGE. BLOODTHIRSTY. BRUTAL.",
					classes : ["Warrior", "Spellslinger", "Stalker"]
				}, chua : {
					name: "Chua",
					description: "NEARLY AS BRILLIANT AS THEY ARE SOCIOPATHIC, THE CHUA ARE MISCHIEVOUS INVENTORS WHO DEVELOP ADVANCED WEAPONS AND TECHNOLOGY FOR THE DOMINION.  SCIENCE HAS NEVER BEEN MORE FUN – OR AGONIZING. TINY. BRILLIANT. PSYCHOTIC.",
					classes : ["Engineer", "Medic", "Esper", "Spellslinger"]
				}
			}
		}
	};
	var classes = {
		warrior : {
			name: "Warrior",
			description: "ARMED TO THE TEETH AND FEARLESSLY WADING INTO BATTLE WITH MULTIPLE ENEMIES, WARRIORS ARE UNSTOPPABLE JUGGERNAUTS OF BRUTALITY AND COMBAT! PEACE IS FOR THE WEAK!"
		}, spellslinger : {
			name: "Spellslinger",
			description: "MAVERICK ACES OF THE RUN AND GUN, SPELLSLINGERS USE THEIR LIGHTNING REFLEXES, QUICKDRAW SKILLS, AND ARCANE SORCERY TO DISPENSE FRONTIER JUSTICE WITH A VENGEANCE! SHOOT FIRST, COUNT THE BODIES LATER!"
		}, esper : {
			name: "Esper",
			description: "MASTERS OF PSIONIC ILLUSION, ESPERS USE THE POWER OF THEIR MINDS TO CONJURE DEADLY APPARITIONS AND EXTRASENSORY WEAPONRY! WHEN IT COMES TO MASS BUTCHERY, IT'S THE THOUGHT THAT COUNTS!"
		}, engineer : {
			name: "Engineer",
			description: "DECKED OUT IN MECHANICAL ARMOR, ENGINEERS UNLEASH DESTRUCTIVE LONG-RANGE ATTACKS WHILE DEPLOYING A POWERFUL POSSE OF BOTS IN BATTLE. NEVER BEFORE HAVE WRENCHES INSPIRED SUCH DREAD!"
		}, stalker : {
			name: "Stalker",
			description: "SILENT BUT DEADLY ASSASSINS, STALKERS USE ADVANCED STEALTH TECHNOLOGY TO STALK AND PAINFULLY EVISCERATE THEIR FOES. IF YOU SEE ONE, YOU’RE ALREADY DEAD!"
		}, medic : {
			name: "Medic",
			description: "SPECIALIZING IN BATTLEFIELD SUPPORT, MEDICS USE THEIR ARSENAL OF GADGETS TO HEAL THEIR FRIENDS AND LIQUIDATE THEIR ENEMIES. PRESCRIPTION: DEATH!"
		}
	};
    var paths = {
		explorer : {
			name: "Explorer",
			description: "DO YOU CRAVE MORTAL DANGER AND DIVING HEADFIRST INTO THE UNKNOWN? BE AN EXPLORER! USING ENHANCED AGILITY AND TECHNOLOGY, EXPLORERS ACCESS SECRET TRAILS, UNCOVER HIDDEN RELICS, AND DISCOVER MAJESTIC VISTAS ACROSS PLANET NEXUS! MAPS?! WHO NEEDS ‘EM?"
		}, solder : {
			name: "Soldier",
			description: "READY TO LOCK, LOAD, AND KICK SOME ASS? AS A SOLDIER, YOU’LL MAKE WEAPON LOCKERS, FORGE SUPER-ARMOR, AND TEST ADVANCED HARDWARE PROTOTYPES ON YOUR RETREATING FOES. THAT ENOUGH ACTION FOR YOU, SPANKY? HOO-AH!"
		}, settler : {
			name: "Settler",
			description: "THIS WILDERNESS AIN’T GONNA IMPROVE ITSELF, CUPCAKE! STEP UP, STRAP ON A TOOLBELT, AND SPRUCE UP NEXUS BY BUILDING BATTLE ARENAS, HOSPITALS, TAVERNS, AND SPACEPORTS FOR YOUR BUDDIES. PIONEERING’S NEVER BEEN SO COOL OR DISEASE-FREE!"
		}, scientist : {
			name: "Scientist",
			description: "KNOWLEDGE IS POWER, SO PUT THAT BIG BRAIN OF YOURS TO WORK! WHETHER IT’S RELICS, ROBOTS, OR RADICAL MACHINES, AS A SCIENTIST YOU AND YOUR TRUSTY SCANBOT WILL UNLOCK ALL THE SECRETS OF NEXUS. WHO KNOWS WHAT EVIL LURKS IN THE HEARTS OF HOSTILE ALIEN LIFEFORMS? YOU WILL!"
		}
	};
    var tradeskills = [{
		name: "Crafting / Production",
		description: "TODO : GABE",
		professions: [{
			name: "Weaponsmith",
			description: "TODO : GABE"
		}, {
			name: "Armorer",
			description: "TODO : GABE"
		}, {
			name: "Outfitter",
			description: "TODO : GABE"
		}, {
			name: "Tailor",
			description: "TODO : GABE"
		}, {
			name: "Technologist",
			description: "TODO : GABE"
		}, {
			name: "Architect",
			description: "TODO : GABE"
		}]
	}, {
		name: "Gathering",
		description: "TODO : GABE",
		professions: [{
			name: "Mining",
			description: "TODO : GABE"
		}, {
			name: "Survivalist",
			description: "TODO : GABE"
		}, {
			name: "Relic Hunter",
			description: "TODO : GABE"
		}]
	}, {
		name: "Hobbies",
		description: "TODO : GABE",
		professions: [{
			name: "Cooking",
			description: "TODO : GABE"
		}, {
			name: "Farming",
			description: "TODO : GABE"
		}, {
			name: "Fishing",
			description: "TODO : GABE"
		}]
	}, {
		name: "Other",
		description: "TODO : GABE",
		professions: [{
			name: "Runecrafting",
			description: "TODO : GABE"
		}, {
			name: "Salvaging",
			description: "TODO : GABE"
		}]
	}];

    wildstar.controller("character", ["$scope", "$http", function ($scope, $http) {
        $scope.factions = factions;		
		$scope.classes = classes;		
		$scope.tradeskills = tradeskills;		
		$scope.paths = paths;
		$scope.character = {};
		$('#character').on('show.bs.modal', function (e) {
			$scope.character.name = "";
			$scope.character.faction = "";
			$scope.character.race = "";
			$scope.character.class = "";
			$scope.character.path = "";
			for(var i in $scope.tradeskills) {
				for(var j in $scope.tradeskills[i].professions) {
					var profession = $scope.tradeskills[i].professions[j];
					profession.selected = false;
				}
			}
			if($scope.global.characterindex != -1) {		
				var character = $scope.global.characters[$scope.global.characterindex];
				var faction = $scope.factions[character.faction && character.faction.toLowerCase()] || 0;
				$scope.character.name = character.name;
				$scope.character.faction  = faction;
				$scope.character.race = faction ? faction.races[character.race && character.race.toLowerCase()] : 0;
				$scope.character.class = $scope.classes[character.class && character.class.toLowerCase()];
				$scope.character.path = $scope.paths[character.path && character.path.toLowerCase()];
				for(var i in $scope.tradeskills) {
					for(var j in $scope.tradeskills[i].professions) {
						var profession = $scope.tradeskills[i].professions[j];
						profession.selected = character.professions.indexOf(profession.name) != -1;
					}
				}
			}
			$scope.$apply();
		});
		
        $scope.selectedProfessions = function () {            
			var professions = [];
            for (var i = 0; i < tradeskills.length; i++) {
                for (var j = 0; j < tradeskills[i].professions.length; j++) {
					var profession = tradeskills[i].professions[j];
                    if (profession.selected) {
                        professions.push(profession.name);
                    }
                }
            }
            return professions;
        };
		
		$scope.removeCharacter = function() {
			$http.post("users/characters", {
				character : {
					index : $scope.global.characterindex,
					remove : true
				},
				accessToken : Cookies.getItem("accessToken")
			}).success(function(data) {
				if(data.error) {
					console.log(data.error);
				} else {
					$("#remove").modal("hide");
					$scope.global.characters.splice($scope.global.characterindex, 1);
					$scope.global.characterindex = -1;
				}
			});
		};
		
		$scope.saveCharacter = function() {
			var character = {
				name : $scope.character.name,
				index : $scope.global.characterindex,
				faction : $scope.character.faction.name,
				class : $scope.character.class.name,
				race : $scope.character.race.name,
				professions : $scope.selectedProfessions(),
				path : $scope.character.path.name
			};
			//SHOW LOADING INDICATOR
			$http.post("users/characters", {
				character : character,
				accessToken : Cookies.getItem("accessToken")
			}).success(function(data) {
				if(data.error) {
					console.log(data.error);
				} else {
					$("#character").modal("hide");
					if($scope.global.characterindex == -1) {
						$scope.global.characters.push(character);
					} else {
						$scope.global.characters[$scope.global.characterindex] = character;
					}
				}
			});
		};
    }]);
}());