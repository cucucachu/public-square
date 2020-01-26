/* 
 Class Model: Poll Option
 Description: Represents a possible poll option to choose from. A Poll Option could be 'Agree', 'Disagree', 'Strongly Agree', etc.

 1 way Relationships targeting this class: PollResponse, Poll,
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const NoommanValidationError = noomman.NoommanErrors.NoommanValidationError;

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
            required: true,
        },
    ],
    validations: [
        function() {
            if (this.positive && this.negative) {
                throw new NoommanValidationError('Poll option cannot be positive and negative.', ['positive', 'negative']);
            }
        },
        function() {
            if (!this.positive && !this.negative) {
                throw new NoommanValidationError('Poll option must be either positive or negative.', ['positive', 'negative']);
            }
        },
    ]
}); 

module.exports = PollOption;

