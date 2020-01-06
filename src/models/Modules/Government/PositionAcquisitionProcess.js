/* 
 Class Model: Position Acquisition Process
 Description: An abstract superclass which describes how an offical attempts to get a Government Position. Two examples of the subclasses are
    Election and Appointment. 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const PositionAcquisitionProcess = new ClassModel({
	className: 'PositionAcquisitionProcess',
	abstract: true,
	relationships: [
		{
			name: 'governmentPosition',
			toClass: 'GovernmentPosition',
			mirrorRelationship: 'positionAcquisitionProcesses',
			singular: true,
			required: true,
		},
	],
});

module.exports = PositionAcquisitionProcess;