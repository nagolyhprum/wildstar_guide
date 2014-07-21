wildstar.controller("tradeskill_details", ["$scope", "$routeParams", function($scope, $routeParams) {
	$scope.tradeskill = $routeParams.tradeskill;
	$scope.profession = $routeParams.profession;
}]);