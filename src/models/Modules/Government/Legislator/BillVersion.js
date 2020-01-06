/* 
 Class Model: Bill Version
 Description: Represents a version of a Bill. Holds the text of a Bill for a particular version. Bills can be ammended over time, so this class
    captures the new text of the Bill each time it is changed, as well as the Legislator(s) who made the change.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const BillVersion = new ClassModel({
    className: 'BillVersion',
    attributes: [
        {
            name: 'versionNumber',
            type: Number,
            required: true,
        },
        {
            name: 'text',
            type: String,
            required: true,
        },
        {
            name: 'date',
            type: Date,
            required: true,
        },
    ],
    relationships: [
        {
            name: 'bill',
            toClass: 'Bill',
            mirrorRelationship: 'billVersions',
            singular: true,
            required: true,
        },
        {
            name: 'legislators',
            toClass: 'Legislator',
            mirrorRelationship: 'billVersions',
            singular: false,
        },
        {
            name: 'legislativeVotes',
            toClass: 'LegislativeVotes',
            mirrorRelationship: 'billVersion',
            singular: false,
        }
    ],
});

module.exports = BillVersion;
