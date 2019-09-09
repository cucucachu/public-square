/* 
 Class Model
 Model: Nomination
 SuperClass: Position Acquisition Process
 Description: Represents an Nomition for a particular Government Position. Has relationships to the Nominator, and the Nominees, and Confirmation
    Votes.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var PositionAcquisitionProcess = require('../PositionAcquisitionProcess');

var Nomination = new ClassModel({
    className: 'Nomination',
	accessControlled: false,
	updateControlled: false,
    superClasses: [PositionAcquisitionProcess],
    schema: {
        nominationDate: {
            type: Date
        },
        positionStartDate: {
            type: Date,
            validate: {
                validator: function(value) {
                    if (value < this.nominationDate)
                        return false;
                    return true;
                },
                message: 'Position Start Date must be greater than or equal to Nomination Date.'
            }
        },
        nominator: {
            type: Schema.Types.ObjectId,
            ref: 'Nominator',
            required: true
        },
        nominee: {
            type: Schema.Types.ObjectId,
            ref: 'Nominee',
            required: true
        },
        confirmationVotes: {
            type: [Schema.Types.ObjectId],
            ref: 'ConfirmationVote'
        }
    }
});

module.exports = Nomination;
