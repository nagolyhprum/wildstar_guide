var express = require("express");
var app = express();
var MongoClient = require('mongodb').MongoClient;

function ws_collection(name, callback) {	
	MongoClient.connect("mongodb://127.0.0.1:27017/wildstar", function (err, db) {
		if(err) throw err;
		callback(db.collection(name));
	});
}

app.use(express.static(__dirname + "/public"));

var tradeskills = require("./routes/tradeskills.js")(ws_collection);
var battlegrounds = require("./routes/battlegrounds.js")(ws_collection);
var classes = require("./routes/classes.js")(ws_collection);
var raids = require("./routes/raids.js")(ws_collection);
var races = require("./routes/races.js")(ws_collection);

app.post("/tradeskills/list", tradeskills.list);
app.post("/battlegrounds/list", battlegrounds.list);
app.post("/classes/list", classes.list);
app.post("/raids/list", raids.list);
app.post("/races/list", races.list);

app.listen(3000);