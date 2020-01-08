/* 
 Class Model: Group Event
 Super Class(es): UserGroup
 Description: A subclass of a UserGroup with a address, start time, and end time.  
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const NoommanValidationError = noomman.NoommanErrors.NoommanValidationError;

const UserGroup = require('./UserGroup');

const GroupEvent = new ClassModel({
    className: 'GroupEvent',
    superClasses: [UserGroup],
	attributes: [
		{
			name: 'startTime',
			type: Date,
			required: true,
		},
		{
			name: 'endTime',
            type: Date,
            required: true,
		},
	],
	relationships: [
		{
			name: 'addresses',
			toClass: 'Address',
			singular: false,
			required: true,
		},
	],
	validations: [
		function() {
			if (this.endTime < this.startTime) {
				throw new NoommanValidationError('End Time must be greater than or equal to Start Time.');
			}
		}
	],
})

module.exports = GroupEvent;