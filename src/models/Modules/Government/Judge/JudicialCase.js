/* 
 Class Model
 Model: Judicial Case
 Description: Represents a legal case that a judge might hear. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var JudicialCase = new ClassModel({
	className: 'JudicialCase',
	accessControlled: false,
	schema: {
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
	}
});

module.exports = JudicialCase;
