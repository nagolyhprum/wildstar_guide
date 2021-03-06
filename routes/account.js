module.exports = function(ws_collection) {
	var routes = {};
		
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
		if(password.length < 8) {
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
	
	routes.refresh = function(req, res) {
		ws_collection.authorizedUser(req.body.accessToken, function(err, user, users) {
			if(user) {
				user.expires = new Date().getTime() + (1000 * 60 * 30);
				users.save(user, function(err) {
					if(err) throw err;
				});
				res.send("Access token refreshed.");
			} else {
				res.send({error : err});
			}
		});
	};
	
	routes.characters = function(req, res) {
		var accessToken = req.body.accessToken;		
		ws_collection.authorizedUser(accessToken, function(err, user, users) {		
			if(!err) {
				var character = req.body.character; //editing
				if(character) {
					//filter
					var index = character.index;
					if(character.remove === true) { //deleting
						user.characters.splice(index, 1);					
						users.save(user, function(err) {
							if(err) throw err;
						});
						res.send("Character removed.");
						return;
					}
					character = {
						name : character.name,
						race : character.race,
						class : character.class,
						faction : character.faction,
						path : character.path,
						professions : character.professions
					};							
					//check types
					if(ws_collection.isArray([character.professions]) && character.professions.length <= 2 && ws_collection.isString([character.name, character.class, character.faction, character.path, character.race].concat(character.professions))) {
						if(ws_collection.isNumber([index]) && index != -1) { //editing							
							if(index < user.characters.length) {
								user.characters[index] = character;							
								users.save(user, function(err) {
									if(err) throw err;
								});
								res.send("Character updated.");
							} else {
								res.send({error : "Index out of bounds."});
							}
						} else { //creating
							user.characters.push(character);							
							users.save(user, function(err) {
								if(err) throw err;
							});
							res.send("Character inserted.");
						}
					} else {
						res.send({error : "Bad types."});
					}
				} else {
					res.send(user.characters);
				}
			} else {
				res.send({error : err});
			}
		});
	};
	
	routes.login = function(req, res) {
		var username = req.body.username || "", 
			password = req.body.password || "", 
			errors = {
			username:[],
			password:[]			
		}, error, hasError = false, isSignup = req.body.isSignup;
		if(!username) {
			errors.username.push("Username is required.");
			hasError = true;
		} else if(!ws_collection.isString([username])) {			
			errors.username.push("Username must be a string.");
			hasError = true;
		} else if((error = checkUsername(username)).length) {
			errors.username = errors.username.concat(error);
			hasError = true;
		}
		if(!password) {
			errors.password.push("Password is required.");
			hasError = true;
		} else if(!ws_collection.isString([password])) {
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
					if(err) throw err;			
					if(user = user[0]) {
						if(user.password == SHA256(password)) {
							var guid = GUID.create().value;
							users.save({
								_id : user._id,
								username : user.username,
								password : user.password,
								characters : user.characters,
								permission : user.permission,
								accessToken : guid,
								expires : new Date().getTime() + (1000 * 60 * 30)
							},function(err){
								if(err) throw err;
								res.send({permission:user.permission,accessToken:guid});
							});
						} else {
							errors.password.push("Wrong password.");
							res.send({errors:errors});												
						}
					} else if(isSignup) {
						var guid = GUID.create().value;
						users.save({
							username : username,
							password : SHA256(password).toString(),
							characters : [],
							permission : ws_collection.permissions.user,
							accessToken : guid,
							expires : new Date().getTime() + (1000 * 60 * 30)
						}, function(err){				
							if(err) throw err;
							res.send({permission:ws_collection.permissions.user,accessToken:guid});	
						});
					} else {
						res.send({errors:{username:["Invalid Username or Password."],password:["Invalid Username or Password."]}});
					}				
				});
			});
		} else {
			res.send({errors:errors});					
		}
	};
	
	return routes;
};