/* 
 Class Model: Person Role
 Abstract
 Discriminated Sub Classes: Candidate, Government Official, Appointer, Nominee
 Description: A Super class giving access to functionallity tied to a Person.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

var PersonRole = new ClassModel({
	className: 'PersonRole',
	abstract: true,
	relationships: [
		{
			name: 'person',
			toClass: 'Person',
			singular: true,
			mirrorRelationship: 'personRoles',
			required: true,
		},
	],
});

module.exports = PersonRole;