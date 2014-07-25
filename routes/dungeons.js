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
	
	routes.save = function(req, res) {
		var accessToken = req.body.accessToken, dungeon = req.body.dungeon || {};
		ws_collection.saveDescribable({
			collection : "dungeons",
			data : {
				description : dungeon.description,
				name : dungeon.name,
				_id : dungeon._id
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

