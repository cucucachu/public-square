// MongoDB and Mongoose Setup
// If you are a developer running this on a local machine, make sure you whitelist your IP address on mongodb atlas.
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const mongo_uri = "mongodb+srv://cody_jones:cody_jones@publicsquaredev-d3ue6.gcp.mongodb.net/test?retryWrites=true";

let client = null;
let db = null;

async function connect() {

	if (db || client) {
		throw new Error('Attempt to connect to database twice.');
	}
	
	client = new MongoClient(mongo_uri);

	await client.connect();
	db = client.db('test');
	return db;
}

function close() {
	client.close();
	db = null;
	client = null;
}


function ObjectId() {
	return new mongo.ObjectId();
}

function ObjectIdFromHexString(id) {
	return mongo.ObjectId.createFromHexString(id);
}

async function insertOne(collection, document) {
	return db.collection(collection).insertOne(document);
}

async function insertMany(collection, docs) {
	return db.collection(collection).insertMany(docs);
}

async function overwrite(collection, doc) {
	const filter = {
		_id: doc._id,
	};
	const update = {
		$set: doc
	}

	return db.collection(collection).updateOne(filter, update);
}

async function update(collection, instance) {
	const filter = {
		_id: instance._id,
	};
	const update = instance.diff();

	return db.collection(collection).updateOne(filter, update);
}

async function find(collection, query) {
	return db.collection(collection).find(query).toArray();
}

async function findOne(collection, query) {
	return db.collection(collection).findOne(query);
}

async function findById(collection, id) {
	if (!(id instanceof mongo.ObjectID))
		return null;

	const query = {
		_id: id,
	}

	return findOne(collection, query);
}

async function deleteOne(collection, document) {
	const filter = {
		_id: document._id,
	}

	return db.collection(collection).deleteOne(filter);
}

async function deleteMany(collection, documents) {
	const filter = {
		_id: {
			$in: documents.map(document => document._id),
		},
	}

	return db.collection(collection).deleteMany(filter);
}

async function clearCollection(collection) {
	return db.collection(collection).deleteMany({});
}

function collection(name) {
	if (db)
		return db.collection(name);
}

module.exports = {
	connect,
	close,
	ObjectId,
	ObjectIdFromHexString,
	collection,
	insertOne,
	insertMany,
	update,
	overwrite,
	deleteOne,
	deleteMany,
	clearCollection,
	find,
	findOne,
	findById,
}