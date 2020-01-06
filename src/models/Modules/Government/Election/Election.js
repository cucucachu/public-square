/* 
 Class Model: Election
 SuperClass: Position Acquisition Process
 Description: Represents an Election for a particular Government Position. Has relationships to all the campaigns running for that position. 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const NoommanValidationError = noomman.NoommanErrors.NoommanValidationError;

var PositionAcquisitionProcess = require('../PositionAcquisitionProcess');

var Election = new ClassModel({
	className: 'Election',
	superClasses: [PositionAcquisitionProcess],
	attributes: [
		{
			name: 'electionDate',
			type: Date,
		},
		{
			name: 'termStartDate',
			type: Date,
		},
	],
	relationships: [
		{
			name: 'campaigns',
			toClass: 'Campaign',
			mirrorRelationship: 'election',
			singular: false,
			required: true,
		},
	],
	validations: [
		function() {
			if (this.termStartDate < this.electionDate) {
				throw new NoommanValidationError('Term Start Date must be greater than or equal to Election Date.');
			}
		},
	],
});

module.exports = Election;
