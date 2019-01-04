/* 
 Mongoose Schema and Model Functions
 Model: Judicial Oppinion
 Description: Represents an oppinion written by a judge or judges about a particular case. Other judges can also be signers of the opinion.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../../database');
var Schema = mongoose.Schema;

var JudicialCase = require('./JudicialCase');
var Judge = require('./Judge');
var Law = require('../Law');

// Schema and Model Setup
var JudicialOpinionSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    judicialCase: {
        type: Schema.Types.ObjectId,
        ref: 'JudicialCase',
        required: true
    },
    writtenByJudges: {
        type: [Schema.Types.ObjectId],
        ref: 'Judge'
    },
    signedByJudges: {
        type: [Schema.Types.ObjectId],
        ref: 'Judge'
	},
	laws: {
		type: [Schema.Types.ObjectId],
		ref: 'Law'
	}
});

var JudicialOpinion = mongoose.model('JudicialOpinion', JudicialOpinionSchema);

//Methods 

// Create Method
var create = function() {
	return new JudicialOpinion({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(judicialOpinion, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
		judicialOpinion.save(function(err, saved) {
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
var compare = function(judicialOpinion1, judicialOpinion2) {
    var match = true;
	var message = '';

    if (judicialOpinion1.text != judicialOpinion2.text) {
        match = false;
        message += 'Texts do not match. ' + judicialOpinion1.text +' != ' + judicialOpinion2.text + '\n';
    }

    if (judicialOpinion1.judicialCase != judicialOpinion2.judicialCase) {
        match = false;
        message += 'Judicial Cases do not match. ' + judicialOpinion1.judicialCase +' != ' + judicialOpinion2.judicialCase + '\n';
    }

	if (judicialOpinion1.writtenByJudges != null && judicialOpinion2.writtenByJudges != null) {
		if (judicialOpinion1.writtenByJudges.length != judicialOpinion2.writtenByJudges.length) {
			match = false;
			message += "Written By Judges do not match. \n";
		}
		else {
			for (var i = 0; i < judicialOpinion1.writtenByJudges.length; i++) {
				if (judicialOpinion1.writtenByJudges[i] != judicialOpinion2.writtenByJudges[i]) {
					match = false;
					message += "Written By Judges do not match. \n";

				}
			}
		}
	}

	if (judicialOpinion1.signedByJudges != null && judicialOpinion2.signedByJudges != null) {
		if (judicialOpinion1.signedByJudges.length != judicialOpinion2.signedByJudges.length) {
			match = false;
			message += "Signed By Judges do not match. \n";
		}
		else {
			for (var i = 0; i < judicialOpinion1.signedByJudges.length; i++) {
				if (judicialOpinion1.signedByJudges[i] != judicialOpinion2.signedByJudges[i]) {
					match = false;
					message += "Signed By Judges do not match. \n";

				}
			}
		}
	}

	if (judicialOpinion1.laws != null && judicialOpinion2.laws != null) {
		if (judicialOpinion1.laws.length != judicialOpinion2.laws.length) {
			match = false;
			message += "Laws do not match. \n";
		}
		else {
			for (var i = 0; i < judicialOpinion1.laws.length; i++) {
				if (judicialOpinion1.laws[i] != judicialOpinion2.laws[i]) {
					match = false;
					message += "Laws do not match. \n";

				}
			}
		}
	}

	if (match)
		message = 'Judicial Opinions Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		JudicialOpinion.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = JudicialOpinion;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

