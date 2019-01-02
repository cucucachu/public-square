/* 
 Mongoose Schema and Model Functions
 Model: Legislator
 Super Class: Government Role
 Description: A subclass of Government Role which enables legislator functionallity. This ties an Occupied Position to allow proposing,
    sponsoring, and voting on Bills. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var GovernmentRole = require('../GovernmentRole');
var BillVersion = require('./BillVersion');
var BillSponsorship = require('./BillSponsorship');
var IndividualLegislativeVote = require('./IndividualLegislativeVote');

// Schema and Model Setup
var LegislatorSchema = new Schema({
    individualLegislativeVotes: {
        type: [Schema.Types.ObjectId],
        ref: 'IndividualLegislativeVote'
    },
    billSponsorships: {
        type: [Schema.Types.ObjectId],
        ref: 'BillSponsorship'
    },
    billVersions: {
        type: [Schema.Types.ObjectId],
        ref: 'BillVersion'
    }
});

var Legislator = GovernmentRole.Model.discriminator('Legislator', LegislatorSchema);

//Methods 

// Create Method
var create = function() {
	return new Legislator({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(legislator, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		legislator.save(function(err, saved) {
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
var compare = function(legislator1, legislator2) {
    var match = true;
    var message = '';

    if (legislator1.occupiedPosition != legislator2.occupiedPosition) {
        match = false;
        message += 'Occupied Positions do not match. ' + legislator1.occupiedPosition +' != ' + legislator2.occupiedPosition + '\n';
    }

	if (legislator1.individualLegislativeVotes != null && legislator2.individualLegislativeVotes != null) {
		if (legislator1.individualLegislativeVotes.length != legislator2.individualLegislativeVotes.length) {
			match = false;
			message += "Individual Legislative Votes do not match. \n";
		}
		else {
			for (var i = 0; i < legislator1.individualLegislativeVotes.length; i++) {
				if (legislator1.individualLegislativeVotes[i] != legislator2.individualLegislativeVotes[i]) {
					match = false;
					message += "Individual Legislative Votes do not match. \n";

				}
			}
		}
	}

	if (legislator1.billSponsorships != null && legislator2.billSponsorships != null) {
		if (legislator1.billSponsorships.length != legislator2.billSponsorships.length) {
			match = false;
			message += "Bill Sponsorships do not match. \n";
		}
		else {
			for (var i = 0; i < legislator1.billSponsorships.length; i++) {
				if (legislator1.billSponsorships[i] != legislator2.billSponsorships[i]) {
					match = false;
					message += "Bill Sponsorships do not match. \n";

				}
			}
		}
	}

	if (legislator1.billVersions != null && legislator2.billVersions != null) {
		if (legislator1.billVersions.length != legislator2.billVersions.length) {
			match = false;
			message += "Bill Versions do not match. \n";
		}
		else {
			for (var i = 0; i < legislator1.billVersions.length; i++) {
				if (legislator1.billVersions[i] != legislator2.billVersions[i]) {
					match = false;
					message += "Bill Versions do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Legislators Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Legislator.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Legislator;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

