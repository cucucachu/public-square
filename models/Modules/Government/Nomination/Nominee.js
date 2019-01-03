/* 
 Mongoose Schema and Model Functions
 Model: Nominee
 Super Class: User Role
 Description: A User Role which connects a Person to Nominations.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var UserRole = require('../../User/UserRole');
var Nomination = require('./Nomination');

// Schema and Model Setup
var NomineeSchema = new Schema({
    nominations: {
        type: [Schema.Types.ObjectId],
        ref: 'Nomination',
        required: true
    }
});

var Nominee = UserRole.Model.discriminator('Nominee', NomineeSchema);

//Methods 

// Create Method
var create = function() {
	return new Nominee({
        _id: new mongoose.Types.ObjectId(),
        startDate: new Date()
	});
}

// Save
var save = function(nominee, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		nominee.save(function(err, saved) {
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
var compare = function(nominee1, nominee2) {
    var match = true;
    var message = '';

    if (nominee1.startDate != nominee2.startDate) {
        match = false;
        message += 'Start Dates do not match. ' + nominee1.startDate +' != ' + nominee2.startDate + '\n';
    }

    if (nominee1.user != nominee2.user) {
        match = false;
        message += 'Users do not match. ' + nominee1.user +' != ' + nominee2.user + '\n';
    }

	if (nominee1.nominations != null && nominee2.nominations != null) {
		if (nominee1.nominations.length != nominee2.nominations.length) {
			match = false;
			message += "Nominations do not match. \n";
		}
		else {
			for (var i = 0; i < nominee1.nominations.length; i++) {
				if (nominee1.nominations[i] != nominee2.nominations[i]) {
					match = false;
					message += "Nominations do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Nominees Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Nominee.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Nominee;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

