/* 
 Mongoose Schema and Model Functions
 Model: Appointment
 SuperClass: Position Acquisition Process
 Description: Represents an Appointment for a particular Government Position. Has relationships to the Appointer, and the Appointee
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var PositionAcquisitionProcess = require('../PositionAcquisitionProcess');
var Appointer = require('./Appointer');
var Appointee = require('./Appointee');

// Schema and Model Setup
var AppointmentSchema = new Schema({
    appointmentDate: {
        type: Date
    },
    positionStartDate: {
        type: Date,
        validate: {
            validator: function(value) {
                if (value < this.appointmentDate)
                    return false;
                return true;
            },
            message: 'Term Start Date must be greater than or equal to Election Date.'
        }
    },
    appointer: {
        type: Schema.Types.ObjectId,
        ref: 'Appointer',
        required: true
    },
    appointee: {
        type: Schema.Types.ObjectId,
        ref: 'Appointee',
        required: true
    }
});

var Appointment = PositionAcquisitionProcess.Model.discriminator('Appointment', AppointmentSchema);

//Methods 

// Create Method
var create = function() {
	return new Appointment({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(appointment, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		appointment.save(function(err, saved) {
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
var compare = function(appointment1, appointment2) {
    var match = true;
    var message = '';

    if (appointment1.governmentPosition != appointment2.governmentPosition) {
        match = false;
        message += 'Government Positions do not match. ' + appointment1.governmentPosition +' != ' + appointment2.governmentPosition + '\n';
    }

    if (appointment1.appointmentDate != appointment2.appointmentDate) {
        match = false;
        message += 'Appointment Dates do not match. ' + appointment1.appointmentDate +' != ' + appointment2.appointmentDate + '\n';
    }

    if (appointment1.positionStartDate != appointment2.positionStartDate) {
        match = false;
        message += 'Position Start Dates do not match. ' + appointment1.positionStartDate +' != ' + appointment2.positionStartDate + '\n';
    }

    if (appointment1.appointer != appointment2.appointer) {
        match = false;
        message += 'Appointers do not match. ' + appointment1.appointer +' != ' + appointment2.appointer + '\n';
    }

    if (appointment1.appointee != appointment2.appointee) {
        match = false;
        message += 'Appointees do not match. ' + appointment1.appointee +' != ' + appointment2.appointee + '\n';
    }

	if (match)
		message = 'Appointments Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Appointment.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Appointment;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

