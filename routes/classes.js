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

	routes.save = function(req, res) {
		var accessToken = req.body.accessToken, class = req.body.class || {};
		ws_collection.saveDescribable({
			collection : "classes",
			data : {
				description : class.description,
				name : class.name,
				_id : class._id
			},
			accessToken : accessToken,
			callback : function(err) {
				if(err) throw err;
				res.send("class saved.");
			}
		});
	};	
	
	return routes;
};

