/* 
 Mongoose Schema and Model Functions
 Model: Government Power
 Description: Describes different powers available to a Government Position. These will be used to determine what functionalities and data 
    are available to a Position. For instance, an instance of Government Power might be 'Legislative', giving a position access to the
    functionality to draft, sponsor, and vote on bills. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var PositionDefinition = require('./PositionDefinition');

// Schema and Model Setup
var GovernmentPowerSchema = new Schema({
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

var GovernmentPower = mongoose.model('GovernmentPower', GovernmentPowerSchema);

//Methods 

// Create Method
var create = function() {
	return new GovernmentPower({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(governmentPower, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		governmentPower.save(function(err, saved) {
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
var compare = function(governmentPower1, governmentPower2) {
    var match = true;
    var message = '';

    if (governmentPower1.name != governmentPower2.name) {
        match = false;
        message += 'Names do not match. ' + governmentPower1.name +' != ' + governmentPower2.name + '\n';
    }

    if (governmentPower1.description != governmentPower2.description) {
        match = false;
        message += 'Descriptions do not match. ' + governmentPower1.description +' != ' + governmentPower2.description + '\n';
    }

    if (governmentPower1.positionDefinitions != null && governmentPower2.positionDefinitions != null) {
        if (governmentPower1.positionDefinitions.length != governmentPower2.positionDefinitions.length) {
            match = false;
            message += "Position Definitions do not match. \n";
        }
        else {
            for (var i = 0; i < governmentPower1.positionDefinitions.length; i++) {
                if (governmentPower1.positionDefinitions[i] != governmentPower2.positionDefinitions[i]) {
                    match = false;
                    message += " Position Definitions do not match. \n";

                }
            }
        }
    }

	if (match)
		message = 'Government Powers Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		GovernmentPower.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = GovernmentPower;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

