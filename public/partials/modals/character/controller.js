wildstar.controller("character", ["$scope", "$http", function ($scope, $http) {
	$scope.character = {};
	if(!$scope.factions) {
		$scope.loader.show();
		$http.post("factions/list").success(function(factions) {
			$scope.set("factions", factions);
			$scope.loader.hide();
		});
	}
	if(!$scope.races) {
		$scope.loader.show();
		$http.post("races/list").success(function(races) {
			$scope.set("races", races);
			$scope.loader.hide();
		});
	}	
	if(!$scope.paths) {
		$scope.loader.show();
		$http.post("paths/list").success(function(paths) {
			$scope.set("paths", paths);
			$scope.loader.hide();
		});	
	}
	if(!$scope.classes) {
		$scope.loader.show();
		$http.post("classes/list").success(function(classes) {
			$scope.set("classes", classes);
			$scope.loader.hide();
		});	
	}
	if(!$scope.professions) {
		$scope.loader.show();
		$http.post("professions/list").success(function(professions) {
			$scope.loader.show();
			$http.post("tradeskills/list").success(function(tradeskills) {
				$scope.set("tradeskills", tradeskills);
				$scope.loader.hide();
			});
			$scope.set("professions", professions);
			$scope.loader.hide();
		});
	}
	$('#character').on('show.bs.modal', function (e) {
		$scope.character.name = "";
		$scope.character.faction = "";
		$scope.character.race = "";
		$scope.character.class = "";
		$scope.character.path = "";
		for(var i in $scope.professions) {
			var profession = $scope.professions[i];
			profession.selected = false;
		}
		if($scope.characterindex != -1) {		
			var character = $scope.characters[$scope.characterindex];
			$scope.character.name = character.name;
			$scope.character.faction  = $scope.factions.findByName(character.faction);
			$scope.character.race = $scope.races.findByName(character.race);
			$scope.character.class = $scope.classes.findByName(character.class);
			$scope.character.path = $scope.paths.findByName(character.path);
			for(var i in $scope.professions) {
				var profession = $scope.professions[i];
				profession.selected = character.professions.indexOf(profession.name) != -1;
			}
		}
		$scope.$apply();
	});
    $scope.selectedProfessions = function () {            
		var professions = [];
		for (var i = 0; i < $scope.professions.length; i++) {
			var profession = $scope.professions[i];
			if (profession.selected) {
				professions.push(profession.name);
			}
		}
		return professions;
	};
	
	$scope.removeCharacter = function() {
		$scope.loader.show();
		$http.post("users/characters", {
			character : {
				index : $scope.characterindex,
				remove : true
			},
			accessToken : Cookies.getItem("accessToken")
		}).success(function(data) {
			if(data.error) {
				console.log(data.error);
			} else {
				$("#remove").modal("hide");
				$scope.characters.splice($scope.characterindex, 1);
				$scope.setCharacterIndex(-1);
			}
			$scope.loader.hide();
		});
	};
	
	$scope.saveCharacter = function() {
		var character = {
			name : $scope.character.name,
			index : $scope.characterindex,
			faction : $scope.character.faction.name,
			class : $scope.character.class.name,
			race : $scope.character.race.name,
			professions : $scope.selectedProfessions(),
			path : $scope.character.path.name
		};
		$scope.loader.show();
		$http.post("users/characters", {
			character : character,
			accessToken : Cookies.getItem("accessToken")
		}).success(function(data) {
			if(data.error) {
				console.log(data.error);
			} else {
				$("#character").modal("hide");
				if($scope.characterindex == -1) {
					$scope.characters.push(character);
				} else {
					$scope.characters[$scope.characterindex] = character;
				}
			}
			$scope.loader.hide();
		});
	};
}]);