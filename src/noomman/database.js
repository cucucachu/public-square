// MongoDB and Mongoose Setup
// If you are a developer running this on a local machine, make sure you whitelist your IP address on mongodb atlas.
const mongoose = require('mongoose');
const mongo_uri = "mongodb+srv://cody_jones:cody_jones@publicsquaredev-d3ue6.gcp.mongodb.net/test?retryWrites=true";

let db = null;

async function connect() {
	if (db) {
		throw new Error('Attempt to connect to database twice.');
	}
	await mongoose.connect(mongo_uri);
	db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	return true;
}

//Connect to Database
// mongoose.connect(mongo_uri);
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// exports.database = db;


function close() {
	db.close();
	db = null;
}

module.exports = {
	connect,
	close,
}