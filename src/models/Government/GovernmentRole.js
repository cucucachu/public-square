/* 
 Class Model: Government Role
 Abstract
 Description: A abstract super class connecting an Occupied Position to different classes that enable functionallity based on the Government Powers
    for the Government Position. Subclasses include Executive, Judge, Legislator, Nominator, and Confirmer.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const GovernmentRole = new ClassModel({
	className: 'GovernmentRole',
	abstract: true,
	relationships: [
		{
			name: 'occupiedPosition',
			toClass: 'OccupiedPosition',
			mirrorRelationship: 'governmentRoles',
			singular: true,
			required: true,
		},
	],
});

module.exports = GovernmentRole;