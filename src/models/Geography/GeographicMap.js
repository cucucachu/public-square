/* 
 Class Model: Geographicmap
 Description: Divides a geographic area into sub Geographic Areas. Each map has a Map Type, which might be cities, or counties, or national parks.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

var GeographicMap = new ClassModel({
	className: 'GeographicMap',
	attributes: [
		{
			name: 'name',
			type: String,
			required: true,
		},
	],
	relationships: [
		{
			name: 'OfGeographicArea',
			toClass: 'GeographicArea',
			mirrorRelationship: 'geographicMapForArea',
			singular: true,
			required: true,
		},
		{
			name: 'containsGeographicAreas',
			toClass: 'GeographicArea',
			singular: false,
			required: true,
		},
		{
			name: 'mapType',
			toClass: 'MapType',
			mirrorRelationship: 'geographicMaps',
			singular: true,
			required: true,
		}
	],
});

module.exports = GeographicMap;