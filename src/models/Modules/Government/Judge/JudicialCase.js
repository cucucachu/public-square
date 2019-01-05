/* 
 Mongoose Schema and Model Functions
 Model: Judicial Case
 Description: Represents a legal case that a judge might hear. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

// Schema and Model Setup
var JudicialCaseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    filedDate: {
        type: Date
    },
    judgements: {
        type: [Schema.Types.ObjectId],
        ref: 'Judgement'
    },
    judicialOpinions: {
        type: [Schema.Types.ObjectId],
        ref: 'JudicialOpinion'
    }
});

var JudicialCase = mongoose.model('JudicialCase', JudicialCaseSchema);

//Methods 

// Create Method
var create = function() {
	return new JudicialCase({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(judicialCase, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		judicialCase.save(function(err, saved) {
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
var compare = function(judicialCase1, judicialCase2) {
    var match = true;
    var message = '';

    if (judicialCase1.name != judicialCase2.name) {
        match = false;
        message += 'Names do not match. ' + judicialCase1.name +' != ' + judicialCase2.name + '\n';
    }

    if (judicialCase1.filedDate != judicialCase2.filedDate) {
        match = false;
        message += 'Filed Dates do not match. ' + judicialCase1.filedDate +' != ' + judicialCase2.filedDate + '\n';
    }

	if (judicialCase1.judgements != null && judicialCase2.judgements != null) {
		if (judicialCase1.judgements.length != judicialCase2.judgements.length) {
			match = false;
			message += "Judgements do not match. \n";
		}
		else {
			for (var i = 0; i < judicialCase1.judgements.length; i++) {
				if (judicialCase1.judgements[i] != judicialCase2.judgements[i]) {
					match = false;
					message += "Judgements do not match. \n";

				}
			}
		}
	}

	if (judicialCase1.judicialOpinions != null && judicialCase2.judicialOpinions != null) {
		if (judicialCase1.judgements.length != judicialCase2.judicialOpinions.length) {
			match = false;
			message += "Judicial Opinions do not match. \n";
		}
		else {
			for (var i = 0; i < judicialCase1.judicialOpinions.length; i++) {
				if (judicialCase1.judicialOpinions[i] != judicialCase2.judicialOpinions[i]) {
					match = false;
					message += "Judicial Opinions do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Judicial Cases Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		JudicialCase.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = JudicialCase;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

