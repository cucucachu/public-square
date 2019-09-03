/* 
 Class Model
 Model: Address
 Description: Represents a street address in the real world. Holds streetnumber and unit number as attributes, street, city, county, and state as
    relationships to Geographic Areas.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var Address = new ClassModel({
	className: 'Address',
	accessControlled: false,
	schema: {
		streetNumber: {
			type: String
		},
		unit: {
			type: String
		},
		users: {
			type: [Schema.Types.ObjectId],
			ref: 'User'
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