module.exports = function(ws_collection) {
	var routes = {};
	
	routes.signup = function(req, res) {
		var username = req.body.username || "",
			password = req.body.password || "";
		if(username && password) {
			if(typeof(username) == "string" && typeof(password) == "string") {
				if(true) { //do additional password and username checks (password verify and email verify)
					ws_collection("users", function(users) {
						users.save({
							username : username,
							password : password //hash the password here
						}, function(err, user) {
							if(err) throw err;
							req.session.id = user._id;
							res.send({error:""}); //return the permission level
						});
					});
				} else {
					res.send({error:"invalid username or password."});					
				}
			} else {				
				res.send({error:"username and password must be a string."});
			}
		} else {				
			res.send({error:"username and password are required."});
		}
	};
	
	routes.login = function(req, res) {
		
	};
	
	routes.isLoggedIn = function(req, res) {
		res.send(req.session.id); //return the permissions level
	};
	
	routes.logout = function(req, res) {
		req.session = {};
	};
	
	return routes;
};