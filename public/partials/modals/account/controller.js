wildstar.controller("account", ["$scope", "$http", "$cookies", function($scope, $http, $cookies) {
	$scope.login = function(isSignup) {
		$scope.loader.show();
		$http.post("users/login", {
			username : $scope.username,
			password : $scope.password,
			isSignup : isSignup
		}).success(function(data) {		
			if(!data.errors) {
				//TODO : CONFIRM ACCOUNT CREATION / LOG IN
				$scope.setTimeout();
				$scope.set("permission", data.permission);
				$cookies.accessToken = data.accessToken;
				$cookies.permission = data.permission;				
				$scope.loadCharacters();
				$scope.getAlerts();
				$("#account").modal("hide");
				$scope.username = "";
				$scope.password = "";
			} else {				
				$scope.errors = data.errors;
				$("[ng-model='username']").tooltip("destroy").tooltip({
					title : data.errors.username[0],
					placement : "right",
					viewport : "body"
				});
				$("[ng-model='password']").tooltip("destroy").tooltip({
					title : data.errors.password[0],
					placement : "right",
					viewport : "body"
				});
			}
			$scope.loader.hide();
		});
	};
}]);