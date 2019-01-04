/* 
 Mongoose Schema and Model Functions
 Model: Citizen
 Super Class: User Role
 Description: A User Role which connects a Person to Poll Responses. Citizen role should only be available to Users who have been verified as
    citizens or voters of the United States.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var UserRole = require('../User/UserRole');
var PollResponse = require('./PollResponse');

// Schema and Model Setup
var CitizenSchema = new Schema({
    pollResponses: {
        type: [Schema.Types.ObjectId],
        ref: 'PollResponse'
    }
});

var Citizen = UserRole.Model.discriminator('Citizen', CitizenSchema);

//Methods 

// Create Method
var create = function() {
	return new Citizen({
        _id: new mongoose.Types.ObjectId(),
        startDate: new Date()
	});
}

// Save
var save = function(citizen, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		citizen.save(function(err, saved) {
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
var compare = function(citizen1, citizen2) {
    var match = true;
    var message = '';

    if (citizen1.startDate != citizen2.startDate) {
        match = false;
        message += 'Start Dates do not match. ' + citizen1.startDate +' != ' + citizen2.startDate + '\n';
    }

    if (citizen1.user != citizen2.user) {
        match = false;
        message += 'Users do not match. ' + citizen1.user +' != ' + citizen2.user + '\n';
    }

	if (citizen1.pollResponses != null && citizen2.pollResponses != null) {
		if (citizen1.pollResponses.length != citizen2.pollResponses.length) {
			match = false;
			message += "Poll Responses do not match. \n";
		}
		else {
			for (var i = 0; i < citizen1.pollResponses.length; i++) {
				if (citizen1.pollResponses[i] != citizen2.pollResponses[i]) {
					match = false;
					message += "Poll Responses do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Citizens Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Citizen.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Citizen;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

