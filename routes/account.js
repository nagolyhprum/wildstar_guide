module.exports = function(ws_collection) {
	var routes = {};
	
	var permissions = {
		user : 5,
		admin : 10
	};
	
	var SHA256 = require("crypto-js/sha256");
	var GUID = require("guid");
	
	function checkUsername(username) {
		var errors = [];
		if(username.length < 8) {
			errors.push("Username must be at least 8 characters.");
		} else if(!(/^[\w\d]{8,}$/g).test(username)) {
			errors.push("Username can only contain alphanumeric characters.");		
		}
		return errors;
	}
	
	function checkPassword(password) {		
		var errors = [];
		if(password.length > 8) {
			errors.push("Password must be at least 8 characters.");
		} else {
			if(!(/[a-z]/g).test(password)) {
				errors.push("Password must contain at least one lowercase letter.");
			}
			if(!(/[A-Z]/g).test(password)) {
				errors.push("Password must contain at least one upper letter.");
			}
			if(!(/[0-9]/g).test(password)) {
				errors.push("Password must contain at least one number.");
			}
			if(!(/^[\w\d]{8,}$/g).test(password)) {
				errors.push("Password can only contain alphanumeric characters.");		
			}
		}
		return errors;
	}
	
	routes.login = function(req, res) {
		var username = req.body.username || "", password = req.body.password || "", errors = {
			username:[],
			password:[]			
		}, error, hasError = false;
		if(!username) {
			errors.username.push("Username is required.");
			hasError = true;
		} else if(typeof(username) != "string") {			
			errors.username.push("Username must be a string.");
			hasError = true;
		} else if((error = checkUsername(username)).length) {
			errors.username = errors.username.concat(error);
			hasError = true;
		}
		if(!password) {
			errors.password.push("Password is required.");
			hasError = true;
		} else if(typeof(password) != "string") {
			errors.password.push("Password must be a string.");
			hasError = true;
		} else if((error = checkPassword(password)).length) {
			errors.password = errors.password.concat(error);
			hasError = true;
		}
		if(!hasError) {
			ws_collection("users", function(users) {
				users.find({
					username : username
				}).toArray(function(err, user) {					
					if(user = user[0]) {
						if(user.password == SHA256(password)) {
							var guid = GUID.create();
							users.save({
								_id : user._id,
								accessToken : guid,
								expires : new Date().getTime() + (1000 * 60 * 30)
							},function(){});
							res.send({permission:user.permission,accessToken:guid});
						} else {
							errors.password.push("Wrong password.");
							res.send({errors:errors});												
						}
					} else { 
						var guid = GUID.create();
						users.save({
							username : username,
							password : SHA256(password),
							characters : [],
							permission : permissions.user,
							accessToken : guid,
							expires : new Date().getTime() + (1000 * 60 * 30)
						},function(){});
						res.send({permission:permissions.user,accessToken:guid});
					}
				});
			});
		} else {
			res.send({errors:errors});					
		}
	};
	
	return routes;
};