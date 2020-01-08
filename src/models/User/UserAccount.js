/* 
 Class Model: User Account
 Description: Holds the email, hashed password and other information for a user of Public Square.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const NoommanValidationError = noomman.NoommanErrors.NoommanValidationError;

const UserAccount = new ClassModel({
	className: 'UserAccount',
	attributes: [
		{
			name: 'email',
			type: String,
			required: true,
			unique: true,
		},
		{
			name: 'passwordHash',
			type: String,
			required: true,
		},
		
	],
	relationships: [
		{
			name: 'person',
			toClass: 'Person',
			singular: true,
			mirrorRelationship: 'userAccount',
			required: true,
		},
		{
			name: 'authToken',
			toClass: 'AuthToken',
			singular: true,
            mirrorRelationship: 'userAccount',
		},
		{
			name: 'userRoles',
			toClass: 'UserRole',
			singular: false,
			mirrorRelationship: 'userAccount',
		},
	],
	validations: [
		function() {
			if (/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(this.email) == false) {
				throw new NoommanValidationError('Invalid Email');
			}
		},
	],
});

module.exports = UserAccount;