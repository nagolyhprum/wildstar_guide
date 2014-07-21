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
	$rootScope.encodeURI = function(uri) {
		return encodeURIComponent(uri);
	};
	$rootScope.dungeons = dungeons;
	$rootScope.raids = raids;
	$rootScope.factions = factions;
	$rootScope.classes = classes;
	$rootScope.races = races;
	$rootScope.tradeskills = tradeskills;
	$rootScope.paths = paths;
	$rootScope.battlegrounds = battlegrounds;
	$rootScope.professions = professions;
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
	
var factions = [{
	name: "Exile",
	description: "DRIVEN FROM THEIR HOMEWORLDS BY THE DOMINION, THE EXILES ARE A RAGTAG ALLIANCE OF REFUGEES, OUTLAWS AND MERCENARIES THAT HAVE COME TO PLANET NEXUS TO FIND A NEW HOME. A GUTSY GROUP OF OUTCASTS AND MERCENARIES WHO HAVE COME TO NEXUS TO FIND A NEW HOME.",
	races : ["Human", "Granok", "Aurin", "Mordesh"]
}, {
	name: "Dominion",
	description: "THE DOMINION IS A POWERFUL INTERSTELLAR EMPIRE THAT HAS RULED THE GALAXY FOR TWO THOUSAND YEARS, AND NOW CLAIMS PLANET NEXUS AS ITS RIGHTFUL LEGACY. A POWERFUL EMPIRE FOUNDED BY THE ELDAN THAT CLAIMS NEXUS AS ITS RIGHTFUL LEGACY.",				
	races: ["Cassian", "Mechari", "Draken", "Chua"]
}];
	
var races = [{
	name: "Human",
	description: "AFTER CENTURIES OF WANDERING THE FRINGE IN THEIR RAMSHACKLE FLEET, HUMANS ARE READY TO SETTLE DOWN ON NEXUS USING GRIT, BACKBONE, AND SOME OLD-FASHIONED ELBOW GREASE. AND IF THOSE DOMINION BASTARDS ARE LOOKING FOR A FIGHT? BRING IT ON! OUTCASTS. RENEGADES. SCRUFFY.",
	classes : ["Engineer", "Medic", "Stalker", "Esper", "Spellslinger", "Warrior"]
}, {
	name: "Granok",
	description: "BANISHED FROM THEIR HOMEWORLD AFTER A BLOODY WAR WITH THE DOMINION, THE GRANOK ARE A RACE OF SKULL-CRACKING, HARD-CHARGING GALACTIC MERCENARIES THAT HAVE COME TO NEXUS TO KICK ASS AND DRINK BEER. NOT NECESSARILY IN THAT ORDER. ROCK-SKINNED. FEARLESS. HUNG OVER.",
	classes : ["Engineer", "Medic", "Warrior"]
}, {
	name: "Aurin",
	description: "SMALL BUT SCRAPPY, THE AURIN ARE A RACE OF FOREST DWELLERS WHOSE HOMEWORLD WAS RAVAGED BY THE DOMINION. THEY MIGHT BE INTO HUGGING TREES, BUT THEY'RE MORE THAN READY TO BARE TOOTH AND CLAW TO DEFEND THEIR NEW HOME ON NEXUS. SMALL. SCRAPPY. TREE-HUGGING.",
	classes : ["Esper", "Spellslinger", "Stalker"]
}, {
	name: "Mordesh",
	description: "CURSED WITH A DEGENERATIVE DISEASE AFTER DELVING INTO THE FORBIDDEN SECRETS OF ALCHEMY, THE MORDESH HAVE COME TO NEXUS TO FIND A CURE. BEING A SPACE ZOMBIE CAN BE COMPLICATED. UNLEASHING DARK AND DEADLY DISCIPLINES ON THE DOMINION? MUCH SIMPLER.INTELLECTUAL. MOROSE. DECOMPOSING.",
	classes : ["Engineer", "Medic", "Spellslinger", "Stalker", "Warrior"]
}, {
	name: "Cassian",
	description: "LONG AGO, THE CASSIANS WERE CHOSEN BY THE ELDAN TO ESTABLISH THE DOMINION - AND THEY'RE GOING TO MAKE SURE THE PATHETIC VERMIN INFESTING THE GALAXY DON'T FORGET IT. DESTINY IS A TERRIBLY HEAVY BURDEN, AND THE CASSIANS BEAR IT WITH STYLE. WEALTHY. DISCIPLINED. SUPERIOR.",
	classes : ["Engineer", "Medic", "Stalker", "Esper", "Spellslinger", "Warrior"]
}, {
	name: "Mechari",
	description: "ENGINEERED BY THE ELDAN THEMSELVES, THE MECHARI ARE A RACE OF HIGHLY-EFFICIENT KILLING MACHINES THAT MAKE IT THEIR BUSINESS TO ELIMINATE TRAITORS AND SPIES ON NEXUS. SENSE OF HUMOR? NOT ONE OF THEIR STRONG POINTS. CALCULATING. EFFICIENT. REMORSELESS.",
	classes : ["Engineer", "Medic", "Warrior", "Stalker"]
}, {
	name: "Draken",
	description: "FORGED IN THE HEAT AND DUST OF THEIR SAVAGE HOMEWORLD, THE DRAKEN HAVE COME TO NEXUS TO PROVE THEY ARE THE MOST BADASS WARRIORS IN THE GALAXY. EVISCERATIONS, DISEMBOWELMENTS, AND DECAPITATIONS WILL DEFINITELY BE INVOLVED. SAVAGE. BLOODTHIRSTY. BRUTAL.",
	classes : ["Warrior", "Spellslinger", "Stalker"]
}, {
	name: "Chua",
	description: "NEARLY AS BRILLIANT AS THEY ARE SOCIOPATHIC, THE CHUA ARE MISCHIEVOUS INVENTORS WHO DEVELOP ADVANCED WEAPONS AND TECHNOLOGY FOR THE DOMINION.  SCIENCE HAS NEVER BEEN MORE FUN – OR AGONIZING. TINY. BRILLIANT. PSYCHOTIC.",
	classes : ["Engineer", "Medic", "Esper", "Spellslinger"]
}];	

var classes = [{
	name: "Warrior",
	description: "ARMED TO THE TEETH AND FEARLESSLY WADING INTO BATTLE WITH MULTIPLE ENEMIES, WARRIORS ARE UNSTOPPABLE JUGGERNAUTS OF BRUTALITY AND COMBAT! PEACE IS FOR THE WEAK!"
}, {
	name: "Spellslinger",
	description: "MAVERICK ACES OF THE RUN AND GUN, SPELLSLINGERS USE THEIR LIGHTNING REFLEXES, QUICKDRAW SKILLS, AND ARCANE SORCERY TO DISPENSE FRONTIER JUSTICE WITH A VENGEANCE! SHOOT FIRST, COUNT THE BODIES LATER!"
}, {
	name: "Esper",
	description: "MASTERS OF PSIONIC ILLUSION, ESPERS USE THE POWER OF THEIR MINDS TO CONJURE DEADLY APPARITIONS AND EXTRASENSORY WEAPONRY! WHEN IT COMES TO MASS BUTCHERY, IT'S THE THOUGHT THAT COUNTS!"
}, {
	name: "Engineer",
	description: "DECKED OUT IN MECHANICAL ARMOR, ENGINEERS UNLEASH DESTRUCTIVE LONG-RANGE ATTACKS WHILE DEPLOYING A POWERFUL POSSE OF BOTS IN BATTLE. NEVER BEFORE HAVE WRENCHES INSPIRED SUCH DREAD!"
}, {
	name: "Stalker",
	description: "SILENT BUT DEADLY ASSASSINS, STALKERS USE ADVANCED STEALTH TECHNOLOGY TO STALK AND PAINFULLY EVISCERATE THEIR FOES. IF YOU SEE ONE, YOU’RE ALREADY DEAD!"
}, {
	name: "Medic",
	description: "SPECIALIZING IN BATTLEFIELD SUPPORT, MEDICS USE THEIR ARSENAL OF GADGETS TO HEAL THEIR FRIENDS AND LIQUIDATE THEIR ENEMIES. PRESCRIPTION: DEATH!"
}];

var paths = [{
	name: "Explorer",
	description: "DO YOU CRAVE MORTAL DANGER AND DIVING HEADFIRST INTO THE UNKNOWN? BE AN EXPLORER! USING ENHANCED AGILITY AND TECHNOLOGY, EXPLORERS ACCESS SECRET TRAILS, UNCOVER HIDDEN RELICS, AND DISCOVER MAJESTIC VISTAS ACROSS PLANET NEXUS! MAPS?! WHO NEEDS ‘EM?"
}, {
	name: "Soldier",
	description: "READY TO LOCK, LOAD, AND KICK SOME ASS? AS A SOLDIER, YOU’LL MAKE WEAPON LOCKERS, FORGE SUPER-ARMOR, AND TEST ADVANCED HARDWARE PROTOTYPES ON YOUR RETREATING FOES. THAT ENOUGH ACTION FOR YOU, SPANKY? HOO-AH!"
}, {
	name: "Settler",
	description: "THIS WILDERNESS AIN’T GONNA IMPROVE ITSELF, CUPCAKE! STEP UP, STRAP ON A TOOLBELT, AND SPRUCE UP NEXUS BY BUILDING BATTLE ARENAS, HOSPITALS, TAVERNS, AND SPACEPORTS FOR YOUR BUDDIES. PIONEERING’S NEVER BEEN SO COOL OR DISEASE-FREE!"
}, {
	name: "Scientist",
	description: "KNOWLEDGE IS POWER, SO PUT THAT BIG BRAIN OF YOURS TO WORK! WHETHER IT’S RELICS, ROBOTS, OR RADICAL MACHINES, AS A SCIENTIST YOU AND YOUR TRUSTY SCANBOT WILL UNLOCK ALL THE SECRETS OF NEXUS. WHO KNOWS WHAT EVIL LURKS IN THE HEARTS OF HOSTILE ALIEN LIFEFORMS? YOU WILL!"
}];

var professions = [{
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
}, {
	name: "Mining",
	description: "TODO : GABE"
}, {
	name: "Survivalist",
	description: "TODO : GABE"
}, {
	name: "Relic Hunter",
	description: "TODO : GABE"
}, {
	name: "Cooking",
	description: "TODO : GABE"
}, {
	name: "Farming",
	description: "TODO : GABE"
}, {
	name: "Fishing",
	description: "TODO : GABE"
}, {
	name: "Runecrafting",
	description: "TODO : GABE"
}, {
	name: "Salvaging",
	description: "TODO : GABE"
}];

var tradeskills = [{
	name: "Crafting / Production",
	description: "TODO : GABE",
	professions: ["Weaponsmith", "Armorer", "Outfitter", "Tailor", "Technologist", "Architect"]
}, {
	name: "Gathering",
	description: "TODO : GABE",
	professions: ["Mining", "Survivalist", "Relic Hunter"]
}, {
	name: "Hobbies",
	description: "TODO : GABE",
	professions: ["Cooking", "Farming", "Fishing"]
}, {
	name: "Other",
	description: "TODO : GABE",
	professions: ["Runecrafting", "Salvaging"]
}];

var battlegrounds = [{
	name : "Walatiki Temple",
	description : "General Description"
}, {
	name : "Bloodsword Halls",
	description : "General Description"
}];

var raids = [{
	name : "Datascape",
	description : "General Description",		
}, {
	name : "Genetic Archives",
	description : "General Description"
}];

var dungeons = [{
	name : "Dungeon 1",
	description : "General description."
}, {
	name : "Dungeon 2",
	description : "General description."
}, {
	name : "Dungeon 3",
	description : "General description."
}, {
	name : "Dungeon 4",
	description : "General description."
}, {
	name : "Dungeon 5",
	description : "General description."
}, {
	name : "Dungeon 6",
	description : "General description."
}, ];