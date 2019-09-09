/* 
 Mongoose Schema and Model Functions
 Model: Organization Member
 Discriminated Super Class: User Role
 Description: An official member of an Organization. Organization Members have to be added by the Group Manager of an Organization, where as a 
    group member can voluntarilly join an Organization without any approval.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var UserRole = require('../User/UserRole');

var OrganizationMember = new ClassModel({
    className: 'OrganizationMember',
    accessControlled: false,
	updateControlled: false,
    discriminatorSuperClass: UserRole,
    schema: {
		startDate: {
			type: Date,
			required: true
		},
		endDate: {
			type: Date
		},
        organization: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
            required: true
        }
    }
});

module.exports = OrganizationMember;
