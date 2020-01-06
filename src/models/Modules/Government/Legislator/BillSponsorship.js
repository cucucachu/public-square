/* 
 Class Model: Bill Sponsorship
 Description: Connects a Legislator to a Bill that they have sponsored. Bills can have one sponsor, and multiple co-sponsors.
    The main sponsor will have an instance of this class with the 'primary' attribute set to true. All other sponsorships 
    (i.e. for the co-sponsors) will have the 'primary' attribute set to false.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const BillSponsorship = new ClassModel({
    className: 'BillSponsorship',
    attributes: [
        {
            name: 'startDate',
            type: Date,
            required: true,
        },
        {
            name: 'endDate',
            type: Date,
        },
    ],
    relationships: [
        {
            name: 'bill',
            toClass: 'Bill',
            mirrorRelationship: 'billSponsorships',
            singular: true,
            required: true,
        },
        {
            name: 'legislator',
            toClass: 'Legislator',
            mirrorRelationship: 'billSponsorShips',
            singular: true,
            required: true,
        },
    ],
    validations: [
        function() {
            if (this.endDate < this.startDate) {
                throw new NoommanValidationError('End Date must be greater than or equal to Start Date.');
            }
        },
    ],
});

module.exports = BillSponsorship;
