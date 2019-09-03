/* 
 Class Model
 Model: Campaign
 Description: Joiner class between Government Position and Election. Relates a Election to a Position Definition for a given date range.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var Campaign = new ClassModel({
	className: 'Campaign',
	accessControlled: false,
	schema: {
		candidate: {
			type: Schema.Types.ObjectId,
			ref: 'Candidate',
			required: true
		},
		election: {
			type: Schema.Types.ObjectId,
			ref: 'Election',
			required: true
		},
		electionResults: {
			type: [Schema.Types.ObjectId],
			ref: 'ElectionResult'
		}
	
	}
});

module.exports = Campaign;