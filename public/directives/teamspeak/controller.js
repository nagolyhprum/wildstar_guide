wildstar.controller("teamspeak", ["$scope", function($scope) {
	$scope.toggle = function() {
		if($scope.state) {
			$scope.state = "";
		} else {
			$scope.state = "css-class";
		}
	};
}]);