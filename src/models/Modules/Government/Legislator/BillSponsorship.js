/* 
 Mongoose Schema and Model Functions
 Model: Bill Sponsorship
 Description: Connects a Legislator to a Bill that they have sponsored. Bills can have one sponsor, and multiple co-sponsors.
    The main sponsor will have an instance of this class with the 'primary' attribute set to true. All other sponsorships 
    (i.e. for the co-sponsors) will have the 'primary' attribute set to false.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

// Schema and Model Setup
var BillSponsorshipSchema = new Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        validate: {
            validator: function(value) {
                if (value < this.startDate)
                    return false;
                return true;
            },
            message: 'End Date must be greater than or equal to Start Date.'
        }
    },
    bill: {
        type: Schema.Types.ObjectId,
        ref: 'Bill',
        required: true
    },
    legislator: {
        type: Schema.Types.ObjectId,
        ref: 'Legislator',
        required: true
    }
});

var BillSponsorship = mongoose.model('BillSponsorship', BillSponsorshipSchema);

//Methods 

// Create Method
var create = function() {
	return new BillSponsorship({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(billSponsorship, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		billSponsorship.save(function(err, saved) {
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
var compare = function(billSponsorship1, billSponsorship2) {
    var match = true;
    var message = '';

    if (billSponsorship1.startDate != billSponsorship2.startDate) {
        match = false;
        message += 'Start Dates do not match. ' + billSponsorship1.startDate +' != ' + billSponsorship2.startDate + '\n';
    }

    if (billSponsorship1.endDate != billSponsorship2.endDate) {
        match = false;
        message += 'End Dates do not match. ' + billSponsorship1.endDate +' != ' + billSponsorship2.endDate + '\n';
    }

    if (billSponsorship1.legislator != billSponsorship2.legislator) {
        match = false;
        message += 'Legislators do not match. ' + billSponsorship1.legislator +' != ' + billSponsorship2.legislator + '\n';
    }

    if (billSponsorship1.bill != billSponsorship2.bill) {
        match = false;
        message += 'Bills do not match. ' + billSponsorship1.bill +' != ' + billSponsorship2.bill + '\n';
    }

	if (match)
		message = 'Bill Sponsorships Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		BillSponsorship.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = BillSponsorship;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

