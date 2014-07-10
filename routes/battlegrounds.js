module.exports = function(ws_collection) {
	var routes = {};

	routes.list = function(req, res) {	
		ws_collection("battlegrounds", function(battlegrounds) {
			battlegrounds.find().toArray(function(err, battlegrounds) {	
				if(err) throw err;
				res.send(battlegrounds);
			});
		});
	};
	
	

	return routes;
};

