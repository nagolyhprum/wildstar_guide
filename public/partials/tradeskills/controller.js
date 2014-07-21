wildstar.controller("tradeskills", ["$scope", "$http", function($scope, $http) {
	$scope.setTitle("Tradeskills");
	$scope.navbar.activate("Tradeskills");
	$scope.hover = function(e) {
		$(e.target).tooltip({				
			placement : "right"
		}).tooltip("show");
	};
}]);