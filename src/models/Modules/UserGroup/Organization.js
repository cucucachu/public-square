/* 
 Mongoose Schema and Model Functions
 Model: Organization
 Super Class(es): User Group
 Description: A User Group which represents a real-world political organization that exists separate from public square. 
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var UserGroup = require('./UserGroup');

var Organization = new ClassModel({
    className: 'Organization',
	accessControlled: false,
	updateControlled: false,
    superClasses: [UserGroup],
    schema: {
        organizationMembers: {
            type: [Schema.Types.ObjectId],
            ref: 'OrganizationMember'
        },
        addresses: {
            type: [Schema.Types.ObjectId],
            ref: 'Address'
        }
    }
});

module.exports = Organization;
