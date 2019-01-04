/* 
 Mongoose Schema and Model Functions
 Model: Government
 Description: Defines a government for a particular geographic area. Examples might be the federal government for the entire United States, or the 
    San Francisco City Government for the geographic area San Francisco (City). Governments can have multiple Government Institutions. For example,
    a city may have a School Board, a Sanitation Department, a Police Department, etc. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var GeographicArea = require('../Geography/GeographicArea');
//var Poll = require('../Poll/Poll');

// Schema and Model Setup
var GovernmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    foundedDate: {
        type: Date
    },
    createdDate: {
        type: Date,
        requried: true
    },
    geographicArea: {
        type: Schema.Types.ObjectId,
        ref: 'GeographicArea',
        required: true
    },
	// poll: {
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'Poll',
	// 	required: true
	// },
    governmentInstitutions: {
        type: [Schema.Types.ObjectId],
        ref: 'GovernmentInstitution'
	}
});

var Government = mongoose.model('Government', GovernmentSchema);

//Methods 

// Create Method
var create = function() {
	return new Government({
        _id: new mongoose.Types.ObjectId(),
        createdDate: new Date()
	});
}

// Save
var save = function(government, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		government.save(function(err, saved) {
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
var compare = function(government1, government2) {
    var match = true;
    var message = '';

    if (government1.name != government2.name) {
        match = false;
        message += 'Names do not match. ' + government1.name +' != ' + government2.name + '\n';
    }

    if (government1.foundedDate != government2.foundedDate) {
        match = false;
        message += 'Founded Dates do not match. ' + government1.foundedDate +' != ' + government2.foundedDate + '\n';
    }

    if (government1.geographicArea != government2.geographicArea) {
        match = false;
        message += 'Geographic Areas do not match. ' + government1.geographicArea +' != ' + government2.geographicArea + '\n';
    }

    // if (government1.poll != government2.poll) {
    //     match = false;
    //     message += 'Polls do not match. ' + government1.poll +' != ' + government2.poll + '\n';
    // }

	if (government1.governmentInstitutions != null && government2.governmentInstitutions != null) {
		if (government1.governmentInstitutions.length != government2.governmentInstitutions.length) {
			match = false;
			message += "Government Institutions do not match. \n";
		}
		else {
			for (var i = 0; i < government1.governmentInstitutions.length; i++) {
				if (government1.governmentInstitutions[i] != government2.governmentInstitutions[i]) {
					match = false;
					message += "Government Institutions do not match. \n";

				}
			}
		}
	}
	
	if (match)
		message = 'Governments Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		Government.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = Government;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

