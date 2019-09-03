/* 
 Class Model
 Model: Geographicmap
 Description: Divides a geographic area into sub Geographic Areas. Each map has a Map Type, which might be cities, or counties, or national parks.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var GeographicMap = new ClassModel({
	className: 'GeographicMap',
	accessControlled: false,
	schema: {
		name: {
			type: String,
			required: true
		},
		ofGeographicArea: {
			type: Schema.Types.ObjectId,
			ref: 'GeographicArea',
			required: true
		},
		containsGeographicAreas: {
			type: [Schema.Types.ObjectId],
			ref: 'GeographicArea',
			required: true
		},
		mapType: {
			type: Schema.Types.ObjectId,
			ref: 'MapType',
			required: true
		}
	}
});

module.exports = GeographicMap;