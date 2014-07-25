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

	//obj = {data(filtered), collection, callback, accessToken}
	ws_collection.saveDescribable = function(obj) {
		if(ws_collection.isString([obj.data.name, obj.data.description])) {			
			ws_collection.authorizedUser(obj.accessToken, function(err, user, users) {
				if(err) throw err;				
				if(user.permission >= ws_collection.permissions.admin) {
					if(obj.data._id) {
						obj.data._id = new ObjectID(obj.data._id);
					}
					ws_collection(obj.collection, function(collection) {
						obj.data.comments = [];
						collection.save(obj.data, function(err) {
							if(err) throw err;
							obj.callback(err);
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
	
	ws_collection.saveComment = function(obj) {
		if(guidChecker.test(obj._id)) {
			ws_collection.authorizedUser(obj.accessToken, function(err, user, users) {
				if(err) throw err;
				if(user.permission >= ws_collections.permission.user) {
					ws_collection(obj.collection, function(collection) {
						collection.find({
							_id : new ObjectID(obj._id)
						}).toArray(function(err, comment) {							
							if(obj.indices) {
								var ref = comment;
								for(var i = 0; i < ref && obj.indices.length; i++) {
									ref = ref.comments[obj.indices[i]];
								}
								if(ref) {
									ref.comments.push({
										comment : obj.comment,
										user : user._id,
										time : new Date().getTime(),
										comments : []
									});
									collection.save(ref, function(err) {
										if(err) throw err;
									});
								}
							}
						});
					});
				}
			});
		}
	};
	
	return ws_collection;
};