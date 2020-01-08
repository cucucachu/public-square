/* 
 Class Model: Person
 Description: Describes attributes of a Person such as names, Addresses, etc.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Person = new ClassModel({
	className: 'Person',
	attributes: [
		{
			name: 'firstName',
			type: String,
			required: true,
		},
		{
			name: 'middleName',
			type: String,
		},
		{
			name: 'lastName',
			type: String,
			required: true,
		},
	],
	relationships: [
		{
			name: 'userAccount',
			toClass: 'UserAccount',
			mirrorRelationship: 'person',
			singular: true,
		},
		{
			name: 'address',
			toClass: 'Address',
			mirrorRelationship: 'persons',
			singular: true,
		},
		{
			name: 'personRoles',
			toClass: 'PersonRole',
			singular: false,
			mirrorRelationship: 'person',
		},
	],
});

module.exports = Person;