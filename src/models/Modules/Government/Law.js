/* 
 Mongoose Schema and Model Functions
 Model: Law
 Description: Represents a bill that has been passed into Law. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var Bill = require('./Legislator/Bill');
var JudicialOpinion = require('./Judge/JudicialOpinion');

// Schema and Model Setup
var LawSchema = new Schema({
    startDate: {
        type: Date,
        required: true
    },
    expireDate: {
        type: Date,
        validate: {
            validator: function(value) {
                if (value < this.startDate)
                    return false;
                return true;
            },
            message: 'Expire Date must be greater than or equal to Start Date.'
        }
    },
    bills: {
        type: [Schema.Types.ObjectId],
        ref: 'Bill',
	},
	judicialOpinions: {
		type: [Schema.Types.ObjectId],
		ref: 'JudicialOpinion'
	}
});

var Law = mongoose.model('Law', LawSchema);

//Methods 

// Create Method
var create = function() {
	return new Law({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(law, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		law.save(function(err, saved) {
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
var compare = function(law1, law2) {
    var match = true;
    var message = '';

    if (law1.startDate != law2.startDate) {
        match = false;
        message += 'Start Dates do not match. ' + law1.startDate +' != ' + law2.startDate + '\n';
    }

    if (law1.expireDate != law2.expireDate) {
        match = false;
        message += 'Expire Dates do not match. ' + law1.expireDate +' != ' + law2.expireDate + '\n';
    }

	if (law1.bills != null && law2.bills != null) {
		if (law1.bills.length != law2.bills.length) {
			match = false;
			message += "Bills do not match. \n";
		}
		else {
			for (var i = 0; i < law1.bills.length; i++) {
				if (law1.bills[i] != law2.bills[i]) {
					match = false;
					message += "Bills do not match. \n";

				}
			}
		}
	}

	if (law1.judicialOpinions != null && law2.judicialOpinions != null) {
		if (law1.judicialOpinions.length != law2.judicialOpinions.length) {
			match = false;
			message += "Judicial Opinions do not match. \n";
		}
		else {
			for (var i = 0; i < law1.judicialOpinions.length; i++) {
				if (law1.judicialOpinions[i] != law2.judicialOpinions[i]) {
					match = false;
					message += "Judicial Opinions do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Laws Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Law.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Law;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

