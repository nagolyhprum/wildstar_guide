module.exports = function(ws_collection) {
	var routes = {};

	routes.list = function(req, res) {	
		ws_collection("races", function(races) {
			races.find().toArray(function(err, races) {	
				if(err) throw err;
				res.send(races);
			});
		});
	};
	
	

	return routes;
};

