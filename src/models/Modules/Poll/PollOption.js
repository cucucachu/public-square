/* 
 Mongoose Schema and Model Functions
 Model: Poll Option
 Description: Represents a possible poll option to choose from. A Poll Option could be 'Agree', 'Disagree', 'Strongly Agree', etc.
*/

var ClassModel = require('../../ClassModel');

var PollOption = new ClassModel({
    className: 'PollOption',
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
        weight: {
            type: Number
        }
    }
}); 

module.exports = PollOption;

