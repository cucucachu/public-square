/* 
 Class Model: Appointee
 Super Class: Person Role
 Description: A Person Role which connects a Person to Appointments.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const PersonRole = require('../../User/PersonRole');

const Appointee = new ClassModel({
	className: 'Appointee',
	superClasses: [PersonRole],
	useSuperClassCollection: true,
	relationships: [
		{
			name: 'appointments',
			toClass: 'Appointment',
			mirrorRelationship: 'appointee',
			singular: false,
			required: true,
		},
	],
});

module.exports = Appointee;
