var assert = require('assert');
var expect = require('expect');
var promiseFinally = require('promise.prototype.finally');

// Add 'finally()' to 'Promis.prototype'
promiseFinally.shim();

process.on('unhandledRejection', error => {
	console.log('unhandledRejection', error.message);
});

var User = require('../models/Modules/User/User');
var GeographicArea = require('../models/Modules/Geography/GeographicArea');
var GeographicMap = require('../models/Modules/Geography/GeographicMap');
var MapType = require('../models/Modules/Geography/MapType');
var Address = require('../models/Modules/Geography/Address');

describe('UserPost Module Tests', function() {
	
	before(function(done) {
		User.clear().then(
			function() {
				GeographicArea.clear().then(
					function() {
						GeographicMap.clear().then(
							function() {
								Stamper.clear().then(
									function() {
										StampType.clear().then(
											function() {
												PostStream.clear().then(
													function() {
														ExternalLink.clear().then(done, done);
													}, 
													done
												);
											}, 
											done
										);
									},
									done								
								);
							}, 
							done
						);
					}, 
					done
				);
			}, 
			done
		);
	});
});