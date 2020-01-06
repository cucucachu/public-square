/* 
 Class Model: Government Official
 Description: A Person Role connecting a Person to Occupied Positions.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const PersonRole = require('../User/PersonRole');

const GovernmentOfficial = new ClassModel({
	className: 'GovernmentOfficial',
	superClasses: [PersonRole],
	useSuperClassCollection: true,
	relationships: [
		{
			name: 'occupiedPositions',
			toClass: 'OccupiedPosition',
			mirrorRelationship: 'governmentOfficial',
			singular: false,
		},
	],
})

module.exports = GovernmentOfficial;