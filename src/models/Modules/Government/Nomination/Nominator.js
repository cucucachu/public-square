/* 
 Class Model
 Model: Nominator
 SuperClass: Government Role
 Description: A Government Role allowing an Occupied Position to make an Nomination of a person to a Government Position. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var GovernmentRole = require('../GovernmentRole');

var Nominator = new ClassModel({
	className: 'Nominator',
	accessControlled: false,
	superClasses: [GovernmentRole],
	schema: {
		nominations: {
			type: [Schema.Types.ObjectId],
			ref: 'Nomination'
		}
	}
});

module.exports = Nominator;