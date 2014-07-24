wildstar.controller("dungeon_details", ["$scope", "$routeParams", function($scope, $routeParams) {
	$scope.$watch("dungeons", function() {
		if($scope.dungeons) {
			$scope.dungeon = {
				name : $scope.dungeons[$routeParams.dungeon].name,
				description : $scope.dungeons[$routeParams.dungeon].description
			};
		}
	});
	$scope.save = function() {	
		$scope.dungeons[$routeParams.dungeon] = $scope.dungeon;
		//TODO SAVE
	};		
}]);