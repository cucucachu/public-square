/* 
 Class Model: Organization
 Super Class(es): User Group
 Description: A User Group which represents a real-world political organization that exists separate from public square. 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const UserGroup = require('./UserGroup');

const Organization = new ClassModel({
    className: 'Organization',
    superClasses: [UserGroup],
    relationships: [
        {
            name: 'organizationMembers',
            toClass: 'OrganizationMember',
            mirrorRelationship: 'organization',
            singular: false,
        },
        {
            name: 'addresses',
            toClass: 'Address',
            singular: false,
        },
    ],
});

module.exports = Organization;
