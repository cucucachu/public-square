/* 
 Class Model: Nominee
 Discriminated Super Class: Person Role
 Description: A Person Role which connects a Person to Nominations.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const PersonRole = require('../../User/PersonRole');

const Nominee = new ClassModel({
	className: 'Nominee',
	superClasses: [PersonRole],
	useSuperClassCollection: true,
	relationships: [
		{
			name: 'nominations',
			toClass: 'Nomination',
			mirrorRelationship: 'nominee',
			singular: false,
			required: true
		},
	],
});

module.exports = Nominee;
