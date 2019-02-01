/* 
 Class Model
 Model: Vote Option
 Description: Represents a possible vote. Because voting can be more than a simple 'Yay' or 'Nay', this class captures all the posible properties 
    of a vote, such as, does the vote count as positive or negative, does it count toward the total number of votes cast, etc.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var VoteOption = new ClassModel({
    className: 'VoteOption',
    abstract: true,
    discriminated: true,
    schema: {
        name: {
            type: String,
            required: true
        },
        positive: {
            type: Boolean
        },
        negative: {
            type: Boolean
        },
        countsTowardsTotal: {
            type: Boolean
        }
    }
});

module.exports = VoteOption;