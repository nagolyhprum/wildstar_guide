module.exports = function(ws_collection) {
	var routes = {};

	routes.list = function(req, res) {	
		ws_collection("guidetemplate", function(guidetemplate) {
			guidetemplate.find().toArray(function(err, guidetemplate) {	
				if(err) throw err;
				res.send(guidetemplate);
			});
		});
	};
	
	

	return routes;
};

