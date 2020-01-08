/* 
 Class Model: Geographic Area
 Description: Represents an area on a map. Could be a street, a city, a state, a national park, etc. The type of area is determened by what
    map it is a part of, and the associated map type.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

var GeographicArea = new ClassModel({
	className: 'GeographicArea',
	attributes: [
		{
			name: 'name',
			type: String,
			required: true,
		},
	],
	relationships: [
		{
			name: 'geographicMapForArea',
			toClass: 'GeographicMap',
			mirrorRelationship: 'ofGeographicArea',
			singular: true,
			required: true,
		},
		{
			name: 'government',
			toClass: 'Government',
			mirrorRelationship: 'geographicArea',
			singular: true,
		},
		{
			name: 'electionResults',
			toClass: 'ElectionResult',
			mirrorRelationship: 'geographicArea',
			singular: false,
		},
	],
});

module.exports = GeographicArea;