/* 
 Class Model
 Model: Group Executive Action
 Discriminator Super Class: Executive Action
 Description: An official action taken by a Government Official with executive powers which requires a group vote.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const ExecutiveAction = require('./ExecutiveAction');

const GroupExecutiveAction = new ClassModel({
	className: 'GroupExecutiveAction',
	superClasses: [ExecutiveAction],
	useSuperClassCollection: true,
	relationships: [
		{
			name: 'executiveVotes',
			toClass: 'ExecutiveVote',
			mirrorRelationship: 'groupExecutiveAction',
			singular: false,
		},
	],
});

module.exports = GroupExecutiveAction;
