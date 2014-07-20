wildstar.controller("character", ["$scope", "$http", function ($scope, $http) {
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
			var faction = $scope.global.factions[character.faction && character.faction.toLowerCase()] || 0;
			$scope.character.name = character.name;
			$scope.character.faction  = faction;
			$scope.character.race = faction ? faction.races[character.race && character.race.toLowerCase()] : 0;
			$scope.character.class = $scope.global.classes[character.class && character.class.toLowerCase()];
			$scope.character.path = $scope.global.paths[character.path && character.path.toLowerCase()];
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