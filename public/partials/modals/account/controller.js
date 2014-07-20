wildstar.controller("account", ["$scope", "$http", function($scope, $http) {
	$scope.login = function() {
		$http.post("users/login", {
			username : $scope.username,
			password : $scope.password
		}).success(function(data) {		
			if(!data.errors) {
				//TODO : CONFIRM ACCOUNT CREATION / LOG IN
				$scope.global.setTimeout();
				$scope.global.isLoggedIn = true;	
				Cookies.setItem("accessToken", data.accessToken, (1000 * 60 * 30));
				Cookies.setItem("permission", data.permission, (1000 * 60 * 30));				
				$scope.loadCharacters();
				$("#account").modal("hide");
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
		});
	};
}]);