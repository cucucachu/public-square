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
var EffectivePositionDefinition = require('../models/Modules/Government/EffectivePositionDefinition');
var PositionDefinition = require('../models/Modules/Government/PositionDefinition');
var TermDefinition = require('../models/Modules/Government/TermDefinition');
var GovernmentPower = require('../models/Modules/Government/GovernmentPower');
var HiringProcess = require('../models/Modules/Government/HiringProcess');

describe('Government Module Tests', function() {
	
	before(function(done) {
		Government.clear().then(
			function() {
				GeographicArea.clear().then(
					function() {
						GovernmentPosition.clear().then(
							function() {
								GovernmentInstitution.clear().then(
									function() {
										EffectivePositionDefinition.clear().then(
											function() {
												PositionDefinition.clear().then(
													function() {
														TermDefinition.clear().then(
															function() {
																GovernmentPower.clear().then(
																	function() {
																		HiringProcess.clear().then(done, done);
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

				var expectedErrorMessage = 'GovernmentPosition validation failed: governmentInstitution: Path `governmentInstitution` is required., title: Path `title` is required.';

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

			it('GovernmentPosition.effectivePositionDefinitions must be a valid Array of IDs.', function(done) {
				var governmentPosition = GovernmentPosition.create();
				var testFailed = 0;
				var error;

				var expectedErrorMessage = 'GovernmentPosition validation failed: effectivePositionDefinitions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "effectivePositionDefinitions"';

				governmentPosition.title = 'Mayor';
				governmentPosition.description = 'The chief executive for a city.';
				governmentPosition.governmentInstitution = GovernmentInstitution.create()._id;
				governmentPosition.effectivePositionDefinitions = ['abcd1234efgh9876', 'abcd1234efgh9875'];

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
				governmentPosition.effectivePositionDefinitions = [EffectivePositionDefinition.create()._id, EffectivePositionDefinition.create()._id];

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

	describe('Effective Position Definition Model Tests', function() {

		describe('EffectivePositionDefinition.create()', function() {
		
			it('EffectivePositionDefinition.create() creates a EffectivePositionDefinition instance.', function() {
				var effectivePositionDefinition = EffectivePositionDefinition.create();
				assert(typeof(effectivePositionDefinition) === "object");
			});

			it('EffectivePositionDefinition.create() creates a EffectivePositionDefinition instance with _id field populated', function() {
				var effectivePositionDefinition = EffectivePositionDefinition.create();
				assert(typeof(effectivePositionDefinition._id) === "object" && /^[a-f\d]{24}$/i.test(effectivePositionDefinition._id));
			});
		});

		describe('EffectivePositionDefinition.save()', function() {

			it('EffectivePositionDefinition.save() throws an error if required fields are missing.', function(done) {
				var effectivePositionDefinition = EffectivePositionDefinition.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'EffectivePositionDefinition validation failed: positionDefinition: Path `positionDefinition` is required., governmentPosition: Path `governmentPosition` is required., startDate: Path `startDate` is required.';

				EffectivePositionDefinition.save(effectivePositionDefinition).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('EffectivePositionDefinition.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'EffectivePositionDefinition.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('EffectivePositionDefinition.positionDefinition must be a valid ID.', function(done) {
				var effectivePositionDefinition = EffectivePositionDefinition.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'EffectivePositionDefinition validation failed: positionDefinition: Cast to ObjectID failed for value "abcd1234efgh9876" at path "positionDefinition"';

				effectivePositionDefinition.startDate = new Date('1999-12-21');
				effectivePositionDefinition.endDate = new Date('2018-01-01');
				effectivePositionDefinition.positionDefinition = 'abcd1234efgh9876';
				effectivePositionDefinition.governmentPosition = GovernmentPosition.create()._id;
				
				EffectivePositionDefinition.save(effectivePositionDefinition).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('EffectivePositionDefinition.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'EffectivePositionDefinition.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('EffectivePositionDefinition.governmentPosition must be a valid ID.', function(done) {
				var effectivePositionDefinition = EffectivePositionDefinition.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'EffectivePositionDefinition validation failed: governmentPosition: Cast to ObjectID failed for value "abcd1234efgh9876" at path "governmentPosition"';

				effectivePositionDefinition.startDate = new Date('1999-12-21');
				effectivePositionDefinition.endDate = new Date('2018-01-01');
				effectivePositionDefinition.positionDefinition = PositionDefinition.create()._id;
				effectivePositionDefinition.governmentPosition = 'abcd1234efgh9876';
				
				EffectivePositionDefinition.save(effectivePositionDefinition).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('EffectivePositionDefinition.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'EffectivePositionDefinition.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Valid Call Saves Effective Position Definition.', function(done){
				var effectivePositionDefinition = EffectivePositionDefinition.create();
				var error = null;
				var compareResult;
				
				effectivePositionDefinition.startDate = new Date('1999-12-21');
				effectivePositionDefinition.endDate = new Date('2018-01-01');
				effectivePositionDefinition.positionDefinition = PositionDefinition.create()._id;
				effectivePositionDefinition.governmentPosition = GovernmentPosition.create()._id;

				EffectivePositionDefinition.save(effectivePositionDefinition).then(
					function(saved) {
						EffectivePositionDefinition.Model.findById(effectivePositionDefinition._id, function(findError, found) {
							compareResult = EffectivePositionDefinition.compare(effectivePositionDefinition, found);

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

	describe('Position Definition Model Tests', function() {

		describe('PositionDefinition.create()', function() {
		
			it('PositionDefinition.create() creates a PositionDefinition instance.', function() {
				var positionDefinition = PositionDefinition.create();
				assert(typeof(positionDefinition) === "object");
			});

			it('PositionDefinition.create() creates a PositionDefinition instance with _id field populated', function() {
				var positionDefinition = PositionDefinition.create();
				assert(typeof(positionDefinition._id) === "object" && /^[a-f\d]{24}$/i.test(positionDefinition._id));
			});
		});

		describe('PositionDefinition.save()', function() {

			it('PositionDefinition.save() throws an error if required fields are missing.', function(done) {
				var positionDefinition = PositionDefinition.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'PositionDefinition validation failed: name: Path `name` is required.';

				PositionDefinition.save(positionDefinition).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('PositionDefinition.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'PositionDefinition.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('PositionDefinition.termDefinition must be a valid ID.', function(done) {
				var positionDefinition = PositionDefinition.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'PositionDefinition validation failed: termDefinition: Cast to ObjectID failed for value "abcd1234efgh9876" at path "termDefinition"';

				positionDefinition.name = 'President';
				positionDefinition.effectivePositionDefinitions = [EffectivePositionDefinition.create()._id, EffectivePositionDefinition.create()._id];
				positionDefinition.termDefinition = 'abcd1234efgh9876';
				positionDefinition.governmentPowers = [GovernmentPower.create()._id, GovernmentPower.create()._id];
				positionDefinition.hiringProcesses = [HiringProcess.create()._id, HiringProcess.create._id];

				PositionDefinition.save(positionDefinition).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('PositionDefinition.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'PositionDefinition.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('PositionDefinition.effectivePositionDefinitions must be a valid Array of IDs.', function(done) {
				var positionDefinition = PositionDefinition.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'PositionDefinition validation failed: effectivePositionDefinitions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "effectivePositionDefinitions"';

				positionDefinition.name = 'President';
				positionDefinition.effectivePositionDefinitions = ['abcd1234efgh9876', 'abcd1234efgh9875'];
				positionDefinition.termDefinition = TermDefinition.create()._id;
				positionDefinition.governmentPowers = [GovernmentPower.create()._id, GovernmentPower.create()._id];
				positionDefinition.hiringProcesses = [HiringProcess.create()._id, HiringProcess.create._id];

				PositionDefinition.save(positionDefinition).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('PositionDefinition.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'PositionDefinition.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('PositionDefinition.governmentPowers must be a valid Array of IDs.', function(done) {
				var positionDefinition = PositionDefinition.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'PositionDefinition validation failed: governmentPowers: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "governmentPowers"';

				positionDefinition.name = 'President';
				positionDefinition.effectivePositionDefinitions = [EffectivePositionDefinition.create()._id, EffectivePositionDefinition.create()._id];
				positionDefinition.termDefinition = TermDefinition.create()._id;
				positionDefinition.governmentPowers = ['abcd1234efgh9876', 'abcd1234efgh9875'];
				positionDefinition.hiringProcesses = [HiringProcess.create()._id, HiringProcess.create._id];

				PositionDefinition.save(positionDefinition).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('PositionDefinition.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'PositionDefinition.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('PositionDefinition.termDefinition must be a valid ID.', function(done) {
				var positionDefinition = PositionDefinition.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'PositionDefinition validation failed: hiringProcesses: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "hiringProcesses"';

				positionDefinition.name = 'President';
				positionDefinition.effectivePositionDefinitions = [EffectivePositionDefinition.create()._id, EffectivePositionDefinition.create()._id];
				positionDefinition.termDefinition = TermDefinition.create()._id;
				positionDefinition.governmentPowers = [GovernmentPower.create()._id, GovernmentPower.create()._id];
				positionDefinition.hiringProcesses = ['abcd1234efgh9876', 'abcd1234efgh9875'];

				PositionDefinition.save(positionDefinition).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('PositionDefinition.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'PositionDefinition.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Valid Call Saves  Position Definition.', function(done){
				var positionDefinition = PositionDefinition.create();
				var error = null;
				var compareResult;

				positionDefinition.name = 'President';
				positionDefinition.effectivePositionDefinitions = [EffectivePositionDefinition.create()._id, EffectivePositionDefinition.create()._id];
				positionDefinition.termDefinition = TermDefinition.create()._id;
				positionDefinition.governmentPowers = [GovernmentPower.create()._id, GovernmentPower.create()._id];
				positionDefinition.hiringProcesses = [HiringProcess.create()._id, HiringProcess.create()._id];

				PositionDefinition.save(positionDefinition).then(
					function(saved) {
						PositionDefinition.Model.findById(positionDefinition._id, function(findError, found) {
							compareResult = PositionDefinition.compare(positionDefinition, found);

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

	describe('Term Definition Model Tests', function() {

		describe('TermDefinition.create()', function() {
		
			it('TermDefinition.create() creates a TermDefinition instance.', function() {
				var termDefinition = TermDefinition.create();
				assert(typeof(termDefinition) === "object");
			});

			it('TermDefinition.create() creates a TermDefinition instance with _id field populated', function() {
				var termDefinition = TermDefinition.create();
				assert(typeof(termDefinition._id) === "object" && /^[a-f\d]{24}$/i.test(termDefinition._id));
			});
		});

		describe('TermDefinition.save()', function() {

			it('TermDefinition.save() throws an error if required fields are missing.', function(done) {
				var termDefinition = TermDefinition.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'TermDefinition validation failed: termLimit: Path `termLimit` is required., termLength: Path `termLength` is required.';

				TermDefinition.save(termDefinition).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('TermDefinition.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'TermDefinition.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('TermDefinition.positionDefinition must be a valid ID.', function(done) {
				var termDefinition = TermDefinition.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'TermDefinition validation failed: positionDefinition: Cast to ObjectID failed for value "abcd1234efgh9876" at path "positionDefinition"';

				termDefinition.termLength = 4;
				termDefinition.termLimit = 2;
				termDefinition.positionDefinition = 'abcd1234efgh9876';

				TermDefinition.save(termDefinition).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('TermDefinition.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'TermDefinition.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Valid Call Saves Term Definition.', function(done){
				var termDefinition = TermDefinition.create();
				var error = null;
				var compareResult;

				termDefinition.termLength = 4;
				termDefinition.termLimit = 2;
				termDefinition.positionDefinition = PositionDefinition.create()._id;

				TermDefinition.save(termDefinition).then(
					function(saved) {
						TermDefinition.Model.findById(termDefinition._id, function(findError, found) {
							compareResult = TermDefinition.compare(termDefinition, found);

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

	describe('Government Power Model Tests', function() {

		describe('GovernmentPower.create()', function() {
		
			it('GovernmentPower.create() creates a GovernmentPower instance.', function() {
				var governmentPower = GovernmentPower.create();
				assert(typeof(governmentPower) === "object");
			});

			it('GovernmentPower.create() creates a GovernmentPower instance with _id field populated', function() {
				var governmentPower = GovernmentPower.create();
				assert(typeof(governmentPower._id) === "object" && /^[a-f\d]{24}$/i.test(governmentPower._id));
			});
		});

		describe('GovernmentPower.save()', function() {

			it('GovernmentPower.save() throws an error if required fields are missing.', function(done) {
				var governmentPower = GovernmentPower.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'GovernmentPower validation failed: name: Path `name` is required.';

				GovernmentPower.save(governmentPower).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('GovernmentPower.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'GovernmentPower.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('GovernmentPower.positionDefinition must be a valid Array of IDs.', function(done) {
				var governmentPower = GovernmentPower.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'GovernmentPower validation failed: positionDefinitions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "positionDefinitions"';

				governmentPower.name = 'Legislative';
				governmentPower.description = 'Writes and votes on laws.';
				governmentPower.positionDefinitions = ['abcd1234efgh9876', 'abcd1234efgh9875'];

				GovernmentPower.save(governmentPower).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('GovernmentPower.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'GovernmentPower.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Valid Call Saves Government Power.', function(done){
				var governmentPower = GovernmentPower.create();
				var error = null;
				var compareResult;

				governmentPower.name = 'Legislative';
				governmentPower.description = 'Writes and votes on laws.';
				governmentPower.positionDefinitions = [PositionDefinition.create()._id, PositionDefinition.create()._id];

				GovernmentPower.save(governmentPower).then(
					function(saved) {
						GovernmentPower.Model.findById(governmentPower._id, function(findError, found) {
							compareResult = GovernmentPower.compare(governmentPower, found);

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

	describe('Hiring Process Model Tests', function() {

		describe('HiringProcess.create()', function() {
		
			it('HiringProcess.create() creates a HiringProcess instance.', function() {
				var hiringProcess = HiringProcess.create();
				assert(typeof(hiringProcess) === "object");
			});

			it('HiringProcess.create() creates a HiringProcess instance with _id field populated', function() {
				var hiringProcess = HiringProcess.create();
				assert(typeof(hiringProcess._id) === "object" && /^[a-f\d]{24}$/i.test(hiringProcess._id));
			});
		});

		describe('HiringProcess.save()', function() {

			it('HiringProcess.save() throws an error if required fields are missing.', function(done) {
				var hiringProcess = HiringProcess.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'HiringProcess validation failed: name: Path `name` is required.';

				HiringProcess.save(hiringProcess).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('HiringProcess.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'HiringProcess.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('HiringProcess.positionDefinition must be a valid Array of IDs.', function(done) {
				var hiringProcess = HiringProcess.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'HiringProcess validation failed: positionDefinitions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "positionDefinitions"';

				hiringProcess.name = 'Direct Election';
				hiringProcess.description = 'Strict majority election by voters.';
				hiringProcess.positionDefinitions = ['abcd1234efgh9876', 'abcd1234efgh9875'];

				HiringProcess.save(hiringProcess).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('HiringProcess.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'HiringProcess.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Valid Call Saves Hiring Process.', function(done){
				var hiringProcess = HiringProcess.create();
				var error = null;
				var compareResult;

				hiringProcess.name = 'Direct Election';
				hiringProcess.description = 'Strict majority election by voters.';
				hiringProcess.positionDefinitions = [PositionDefinition.create()._id, PositionDefinition.create()._id];

				HiringProcess.save(hiringProcess).then(
					function(saved) {
						HiringProcess.Model.findById(hiringProcess._id, function(findError, found) {
							compareResult = HiringProcess.compare(hiringProcess, found);

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