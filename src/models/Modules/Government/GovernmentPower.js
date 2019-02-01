/* 
 Class Model
 Model: Government Power
 Description: Describes different powers available to a Government Position. These will be used to determine what functionalities and data 
    are available to a Position. For instance, an instance of Government Power might be 'Legislative', giving a position access to the
    functionality to draft, sponsor, and vote on bills. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var GovernmentPower = new ClassModel({
    className: 'GovernmentPower',
    schema: {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        positionDefinitions: {
            type: [Schema.Types.ObjectId],
            ref: 'PositionDefinition'
        }
    }
});

module.exports = GovernmentPower;