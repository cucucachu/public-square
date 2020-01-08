/* 
 Class Model: Law
 Description: Represents a bill that has been passed into Law. 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const NoommanValidationError = noomman.NoommanErrors.NoommanValidationError;

const Law = new ClassModel({
	className: 'Law',
	attributes: [
		{
			name: 'startDate',
			type: Date,
			required: true,
		},
		{
			name: 'expireDate',
			type: Date,
		},
	],
	relationships: [
		{
			name: 'bills',
			toClass: 'Bill',
			mirrorRelationship: 'laws',
			singular: false,
		},
		{
			name: 'judicialOpinions',
			toClass: 'JudicialOpinion',
			mirrorRelationship: 'laws',
			singular: false,
		}
	],
	validations: [
		function() {
			if (this.expireDate && (this.expireDate < this.startDate)) {
				throw new NoommanValidationError('Expire Date must be greater than or equal to Start Date.');
			}
		}
	],
})

module.exports = Law;