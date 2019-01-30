/* 
 Class Model
 Model: Geographic Area
 Description: Represents an area on a map. Could be a street, a city, a state, a national park, etc. The type of area is determened by what
    map it is a part of, and the associated map type.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var GeographicArea = new ClassModel({
	className: 'GeographicArea',
	schema: {
		name: {
			type: String,
			required: true
		},
		geographicMap: {
			type: Schema.Types.ObjectId,
			ref: 'GeographicMap',
			required: true
		},
		addresses: {
			type: [Schema.Types.ObjectId],
			ref: 'Location'
		},
		government: {
			type: Schema.Types.ObjectId,
			ref: 'Government'
		},
		electionResults: {
			type: [Schema.Types.ObjectId],
			ref: 'ElectionResult'
		}
	}
});

module.exports = GeographicArea;