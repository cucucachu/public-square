/* 
 Mongoose Schema and Model Functions
 Model: Appointer
 SuperClass: Government Role
 Description: A Government Role allowing an Occupied Position to make an Appointment of a person to a Government Position. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var GovernmentRole = require('../GovernmentRole');

// Schema and Model Setup
var AppointerSchema = new Schema({
    appointments: {
        type: [Schema.Types.ObjectId],
        ref: 'Appointment'
    }
});

var Appointer = GovernmentRole.Model.discriminator('Appointer', AppointerSchema);

//Methods 

// Create Method
var create = function() {
	return new Appointer({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(appointer, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		appointer.save(function(err, saved) {
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
var compare = function(appointer1, appointer2) {
    var match = true;
    var message = '';

    if (appointer1.occupiedPosition != appointer2.occupiedPosition) {
        match = false;
        message += 'Occupied Positions do not match. ' + appointer1.occupiedPosition +' != ' + appointer2.occupiedPosition + '\n';
    }

	if (appointer1.appointments != null && appointer2.appointments != null) {
		if (appointer1.appointments.length != appointer2.appointments.length) {
			match = false;
			message += "Appointments do not match. \n";
		}
		else {
			for (var i = 0; i < appointer1.appointments.length; i++) {
				if (appointer1.appointments[i] != appointer2.appointments[i]) {
					match = false;
					message += "Appointments do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Appointers Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Appointer.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Appointer;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

