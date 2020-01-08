/* 
 Class Model: Candidate
 Super Class: Person Role
 Description: A Person Role which connects a Person to Campaigns.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

var PersonRole = require('../../User/PersonRole');

var Candidate = new ClassModel({
	className: 'Candidate',
	superClasses: [PersonRole],
	useSuperClassCollection: true,
	relationships: [
		{
			name: 'campaigns',
			toClass: 'Campaign',
			mirrorRelationship: 'candidate',
			singular: false,
			required: true,
		}
	],
});

module.exports = Candidate;
