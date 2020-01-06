/* 
 Class Model: Government
 Description: Defines a government for a particular geographic area. Examples might be the federal government for the entire United States, or the 
    San Francisco City Government for the geographic area San Francisco (City). Governments can have multiple Government Institutions. For example,
    a city may have a School Board, a Sanitation Department, a Police Department, etc. 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Pollable = require('../Poll/Pollable');

const Government = new ClassModel({
	className: 'Government',
	superClasses: [Pollable],
	attributes: [
		{
			name: 'name',
			type: String,
			required: true,
		},
		{
			name: 'foundedDate',
			type: Date,
		},
		{
			name: 'createdDate',
			type: Date,
			required: true,
		},
	],
	relationships: [
		{
			name: 'geographicArea',
			toClass: 'GeographicArea',
			mirrorRelationship: 'government',
			singular: true,
			required: true,
		},
		{
			name: 'governmentInstitution',
			toClass: 'GovernmentInstitution',
			mirrorRelationship: 'government',
			singular: false,
		},
	],
});

module.exports = Government;

