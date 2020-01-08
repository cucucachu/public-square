/* 
 Class Model: Nominator
 SuperClass: Government Role
 Description: A Government Role allowing an Occupied Position to make an Nomination of a person to a Government Position. 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const GovernmentRole = require('../GovernmentRole');

const Nominator = new ClassModel({
	className: 'Nominator',
	superClasses: [GovernmentRole],
	relationships: [
		{
			name: 'nominations',
			toClass: 'Nomination',
			mirrorRelationship: 'nominator',
			singular: false,
		},
	],
});

module.exports = Nominator;