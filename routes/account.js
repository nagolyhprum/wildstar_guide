module.exports = function(ws_collection) {
	var routes = {};
	
	routes.signup = function(req, res) {
		var username = req.body.username || "",
			password = req.body.password || "";
		if(username && password) {
			if(typeof(username) == "string" && typeof(password) == "string") {
				if(true) { //TODO : additional password and username checks (password verify and email verify)
					ws_collection("users", function(users) {
						users.find({
							username : username
						}).toArray(function(err, result) {
							if(!result.length) {
								users.save({
									username : username,
									password : password //TODO : hash the password here,
									characters : []
								}, function(err, user) {
									if(err) throw err;
									res.send({error:""}); //TODO : return the permission level
								});
							} else { 
								res.send({error:"that username is in use already."});					
							}
						});
					});
				} else {
					res.send({error:"invalid password."});					
				}
			} else {				
				res.send({error:"username and password must be a string."});
			}
		} else {				
			res.send({error:"username and password are required."});
		}
	};
	
	routes.login = function(req, res) {
		//TODO : limit logins
		var username = req.body.username || "",
			password = req.body.password || "";
		ws_collection("users", function(users) {
			users.find({
				username : username,
				password : password
			}).toArray(function(err, result) {
				if(err) throw err;
				if(result.length) {
					res.send({error:""}); //TODO : permission level
				} else { 
					res.send({error:"invalid username or password."});					
				}
			});
		});
	};
	
	return routes;
};