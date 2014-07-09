var express = require("express");
var app = express();
var MongoClient = require('mongodb').MongoClient;

function ws_collection(name, callback) {	
	MongoClient.connect("mongodb://127.0.0.1:27017/wildstar", function (err, db) {
		if(err) throw err;
		callback(db.collection(name));
	});
}

var tradeskills = require("./routes/tradeskills.js")(ws_collection);

app.use(express.static(__dirname + "/public"));

app.post("/tradeskills/list", tradeskills.list);

app.listen(3000);