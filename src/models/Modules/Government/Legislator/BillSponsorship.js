/* 
 Class Model
 Model: Bill Sponsorship
 Description: Connects a Legislator to a Bill that they have sponsored. Bills can have one sponsor, and multiple co-sponsors.
    The main sponsor will have an instance of this class with the 'primary' attribute set to true. All other sponsorships 
    (i.e. for the co-sponsors) will have the 'primary' attribute set to false.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var BillSponsorship = new ClassModel({
    className: 'BillSponsorship',
    schema: {
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            validate: {
                validator: function(value) {
                    if (value < this.startDate)
                        return false;
                    return true;
                },
                message: 'End Date must be greater than or equal to Start Date.'
            }
        },
        bill: {
            type: Schema.Types.ObjectId,
            ref: 'Bill',
            required: true
        },
        legislator: {
            type: Schema.Types.ObjectId,
            ref: 'Legislator',
            required: true
        }
    }
});

module.exports = BillSponsorship;
