module.exports = function(ws_collection) {
	var routes = {};

	routes.list = function(req, res) {	
		ws_collection("dungeons", function(dungeons) {
			dungeons.find().toArray(function(err, dungeons) {	
				if(err) throw err;
				res.send(dungeons);
			});
		});
	};
	
	

	return routes;
};

