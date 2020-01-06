/* 
 Class Model: Address
 Description: Represents a street address in the real world. Holds streetnumber and unit number as attributes, street, city, county, and state as
    relationships to Geographic Areas.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

var Address = new ClassModel({
	className: 'Address',
	attributes: [
		{
			name: 'streetNumber',
			type: String,
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
	schema: {
		streetNumber: {
			type: String
		},
		unit: {
			type: String
		},
		persons: {
			type: [Schema.Types.ObjectId],
			ref: 'Person'
		},
		street: {
			type: Schema.Types.ObjectId,
			ref: 'GeographicArea'
		},
		city: {
			type: Schema.Types.ObjectId,
			ref: 'GeographicArea',
			required: true
		},
		county: {
			type: Schema.Types.ObjectId,
			ref: 'GeographicArea'
		},
		state: {
			type: Schema.Types.ObjectId,
			ref: 'GeographicArea',
			required: true
		}
	}
});

module.exports = Address;