/* 
 Class Model
 Model: Individual Judgement
 Description: Represents a Judges's decission for a particular Judicial Case. Has a relationship to the Judge who made the decision, the Judgement
    (the class that groups the Individual Judgements), and the Judgement Option. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var IndividualJudgement = new ClassModel({
    className: 'IndividualJudgement',
    schema: {
        judge: {
            type: Schema.Types.ObjectId,
            ref: 'Judge',
            required: true
        },
        judgement: {
            type: Schema.Types.ObjectId,
            ref: 'Judgement',
            required: true
        },
        judgementOption: {
            type: Schema.Types.ObjectId,
            ref: 'JudgementOption',
            required: true
        }
    }
});

module.exports = IndividualJudgement;
