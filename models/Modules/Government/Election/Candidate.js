/* 
 Mongoose Schema and Model Functions
 Model: Candidate
 Super Class: User Role
 Description: A User Role which connects a Person to Campaigns.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var UserRole = require('../../User/UserRole');

// Schema and Model Setup
var CandidateSchema = new Schema({
    campaigns: {
        type: [Schema.Types.ObjectId],
        ref: 'Campaign',
        required: true
    }
});

var Candidate = UserRole.Model.discriminator('Candidate', CandidateSchema);

//Methods 

// Create Method
var create = function() {
	return new Candidate({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(candidate, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		candidate.save(function(err, saved) {
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
var compare = function(candidate1, candidate2) {
    var match = true;
    var message = '';

    if (candidate1.startDate != candidate2.startDate) {
        match = false;
        message += 'Start Dates do not match. ' + candidate1.startDate +' != ' + candidate2.startDate + '\n';
    }
    if (candidate1.user != candidate2.user) {
        match = false;
        message += 'Users do not match. ' + candidate1.user +' != ' + candidate2.user + '\n';
    }

	if (candidate1.campaigns != null && candidate2.campaigns != null) {
		if (candidate1.campaigns.length != candidate2.campaigns.length) {
			match = false;
			message += "Campaigns do not match. \n";
		}
		else {
			for (var i = 0; i < candidate1.campaigns.length; i++) {
				if (candidate1.campaigns[i] != candidate2.campaigns[i]) {
					match = false;
					message += "Campaigns do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Candidates Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Candidate.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Candidate;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

