/* 
 Class Model
 Model: Person
 Description: Describes attributes of a Person such as names, Addresses, etc.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var Person = new ClassModel({
	className: 'Person',
	accessControlled: false,
	updateControlled: false,
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
			ref: 'UserAccount'
		},
		address: {
			type: Schema.Types.ObjectId,
			ref: 'Address',
		},
		personRoles: {
			type: [Schema.Types.ObjectId],
			ref: 'PersonRole'
		}
	}
});

module.exports = Person;