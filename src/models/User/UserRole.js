/* 
 Class Model: User Role
 Abstract
 Discriminated Sub Classes: Citizen, Civilian, Group Manager, Group Member
 Description: A Super class giving access to functionallity tied to a Person.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

var UserRole = new ClassModel({
	className: 'UserRole',
	abstract: true,
	relationships: [
		{
			name: 'userAccount',
			toClass: 'UserAccount',
			singular: true,
			mirrorRelationship: 'userRoles',
			required: true,
		},
	],
});

module.exports = UserRole;