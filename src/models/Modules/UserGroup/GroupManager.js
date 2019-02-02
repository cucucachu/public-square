/* 
 Class Model
 Model: Group Manager
 Discriminated Super Class: UserRole
 Description: A user Role which grants management priviliges to a User for a particular User Group.  
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var UserRole = require('../User/UserRole');

var GroupManager = new ClassModel({
	className: 'GroupManager',
	discriminatorSuperClass: UserRole,
	schema: {
		userGroups: {
			type: [Schema.Types.ObjectId],
			ref: 'UserGoup',
			required: true
		}
	}
})

module.exports = GroupManager;