/* 
 Mongoose Schema and Model Functions
 Model: Bill Version
 Description: Represents a version of a Bill. Holds the text of a Bill for a particular version. Bills can be ammended over time, so this class
    captures the new text of the Bill each time it is changed, as well as the Legislator(s) who made the change.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var Legislator = require('./Legislator');
var Bill = require('./Bill');

// Schema and Model Setup
var BillVersionSchema = new Schema({
    versionNumber: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    bill: {
        type: Schema.Types.ObjectId,
        ref: 'Bill',
        required: true
    },
    legislators: {
        type: [Schema.Types.ObjectId],
        ref: 'Legislator'
    }
});

var BillVersion = mongoose.model('BillVersion', BillVersionSchema);

//Methods 

// Create Method
var create = function() {
	return new BillVersion({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(billVersion, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		billVersion.save(function(err, saved) {
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
var compare = function(billVersion1, billVersion2) {
    var match = true;
    var message = '';

    if (billVersion1.date != billVersion2.date) {
        match = false;
        message += 'Dates do not match. ' + billVersion1.date +' != ' + billVersion2.date + '\n';
    }

    if (billVersion1.text != billVersion2.text) {
        match = false;
        message += 'Texts do not match. ' + billVersion1.text +' != ' + billVersion2.text + '\n';
    }

    if (billVersion1.versionNumber != billVersion2.versionNumber) {
        match = false;
        message += 'Version Numbers do not match. ' + billVersion1.versionNumber +' != ' + billVersion2.versionNumber + '\n';
    }

    if (billVersion1.bill != billVersion2.bill) {
        match = false;
        message += 'Bills do not match. ' + billVersion1.bill +' != ' + billVersion2.bill + '\n';
    }

	if (billVersion1.legislators != null && billVersion2.legislators != null) {
		if (billVersion1.legislators.length != billVersion2.legislators.length) {
			match = false;
			message += "Legislators do not match. \n";
		}
		else {
			for (var i = 0; i < billVersion1.legislators.length; i++) {
				if (billVersion1.legislators[i] != billVersion2.legislators[i]) {
					match = false;
					message += "Legislators do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Bill Versions Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		BillVersion.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = BillVersion;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

