/* 
 Class Model: User Group
 Sub Classes: Group Event, Organization
 Description: Definies a group of users, which has members and managers, and which has an associated Post Stream.  
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const UserGroup = new ClassModel({
	className: 'UserGroup',
	attributes: [
		{
			name: 'name',
			type: String,
			required: true,
			unique: true,
		},
		{
			name: 'createdAt',
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
			name: 'parentGroup',
			toClass: 'UserGroup',
			mirrorRelationship: 'childGroups',
			singular: true,
		},
		{
			name: 'childGroups',
			toClass: 'UserGroup',
			mirrorRelationship: 'parentGroup',
			singular: false,
		},
		{
			name: 'groupManagers',
			toClass: 'GroupManager',
			mirrorRelationship: 'userGroup',
			singular: false,
			required: true,
		},
		{
			name: 'groupMembers',
			toClass: 'GroupMember',
			mirrorRelationship: 'userGroup',
			singular: false,
		},
		{
			name: 'postStream',
			toClass: 'PostStream',
			mirrorRelationship: 'userGroup',
			singular: true,
		},
	],
});

module.exports = UserGroup;
