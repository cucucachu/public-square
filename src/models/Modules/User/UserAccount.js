/* 
 Class Model
 Model: User Account
 Description: Holds the email, hashed password and other information for a user of Public Square.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var UserAccount = new ClassModel({
	className: 'UserAccount',
	accessControlled: false,
	schema: {
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
		person: {
			type: Schema.Types.ObjectId,
			ref: 'Person',
			required: true
		},
		authToken: {
			type: Schema.Types.ObjectId,
			ref: 'AuthToken'
		},
		userRoles: {
			type: [Schema.Types.ObjectId],
			ref: 'UserRole'
		}
	}
});
module.exports = UserAccount;