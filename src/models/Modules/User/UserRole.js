/* 
 Class Model
 Model: User Role
 Description: A Super class giving access to functionallity tied to a Person.
 Sub Classes: Candidate, Government Official, Appointer, Nominee, Citizen, Civilian, Group Manager, Group Member
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var UserRole = new ClassModel({
	className: 'UserRole',
	accessControlled: false,
	discriminated: true,
	abstract: true,
	schema: {
		_id: Schema.Types.ObjectId,
		startDate: {
			type: Date,
			required: true
		},
		endDate: Date,
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		}
	}
});

module.exports = UserRole;