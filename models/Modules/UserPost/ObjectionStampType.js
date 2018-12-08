// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var StampType = require('./StampType');

// Schema and Model Setup
var ObjectionStampTypeSchema = new Schema({
});

var ObjectionStampType = StampType.Model.discriminator('ObjectionStampType', ObjectionStampTypeSchema);

//Methods 

// Create Method
var create = function() {
	return new ObjectionStampType({
		_id: new mongoose.Types.ObjectId(),
	});
}

// Save
var save = function(objectionStampType, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		objectionStampType.save(function(err, saved) {
			if (err) {
				// if (errorMessage != null)
				// 	console.log(errorMessage);
				reject(err);
			}
			else {
				// if (successMessasge != null)
				// 	console.log(successMessasge);

				resolve(saved);
			}
		});
	});
}

// Comparison Methods

// This is a member comparison, not an instance comparison. i.e. two separate instances can be equal if their members are equal.
var compare = function(objectionStampType1, objectionStampType2) {
    return StampType.compare(objectionStampType1, objectionStampType2);
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		ObjectionStampType.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = ObjectionStampType;
exports.create = create;
exports.save = save;
//exports.saveUserPostAndPoster = saveUserPostAndPoster;
exports.compare = compare;
exports.clear = clear;

