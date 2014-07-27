var express = require("express");
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser());

app.use(express.static(__dirname + "/public"));

var ws_collection = require("./routes/ws_collection.js")();
var account = require("./routes/account.js")(ws_collection);

app.post("/save", ws_collection.handleSave);
app.post("/comment", ws_collection.handleComment);
app.post("/list", ws_collection.list);

app.post("/users/login", account.login);
app.post("/users/characters", account.characters);
app.post("/users/refresh", account.refresh);

app.listen(3000, function() {
	console.log("Server listening on port 3000.");
});