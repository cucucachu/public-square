/* 
 Class Model
 Model: Nominee
 Discriminated Super Class: Person Role
 Description: A Person Role which connects a Person to Nominations.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var PersonRole = require('../../User/PersonRole');

var Nominee = new ClassModel({
	className: 'Nominee',
	discriminatorSuperClass: PersonRole,
	schema: {
		nominations: {
			type: [Schema.Types.ObjectId],
			ref: 'Nomination',
			required: true
		}
	}
});

module.exports = Nominee;
