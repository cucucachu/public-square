// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var GeographicMap = require('./GeographicMap');
var Government = require('../Government/Government');
var Address = require('./Address');

// Schema and Model Setup
var GeographicAreaSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    geographicMap: {
        type: Schema.Types.ObjectId,
        ref: 'GeographicMap',
        required: true
    },
    addresses: {
        type: [Schema.Types.ObjectId],
        ref: 'Location'
	},
	government: {
		type: Schema.Types.ObjectId,
		ref: 'Government'
	}
});

var GeographicArea = mongoose.model('GeographicArea', GeographicAreaSchema);

//Methods 

// Create Method
var create = function() {
	return new GeographicArea({
		_id: new mongoose.Types.ObjectId(),
	});
}

// Save
var save = function(geographicArea, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		geographicArea.save(function(err, saved) {
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
var compare = function(geographicArea1, geographicArea2) {
    var match = true;
    var message = '';

    if (geographicArea1.name != geographicArea2.name) {
        match = false;
        message += 'Names do not match. ' + geographicArea1.name +' != ' + geographicArea2.name + '\n';
    }

    if (geographicArea1.geographicMap != geographicArea2.geographicMap) {
        match = false;
        message += 'GeographicMaps do not match. ' + geographicArea1.geographicMap +' != ' + geographicArea2.geographicMap + '\n';
    }

    if (geographicArea1.government != geographicArea2.government) {
        match = false;
        message += 'Governments do not match. ' + geographicArea1.government +' != ' + geographicArea2.government + '\n';
    }

	if (geographicArea1.addresses != null && geographicArea2.addresses != null) {
		if (geographicArea1.addresses.length != geographicArea2.addresses.length) {
			match = false;
			message += "Locations do not match. \n";
		}
		else {
			for (var i = 0; i < geographicArea1.addresses.length; i++) {
				if (geographicArea1.addresses[i] != geographicArea2.addresses[i]) {
					match = false;
					message += "Locations do not match. \n";

				}
			}
		}
	}
	
	if (match)
		message = 'GeographicAreas Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		GeographicArea.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = GeographicArea;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

