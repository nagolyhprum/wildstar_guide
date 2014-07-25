module.exports = function(ws_collection) {
	var routes = {};

	routes.list = function(req, res) {	
		ws_collection("classes", function(classes) {
			classes.find().toArray(function(err, classes) {	
				if(err) throw err;
				res.send(classes);
			});
		});
	};

	return routes;
};

