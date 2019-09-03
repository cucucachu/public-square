/* 
 Class Model
 Model: Candidate
 Super Class: User Role
 Description: A User Role which connects a Person to Campaigns.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var UserRole = require('../../User/UserRole');

var Candidate = new ClassModel({
	className: 'Candidate',
	accessControlled: false,
	discriminatorSuperClass: UserRole,
	schema: {
		campaigns: {
			type: [Schema.Types.ObjectId],
			ref: 'Campaign',
			required: true
		}
	}
});

module.exports = Candidate;
