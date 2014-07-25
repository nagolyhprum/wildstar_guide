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
	
	routes.save = function(req, res) {
		var accessToken = req.body.accessToken, raid = req.body.raid || {};
		ws_collection.saveDescribable({
			collection : "raids",
			data : {
				description : raid.description,
				name : raid.name,
				_id : raid._id
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

