/* 
 Mongoose Schema and Model Functions
 Model: Civilian
 Super Class: User Role
 Description: A User Role which connects a Person to Poll Responses.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var UserRole = require('../User/UserRole');
var PollResponse = require('./PollResponse');

// Schema and Model Setup
var CivilianSchema = new Schema({
    pollResponses: {
        type: [Schema.Types.ObjectId],
        ref: 'PollResponse'
    }
});

var Civilian = UserRole.Model.discriminator('Civilian', CivilianSchema);

//Methods 

// Create Method
var create = function() {
	return new Civilian({
        _id: new mongoose.Types.ObjectId(),
        startDate: new Date()
	});
}

// Save
var save = function(civilian, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		civilian.save(function(err, saved) {
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
var compare = function(civilian1, civilian2) {
    var match = true;
    var message = '';

    if (civilian1.startDate != civilian2.startDate) {
        match = false;
        message += 'Start Dates do not match. ' + civilian1.startDate +' != ' + civilian2.startDate + '\n';
    }

    if (civilian1.user != civilian2.user) {
        match = false;
        message += 'Users do not match. ' + civilian1.user +' != ' + civilian2.user + '\n';
    }

	if (civilian1.pollResponses != null && civilian2.pollResponses != null) {
		if (civilian1.pollResponses.length != civilian2.pollResponses.length) {
			match = false;
			message += "Poll Responses do not match. \n";
		}
		else {
			for (var i = 0; i < civilian1.pollResponses.length; i++) {
				if (civilian1.pollResponses[i] != civilian2.pollResponses[i]) {
					match = false;
					message += "Poll Responses do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Civilians Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Civilian.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Civilian;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

