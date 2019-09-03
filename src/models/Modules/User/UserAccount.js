/* 
 Class Model
 Model: User Account
 Description: Holds the email, hashed password and other information for a user of Public Square.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

// Related Models
var User = require('./User');

var UserAccount = new ClassModel({
	className: 'UserAccount',
	accessControlled: false,
	schema: {
		_id: Schema.Types.ObjectId,
		email: {
			type: String,
			validate: {
				validator: function(value) {
					return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(value);
				},
				message: 'Invalid Email'
			},
			required: true,
	
		},
		passwordHash: {
			type: String,
			required: true
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		authToken: {
			type: Schema.Types.ObjectId,
			ref: 'AuthToken'
		}
	}
});
module.exports = UserAccount;