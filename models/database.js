// MongoDB and Mongoose Setup
// If you are a developer running this on a local machine, make sure you whitelist your IP address on mongodb atlas.
var mongoose = require('mongoose');
var mongo_uri = "mongodb+srv://cody_jones:cody_jones@publicsquaredev-d3ue6.gcp.mongodb.net/test?retryWrites=true";

exports.connect = function() {
	mongoose.connect(mongo_uri);
	db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	return db;
}

exports.close = function(db) {
	db.close();
}