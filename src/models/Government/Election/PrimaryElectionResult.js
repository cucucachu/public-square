/* 
 Class Model: Primary Election Result
 Discriminated Super Class: Election Result
 Description: Holds the vote counts for a primary election, for a particular Geographic Area and Campaign. 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

var ElectionResult = require('./ElectionResult');

var PrimaryElectionResult = new ClassModel({
    className: 'PrimaryElectionResult',
    superClasses: [ElectionResult],
    useSuperClassCollection: true,
});

module.exports = PrimaryElectionResult;
