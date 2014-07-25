wildstar.controller("dungeon_details", ["$scope", "$routeParams", function($scope, $routeParams) {
	$scope.$watch("dungeons", function() {
		if($scope.dungeons) {
			$scope.dungeon = {
				name : $scope.dungeons[$routeParams.dungeon].name,
				description : $scope.dungeons[$routeParams.dungeon].description
				_id : $scope.dungeons[$routeParams.dungeon]._id
			};
		}
	});
	$scope.save = function() {	
		$scope.dungeons[$routeParams.dungeon] = $scope.dungeon;
		$http.post("dungeons/save", {
			dungeon : $scope.dungeon,
			accessToken : Cookies.getItem("accessToken")
		}).success(function(data) {
			
		});
	};		
}]);