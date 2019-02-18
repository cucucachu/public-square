/* 
 Class Model
 Model: Person Role
 Abstract
 Discriminated Sub Classes: Candidate, Government Official, Appointer, Nominee
 Description: A Super class giving access to functionallity tied to a Person.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var PersonRole = new ClassModel({
	className: 'PersonRole',
	discriminated: true,
	abstract: true,
	schema: {
		person: {
			type: Schema.Types.ObjectId,
			ref: 'Person',
			required: true
		}
	}
});

module.exports = PersonRole;