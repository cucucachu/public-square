/* 
 Class Model
 Model: Group Member
 Discriminated Super Class: UserRole
 Description: A user Role which grants membership priviliges to a User for a particular User Group. 
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var UserRole = require('../User/UserRole');

var GroupMember = new ClassModel({
	className: 'GroupMember',
	accessControlled: false,
	discriminatorSuperClass: UserRole,
	schema: {
		startDate: {
			type: Date,
			required: true
		},
		endDate: {
			type: Date
		},
		userGroup: {
			type: Schema.Types.ObjectId,
			ref: 'UserGoup',
			required: true
		}
	}
});

module.exports = GroupMember;