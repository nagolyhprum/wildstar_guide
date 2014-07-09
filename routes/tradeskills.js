module.exports = function(ws_collection) {
	var routes = {};

	routes.list = function(req, res) {	
		ws_collection("tradeskills", function(tradeskills) {
			tradeskills.find().toArray(function(err, tradeskills) {	
				if(err) throw err;
				res.send(tradeskills);
			});
		});
	};

	return routes;
};

