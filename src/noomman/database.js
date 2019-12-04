/*
 * database
 * Holds all the code related to connecting to and interacting with a mongo database.
 */

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const mongo_uri = "mongodb+srv://cody_jones:cody_jones@publicsquaredev-d3ue6.gcp.mongodb.net/test?retryWrites=true";

let client = null;
let db = null;

/*
 * connect(uri)
 * Connects to the mongo database with the given uri.
 * Parameters
 * uri - String - A uri string of the database to connect to.
 * Returns
 * - Promise<mongodb.Db> - The database object returned by mongodb.MongoClient.connect().
 * Throws
 * - Error - If an attempt is made to connect to a database more than once without calling close().
 * - MongoError - If underlying call to mongodb.MongoCLient.connect() throws an error.
 */
async function connect() {
	if (connected()) {
		throw new Error('Attempt to connect to database twice.');
	}
	
	client = new MongoClient(mongo_uri, { useNewUrlParser: true });

	await client.connect();
	db = client.db('test');
	return db;
}

/* 
 * close()
 * Closes the connection to a mongo db that was established by calling connect().
 * Returns
 * - Promise<undefined> - A promise which will resolve undefined if connection is 
 *    closed successfully.
 */
async function close() {
	await client.close();
	db = null;
	client = null;
}

/* 
 * connected()
 * Use to determine if a connection to a database is active.
 * Returns
 * - Boolean - True if connection to database is active, false otherwise.
 */
function connected() {
	return db !== null && client !== null;
}

/*
 * index(collection, field)
 * Adds an index on the given field to the collection with the given name in the database.
 *    Calls native mongodb function mongodb.Collection.createIndex()
 * Parameters
 * - collection - String - The name of the collection to add an index to.
 * - field - String | Array | Object - See fieldOrSpec parameter 
 *      https://mongodb.github.io/node-mongodb-native/3.3/api/Collection.html#createIndex
 * Returns 
 * - Promise<result> - String representing all the indices added to the collection.
 */
async function index(collection, field) {
	if (!connected()) {
		throw new Error('database.index() called before database.connect()')
	}
	return db.collection(collection).createIndex(field);
}

/*
 * ObjectId(hexString)
 * Creates a new ObjectId either from the given hexString or by calling new mongodb.ObjectId().
 * Parameters
 * - hexString - String - A 24 byte hex string.
 * Returns
 * - mongodb.ObjectId - A native mongo ObjectId object.
 * Throws
 * - MongoError - If given hexString is invalid.
 */
function ObjectId(hexString) {
	if (hexString) {
		return ObjectIdFromHexString(hexString);
	}

	return new mongo.ObjectId();
}

/*
 * ObjectIdFromHexString(id)
 * Creates a new ObjectId from the given hexString by calling mongodb.ObjectId.createFromHexString().
 * Parameters
 * - id - String - A 24 byte hex string.
 * Returns
 * - mongodb.ObjectId - A native mongo ObjectId object.
 * Throws
 * - MongoError - If given hexString is invalid.
 */
function ObjectIdFromHexString(id) {
	return mongo.ObjectId.createFromHexString(id);
}

/*
 * insertOne(collection, document)
 * Inserts a single document into the given collection.
 * Parameters
 * - collection - String - The name of the collection in which to insert the document.
 * - document - Object - A document to insert into the given collection.
 * Returns
 * - Promise<insertOneWriteOpResult> - See https://mongodb.github.io/node-mongodb-native/3.3/api/Collection.html#~insertOneWriteOpResult
 */
async function insertOne(collection, document) {
	return db.collection(collection).insertOne(document);
}

/*
 * insertMany(collection, documents)
 * Inserts given documents into the given collection.
 * Parameters
 * - collection - String - The name of the collection in which to insert the documents.
 * - documents - Array<Object> - A array of documents to insert into the given collection.
 * Returns
 * - Promise<insertWriteOpResultObject> - See https://mongodb.github.io/node-mongodb-native/3.3/api/Collection.html#~insertWriteOpResult
 */
async function insertMany(collection, documents) {
	return db.collection(collection).insertMany(documents);
}

/* 
 * overwrite(collection, instance)
 * Overwrites the given instance in the given collection. Do Not Use. Internal Use Only.
 * Parameters
 * - collection - String - The name of the collection in which to overwrite the instance.
 * - instance - Instance - An instance to overwrite in the database.
 * Returns
 * - Promise<updateWriteOpResult> - See https://mongodb.github.io/node-mongodb-native/3.3/api/Collection.html#~updateWriteOpResult
 */
async function overwrite(collection, document) {
	const filter = {
		_id: document._id,
	};
	const update = {
		$set: document
	}

	return db.collection(collection).updateOne(filter, update);
}

/* 
 * update(collection, instance)
 * Updates the given instance in the given collection.
 * Parameters
 * - collection - String - The name of the collection in which to update the instance.
 * - instance - Instance - An instance to update in the database.
 * Returns
 * - Promise<updateWriteOpResult> - See https://mongodb.github.io/node-mongodb-native/3.3/api/Collection.html#~updateWriteOpResult
 */
async function update(collection, instance) {
	const filter = {
		_id: instance._id,
	};
	const update = instance.diff();

	return db.collection(collection).updateOne(filter, update);
}

/*
 * find(collection, query)
 * Runs the given query on the given collection using the native mongodb.Collection.find() function.
 *    Returns the documents which match the query as an array. Do not use with queries expected to return
 *    a large number of documents.
 * Parameters
 * - collection - String - The name of the collection in which to search for documents.
 * - query - Object - A mongo query object.
 * Returns
 * - Promise<Array<Object>> - An array of all the objects in the given collection which match the given query.
 */
async function find(collection, query) {
	return db.collection(collection).find(query).toArray();
}

/*
 * findOne(collection, query)
 * Runs the given query on the given collection using the native mongodb.Collection.findOne() function.
 *    Returns the first document which matches the query. Returns null if no document matches the query.
 * Parameters
 * - collection - String - The name of the collection in which to search for a document.
 * - query - Object - A mongo query object.
 * Returns
 * - Promise<Object> - The first document in the collection which matches the query. Null if no document 
 *    matches the query.
 */
async function findOne(collection, query) {
	return db.collection(collection).findOne(query);
}

/*
 * findById(collection, id)
 * Queries the given collection for a document with the given ObjectId. Returns null if no document 
 *    has the given ObjectId.
 * Parameters
 * - collection - String - The name of the collection in which to search for a document.
 * - id - mongodb.ObjectId - A mongo ObjectId to search the collection for.
 * Returns
 * - Promise<Object> - The document in the collection with the given ObjectId. Null if no document 
 *    in the collection has the given ObjectId.
 */
async function findById(collection, id) {
	if (!(id instanceof mongo.ObjectID))
		return null;

	const query = {
		_id: id,
	}

	return findOne(collection, query);
}

/*
 * deleteOne(collection, document)
 * Deletes the document with the ObjectId of the given document from the given collection.
 * Parameters
 * - collection - String - The name of the collection containing the document to delete.
 * - document - Object - A document to delete.
 * Returns
 * - Promise<deleteWriteOpResult> - See https://mongodb.github.io/node-mongodb-native/3.3/api/Collection.html#~deleteWriteOpResult
 */
async function deleteOne(collection, document) {
	const filter = {
		_id: document._id,
	}

	return db.collection(collection).deleteOne(filter);
}

/*
 * deleteMany(collection, documents)
 * Deletes all of the given documents from the given collection.
 * Parameters
 * - collection - String - The name of the collection containing the documents to delete.
 * - documents - Iterable<Object> - An Iterable (Array, InstanceSet, etc.) containing documents to delete.
 * Returns 
 * - Promise<deleteWriteOpResult> - See https://mongodb.github.io/node-mongodb-native/3.3/api/Collection.html#~deleteWriteOpResult
 */
async function deleteMany(collection, documents) {
	const filter = {
		_id: {
			$in: documents.map(document => document._id),
		},
	}

	return db.collection(collection).deleteMany(filter);
}

/* 
 * clearCollection(collection)
 * Removes all documents from the given collection.
 * Parameters
 * - collection - String - The name of the collection to delete all documents from.
 * Returns 
 * - Promise<deleteWriteOpResult> - See https://mongodb.github.io/node-mongodb-native/3.3/api/Collection.html#~deleteWriteOpResult
 */
async function clearCollection(collection) {
	return db.collection(collection).deleteMany({});
}

/* 
 * collection(name)
 * Retrieves the mongodb.Collection object for a collection with the given name in the connected database.
 * Parameters
 * - name - String - The name of the collection to retrieve.
 * Returns
 * - mongodb.Collection - The collection in the connected database matching the given name.
 */
function collection(name) {
	if (db)
		return db.collection(name);
}

module.exports = {
	connect,
	close,
	connected,
	index,
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