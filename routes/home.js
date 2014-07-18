module.exports = function(ws_collection) {
	var routes = {};

	routes.list = function(req, res) {	
		ws_collection("home", function(home) {
			home.find().toArray(function(err, home) {	
				if(err) throw err;
				res.send(home);
			});
		});
	};
	
	

	return routes;
};

