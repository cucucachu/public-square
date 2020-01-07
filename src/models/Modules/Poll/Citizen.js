/* 
 Class Model: Citizen
 Super Class: User Role
 Description: A User Role which connects a Person to Poll Responses. Citizen role should only be available to Users who have been verified as
    citizens or voters of the United States.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const UserRole = require('../User/UserRole');

const Citizen = new ClassModel({
	className: 'Citizen',
	superClasses: [UserRole],
	useSuperClassCollection: true,
	relationships: [
		{
			name: 'pollResponses',
			toClass: 'PollResponse',
			mirrorRelationship: 'citizen',
			singular: false,
		},
	],
});

module.exports = Citizen;