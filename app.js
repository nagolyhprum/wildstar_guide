var express = require("express");
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser());

app.use(express.static(__dirname + "/public"));

var ws_collection = require("./routes/ws_collection.js")();
var articles = require("./routes/articles.js")(ws_collection);
var factions = require("./routes/tradeskills.js")(ws_collection);
var tradeskills = require("./routes/tradeskills.js")(ws_collection);
var battlegrounds = require("./routes/battlegrounds.js")(ws_collection);
var classes = require("./routes/classes.js")(ws_collection);
var raids = require("./routes/raids.js")(ws_collection);
var factions = require("./routes/factions.js")(ws_collection);
var races = require("./routes/races.js")(ws_collection);
var paths = require("./routes/paths.js")(ws_collection);
var professions = require("./routes/professions.js")(ws_collection);
var dungeons = require("./routes/dungeons.js")(ws_collection);

var account = require("./routes/account.js")(ws_collection);

app.post("/tradeskills/list", tradeskills.list);
app.post("/battlegrounds/list", battlegrounds.list);
app.post("/classes/list", classes.list);
app.post("/raids/list", raids.list);
app.post("/dungeons/list", dungeons.list);
app.post("/factions/list", factions.list);
app.post("/races/list", races.list);
app.post("/paths/list", paths.list);
app.post("/professions/list", professions.list);
app.post("/articles/list", articles.list);

app.post("/battlegrounds/save", battlegrounds.save);
app.post("/raids/save", raids.save);
app.post("/classes/save", classes.save);
//app.post("/dungeons/save", dungeons.save);
//app.post("/articles/save", articles.save);


app.post("/users/login", account.login);
app.post("/users/characters", account.characters);
app.post("/users/refresh", account.refresh);

app.listen(3000, function() {
	console.log("Server listening on port 3000.");
});