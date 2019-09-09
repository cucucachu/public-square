/* 
 ClassModel
 Model: Executive Action
 Abstract 
 Super Class(es): Pollable
 Discriminated Sub Classes: Individual Executive Action, Group Executive Action
 Description: An official action taken by a Government Official with executive powers. This could be a presidential executive action (individual),
    or an action by an agency of a government (like the FCC killing net neutrality rules) (group).
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var Pollable = require('../../Poll/Pollable');

var ExecutiveAction = new ClassModel({
    className: 'ExecutiveAction',
	accessControlled: false,
	updateControlled: false,
    abstract: true,
    discriminated: true,
    superClasses: [Pollable],
    schema: {
        name: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        passedDate: {
            type: Date
        },
        effectiveDate: {
            type: Date,
            validate: {
                validator: function(value) {
                    if (value < this.passedDate)
                        return false;
                    return true;
                },
                message: 'Effective Date must be greater than or equal to Passed Date.'
            }
        },
        executives: {
            type: [Schema.Types.ObjectId],
            ref: 'Executive'
        }
    }
});

module.exports = ExecutiveAction;
