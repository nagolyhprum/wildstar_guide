module.exports = function() {
	var md = require("node-markdown").Markdown;

	var routes = {};
	
	routes.markdown = function(req, res) {
		res.send(md(req.body.markdown, true));
	};
	
	return routes;
};