/* 
 Mongoose Schema and Model Functions
 Model: Confirmer
 Super Class: Government Role
 Description: A subclass of Government Role which enables confirmer functionallity. This ties an Occupied Position to allow casting Confirmation
    Votes for a Nomination
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var GovernmentRole = require('../GovernmentRole');
var IndividualConfirmationVote = require('./IndividualConfirmationVote');

// Schema and Model Setup
var ConfirmerSchema = new Schema({
    individualConfirmationVotes: {
        type: [Schema.Types.ObjectId],
        ref: 'IndividualConfirmationVote'
    }
});

var Confirmer = GovernmentRole.Model.discriminator('Confirmer', ConfirmerSchema);

//Methods 

// Create Method
var create = function() {
	return new Confirmer({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(confirmer, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		confirmer.save(function(err, saved) {
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
var compare = function(confirmer1, confirmer2) {
    var match = true;
    var message = '';

    if (confirmer1.occupiedPosition != confirmer2.occupiedPosition) {
        match = false;
        message += 'Occupied Positions do not match. ' + confirmer1.occupiedPosition +' != ' + confirmer2.occupiedPosition + '\n';
    }

	if (confirmer1.individualConfirmationVotes != null && confirmer2.individualConfirmationVotes != null) {
		if (confirmer1.individualConfirmationVotes.length != confirmer2.individualConfirmationVotes.length) {
			match = false;
			message += "Individual Confirmation Votes do not match. \n";
		}
		else {
			for (var i = 0; i < confirmer1.individualConfirmationVotes.length; i++) {
				if (confirmer1.individualConfirmationVotes[i] != confirmer2.individualConfirmationVotes[i]) {
					match = false;
					message += "Individual Confirmation Votes do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Confirmers Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Confirmer.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Confirmer;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

