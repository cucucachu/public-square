/* 
 Class Model
 Model: Judicial Opinion
 Description: Represents an oppinion written by a judge or judges about a particular case. Other judges can also be signers of the opinion.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var JudicialOpinion = new ClassModel({
	className: 'JudicialOpinion',
	schema: {
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
	}
});

module.exports = JudicialOpinion;