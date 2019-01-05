/* 
 Mongoose Schema and Model Functions
 Model: Geographicmap
 Description: Divides a geographic area into sub Geographic Areas. Each map has a Map Type, which might be cities, or counties, or national parks.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

// Schema and Model Setup
var GeographicMapSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    ofGeographicArea: {
        type: Schema.Types.ObjectId,
        ref: 'GeographicArea',
        required: true
    },
    containsGeographicAreas: {
        type: [Schema.Types.ObjectId],
        ref: 'GeographicArea',
        required: true
    },
    mapType: {
        type: Schema.Types.ObjectId,
        ref: 'MapType',
        required: true
    }
});


var GeographicMap = mongoose.model('GeographicMap', GeographicMapSchema);

//Methods 

// Create Method
var create = function() {
	return new GeographicMap({
		_id: new mongoose.Types.ObjectId(),
	});
}

// Save
var save = function(geographicMap, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		geographicMap.save(function(err, saved) {
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
var compare = function(geographicMap1, geographicMap2) {
    var match = true;
    var message = '';

    if (geographicMap1.name != geographicMap2.name) {
        match = false;
        message += 'Names do not match. ' + geographicMap1.name +' != ' + geographicMap2.name + '\n';
    }

    if (geographicMap1.ofGeographicArea != geographicMap2.ofGeographicArea) {
        match = false;
        message += 'GeographicMap.ofGeographicArea s do not match. ' + geographicMap1.ofGeographicArea +' != ' + geographicMap2.ofGeographicArea + '\n';
    }

    if (geographicMap1.mapType != geographicMap2.mapType) {
        match = false;
        message += 'GeographicMap Types do not match. ' + geographicMap1.mapType +' != ' + geographicMap2.mapType + '\n';
    }

	if (geographicMap1.containsGeographicAreas = null && geographicMap2.containsGeographicAreas != null) {
		if (geographicMap1.containsGeographicAreas.length != geographicMap2.containsGeographicAreas.length) {
			match = false;
			message += "Contains Geographic Areas do not match. \n";
		}
		else {
			for (var i = 0; i < geographicMap1.containsGeographicAreas.length; i++) {
				if (geographicMap1.containsGeographicAreas[i] != geographicMap2.containsGeographicAreas[i]) {
					match = false;
					message += "Contains Geographic Areas do not match. \n";

				}
			}
		}
	}
	
	if (match)
		message = 'GeographicMaps Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		GeographicMap.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = GeographicMap;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

