/* 
 Class Model
 Model: Candidate
 Super Class: Person Role
 Description: A Person Role which connects a Person to Campaigns.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var PersonRole = require('../../User/PersonRole');

var Candidate = new ClassModel({
	className: 'Candidate',
	accessControlled: false,
	updateControlled: false,
	discriminatorSuperClass: PersonRole,
	schema: {
		campaigns: {
			type: [Schema.Types.ObjectId],
			ref: 'Campaign',
			required: true
		}
	}
});

module.exports = Candidate;
