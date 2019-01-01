/* 
 Mongoose Schema and Model Functions
 Model: Acquisition Process Definition
 Description: Describes how a Government Position becomes filled. Some examples might be Direct Election, Indirect Election (like electoral
    college), Appointment, Appointment with Confirmation, etc. The Acquisition Process Definition for a particular Position Details will grant 
    functionality to a Government Position. For example, if a Position has a Acquisition Process of Appointment with Confirmation, then a its 
    Government Position will have a relationship to a Appointment Position Acquisition Process. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var PositionDefinition = require('./PositionDefinition');

// Schema and Model Setup
var AcquisitionProcessDefinitionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    positionDefinitions: {
        type: [Schema.Types.ObjectId],
        ref: 'PositionDefinition'
    }
});

var AcquisitionProcessDefinition = mongoose.model('AcquisitionProcessDefinition', AcquisitionProcessDefinitionSchema);

//Methods 

// Create Method
var create = function() {
	return new AcquisitionProcessDefinition({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(acquisitionProcessDefinition, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		acquisitionProcessDefinition.save(function(err, saved) {
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
var compare = function(acquisitionProcessDefinition1, acquisitionProcessDefinition2) {
    var match = true;
    var message = '';

    if (acquisitionProcessDefinition1.name != acquisitionProcessDefinition2.name) {
        match = false;
        message += 'Names do not match. ' + acquisitionProcessDefinition1.name +' != ' + acquisitionProcessDefinition2.name + '\n';
    }

    if (acquisitionProcessDefinition1.description != acquisitionProcessDefinition2.description) {
        match = false;
        message += 'Descriptions do not match. ' + acquisitionProcessDefinition1.description +' != ' + acquisitionProcessDefinition2.description + '\n';
    }

    if (acquisitionProcessDefinition1.positionDefinitions != null && acquisitionProcessDefinition2.positionDefinitions != null) {
        if (acquisitionProcessDefinition1.positionDefinitions.length != acquisitionProcessDefinition2.positionDefinitions.length) {
            match = false;
            message += "Position Definitions do not match. \n";
        }
        else {
            for (var i = 0; i < acquisitionProcessDefinition1.positionDefinitions.length; i++) {
                if (acquisitionProcessDefinition1.positionDefinitions[i] != acquisitionProcessDefinition2.positionDefinitions[i]) {
                    match = false;
                    message += " Position Definitions do not match. \n";

                }
            }
        }
    }

	if (match)
		message = 'Hiring Processes Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		AcquisitionProcessDefinition.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = AcquisitionProcessDefinition;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

