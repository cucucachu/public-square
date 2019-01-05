/* 
 Mongoose Schema and Model Functions
 Model: Approval Stamp Type
 Description: A subclass of Stamp Type which is positive.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var StampType = require('./StampType');

// Schema and Model Setup
var ApprovalStampTypeSchema = new Schema({
});

var ApprovalStampType = StampType.Model.discriminator('ApprovalStampType', ApprovalStampTypeSchema);

//Methods 

// Create Method
var create = function() {
	return new ApprovalStampType({
		_id: new mongoose.Types.ObjectId(),
	});
}

// Save
var save = function(approvalStampType, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		approvalStampType.save(function(err, saved) {
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
var compare = function(approvalStampType1, approvalStampType2) {
    return StampType.compare(approvalStampType1, approvalStampType2);
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		ApprovalStampType.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = ApprovalStampType;
exports.create = create;
exports.save = save;
//exports.saveUserPostAndPoster = saveUserPostAndPoster;
exports.compare = compare;
exports.clear = clear;

