wildstar.controller("tradeskills", ["$scope", "$http", function($scope, $http) {	
	$scope.navbar.activate($scope.set("title", "Tradeskills"));
	$scope.hover = function(e) {
		$(e.target).tooltip({				
			placement : "right"
		}).tooltip("show");
	};
	if(!$scope.professions) {
		$scope.loader.show();
		$http.post("list", {
			collection : "professions"
		}).success(function(professions) {
			$scope.loader.show();
			$http.post("list", {
				collection : "tradeskills"
			}).success(function(tradeskills) {
				$scope.set("tradeskills", tradeskills);
				$scope.loader.hide();
			});
			$scope.set("professions", professions);
			$scope.loader.hide();
		});
	}
}]);