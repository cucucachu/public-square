/* 
 Class Model: Address
 Description: Represents a street address in the real world. Holds streetnumber and unit number as attributes, street, city, county, and state as
    relationships to Geographic Areas.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Address = new ClassModel({
	className: 'Address',
	attributes: [
		{
			name: 'streetNumber',
			type: String,
			required: true,
		},
		{
			name: 'unit',
			type: String,
		},
	],
	relationships: [
		{
			name: 'persons',
			toClass: 'Person',
			mirrorRelationship: 'address',
			singular: false,
		},
		{
			name: 'street',
			toClass: 'GeographicArea',
			singular: true,
		},
		{
			name: 'city',
			toClass: 'GeographicArea',
			singular: true,
			required: true,
		},
		{
			name: 'county',
			toClass: 'GeographicArea',
			singular: true,
		},
		{
			name: 'state',
			toClass: 'GeographicArea',
			singular: true,
			required: true,
		},
	],
});

module.exports = Address;