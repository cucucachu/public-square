/* 
 Class Model: Executive Action
 Abstract 
 Super Class(es): Pollable
 Discriminated Sub Classes: Individual Executive Action, Group Executive Action
 Description: An official action taken by a Government Official with executive powers. This could be a presidential executive action (individual),
    or an action by an agency of a government (like the FCC killing net neutrality rules) (group).
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Pollable = require('../../Poll/Pollable');

const ExecutiveAction = new ClassModel({
    className: 'ExecutiveAction',
    abstract: true,
    superClasses: [Pollable],
    attributes: [
        {
            name: 'name',
            type: String,
            required: true,
        },
        {
            name: 'text',
            type: String,
            required: true,
        },
        {
            name: 'passedDate',
            type: Date,
        },
        {
            name: 'effectiveDate',
            type: Date,
        },
    ],
    relationships: [
        {
            name: 'executives',
            toClass: 'Executive',
            mirrorRelationship: 'executiveActions',
            singular: false,
        },
    ],
    validations: [
        function() {
            if (this.effectiveDate < this.passedDate) {
                throw new NoommanValidationError('Effective Date must be greater than or equal to Passed Date.');
            }
        }
    ],
});

module.exports = ExecutiveAction;
