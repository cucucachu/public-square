/* 
 Class Model: Group Manager
 Discriminated Super Class: UserRole
 Description: A user Role which grants management priviliges to a User for a particular User Group.  
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const UserRole = require('../User/UserRole');

const GroupManager = new ClassModel({
	className: 'GroupManager',
	superClasses: [UserRole],
	useSuperClassCollection: true,
	attributes: [
		{
			name: 'startDate',
			type: Date,
			required: true,
		},
		{
			name: 'endDate',
			type: Date,
		},
	],
	relationships: [
		{
			name: 'userGroup',
			toClass: 'UserGroup',
			mirrorRelationship: 'groupManagers',
			singular: true,
			required: true,
		},
	],
});

module.exports = GroupManager;