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
		raids : "raid",
		forums : "forum"
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
				if(obj.data._id) {
					obj.data._id = new ObjectID(obj.data._id);
				}
				if(user.permission >= ws_collection.permissions.admin) {
					ws_collection(obj.collection, function(collection) {						
						collection.update({_id:obj.data._id}, {$set:obj.data}, {}, function(err, document) {
							if(err) throw err;
							if(!document) {
								obj.data.time = new Date();
								obj.data.comments = [];
								if(obj.collection == "forums") {
									obj.data.user = user._id;
								}
								collection.insert(obj.data, {}, function(err, document) {
									if(err) throw err;
									obj.callback(err, document[0]._id.toString());
								});
							} else {
								obj.callback(err, obj.data._id);
							}
						});
					});
				} else if(user.permission >= ws_collection.permissions.user && obj.collection == "forums") {					
					ws_collection(obj.collection, function(collection) {
						collection.update({
							_id : obj.data._id,
							user : user._id
						}, {$set:obj.data}, {}, function(err, document) {
							if(err) throw err;
							if(!document) {
								obj.data.user = user._id;
								obj.data.time = new Date();
								obj.data.comments = [];
								collection.insert(obj.data, {}, function(err, document) {
									if(err) throw err;
									obj.callback(err, document[0]._id.toString());
								});
							} else {
								obj.callback(err, obj.data._id);
							}
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
		forums : 1,
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
											time : new Date(),
											comments : []
										});
										if(ref.user) {
											ws_collection.alert({
												user : ref.user, 
												message : "A user has commented on your " + (ref == commentable ? obj.collection : "comment") + ".",
												link : "#/" + obj.collection + "/" + commentable._id
											});
										}
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
		arenas : 1,
		articles : 1,
		dungeons : 1,
		forums : 1,
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
									objects[i].editable = user.permission >= ws_collection.permissions.admin || user._id.equals(objects[i]);
									ws_collection.mark(objects[i].comments, user);
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
				comment.editable = user._id.equals(comment.user) || (user.permission >= ws_collection.permissions.admin);
				ws_collection.mark(comment.comments, user);
			}
		}
	};
	
	
	var deleteCollections = {
		articles : "article",
		dungeons : "dungeon",
		battlegrounds : "battleground",
		raids : "raid",
		forums : "forum"
	};
	
	ws_collection.handleDelete = function(req, res) {	
		var accessToken = req.body.accessToken, 
			collection = req.body.collection,
			_id = req.body._id;
		if(deleteCollections[collection]) {			
			ws_collection.delete({
				collection : collection,
				_id : _id,
				accessToken : accessToken,
				callback : function(err, _id) {
					if(err) throw err;
					res.send("");
				}
			});
		} else {
			res.send("Invalid collection.");
		}
	};
	
	ws_collection.delete = function(args) {		
		ws_collection.authorizedUser(args.accessToken, function(err, user, users) {
			var query = {
				_id : new ObjectID(args._id)
			};
			if(user.permission < ws_collection.permissions.admin) {
				query.user = user._id;
			}
			ws_collection(args.collection, function(collection) {
				collection.findAndModify(query, [], {},{remove:true}, function(err) {
					if(err) throw new err;
					args.callback("");
				});
			});
		});
	};
	
	ws_collection.alert = function(args) {
		ws_collection("alerts", function(collection) {
			collection.save(args, function(err) {
				if(err) throw err;
			});
		});
	};
	
	ws_collection.alerts = function(req, res) {
		var accessToken = req.body.accessToken;
		ws_collection.authorizedUser(accessToken, function(err, user, users) {
			if(user) {
				ws_collection("alerts", function(collection) {
					collection.find({user : user._id}).toArray(function(err, alerts) {
						if(err) throw err;
						res.send(alerts);
					});
				});				
			} else {
				throw "Invalid permission.";
			}
		});
	};
	
	return ws_collection;
};