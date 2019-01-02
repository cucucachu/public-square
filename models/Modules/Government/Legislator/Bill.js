/* 
 Mongoose Schema and Model Functions
 Model: Bill 
 Description: I'm just a bill, yes I'm only a bill, and I'm sitting here on capitol hill.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var LegislativeVote = require('./LegislativeVote');
var BillSponsorship = require('./BillSponsorship');
var BillVersion = require('./BillVersion');
var Law = require('../Law');

// Schema and Model Setup
var BillSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    passageDate: {
        type: Date
    },
    signedDate: {
        type: Date
    },
    billVersions: {
        type: [Schema.Types.ObjectId],
        ref: 'BillVersion',
        required: true
    },
    billSponsorships: {
        type: [Schema.Types.ObjectId],
        ref: 'BillSponsorship',
        required: true
    },
    laws: {
        type: [Schema.Types.ObjectId],
        ref: 'Law',
        required: true
    }
});

var Bill = mongoose.model('Bill', BillSchema);

//Methods 

// Create Method
var create = function() {
	return new Bill({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(bill, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		bill.save(function(err, saved) {
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
var compare = function(bill1, bill2) {
    var match = true;
    var message = '';

    if (bill1.signedDate != bill2.signedDate) {
        match = false;
        message += 'Signed Dates do not match. ' + bill1.signedDate +' != ' + bill2.signedDate + '\n';
    }

    if (bill1.passageDate != bill2.passageDate) {
        match = false;
        message += 'Passage Dates do not match. ' + bill1.passageDate +' != ' + bill2.passageDate + '\n';
    }

	if (bill1.laws != null && bill2.laws != null) {
		if (bill1.laws.length != bill2.laws.length) {
			match = false;
			message += "Laws do not match. \n";
		}
		else {
			for (var i = 0; i < bill1.laws.length; i++) {
				if (bill1.laws[i] != bill2.laws[i]) {
					match = false;
					message += "Laws do not match. \n";

				}
			}
		}
	}

	if (bill1.billVersions != null && bill2.billVersions != null) {
		if (bill1.billVersions.length != bill2.billVersions.length) {
			match = false;
			message += "Bill Versions do not match. \n";
		}
		else {
			for (var i = 0; i < bill1.billVersions.length; i++) {
				if (bill1.billVersions[i] != bill2.billVersions[i]) {
					match = false;
					message += "Bill Versions do not match. \n";

				}
			}
		}
	}

	if (bill1.billSponsorships != null && bill2.billSponsorships != null) {
		if (bill1.billSponsorships.length != bill2.billSponsorships.length) {
			match = false;
			message += "Bill Sponsorships do not match. \n";
		}
		else {
			for (var i = 0; i < bill1.billSponsorships.length; i++) {
				if (bill1.billSponsorships[i] != bill2.billSponsorships[i]) {
					match = false;
					message += "Bill Sponsorships do not match. \n";

				}
			}
		}
	}

	if (bill1.legislativeVotes != null && bill2.legislativeVotes != null) {
		if (bill1.legislativeVotes.length != bill2.legislativeVotes.length) {
			match = false;
			message += "Legislative Votes do not match. \n";
		}
		else {
			for (var i = 0; i < bill1.legislativeVotes.length; i++) {
				if (bill1.legislativeVotes[i] != bill2.legislativeVotes[i]) {
					match = false;
					message += "Legislative Votes do not match. \n";

				}
			}
		}
	}


	if (match)
		message = 'Bills Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Bill.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Bill;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

