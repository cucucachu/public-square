/* 
 Mongoose Schema and Model Functions
 Model: Civilian
 Super Class: User Role
 Description: A User Role which connects a Person to Poll Responses.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var UserRole = require('../User/UserRole');

var Civilian = new ClassModel({
	className: 'Civilian',
	accessControlled: false,
	discriminatorSuperClass: UserRole,
	schema: {
		pollResponses: {
			type: [Schema.Types.ObjectId],
			ref: 'PollResponse'
		}
	}
});

module.exports = Civilian;
