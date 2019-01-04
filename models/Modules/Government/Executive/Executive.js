/* 
 Mongoose Schema and Model Functions
 Model: Executive
 Super Class: Government Role
 Description: A subclass of Government Role which enables executive functionallity. This ties an Occupied Position to voting executive actions.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var GovernmentRole = require('../GovernmentRole');
var IndividualExecutiveVote = require('./IndividualExecutiveVote');
var ExecutiveAction = require('./ExecutiveAction');

// Schema and Model Setup
var ExecutiveSchema = new Schema({
    individualExecutiveVotes: {
        type: [Schema.Types.ObjectId],
        ref: 'IndividualExecutiveVote'
    },
    executiveActions: {
        type: [Schema.Types.ObjectId],
        ref: 'ExecutiveAction'
    }
});

var Executive = GovernmentRole.Model.discriminator('Executive', ExecutiveSchema);

//Methods 

// Create Method
var create = function() {
	return new Executive({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(executive, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		executive.save(function(err, saved) {
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
var compare = function(executive1, executive2) {
    var match = true;
    var message = '';

    if (executive1.occupiedPosition != executive2.occupiedPosition) {
        match = false;
        message += 'Occupied Positions do not match. ' + executive1.occupiedPosition +' != ' + executive2.occupiedPosition + '\n';
    }

	if (executive1.individualExecutiveVotes != null && executive2.individualExecutiveVotes != null) {
		if (executive1.individualExecutiveVotes.length != executive2.individualExecutiveVotes.length) {
			match = false;
			message += "Individual Executive Votes do not match. \n";
		}
		else {
			for (var i = 0; i < executive1.individualExecutiveVotes.length; i++) {
				if (executive1.individualExecutiveVotes[i] != executive2.individualExecutiveVotes[i]) {
					match = false;
					message += "Individual Executive Votes do not match. \n";

				}
			}
		}
	}

	if (executive1.executiveActions != null && executive2.executiveActions != null) {
		if (executive1.executiveActions.length != executive2.executiveActions.length) {
			match = false;
			message += "Executive Actions do not match. \n";
		}
		else {
			for (var i = 0; i < executive1.executiveActions.length; i++) {
				if (executive1.executiveActions[i] != executive2.executiveActions[i]) {
					match = false;
					message += "Executive Actions do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Executives Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Executive.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Executive;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

