/* 
 Class Model: Appointer
 SuperClass: Government Role
 Description: A Government Role allowing an Occupied Position to make an Appointment of a person to a Government Position. 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const GovernmentRole = require('../GovernmentRole');

const Appointer = new ClassModel({
	className: 'Appointer',
	superClasses: [GovernmentRole],
	relationships: [
		{
			name: 'appointments',
			toClass: 'Appointment',
			mirrorRelationship: 'appointer',
			singular: false,
		},
	],
});

module.exports = Appointer;
