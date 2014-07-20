wildstar.controller("tradeskills", ["$scope", "$http", function($scope, $http) {
	$scope.global.navbar.activate($scope.global.title = "Tradeskills");
	$scope.hover = function(e) {
		$(e.target).tooltip({				
			placement : "right"
		}).tooltip("show");
	};
}]);