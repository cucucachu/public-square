/* 
 Class Model: Individual Executive Action
 Discrimintor Super Class: Executive Action
 Description: An official action taken by a Government Official with executive powers which does not require a group vote.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const ExecutiveAction = require('./ExecutiveAction');

const IndividualExecutiveAction = new ClassModel({
	className: 'IndividualExecutiveAction',
	superClasses: [ExecutiveAction],
	useSuperClassCollection: true,
});

module.exports = IndividualExecutiveAction;
