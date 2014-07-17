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
		$rootScope.global.isLoggedIn = false; //TODO : cookies - auth
		$rootScope.logout = function() {
			$rootScope.global.isLoggedIn = false; //TODO : cookies - auth
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
			templateURL : "partials/guidetemplate.html"
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
	
	wildstar.controller("guidetemplate", ["$scope", "$http", function($scope, $http) {
		$scope.global.navbar.activate($scope.global.title = "Guidetemplate");
		$http.post("guidetemplate/list").success(function(guidetemplate) {
			$scope.guidetemplate = guidetemplate;
		});
	}]);
	
	wildstar.controller("account", ["$scope", "$http", function($scope, $http) {
		$scope.login = function() {
			$http.post("users/login", {
				username : $scope.username,
				password : $scope.password
			}).success(function(data) {						
				if(!data.errors) {
					$scope.global.isLoggedIn = true; //TODO : cookies
					$("#account").modal("hide");
				} else {
					console.log(data.errors);
				}
			});
		};
	}]);
	
	wildstar.controller("createcharacter", ["$scope", "$http", function($scope, $http) {
		$scope.createcharacter = function() {
			console.log("TODO");
		};
	}]);
	
	var character = {
        factions: {
			exile : {
				name: "EXILE",
				description: "DRIVEN FROM THEIR HOMEWORLDS BY THE DOMINION, THE EXILES ARE A RAGTAG ALLIANCE OF REFUGEES, OUTLAWS AND MERCENARIES THAT HAVE COME TO PLANET NEXUS TO FIND A NEW HOME. A GUTSY GROUP OF OUTCASTS AND MERCENARIES WHO HAVE COME TO NEXUS TO FIND A NEW HOME.",
				races : {
					human : {
						name: "HUMAN",
						description: "AFTER CENTURIES OF WANDERING THE FRINGE IN THEIR RAMSHACKLE FLEET, HUMANS ARE READY TO SETTLE DOWN ON NEXUS USING GRIT, BACKBONE, AND SOME OLD-FASHIONED ELBOW GREASE. AND IF THOSE DOMINION BASTARDS ARE LOOKING FOR A FIGHT? BRING IT ON! OUTCASTS. RENEGADES. SCRUFFY.",
						classes : ["Engineer", "Medic", "Stalker", "Esper", "Spellslinger", "Warrior"]
					}, granok : {
						name: "GRANOK",
						description: "BANISHED FROM THEIR HOMEWORLD AFTER A BLOODY WAR WITH THE DOMINION, THE GRANOK ARE A RACE OF SKULL-CRACKING, HARD-CHARGING GALACTIC MERCENARIES THAT HAVE COME TO NEXUS TO KICK ASS AND DRINK BEER. NOT NECESSARILY IN THAT ORDER. ROCK-SKINNED. FEARLESS. HUNG OVER.",
						classes : ["Engineer", "Medic", "Warrior"]
					}, aurin : {
						name: "AURIN",
						description: "SMALL BUT SCRAPPY, THE AURIN ARE A RACE OF FOREST DWELLERS WHOSE HOMEWORLD WAS RAVAGED BY THE DOMINION. THEY MIGHT BE INTO HUGGING TREES, BUT THEY'RE MORE THAN READY TO BARE TOOTH AND CLAW TO DEFEND THEIR NEW HOME ON NEXUS. SMALL. SCRAPPY. TREE-HUGGING.",
						classes : ["Esper", "Spellslinger", "Stalker"]
					}, mordesh : {
						name: "MORDESH",
						description: "CURSED WITH A DEGENERATIVE DISEASE AFTER DELVING INTO THE FORBIDDEN SECRETS OF ALCHEMY, THE MORDESH HAVE COME TO NEXUS TO FIND A CURE. BEING A SPACE ZOMBIE CAN BE COMPLICATED. UNLEASHING DARK AND DEADLY DISCIPLINES ON THE DOMINION? MUCH SIMPLER.INTELLECTUAL. MOROSE. DECOMPOSING.",
						classes : ["Engineer", "Medic", "Spellslinger", "Stalker", "Warrior"]
					}	
				}
			}, dominion : {
				name: "DOMINION",
				description: "THE DOMINION IS A POWERFUL INTERSTELLAR EMPIRE THAT HAS RULED THE GALAXY FOR TWO THOUSAND YEARS, AND NOW CLAIMS PLANET NEXUS AS ITS RIGHTFUL LEGACY. A POWERFUL EMPIRE FOUNDED BY THE ELDAN THAT CLAIMS NEXUS AS ITS RIGHTFUL LEGACY.",				
				races: {
					cassian : {
						name: "CASSIAN",
						description: "LONG AGO, THE CASSIANS WERE CHOSEN BY THE ELDAN TO ESTABLISH THE DOMINION - AND THEY'RE GOING TO MAKE SURE THE PATHETIC VERMIN INFESTING THE GALAXY DON'T FORGET IT. DESTINY IS A TERRIBLY HEAVY BURDEN, AND THE CASSIANS BEAR IT WITH STYLE. WEALTHY. DISCIPLINED. SUPERIOR.",
						classes : ["Engineer", "Medic", "Stalker", "Esper", "Spellslinger", "Warrior"]
					}, mechari : {
						name: "MECHARI",
						description: "ENGINEERED BY THE ELDAN THEMSELVES, THE MECHARI ARE A RACE OF HIGHLY-EFFICIENT KILLING MACHINES THAT MAKE IT THEIR BUSINESS TO ELIMINATE TRAITORS AND SPIES ON NEXUS. SENSE OF HUMOR? NOT ONE OF THEIR STRONG POINTS. CALCULATING. EFFICIENT. REMORSELESS.",
						classes : ["Engineer", "Medic", "Warrior", "Stalker"]
					}, draken : {
						name: "DRAKEN",
						description: "FORGED IN THE HEAT AND DUST OF THEIR SAVAGE HOMEWORLD, THE DRAKEN HAVE COME TO NEXUS TO PROVE THEY ARE THE MOST BADASS WARRIORS IN THE GALAXY. EVISCERATIONS, DISEMBOWELMENTS, AND DECAPITATIONS WILL DEFINITELY BE INVOLVED. SAVAGE. BLOODTHIRSTY. BRUTAL.",
						classes : ["Warrior", "Spellslinger", "Stalker"]
					}, chua : {
						name: "CHUA",
						description: "NEARLY AS BRILLIANT AS THEY ARE SOCIOPATHIC, THE CHUA ARE MISCHIEVOUS INVENTORS WHO DEVELOP ADVANCED WEAPONS AND TECHNOLOGY FOR THE DOMINION.  SCIENCE HAS NEVER BEEN MORE FUN – OR AGONIZING. TINY. BRILLIANT. PSYCHOTIC.",
						classes : ["Engineer", "Medic", "Esper", "Spellslinger"]
					}
				}
			}
		},
        classes: {
			warrior : {
				name: "WARRIOR",
				description: "ARMED TO THE TEETH AND FEARLESSLY WADING INTO BATTLE WITH MULTIPLE ENEMIES, WARRIORS ARE UNSTOPPABLE JUGGERNAUTS OF BRUTALITY AND COMBAT! PEACE IS FOR THE WEAK!"
			}, spellslinger : {
				name: "SPELLSLINGER",
				description: "MAVERICK ACES OF THE RUN AND GUN, SPELLSLINGERS USE THEIR LIGHTNING REFLEXES, QUICKDRAW SKILLS, AND ARCANE SORCERY TO DISPENSE FRONTIER JUSTICE WITH A VENGEANCE! SHOOT FIRST, COUNT THE BODIES LATER!"
			}, esper : {
				name: "ESPER",
				description: "MASTERS OF PSIONIC ILLUSION, ESPERS USE THE POWER OF THEIR MINDS TO CONJURE DEADLY APPARITIONS AND EXTRASENSORY WEAPONRY! WHEN IT COMES TO MASS BUTCHERY, IT'S THE THOUGHT THAT COUNTS!"
			}, engineer : {
				name: "ENGINEER",
				description: "DECKED OUT IN MECHANICAL ARMOR, ENGINEERS UNLEASH DESTRUCTIVE LONG-RANGE ATTACKS WHILE DEPLOYING A POWERFUL POSSE OF BOTS IN BATTLE. NEVER BEFORE HAVE WRENCHES INSPIRED SUCH DREAD!"
			}, stalker : {
				name: "STALKER",
				description: "SILENT BUT DEADLY ASSASSINS, STALKERS USE ADVANCED STEALTH TECHNOLOGY TO STALK AND PAINFULLY EVISCERATE THEIR FOES. IF YOU SEE ONE, YOU’RE ALREADY DEAD!"
			}, medic : {
				name: "MEDIC",
				description: "SPECIALIZING IN BATTLEFIELD SUPPORT, MEDICS USE THEIR ARSENAL OF GADGETS TO HEAL THEIR FRIENDS AND LIQUIDATE THEIR ENEMIES. PRESCRIPTION: DEATH!"
			}
		},
        paths: {
			explorer : {
				name: "EXPLORER",
				description: "DO YOU CRAVE MORTAL DANGER AND DIVING HEADFIRST INTO THE UNKNOWN? BE AN EXPLORER! USING ENHANCED AGILITY AND TECHNOLOGY, EXPLORERS ACCESS SECRET TRAILS, UNCOVER HIDDEN RELICS, AND DISCOVER MAJESTIC VISTAS ACROSS PLANET NEXUS! MAPS?! WHO NEEDS ‘EM?"
			}, solder : {
				name: "SOLDIER",
				description: "READY TO LOCK, LOAD, AND KICK SOME ASS? AS A SOLDIER, YOU’LL MAKE WEAPON LOCKERS, FORGE SUPER-ARMOR, AND TEST ADVANCED HARDWARE PROTOTYPES ON YOUR RETREATING FOES. THAT ENOUGH ACTION FOR YOU, SPANKY? HOO-AH!"
			}, settler : {
				name: "SETTLER",
				description: "THIS WILDERNESS AIN’T GONNA IMPROVE ITSELF, CUPCAKE! STEP UP, STRAP ON A TOOLBELT, AND SPRUCE UP NEXUS BY BUILDING BATTLE ARENAS, HOSPITALS, TAVERNS, AND SPACEPORTS FOR YOUR BUDDIES. PIONEERING’S NEVER BEEN SO COOL OR DISEASE-FREE!"
			}, scientist : {
				name: "SCIENTIST",
				description: "KNOWLEDGE IS POWER, SO PUT THAT BIG BRAIN OF YOURS TO WORK! WHETHER IT’S RELICS, ROBOTS, OR RADICAL MACHINES, AS A SCIENTIST YOU AND YOUR TRUSTY SCANBOT WILL UNLOCK ALL THE SECRETS OF NEXUS. WHO KNOWS WHAT EVIL LURKS IN THE HEARTS OF HOSTILE ALIEN LIFEFORMS? YOU WILL!"
			}
		},
        tradeskills: [{
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
        }]
    };

    wildstar.controller("character", ["$scope", "$document", function ($scope, $document) {
        $scope.character = character;
        $scope.tradeskillsSelected = function () {
            var k = 0;
            for (var i = 0; i < character.tradeskills.length; i++) {
                for (var j = 0; j < character.tradeskills[i].professions.length; j++) {
                    if (character.tradeskills[i].professions[j].selected) {
                        k++;
                    }
                }
            }
            return k;
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