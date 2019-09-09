/* 
 Class Model
 Model: User Role
 Abstract
 Discriminated Sub Classes: Citizen, Civilian, Group Manager, Group Member
 Description: A Super class giving access to functionallity tied to a Person.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var UserRole = new ClassModel({
	className: 'UserRole',
	accessControlled: false,
	updateControlled: false,
	discriminated: true,
	abstract: true,
	schema: {
		userAccount: {
			type: Schema.Types.ObjectId,
			ref: 'UserAccount',
			required: true
		}
	}
});

module.exports = UserRole;