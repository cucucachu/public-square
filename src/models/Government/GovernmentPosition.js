/* 
 Class Model: Government Position
 Description: Defines a Postion in a particular Government Institution. For a Government Institution for a City Council, there may be positions
    for Board Chair, Board Member, Treasurer, etc. If there are multiple positions with the same title, the max attribute defines the maximum 
    number of positions that can be filled at any time. For example if a City Council has 5 Board Members, there would be one position
    called 'Board Member', and max for this position would be 5.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const GovernmentPosition = new ClassModel({
	className: 'GovernmentPosition',
	attributes: [
		{
			name: 'title',
			type: String,
			required: true,
		},
		{
			name: 'description',
			type: String,
		},
		{
			name: 'max',
			type: Number,
		},
	],
	relationships: [
		{
			name: 'governmentInstitution',
			toClass: 'GovernmentInstitution',
			mirrorRelationship: 'governmentPositions',
			singular: true,
			required: true,
		},
		{
			name: 'effectivePositionDefinitions',
			toClass: 'EffectivePositionDefinition',
			mirrorRelationship: 'governmentPosition',
			singular: false,
		},
		{
			name: 'occupiedPositions',
			toClass: 'OccupiedPosition',
			mirrorRelationship: 'governmentPosition',
			singular: false,
		},
		{
			name: 'positionAcquisitionProcesses',
			toClass: 'PositionAcquisitionProcess',
			mirrorRelationship: 'governmentPosition',
			singular: false,
		},
	],
});

module.exports = GovernmentPosition;