/* 
 Mongoose Schema and Model Functions
 Model: Government
 Description: Defines a government for a particular geographic area. Examples might be the federal government for the entire United States, or the 
    San Francisco City Government for the geographic area San Francisco (City). Governments can have multiple Government Institutions. For example,
    a city may have a School Board, a Sanitation Department, a Police Department, etc. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

let Pollable = require('../Poll/Pollable');

let Government = new ClassModel({
	className: 'Government',
	accessControlled: false,
	superClasses: [Pollable],
	schema: {
		name: {
			type: String,
			required: true
		},
		foundedDate: {
			type: Date
		},
		createdDate: {
			type: Date,
			requried: true
		},
		geographicArea: {
			type: Schema.Types.ObjectId,
			ref: 'GeographicArea',
			required: true
		},
		governmentInstitutions: {
			type: [Schema.Types.ObjectId],
			ref: 'GovernmentInstitution'
		}
	}
});

// Exports
module.exports = Government;

