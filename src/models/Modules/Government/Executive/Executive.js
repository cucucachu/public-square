/* 
 Class Model
 Model: Executive
 Super Class: Government Role
 Description: A subclass of Government Role which enables executive functionallity. This ties an Occupied Position to voting executive actions.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var GovernmentRole = require('../GovernmentRole');

var Executive = new ClassModel({
	className: 'Executive',
	accessControlled: false,
	updateControlled: false,
	superClasses: [GovernmentRole],
	schema: {
		individualExecutiveVotes: {
			type: [Schema.Types.ObjectId],
			ref: 'IndividualExecutiveVote'
		},
		executiveActions: {
			type: [Schema.Types.ObjectId],
			ref: 'ExecutiveAction'
		}
	}
});

module.exports = Executive;
