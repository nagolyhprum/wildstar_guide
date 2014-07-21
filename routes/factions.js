module.exports = function(ws_collection) {
	var routes = {};

	routes.list = function(req, res) {	
		ws_collection("factions", function(factions) {
			factions.find().toArray(function(err, factions) {	
				if(err) throw err;
				res.send(factions);
			});
		});
	};
	
	return routes;
};

