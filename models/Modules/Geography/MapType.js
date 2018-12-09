/* 
 Mongoose Schema and Model Functions
 Model: MapType
 Description: Supplies a type for a Map. This answers the question 'What is this Map a map of?'. Some examples might be Citys, Countys, Streets, or National Parks.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var GeographicMap = require('./GeographicMap');

// Schema and Model Setup
var MapTypeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    geographicMaps: {
        type: [Schema.Types.ObjectId],
        ref: 'GeographicMap',
        required: true
    }
});

var MapType = mongoose.model('Map', MapTypeSchema);

//Methods 

// Create Method
var create = function() {
	return new MapType({
		_id: new mongoose.Types.ObjectId(),
	});
}

// Save
var save = function(mapType, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		mapType.save(function(err, saved) {
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
var compare = function(mapType1, mapType2) {
    var match = true;
    var message = '';

    if (mapType1.name != mapType2.name) {
        match = false;
        message += 'Names do not match. ' + mapType1.name +' != ' + mapType2.name + '\n';
    }

	if (mapType1.geographicMaps = null && mapType2.geographicMaps != null) {
		if (mapType1.geographicMaps.length != mapType2.geographicMaps.length) {
			match = false;
			message += "Geographic Maps do not match. \n";
		}
		else {
			for (var i = 0; i < mapType1.geographicMaps.length; i++) {
				if (mapType1.geographicMaps[i] != mapType2.geographicMaps[i]) {
					match = false;
					message += "Geographic Maps do not match. \n";

				}
			}
		}
	}
	
	if (match)
		message = 'Map Types Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		MapType.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = MapType;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

