/* 
 Class Model
 Model: Bill 
 Description: I'm just a bill, yes I'm only a bill, and I'm sitting here on capitol hill.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassModel = require('../../../ClassModel');

var Bill = new ClassModel({
	className: 'Bill',
	schema: {
		name: {
			type: String,
			required: true
		},
		passageDate: {
			type: Date
		},
		signedDate: {
			type: Date
		},
		billVersions: {
			type: [Schema.Types.ObjectId],
			ref: 'BillVersion',
			required: true
		},
		billSponsorships: {
			type: [Schema.Types.ObjectId],
			ref: 'BillSponsorship',
			required: true
		},
		laws: {
			type: [Schema.Types.ObjectId],
			ref: 'Law',
			required: true
		}
	}
});

module.exports = Bill;
