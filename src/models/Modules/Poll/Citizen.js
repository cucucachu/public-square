/* 
 Class Model
 Model: Citizen
 Super Class: User Role
 Description: A User Role which connects a Person to Poll Responses. Citizen role should only be available to Users who have been verified as
    citizens or voters of the United States.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var UserRole = require('../User/UserRole');

var Citizen = new ClassModel({
	className: 'Citizen',
	accessControlled: false,
	updateControlled: false,
	discriminatorSuperClass: UserRole,
	schema: {
		pollResponses: {
			type: [Schema.Types.ObjectId],
			ref: 'PollResponse'
		}
	}
});

module.exports = Citizen;