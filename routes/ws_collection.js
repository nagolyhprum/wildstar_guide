module.exports = function() {
	var MongoClient = require('mongodb').MongoClient;
	
	var ObjectID = require('mongodb').ObjectID;
	
	function ws_collection(name, callback) {	
		MongoClient.connect("mongodb://127.0.0.1:27017/wildstar", function (err, db) {
			if(err) throw err;
			callback(db.collection(name));
		});
	}
	
	var guidChecker = /^[a-f0-9]{24}$/
	var accessTokenChecker = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

	ws_collection.authorizedUser = function(accessToken, callback) {
		if(accessTokenChecker.test(accessToken)) {
			ws_collection("users", function(users) {
				users.find({
					accessToken : accessToken
				}).toArray(function(err, user) {	
					if(err) throw err;
					if((user = user[0]) && (user.expires > new Date().getTime())) {
						callback(err, user, users);
					} else if(!user) {
						callback("Invalid access token.");
					} else {
						callback("Expired access token.");
					}
				});
			});
		} else {
			callback("Access token format error '" + accessToken + "'.");
		}
	};

	ws_collection.permissions = {
		user : 5,
		admin : 10
	};

	ws_collection.isString = function(r) {		
		for(var i = 0; i < r.length; i++) {
			if(typeof r[i] != "string") {
				return false;
			}
		}
		return true;
	}
		
	ws_collection.isNumber = function(r) {
		for(var i = 0; i < r.length; i++) {
			if(typeof r[i] != "number") {
				return false;
			}
		}
		return true;
	};
		
	ws_collection.isNumber = function(r) {
		for(var i = 0; i < r.length; i++) {
			if(typeof r[i] != "number") {
				return false;
			}
		}
		return true;
	};
		
	ws_collection.isArray = function(r) {
		for(var i = 0; i < r.length; i++) {
			if(!(r[i] instanceof Array)) {
				return false;
			}
		}
		return true;
	};
	
	var saveCollections = {
		articles : "article",
		dungeons : "dungeon",
		battlegrounds : "battleground",
		raids : "raid"
	};
	
	ws_collection.handleSave = function(req, res) {	
		var accessToken = req.body.accessToken, 
			collection = req.body.collection,
			object = req.body.object || {};
		if(saveCollections[collection]) {			
			ws_collection.save({
				collection : collection,
				data : {
					description : object.description,
					name : object.name,
					_id : object._id
				},
				accessToken : accessToken,
				callback : function(err, _id) {
					if(err) throw err;
					res.send(_id);
				}
			});
		} else {
			res.send("Invalid collection.");
		}
	};

	ws_collection.save = function(obj) {
		if(ws_collection.isString([obj.data.name, obj.data.description])) {			
			ws_collection.authorizedUser(obj.accessToken, function(err, user, users) {
				if(err) throw err;				
				if(user.permission >= ws_collection.permissions.admin) {
					if(obj.data._id) {
						obj.data._id = new ObjectID(obj.data._id);
					}
					ws_collection(obj.collection, function(collection) {
						obj.data.comments = [];
						collection.save(obj.data, function(err, document) {
							obj.callback(err, document._id);
						});
					});
				} else {
					obj.callback("Invalid permission.");
				}
			});
		} else {
			obj.callback("Name and description are required.");
		}
	};
	
	var commentCollections = {
		articles : 1,
		dungeons : 1,
		battlegrounds : 1,
		raids : 1
	};
	
	ws_collection.handleComment = function(req, res) {
		var _id = req.body._id,
			accessToken = req.body.accessToken,
			collection = req.body.collection,
			indices = req.body.indices,
			comment = req.body.comment,
			comments = req.body.comments;
		if(commentCollections[collection]) {
			ws_collection.comment({
				_id : _id,
				accessToken : accessToken,
				collection : collection,
				indices : indices,
				comment : comment,
				comments : comments,
				callback : function(err) {
					res.send(err);
				}
			});
		} else {
			res.send("Invalid collection.");
		}
	};
	
	ws_collection.comment = function(obj) {
		if(guidChecker.test(obj._id)) {
			ws_collection.authorizedUser(obj.accessToken, function(err, user, users) {
				if(err) throw err;
				if(user.permission >= ws_collection.permissions.user) {
					ws_collection(obj.collection, function(collection) {
						collection.find({
							_id : new ObjectID(obj._id)
						}).toArray(function(err, commentable) {							
							if(err) throw err;
							if(obj.indices && (commentable = commentable[0])) {
								var ref = commentable;
								for(var i = 0; i < obj.indices.length && ref; i++) { //limit nesting
									ref = ref.comments[obj.indices[i]];
								}
								if(ref) {
									if(obj.comments) {
										ref.comments.push({
											comment : obj.comments,
											user : user._id,
											time : new Date().getTime(),
											comments : []
										});
									} else if(obj.comment && ref.user.equals(user._id)) {
										ref.comment = obj.comment;
									} else {
										obj.callback("Comment or comments required.");
										return;
									}
									collection.save(commentable, function(err) {
										if(err) throw err;
										obj.callback("All good.");
									});
								} else {
									obj.callback("Bad indexing.");
								}
							} else {
								obj.callback("Indices are required.");
							}
						});
					});
				} else {
					obj.callback("Invalid permissions.");
				}
			});
		} else {
			obj.callback("Bad guid '" + obj.guid + "'.");
		}
	};
	
	var listCollections = {
		articles : 1,
		dungeons : 1,
		battlegrounds : 1,
		raids : 1,
		tradeskills : 1,
		classes : 1,
		factions : 1,
		races : 1,
		paths : 1,
		professions : 1
	};
	
	ws_collection.list = function(req, res) {	
		var collection = req.body.collection,
			accessToken = req.body.accessToken;
		if(listCollections[collection]) {
			ws_collection(collection, function(objects) {
				objects.find({}).toArray(function(err, objects) {	
					if(err) throw err;
					if(accessToken && commentCollections[collection]) {
						ws_collection.authorizedUser(accessToken, function(err, user, users) {
							if(user) {
								for(var i = 0; i < objects.length; i++) {
									ws_collection.mark(objects[i].comments, user._id);
								}
							}
							res.send(objects);
						});
					} else {
						res.send(objects);
					}
				});
			});
		} else {
			res.send("Invalid collection.");
		}
	};
	
	ws_collection.mark = function(comments, user) {
		if(comments) {
			for(var i = 0; i < comments.length; i++) {
				var comment = comments[i];
				comment.editable = user.equals(comment.user);
				ws_collection.mark(comment.comments, user);
			}
		}
	};
	
	return ws_collection;
};