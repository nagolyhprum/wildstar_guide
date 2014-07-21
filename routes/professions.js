module.exports = function(ws_collection) {
	var routes = {};

	routes.list = function(req, res) {	
		ws_collection("professions", function(professions) {
			professions.find().toArray(function(err, professions) {	
				if(err) throw err;
				res.send(professions);
			});
		});
	};
	
	return routes;
};

