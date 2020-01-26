/* 
 Class Model: Map Type
 Description: Supplies a type for a Map. This answers the question 'What is this Map a map of?'. Some examples might be Citys, Countys, Streets, or National Parks.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

var MapType = new ClassModel({
	className: 'MapType',
	attributes: [
		{
			name: 'name',
			type: String,
			required: true,
		},
	],
	relationships: [
		{
			name: 'geographicMaps',
			toClass: 'GeographicMap',
			singular: false,
		},
	],
});

module.exports = MapType;