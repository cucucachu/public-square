/* 
 Class Model: Organization Member
 Discriminated Super Class: User Role
 Description: An official member of an Organization. Organization Members have to be added by the Group Manager of an Organization, where as a 
    group member can voluntarilly join an Organization without any approval.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const UserRole = require('../User/UserRole');

const OrganizationMember = new ClassModel({
    className: 'OrganizationMember',
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
			name: 'organization',
			toClass: 'Organization',
			mirrorRelationship: 'organizationMembers',
			singular: true,
			required: true,
		},
	],
});

module.exports = OrganizationMember;
