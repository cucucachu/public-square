/* 
 Class Model
 Model: Government Position
 Description: Defines a Postion in a particular Government Institution. For a Government Institution for a City Council, there may be positions
    for Board Chair, Board Member, Treasurer, etc. If there are multiple positions with the same title, the max attribute defines the maximum 
    number of positions that can be filled at any time. For example if a City Council has 5 Board Members, there would be one position
    called 'Board Member', and max for this position would be 5.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var GovernmentPosition = new ClassModel({
	className: 'GovernmentPosition',
	accessControlled: false,
	updateControlled: false,
	schema: {
		title: {
			type: String,
			required: true
		},
		description: {
			type: String
		},
		max: {
			type: Number
		},
		governmentInstitution: {
			type: Schema.Types.ObjectId,
			ref: 'GovernmentInstitution',
			required: true
		},
		effectivePositionDefinitions: {
			type: [Schema.Types.ObjectId],
			ref: 'EffectivePositionDefinition'
		},
		occupiedPositions: {
			type: [Schema.Types.ObjectId],
			ref: 'OccupiedPosition'
		},
		positionAcquisitionProcesses: {
			type: [Schema.Types.ObjectId],
			ref: 'PositionAcquisitionProcess'
		}
	}
});

module.exports = GovernmentPosition;