/* 
 Class model
 Model: Position Definition
 Description: Defines complex properties for positions. This is separated out into its own class and model so that these definitions can be reused
    for multiple positions accross different governments and at different times. These properties include data about Terms, the Powers available
    to the holder of the position, and how the position is filled (Hiring Process). A definition for the President of the United States position
	would define what a term is (4 years), the term limits (2 terms), the powers available (executive, military), and the aquisition process 
	definition (election through electory college).
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var PositionDefinition = new ClassModel({
	className: 'PositionDefinition',
	accessControlled: false,
	schema: {
		name: {
			type: String,
			required: true
		},
		effectivePositionDefinitions: {
			type: [Schema.Types.ObjectId],
			ref: 'EffectivePositionDefinition'
		},
		termDefinition: {
			type: Schema.Types.ObjectId,
			ref: 'TermDefinition',
		},
		governmentPowers: {
			type: [Schema.Types.ObjectId],
			ref: 'GovernmentPower'
		},
		acquisitionProcessDefinitions: {
			type: [Schema.Types.ObjectId],
			ref: 'AcquisitionProcessDefinition'
		}
	}
});

module.exports = PositionDefinition;