/* 
 Class Model: Occupied Position
 Super Class(es): Pollable
 Description: Definies who is in a particular Government Position at a particular time. Also relates to different Government Roles, which enable
    different functionallity, depending on the Government Powers defined for the Government Position.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const NoommanValidationError = noomman.NoommanErrors.NoommanValidationError;

const Pollable = require('../Poll/Pollable');

const OccupiedPosition = new ClassModel({
	className: 'OccupiedPosition',
	superClasses: [Pollable],
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
			name: 'governmentPosition',
			toClass: 'GovernmentPosition',
			mirrorRelationship: 'occupiedPositions',
			singular: true,
			required: true,
		},
		{
			name: 'governmentOfficial',
			toClass: 'GovernmentOfficial',
			mirrorRelationship: 'occupiedPositions',
			singular: true,
			required: true,
		},
		{
			name: 'governmentRoles',
			toClass: 'GovernmentRole',
			mirrorRelationship: 'occupiedPosition',
			singular: false,
		}
	],
	validations: [
		function() {
			if (this.endDate && (this.endDate < this.startDate)) {
				throw new NoommanValidationError('End Date must be greater than or equal to Start Date.');
			}
		}
	],
});

module.exports = OccupiedPosition;