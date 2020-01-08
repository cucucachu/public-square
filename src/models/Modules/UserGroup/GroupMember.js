/* 
 Class Model: Group Member
 Discriminated Super Class: UserRole
 Description: A user Role which grants membership priviliges to a User for a particular User Group. 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const NoommanValidationError = noomman.NoommanErrors.NoommanValidationError;

const UserRole = require('../User/UserRole');

const GroupMember = new ClassModel({
	className: 'GroupMember',
	superClasses: [UserRole],
	useSuperClassCollection: true,
	attributes: [
		{
			name: 'startDate',
			type: Date,
			required: true,
		},
		{
			name: 'endDate',
			type: Date,
		},
	],
	relationships: [
		{
			name: 'userGroup',
			toClass: 'UserGroup',
			mirrorRelationship: 'groupMembers',
			singular: true,
			required: true,
		},
	],
	validations: [
		function() {
			if (this.endDate && (this.endDate < this.startDate)) {
				throw new NoommanValidationError('End Date must be greater than or equal to Start Date.');
			}
		}
	],
});

module.exports = GroupMember;