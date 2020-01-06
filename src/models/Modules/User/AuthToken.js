/* 
 ClassModel: AuthToken
 Description: An authorization token that gets created when a user logs in. Has an expiredAt field so that tokens are not valid forever.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const AuthToken = new ClassModel({
    className: 'AuthToken',
    attributes: [
        {
            name: 'createdAt',
            type: Date,
            required: true,
        },
        {
            name: 'expiresAt',
            type: Date,
            required: true,
        },
    ],
    relationships: [
        {
            name: 'userAccount',
            toClass: 'UserAccount',
            required: true,
            mirrorRelationship: 'authToken',
        },
    ],
});

module.exports = AuthToken;