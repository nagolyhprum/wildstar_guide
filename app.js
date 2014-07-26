var express = require("express");
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser());

app.use(express.static(__dirname + "/public"));

var ws_collection = require("./routes/ws_collection.js")();
var account = require("./routes/account.js")(ws_collection);
var classes = require("./routes/classes.js")(ws_collection);
var factions = require("./routes/factions.js")(ws_collection);
var paths = require("./routes/paths.js")(ws_collection);
var professions = require("./routes/professions.js")(ws_collection);
var races = require("./routes/races.js")(ws_collection);
var tradeskills = require("./routes/tradeskills.js")(ws_collection);


app.post("/classes/list", classes.list);
app.post("/factions/list", factions.list);
app.post("/paths/list", paths.list);
app.post("/professions/list", professions.list);
app.post("/races/list", races.list);
app.post("/tradeskills/list", tradeskills.list);

app.post("/save", ws_collection.handleSave);
app.post("/comment", ws_collection.handleComment);
app.post("/list", ws_collection.list);

app.post("/users/login", account.login);
app.post("/users/characters", account.characters);
app.post("/users/refresh", account.refresh);

app.listen(3000, function() {
	console.log("Server listening on port 3000.");
});