module.exports = function(ws_collection) {
	var routes = {};

	routes.list = function(req, res) {	
		ws_collection("paths", function(paths) {
			paths.find().toArray(function(err, paths) {	
				if(err) throw err;
				res.send(paths);
			});
		});
	};
	
	return routes;
};

