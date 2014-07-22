module.exports = function(ws_collection) {
	var routes = {};

	routes.list = function(req, res) {	
		ws_collection("articles", function(articles) {
			articles.find().toArray(function(err, articles) {	
				if(err) throw err;
				res.send(articles);
			});
		});
	};
	
	return routes;
};

