/* 
 Class Model
 Model: User
 Description: Describes attributes of a Person such as names, Addresses, etc.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var User = new ClassModel({
	className: 'User',
	accessControlled: false,
	schema: {
		_id: Schema.Types.ObjectId,
		firstName: {
			type: String,
			required: true
		},
		middleName: {
			type: String
		},
		lastName: {
			type: String,
			required: true
		},
		userAccount: {
			type: Schema.Types.ObjectId, 
			ref: 'UserAccount',
			required: true
		},
		userRoles: {
			type: [Schema.Types.ObjectId],
			ref: 'UserRoles'
		}
	}
});

module.exports = User;