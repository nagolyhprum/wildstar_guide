var express = require("express");
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
var app = express();
var MongoClient = require('mongodb').MongoClient;

function ws_collection(name, callback) {	
	MongoClient.connect("mongodb://127.0.0.1:27017/wildstar", function (err, db) {
		if(err) throw err;
		callback(db.collection(name));
	});
}


app.use(cookieParser());
app.use(expressSession({secret:'somesecrettokenhere'})); 
app.use(bodyParser());

app.use(express.static(__dirname + "/public"));

var tradeskills = require("./routes/tradeskills.js")(ws_collection);
var battlegrounds = require("./routes/battlegrounds.js")(ws_collection);
var classes = require("./routes/classes.js")(ws_collection);
var raids = require("./routes/raids.js")(ws_collection);
var dungeons = require("./routes/dungeons.js")(ws_collection);
var account = require("./routes/account.js")(ws_collection);

app.post("/tradeskills/list", tradeskills.list);
app.post("/battlegrounds/list", battlegrounds.list);
app.post("/classes/list", classes.list);
app.post("/raids/list", raids.list);
app.post("/dungeons/list", dungeons.list);

app.post("/users/signup", account.signup);
app.post("/users/login", account.login);
app.post("/users/isloggedin", account.isLoggedIn);

app.listen(3000, function() {
	console.log("Server listening on port 3000.");
});