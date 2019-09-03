/* 
 Class Model
 Model: Judicial Opinion
 Super Class(es): Pollable
 Description: Represents an oppinion written by a judge or judges about a particular case. Other judges can also be signers of the opinion.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var Pollable = require('../../Poll/Pollable');

var JudicialOpinion = new ClassModel({
	className: 'JudicialOpinion',
	accessControlled: false,
	superClasses: [Pollable],
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