/* 
 Class Model: Vote Option
 Description: Represents a possible vote. Because voting can be more than a simple 'Yay' or 'Nay', this class captures all the posible properties 
    of a vote, such as, does the vote count as positive or negative, does it count toward the total number of votes cast, etc.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const VoteOption = new ClassModel({
    className: 'VoteOption',
    abstract: true,
    attributes: [
        {
            name: 'name',
            type: String,
            required: true,
        },
        {
            name: 'positive',
            type: Boolean,
        },
        {
            name: 'negative',
            type: Boolean,
        },
        {
            name: 'countsTowardsTotal',
            type: Boolean,
        },
    ],
});

module.exports = VoteOption;