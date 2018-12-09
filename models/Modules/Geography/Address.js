// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var GeographicArea = require('./GeographicArea');
var User = require('../User/User');

// Schema and Model Setup
var AddressSchema = new Schema({
    streetNumber: {
        type: String,
        required: true
    },
    unit: {
        type: String
    },
    users: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    geographicAreas: {
        type: [Schema.Types.ObjectId],
        ref: 'GeographicArea'
    }
});

var Address = mongoose.model('Address', AddressSchema);

//Methods 

// Create Method
var create = function() {
	return new Address({
		_id: new mongoose.Types.ObjectId(),
	});
}

// Save
var save = function(address, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		address.save(function(err, saved) {
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
var compare = function(address1, address2) {
    var match = true;
    var message = '';

    if (address1.streetNumber != address2.streetNumber) {
        match = false;
        message += 'Street numbers do not match. ' + address1.streetNumber +' != ' + address2.streetNumber + '\n';
    }

    if (address1.unit != address2.unit) {
        match = false;
        message += 'Units do not match. ' + address1.unit +' != ' + address2.unit + '\n';
    }

	if (address1.users != null && address2.users != null) {
		if (address1.users.length != address2.users.length) {
			match = false;
			message += "Users do not match. \n";
		}
		else {
			for (var i = 0; i < address1.users.length; i++) {
				if (address1.users[i] != address2.users[i]) {
					match = false;
					message += "Users do not match. \n";

				}
			}
		}
	}

	if (address1.geographicAreas != null && address2.geographicAreas != null) {
		if (address1.geographicAreas.length != address2.geographicAreas.length) {
			match = false;
			message += "Geographic Areas do not match. \n";
		}
		else {
			for (var i = 0; i < address1.geographicAreas.length; i++) {
				if (address1.geographicAreas[i] != address2.geographicAreas[i]) {
					match = false;
					message += "Geographic Areas do not match. \n";

				}
			}
		}
	}
	
	if (match)
		message = 'Addresses Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Address.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Address;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

