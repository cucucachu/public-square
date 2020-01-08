/* 
 Class Model: Poll Option
 Description: Represents a possible poll option to choose from. A Poll Option could be 'Agree', 'Disagree', 'Strongly Agree', etc.

 1 way Relationships targeting this class: PollResponse, Poll,
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const PollOption = new ClassModel({
    className: 'PollOption',
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
            name: 'weight',
            type: Number,
        },
    ],
}); 

module.exports = PollOption;

