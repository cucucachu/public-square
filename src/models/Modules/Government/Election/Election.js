/* 
 Class Model
 Model: Election
 SuperClass: Position Acquisition Process
 Description: Represents an Election for a particular Government Position. Has relationships to all the campaigns running for that position. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var PositionAcquisitionProcess = require('../PositionAcquisitionProcess');

var Election = new ClassModel({
	className: 'Election',
	superClasses: [PositionAcquisitionProcess],
	schema: {
		electionDate: {
			type: Date
		},
		termStartDate: {
			type: Date,
			validate: {
				validator: function(value) {
					if (value < this.electionDate)
						return false;
					return true;
				},
				message: 'Term Start Date must be greater than or equal to Election Date.'
			}
		},
		campaigns: {
			type: [Schema.Types.ObjectId],
			ref: 'Campaign',
			required: true
		}
	}
});

module.exports = Election;
