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

	routes.save = function(req, res) {
		var accessToken = req.body.accessToken, article = req.body.article || {};
		ws_collection.saveDescribable({
			collection : "articles",
			data : {
				description : article.description,
				name : article.name,
				_id : article._id
			},
			accessToken : accessToken,
			callback : function(err, _id) {
				if(err) throw err;
				res.send(_id);
			}
		});
	};
	
	return routes;
};

