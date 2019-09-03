/* 
 Class Model
 Model: Term Definition
 Description: Defines the lenght (in time) and the term limit (max number of terms) for a Position Definition. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var TermDefinition = new ClassModel({
	className: 'TermDefinition',
	accessControlled: false,
	schema: {
		termLength: {
			type: Number,
			required: true
		},
		termLimit: {
			type: Number,
			required: true
		},
		positionDefinition: {
			type: Schema.Types.ObjectId,
			ref: 'PositionDefinition'
		}
	}
});

module.exports = TermDefinition;