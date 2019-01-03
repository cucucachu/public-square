/* 
 Mongoose Schema and Model Functions
 Model: Position Acquisition Process
 Description: An abstract superclass which describes how an offical attempts to get a Government Position. Two examples of the subclasses are
    Election and Appointment. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var GovernmentPosition = require('./GovernmentPosition');

// Schema and Model Setup
var PositionAcquisitionProcessSchema = new Schema({
    governmentPosition: {
        type: Schema.Types.ObjectId,
        ref: 'GovernmentPosition',
        required: true
    }
});

var PositionAcquisitionProcess = mongoose.model('PositionAcquisitionProcess', PositionAcquisitionProcessSchema);

//Methods 

// Create Method
var create = function() {
	return new PositionAcquisitionProcess({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(positionAcquisitionProcess, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		positionAcquisitionProcess.save(function(err, saved) {
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
var compare = function(positionAcquisitionProcess1, positionAcquisitionProcess2) {
    var match = true;
    var message = '';

    if (positionAcquisitionProcess1.governmentPosition != positionAcquisitionProcess2.governmentPosition) {
        match = false;
        message += 'Government Positions do not match. ' + positionAcquisitionProcess1.governmentPosition +' != ' + positionAcquisitionProcess2.governmentPosition + '\n';
    }

	if (match)
		message = 'Position Acquisition Processes Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		PositionAcquisitionProcess.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = PositionAcquisitionProcess;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

