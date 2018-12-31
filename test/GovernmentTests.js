var assert = require('assert');
var expect = require('expect');
var promiseFinally = require('promise.prototype.finally');

// Add 'finally()' to 'Promis.prototype'
promiseFinally.shim();

process.on('unhandledRejection', error => {
	console.log('unhandledRejection', error.message);
});

var GeographicArea = require('../models/Modules/Geography/GeographicArea');
var Government = require('../models/Modules/Government/Government');
var GovernmentInstitution = require('../models/Modules/Government/GovernmentInstitution');
var GovernmentPosition = require('../models/Modules/Government/GovernmentPosition');

describe('Government Module Tests', function() {
	
	before(function(done) {
		Government.clear().then(
			function() {
				GeographicArea.clear().then(
					function() {
						GovernmentPosition.clear().then(
							function() {
								GovernmentInstitution.clear().then(done, done);
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

	describe('Government Model Tests', function() {

		describe('Government.create()', function() {
		
			it('Government.create() creates a Government instance.', function() {
				var government = Government.create();
				assert(typeof(government) === "object");
			});

			it('Government.create() creates a Government instance with _id field populated', function(){
				var government = Government.create();
				assert(typeof(government._id) === "object" && /^[a-f\d]{24}$/i.test(government._id));
			});
		});

		describe('Government.save()', function() {

			it('Government.save() throws an error if required fields are missing.', function(done) {
				var government = Government.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'Government validation failed: geographicArea: Path `geographicArea` is required., name: Path `name` is required.';
				
				Government.save(government).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Government.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Government.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});


			it('Goverment.geographicArea must be a valid ID.', function(done){
				var government = Government.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage = 'Government validation failed: geographicArea: Cast to ObjectID failed for value "abcd1234efgh9876" at path "geographicArea"';

                government.name = 'California State Government';
                government.foundedDate = new Date('1850-09-09');
                government.geographicArea = 'abcd1234efgh9876';
				government.governmentInstitutions = [GovernmentInstitution.create()._id, GovernmentInstitution.create()._id];
				

				Government.save(government).then(
					function(saved) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('Government.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'Government.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});


			it('Government.governmentInstitutions must be a valid Array of IDs.', function(done){
				var government = Government.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage = 'Government validation failed: governmentInstitutions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "governmentInstitutions"';

                government.name = 'California State Government';
                government.foundedDate = new Date('1850-09-09');
				government.geographicArea = GeographicArea.create()._id;
				government.governmentInstitutions = ['abcd1234efgh9876', 'abcd1234efgh9875'];
				
				Government.save(government).then(
					function(saved) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('Government.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'Government.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});					

			it('Valid Call Saves Government.', function(done){
				var government = Government.create();
				var error = null;
				var compareResult;

                government.name = 'California State Government';
                government.foundedDate = new Date('1850-09-09');
				government.geographicArea = GeographicArea.create()._id;
				government.governmentInstitutions = [GovernmentInstitution.create()._id, GovernmentInstitution.create()._id];

				Government.save(government).then(
					function(saved) {
						Government.Model.findById(government._id, function(findError, found) {
							compareResult = Government.compare(government, found);

							if (compareResult.match == false)
								error = new Error(compareResult.message);
						});
					},
					function(saveErr) {
						testFailed = 1;
						error = saveErr;
					}
				).finally(function() {
					if (error)
						done(error);
					else
						done();
				});
			});

		});

	});

	describe('Government Institution Model Tests', function() {

		describe('GovernmentInstitution.create()', function() {
		
			it('GovernmentInstitution.create() creates a Government Institution instance.', function() {
				var governmentInstitution = GovernmentInstitution.create();
				assert(typeof(governmentInstitution) === "object");
			});

			it('GovernmentInstitution.create() creates a GovernmentInstitution instance with _id field populated', function(){
				var governmentInstitution = GovernmentInstitution.create();
				assert(typeof(governmentInstitution._id) === "object" && /^[a-f\d]{24}$/i.test(governmentInstitution._id));
			});
		});

		describe('GovernmentInstitution.save()', function() {

			it('GovernmentInstitution.save() throws an error if required fields are missing.', function(done) {
				var governmentInstitution = GovernmentInstitution.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'GovernmentInstitution validation failed: parentGovernmentInstitution: parentGovernmentInstitution is required if government is empty., government: government is required if parentGovernmentInstitution is empty., name: Path `name` is required.';
                				
				GovernmentInstitution.save(governmentInstitution).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('GovernmentInstitution.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'GovernmentInstitution.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});


			it('GovermentInstitution.government must be a valid ID.', function(done){
				var governmentInstitution = GovernmentInstitution.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage = 'GovernmentInstitution validation failed: government: Cast to ObjectID failed for value "abcd1234efgh9876" at path "government", parentGovernmentInstitution: parentGovernmentInstitution is required if government is empty.';

                governmentInstitution.name = 'California State Legislature';
                governmentInstitution.description = 'The body which writes and passes laws.';
                governmentInstitution.government = 'abcd1234efgh9876';
                governmentInstitution.governmentPostions = [GovernmentPosition.create()._id, GovernmentPosition.create()._id];

				GovernmentInstitution.save(governmentInstitution).then(
					function(saved) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('GovernmentInstitution.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'GovernmentInstitution.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});


			it('GovermentInstitution.parentGovernmentInstitution must be a valid ID.', function(done){
				var governmentInstitution = GovernmentInstitution.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage = 'GovernmentInstitution validation failed: parentGovernmentInstitution: Cast to ObjectID failed for value "abcd1234efgh9876" at path "parentGovernmentInstitution", government: government is required if parentGovernmentInstitution is empty.';

                governmentInstitution.name = 'California State Assembly';
                governmentInstitution.description = 'The house of representatives for the California State Legislature.';
                governmentInstitution.parentGovernmentInstitution = 'abcd1234efgh9876';
                governmentInstitution.governmentPostions = [GovernmentPosition.create()._id, GovernmentPosition.create()._id];

				GovernmentInstitution.save(governmentInstitution).then(
					function(saved) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('GovernmentInstitution.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'GovernmentInstitution.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});


			it('GovermentInstitution.governmentPositions must be a valid Array of IDs.', function(done){
				var governmentInstitution = GovernmentInstitution.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage = 'GovernmentInstitution validation failed: governmentPositions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9876\' ]" at path "governmentPositions"';

                governmentInstitution.name = 'California State Legislature';
                governmentInstitution.description = 'The body which writes and passes laws.';
                governmentInstitution.government = Government.create()._id;
                governmentInstitution.governmentPositions = ['abcd1234efgh9876', 'abcd1234efgh9876'];

				GovernmentInstitution.save(governmentInstitution).then(
					function(saved) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('GovernmentInstitution.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'GovernmentInstitution.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});


			it('GovermentInstitution.childGovernmentInstitutions must be a valid Array of IDs.', function(done){
				var governmentInstitution = GovernmentInstitution.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage = 'GovernmentInstitution validation failed: childGovernmentInstitutions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9876\' ]" at path "childGovernmentInstitutions"';

                governmentInstitution.name = 'California State Legislature';
                governmentInstitution.description = 'The body which writes and passes laws.';
                governmentInstitution.government = Government.create()._id;
                governmentInstitution.governmentPostions = [GovernmentPosition.create()._id, GovernmentPosition.create()._id];
                governmentInstitution.childGovernmentInstitutions = ['abcd1234efgh9876', 'abcd1234efgh9876'];

				GovernmentInstitution.save(governmentInstitution).then(
					function(saved) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('GovernmentInstitution.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'GovernmentInstitution.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});


			it('Either GovernmentInstitution.government or GovernmentInstitution.parentGovernmentInstitution is required.', function(done){
				var governmentInstitution = GovernmentInstitution.create();
				var testFailed = 0;
                var error = null;

				var expectedErrorMessage = 'GovernmentInstitution validation failed: parentGovernmentInstitution: parentGovernmentInstitution is required if government is empty., government: government is required if parentGovernmentInstitution is empty.';

                governmentInstitution.name = 'California State Legislature';
                governmentInstitution.description = 'The body which writes and passes laws.';
                governmentInstitution.governmentPostions = [GovernmentPosition.create()._id, GovernmentPosition.create()._id];

				GovernmentInstitution.save(governmentInstitution).then(
					function(saved) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('GovernmentInstitution.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'GovernmentInstitution.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
                });

			});


			it('GovernmentInstitution.government and GovernmentInstitution.parentGovernmentInstitution are mutually exclusive.', function(done){
				var governmentInstitution = GovernmentInstitution.create();
				var testFailed = 0;
                var error = null;

				var expectedErrorMessage = 'GovernmentInstitution validation failed: government: government and parentGovernmentInstitution are mutually exclusive.';

                governmentInstitution.name = 'California State Legislature';
                governmentInstitution.description = 'The body which writes and passes laws.';
                governmentInstitution.governmentPostions = [GovernmentPosition.create()._id, GovernmentPosition.create()._id];
                governmentInstitution.government = Government.create()._id;
                governmentInstitution.parentGovernmentInstitution = GovernmentInstitution.create()._id;

				GovernmentInstitution.save(governmentInstitution).then(
					function(saved) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('GovernmentInstitution.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'GovernmentInstitution.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
                });

			});


			it('Valid Call Saves Government Institution.', function(done){
				var governmentInstitution = GovernmentInstitution.create();
				var error = null;
				var compareResult;

                governmentInstitution.name = 'California State Legislature';
                governmentInstitution.description = 'The body which writes and passes laws.';
                governmentInstitution.governmentPostions = [GovernmentPosition.create()._id, GovernmentPosition.create()._id];
                governmentInstitution.parentGovernmentInstitution = GovernmentInstitution.create()._id;

				GovernmentInstitution.save(governmentInstitution).then(
					function(saved) {
						GovernmentInstitution.Model.findById(governmentInstitution._id, function(findError, found) {
							compareResult = GovernmentInstitution.compare(governmentInstitution, found);

							if (compareResult.match == false)
								error = new Error(compareResult.message);
						});
					},
					function(saveErr) {
						testFailed = 1;
						error = saveErr;
					}
				).finally(function() {
					if (error)
						done(error);
					else
						done();
				});
			});

		});

	});

	describe('Government Position Model Tests', function() {

		describe('GovernmentPosition.create()', function() {
		
			it('GovernmentPosition.create() creates a GovernmentPosition instance.', function() {
				var governmentPosition = GovernmentPosition.create();
				assert(typeof(governmentPosition) === "object");
			});

			it('GovernmentPosition.create() creates a GovernmentPosition instance with _id field populated', function(){
				var governmentPosition = GovernmentPosition.create();
				assert(typeof(governmentPosition._id) === "object" && /^[a-f\d]{24}$/i.test(governmentPosition._id));
			});
		});

		describe('GovernmentPosition.save()', function() {

			it('GovernmentPosition.save() throws an error if required fields are missing.', function(done) {
				var governmentPosition = GovernmentPosition.create();
				var testFailed = 0;
				var error;

				var expectedErrorMessage = 'GovernmentPosition validation failed: title: Path `title` is required., governmentInstitution: Path `governmentInstitution` is required.';

				GovernmentPosition.save(governmentPosition).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('GovernmentPosition.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'GovernmentPosition.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('GovernmentPosition.governmentInstitution must be a valid ID.', function(done) {
				var governmentPosition = GovernmentPosition.create();
				var testFailed = 0;
				var error;

				var expectedErrorMessage = 'GovernmentPosition validation failed: governmentInstitution: Cast to ObjectID failed for value "abcd1234efgh9876" at path "governmentInstitution"';

				governmentPosition.title = 'Mayor';
				governmentPosition.description = 'The chief executive for a city.';
				governmentPosition.governmentInstitution = 'abcd1234efgh9876';

				GovernmentPosition.save(governmentPosition).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('GovernmentPosition.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'GovernmentPosition.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Valid Call Saves Government Position.', function(done){
				var governmentPosition = GovernmentPosition.create();
				var error = null;
				var compareResult;

				governmentPosition.title = 'Mayor';
				governmentPosition.description = 'The chief executive for a city.';
				governmentPosition.governmentInstitution = GovernmentInstitution.create()._id;

				GovernmentPosition.save(governmentPosition).then(
					function(saved) {
						GovernmentPosition.Model.findById(governmentPosition._id, function(findError, found) {
							compareResult = GovernmentPosition.compare(governmentPosition, found);

							if (compareResult.match == false)
								error = new Error(compareResult.message);
						});
					},
					function(saveErr) {
						testFailed = 1;
						error = saveErr;
					}
				).finally(function() {
					if (error)
						done(error);
					else
						done();
				});
			});

		});

	});



});