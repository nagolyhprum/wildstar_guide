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
	
	routes.save = function(req, res) {
		var accessToken = req.body.accessToken, battleground = req.body.battleground || {};
		console.log(battleground);
		ws_collection.saveDescribable({
			collection : "battlegrounds",
			data : {
				description : battleground.description,
				name : battleground.name,
				_id : battleground._id
			},
			accessToken : accessToken,
			callback : function(err) {
				if(err) throw err;
				res.send("Battleground saved.");
			}
		});
	};
	
	return routes;
};

