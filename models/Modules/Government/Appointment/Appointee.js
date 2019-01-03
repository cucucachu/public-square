/* 
 Mongoose Schema and Model Functions
 Model: Appointee
 Super Class: User Role
 Description: A User Role which connects a Person to Appointments.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var UserRole = require('../../User/UserRole');
var Appointment = require('./Appointment');

// Schema and Model Setup
var AppointeeSchema = new Schema({
    appointments: {
        type: [Schema.Types.ObjectId],
        ref: 'Appointment',
        required: true
    }
});

var Appointee = UserRole.Model.discriminator('Appointee', AppointeeSchema);

//Methods 

// Create Method
var create = function() {
	return new Appointee({
        _id: new mongoose.Types.ObjectId(),
        startDate: new Date()
	});
}

// Save
var save = function(appointee, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		appointee.save(function(err, saved) {
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
var compare = function(appointee1, appointee2) {
    var match = true;
    var message = '';

    if (appointee1.startDate != appointee2.startDate) {
        match = false;
        message += 'Start Dates do not match. ' + appointee1.startDate +' != ' + appointee2.startDate + '\n';
    }

    if (appointee1.user != appointee2.user) {
        match = false;
        message += 'Users do not match. ' + appointee1.user +' != ' + appointee2.user + '\n';
    }

	if (appointee1.appointments != null && appointee2.appointments != null) {
		if (appointee1.appointments.length != appointee2.appointments.length) {
			match = false;
			message += "Appointments do not match. \n";
		}
		else {
			for (var i = 0; i < appointee1.appointments.length; i++) {
				if (appointee1.appointments[i] != appointee2.appointments[i]) {
					match = false;
					message += "Appointments do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Appointees Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Appointee.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Appointee;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

