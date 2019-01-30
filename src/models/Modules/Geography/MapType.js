/* 
 Class Model
 Model: Map Type
 Description: Supplies a type for a Map. This answers the question 'What is this Map a map of?'. Some examples might be Citys, Countys, Streets, or National Parks.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var MapType = new ClassModel({
	className: 'MapType',
	schema: {
		name: {
			type: String,
			required: true
		},
		geographicMaps: {
			type: [Schema.Types.ObjectId],
			ref: 'GeographicMap',
			required: true
		}
	}
});

module.exports = MapType;