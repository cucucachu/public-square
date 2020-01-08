/* 
 Class Model: Position Definition
 Description: Defines complex properties for positions. This is separated out into its own class and model so that these definitions can be reused
    for multiple positions accross different governments and at different times. These properties include data about Terms, the Powers available
    to the holder of the position, and how the position is filled (Hiring Process). A definition for the President of the United States position
	would define what a term is (4 years), the term limits (2 terms), the powers available (executive, military), and the aquisition process 
	definition (election through electory college).
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const PositionDefinition = new ClassModel({
	className: 'PositionDefinition',
	attributes: [
		{
			name: 'name',
			type: String,
			required: true,
		},
	],
	relationships: [
		{
			name: 'effectivePositionDefinitions',
			toClass: 'EffectivePositionDefinition',
			mirrorRelationship: 'positionDefinition',
			singular: false,
		},
		{
			name: 'termDefinition',
			toClass: 'TermDefinition',
			mirrorRelationship: 'positionDefinition',
			singular: true,
		},
		{
			name: 'governmentPowers',
			toClass: 'GovernmentPower',
			mirrorRelationship: 'positionDefinitions',
			singular: false,
		},
		{
			name: 'acquisitionProcessDefinitions',
			toClass: 'AcquisitionProcessDefinition',
			mirrorRelationship: 'positionDefinitions',
			singular: false,
		},
	],
});

module.exports = PositionDefinition;