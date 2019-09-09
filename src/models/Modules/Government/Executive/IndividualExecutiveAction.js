/* 
 Class Model
 Model: Individual Executive Action
 Discrimintor Super Class: Executive Action
 Description: An official action taken by a Government Official with executive powers which does not require a group vote.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var ExecutiveAction = require('./ExecutiveAction');

var IndividualExecutiveAction = new ClassModel({
	className: 'IndividualExecutiveAction',
	accessControlled: false,
	updateControlled: false,
	discriminatorSuperClass: ExecutiveAction,
	schema: {}
});

module.exports = IndividualExecutiveAction;
