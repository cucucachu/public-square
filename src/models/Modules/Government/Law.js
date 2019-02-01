/* 
 Class Model
 Model: Law
 Description: Represents a bill that has been passed into Law. 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var Law = new ClassModel({
	className: 'Law',
	schema: {
		startDate: {
			type: Date,
			required: true
		},
		expireDate: {
			type: Date,
			validate: {
				validator: function(value) {
					if (value < this.startDate)
						return false;
					return true;
				},
				message: 'Expire Date must be greater than or equal to Start Date.'
			}
		},
		bills: {
			type: [Schema.Types.ObjectId],
			ref: 'Bill',
		},
		judicialOpinions: {
			type: [Schema.Types.ObjectId],
			ref: 'JudicialOpinion'
		}
	}
})

module.exports = Law;