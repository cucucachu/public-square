/* 
 Class Model
 Model: Nominee
 Discriminated Super Class: User Role
 Description: A User Role which connects a Person to Nominations.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var UserRole = require('../../User/UserRole');

var Nominee = new ClassModel({
	className: 'Nominee',
	accessControlled: false,
	discriminatorSuperClass: UserRole,
	schema: {
		nominations: {
			type: [Schema.Types.ObjectId],
			ref: 'Nomination',
			required: true
		}
	}
});

module.exports = Nominee;
