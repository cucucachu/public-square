/* 
 Class Model: Bill 
 Super Class(es): Pollable
 Description: I'm just a bill, yes I'm only a bill, and I'm sitting here on capitol hill.
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Pollable = require('../../Poll/Pollable');

const Bill = new ClassModel({
	className: 'Bill',
	superClasses: [Pollable],
	attributes: [
		{
			name: 'name',
			type: String,
			required: true,
		},
		{
			name: 'passageDate',
			type: Date,
		},
		{
			name: 'signedDate',
			type: Date,
		},
	],
	relationships: [
		{
			name: 'billVersions',
			toClass: 'BillVersion',
			mirrorRelationship: 'bill',
			singular: false,
			required: true,
		},
		{
			name: 'billSponsorships',
			toClass: 'BillSponsorship',
			mirrorRelationship: 'bill',
			singular: false,
			required: true,
		},
		{
			name: 'laws',
			toClass: 'Law',
			mirrorRelationship: 'bills',
			singular: false,
		},
	],
});

module.exports = Bill;
