/* 
 Mongoose Schema and Model Functions
 Model: Hiring Process
 Description: Describes how a Government Position becomes filled. Some examples might be Direct Election, Indirect Election (like electoral
    college), Appointment, Appointment with Confirmation, etc. The Hiring Process for a particular Position Details will grant functionality
    to a Government Position. For example, if a Position has a Hiring Process of Appointment with Confirmation, then a its Filled Position 
    will have the functionality to relate to the Appointer and the Confirmers. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var PositionDefinition = require('./PositionDefinition');

// Schema and Model Setup
var HiringProcessSchema = new Schema({
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

var HiringProcess = mongoose.model('HiringProcess', HiringProcessSchema);

//Methods 

// Create Method
var create = function() {
	return new HiringProcess({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(hiringProcess, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		hiringProcess.save(function(err, saved) {
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
var compare = function(hiringProcess1, hiringProcess2) {
    var match = true;
    var message = '';

    if (hiringProcess1.name != hiringProcess2.name) {
        match = false;
        message += 'Names do not match. ' + hiringProcess1.name +' != ' + hiringProcess2.name + '\n';
    }

    if (hiringProcess1.description != hiringProcess2.description) {
        match = false;
        message += 'Descriptions do not match. ' + hiringProcess1.description +' != ' + hiringProcess2.description + '\n';
    }

    if (hiringProcess1.positionDefinitions != null && hiringProcess2.positionDefinitions != null) {
        if (hiringProcess1.positionDefinitions.length != hiringProcess2.positionDefinitions.length) {
            match = false;
            message += "Position Definitions do not match. \n";
        }
        else {
            for (var i = 0; i < hiringProcess1.positionDefinitions.length; i++) {
                if (hiringProcess1.positionDefinitions[i] != hiringProcess2.positionDefinitions[i]) {
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
		HiringProcess.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = HiringProcess;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

