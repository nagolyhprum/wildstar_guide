module.exports = function(ws_collection) {
	var routes = {};

	routes.list = function(req, res) {	
		ws_collection("raids", function(raids) {
			raids.find().toArray(function(err, raids) {	
				if(err) throw err;
				res.send(raids);
			});
		});
	};
	
	

	return routes;
};

