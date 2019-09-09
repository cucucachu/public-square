/* 
 Class Model
 Model: AuthToken
 Description: An authorization token that gets created when a user logs in. Has an expiredAt field so that tokens are not valid forever.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var AuthToken = new ClassModel({
	className: 'AuthToken',
	accessControlled: false,
	updateControlled: false,
	schema: {
        createdAt: {
            type: Date,
            required: true
        },
        expiresAt: {
            type: Date,
            required: true
        },
        userAccount: {
            type: Schema.Types.ObjectId,
            ref: 'UserAccount',
            required: true
        }
	}
});

module.exports = AuthToken;