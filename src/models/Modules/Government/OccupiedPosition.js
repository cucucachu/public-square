/* 
 Class Model
 Model: Occupied Position
 Description: Definies who is in a particular Government Position at a particular time. Also relates to different Government Roles, which enable
    different functionallity, depending on the Government Powers defined for the Government Position.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var OccupiedPosition = new ClassModel({
	className: 'OccupiedPosition',
	schema: {
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date
		},
		governmentPosition: {
			type: Schema.Types.ObjectId,
			ref: 'GovernmentPosition',
			required: true
		},
		governmentOfficial: {
			type: Schema.Types.ObjectId,
			ref: 'GovernmentOfficial',
			required: true
		},
		governmentRoles: {
			type: [Schema.Types.ObjectId],
			ref: 'GovernmentRole',
		}
	}
});

module.exports = OccupiedPosition;