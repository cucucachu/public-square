/* 
 Class Model
 Model: Bill Version
 Description: Represents a version of a Bill. Holds the text of a Bill for a particular version. Bills can be ammended over time, so this class
    captures the new text of the Bill each time it is changed, as well as the Legislator(s) who made the change.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var BillVersion = new ClassModel({
    className: 'BillVersion',
    schema: {
        versionNumber: {
            type: Number,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        bill: {
            type: Schema.Types.ObjectId,
            ref: 'Bill',
            required: true
        },
        legislators: {
            type: [Schema.Types.ObjectId],
            ref: 'Legislator'
        },
        legislativeVotes: {
            type: [Schema.Types.ObjectId],
            ref: 'LegislativeVote'
        }
    }
});

module.exports = BillVersion;
