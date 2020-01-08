/* 
 Class Model: Nomination
 SuperClass: Position Acquisition Process
 Description: Represents an Nomition for a particular Government Position. Has relationships to the Nominator, and the Nominees, and Confirmation
    Votes.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
NoommanValidationError = noomman.NoommanErrors.NoommanValidationError;

const PositionAcquisitionProcess = require('../PositionAcquisitionProcess');

const Nomination = new ClassModel({
    className: 'Nomination',
    superClasses: [PositionAcquisitionProcess],
    attributes: [
        {
            name: 'nominationDate',
            type: Date,
        },
        {
            name: 'positionStartDate',
            type: Date,
        },
    ],
    relationships: [
        {
            name: 'nominator',
            toClass: 'Nominator',
            mirrorRelationship: 'nominations',
            singular: true,
            required: true,
        },
        {
            name: 'nominee',
            toClass: 'Nominee',
            mirrorRelationship: 'nominations',
            singular: true,
            required: true,
        },
        {
            name: 'confirmationVotes',
            toClass: 'ConfirmationVote',
            mirrorRelationship: 'nomination',
            singular: false,
        },
    ],
    validations: [
        function() {
            if (this.positionStartDate && this.nominationDate) {
                if (this.positionStartDate < this.nominationDate) {
                    throw new NoommanValidationError('Position Start Date must be greater than or equal to Nomination Date.');
                }
            }
        },
    ],
});

module.exports = Nomination;
