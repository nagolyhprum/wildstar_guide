wildstar.controller("character", ["$scope", "$http", function ($scope, $http) {
	$scope.character = {};
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
		if($scope.global.characterindex != -1) {		
			var character = $scope.global.characters[$scope.global.characterindex];
			$scope.character.name = character.name;
			$scope.character.faction  = $scope.global.factions.findByName(character.faction);
			$scope.character.race = $scope.global.races.findByName(character.race);
			$scope.character.class = $scope.global.classes.findByName(character.class);
			$scope.character.path = $scope.global.paths.findByName(character.path);
			for(var i in $scope.professions) {
				var profession = $scope.professions[i];
				profession.selected = character.professions.indexOf(profession.name) != -1;
			}
		}
		$scope.$apply();
	});
    $scope.selectedProfessions = function () {            
		var professions = [];
		for (var i = 0; i < $scope.global.professions.length; i++) {
			var profession = $scope.global.professions[i];
			if (profession.selected) {
				professions.push(profession.name);
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