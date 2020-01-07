/* 
 Class Model: Civilian
 Super Class: User Role
 Description: A User Role which connects a Person to Poll Responses.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const UserRole = require('../User/UserRole');

const Civilian = new ClassModel({
	className: 'Civilian',
	superClasses: [UserRole],
	useSuperClassCollection: true,
	relationships: [
		{
			name: 'pollResponses',
			toClass: 'PollResponse',
			mirrorRelationship: 'civilian',
			singular: false,
		},
	],
});

module.exports = Civilian;
