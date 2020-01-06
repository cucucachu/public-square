/* 
 Class Model: Term Definition
 Description: Defines the lenght (in time) and the term limit (max number of terms) for a Position Definition. 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const TermDefinition = new ClassModel({
	className: 'TermDefinition',
	attributes: [
		{
			name: 'termLength',
			type: Number,
			required: true,
		},
		{
			name: 'termLimit',
			type: Number,
			required: true,
		},
	],
	relationships: [
		{
			name: 'positionDefinition',
			toClass: 'PositionDefinition',
			mirrorRelationship: 'termDefinition',
			singular: true,
		},
	],
});

module.exports = TermDefinition;