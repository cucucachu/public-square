/* 
 Mongoose Schema and Model Functions
 Model: Nominator
 SuperClass: Government Role
 Description: A Government Role allowing an Occupied Position to make an Nomination of a person to a Government Position. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var GovernmentRole = require('../GovernmentRole');

// Schema and Model Setup
var NominatorSchema = new Schema({
    nominations: {
        type: [Schema.Types.ObjectId],
        ref: 'Nomination'
    }
});

var Nominator = GovernmentRole.Model.discriminator('Nominator', NominatorSchema);

//Methods 

// Create Method
var create = function() {
	return new Nominator({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(nominator, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		nominator.save(function(err, saved) {
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
var compare = function(nominator1, nominator2) {
    var match = true;
    var message = '';

    if (nominator1.occupiedPosition != nominator2.occupiedPosition) {
        match = false;
        message += 'Occupied Positions do not match. ' + nominator1.occupiedPosition +' != ' + nominator2.occupiedPosition + '\n';
    }

	if (nominator1.nominations != null && nominator2.nominations != null) {
		if (nominator1.nominations.length != nominator2.nominations.length) {
			match = false;
			message += "Nominations do not match. \n";
		}
		else {
			for (var i = 0; i < nominator1.nominations.length; i++) {
				if (nominator1.nominations[i] != nominator2.nominations[i]) {
					match = false;
					message += "Nominations do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Nominators Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Nominator.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Nominator;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

