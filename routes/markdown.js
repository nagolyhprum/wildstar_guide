module.exports = function() {
	var md = require("node-markdown").Markdown;
	
	var routes = {};
	
	routes.toHTML = function(req, res) {
		res.send(md(req.query.md || "", true));
	};
	
	return routes;
};