const assert = require('assert');

const database = require('../dist/models/database');
require('../dist/models/Modules/Poll/PollModule');
const UserAccount = require('../dist/models/Modules/User/UserAccount');
const Poll = require('../dist/models/Modules/Poll/Poll');
const PollResponse = require('../dist/models/Modules/Poll/PollResponse');
const PollOption = require('../dist/models/Modules/Poll/PollOption');
const Civilian = require('../dist/models/Modules/Poll/Civilian');
const Citizen = require('../dist/models/Modules/Poll/Citizen');
const Government = require('../dist/models/Modules/Government/Government');
const GeographicArea = require('../dist/models/Modules/Geography/GeographicArea');

describe.skip('Poll Module Tests', function() {

    before(async () => {
		await database.connect();

		await Poll.clear();
		await PollResponse.clear();
		await PollOption.clear();
		await Civilian.clear();
		await Citizen.clear();
    });
    
	describe('Poll Model Tests', function() {

		describe('Poll.create()', function() {
		
			it('Poll.create() creates a Poll instance.', function() {
				var poll = Poll.create();
				assert(typeof(poll) === "object");
			});

			it('Poll.create() creates a Poll instance with _id field populated', function(){
				var poll = Poll.create();
				assert(typeof(poll._id) === "object" && /^[a-f\d]{24}$/i.test(poll._id));
			});
		});

		describe('Poll.save()', function() {

			it('Poll.save() throws an error if required fields are missing.', function(done) {
				var poll = Poll.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Poll validation failed: pollable: Path `pollable` is required.';

				Poll.save(poll).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Poll.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Poll.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves Poll.', function(done){
				var poll = Poll.create();
				var error = null;
                var compareResult;

                poll.pollable = Government.create()._id;
                poll.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];
                poll.pollOptions = [PollOption.create()._id, PollOption.create()._id];

				Poll.save(poll).then(
					function(saved) {
						Poll.findById(poll._id).then(
							(found) => {
								compareResult = Poll.compare(poll, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							},
							(findError) => {
								error = findError;
							}
						);
					},
					function(saveErr) {
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

		describe('Poll.walk()', () => {

			var poll = Poll.create();
			var government = Government.create();

			poll.pollable = government;
			poll.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];
			poll.pollOptions = [PollOption.create()._id, PollOption.create()._id];

			government.name = 'United States of America';
			government.foundedDate = new Date('1776-07-04');
			government.createdDate = new Date();
			government.geographicArea = GeographicArea.create();
			government.poll = poll;

			before((done) => {
				Poll.save(poll).then(() => {
					Government.save(government).finally(done);
				});
			});

			it('Poll.walk(poll, \'pollable\') returns an instance of pollable.', (done) => {
				let expectedInstance = government;
				let error;

				Poll.walk(poll, 'pollable').then(
					(foundInstance) => {
						if (foundInstance == null)
							error = new Error('Poll.walk() did not return an instance.')
						else {
							if (!foundInstance._id.equals(expectedInstance._id)) {
								error = new Error ('Poll.walk returned an instance, but it is not the right one.');
							}
						}
					},
					(walkError) => {
						error = walkError;
					}
				).finally(() => {
					if (error)
						done(error)
					else 
						done();
				});
			});

		});

	});
    
	describe('PollResponse Model Tests', function() {

		describe('PollResponse.create()', function() {
		
			it('PollResponse.create() creates a PollResponse instance.', function() {
				var pollResponse = PollResponse.create();
				assert(typeof(pollResponse) === "object");
			});

			it('PollResponse.create() creates a PollResponse instance with _id field populated', function(){
				var pollResponse = PollResponse.create();
				assert(typeof(pollResponse._id) === "object" && /^[a-f\d]{24}$/i.test(pollResponse._id));
			});
		});

		describe('PollResponse.save()', function() {

			it('PollResponse.save() throws an error if required fields are missing.', function(done) {
				var pollResponse = PollResponse.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'PollResponse validation failed: pollOption: Path `pollOption` is required., poll: Path `poll` is required., civilian: Path `civilian` is required., date: Path `date` is required.';

				PollResponse.save(pollResponse).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('PollResponse.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'PollResponse.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
            it('PollResponse.civilian must be a valid ID.', function(done) {
				var pollResponse = PollResponse.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'PollResponse validation failed: civilian: Cast to ObjectID failed for value "abcd1234efgh9876" at path "civilian"';

                pollResponse.comment = 'I very strongly disapprove of this thing.';
                pollResponse.latest = true;
                pollResponse.civilian = 'abcd1234efgh9876';
                pollResponse.citizen = Citizen.create()._id;
                pollResponse.poll = Poll.create()._id;
				pollResponse.pollOption = PollOption.create()._id;
				pollResponse.date = new Date();

                PollResponse.save(pollResponse).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('PollResponse.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'PollResponse.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });
    
            it('PollResponse.citizen must be a valid ID.', function(done) {
				var pollResponse = PollResponse.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'PollResponse validation failed: citizen: Cast to ObjectID failed for value "abcd1234efgh9876" at path "citizen"';

                pollResponse.comment = 'I very strongly disapprove of this thing.';
                pollResponse.latest = true;
                pollResponse.civilian = Civilian.create()._id;
                pollResponse.citizen = 'abcd1234efgh9876';
                pollResponse.poll = Poll.create()._id;
                pollResponse.pollOption = PollOption.create()._id;
				pollResponse.date = new Date();

                PollResponse.save(pollResponse).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('PollResponse.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'PollResponse.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });
    
            it('PollResponse.poll must be a valid ID.', function(done) {
				var pollResponse = PollResponse.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'PollResponse validation failed: poll: Cast to ObjectID failed for value "abcd1234efgh9876" at path "poll"';

                pollResponse.comment = 'I very strongly disapprove of this thing.';
                pollResponse.latest = true;
                pollResponse.civilian = Civilian.create()._id;
                pollResponse.citizen = Citizen.create()._id;
                pollResponse.poll = 'abcd1234efgh9876';
                pollResponse.pollOption = PollOption.create()._id;
				pollResponse.date = new Date();

                PollResponse.save(pollResponse).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('PollResponse.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'PollResponse.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });
    
            it('PollResponse.pollOption must be a valid ID.', function(done) {
				var pollResponse = PollResponse.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'PollResponse validation failed: pollOption: Cast to ObjectID failed for value "abcd1234efgh9876" at path "pollOption"';

                pollResponse.comment = 'I very strongly disapprove of this thing.';
                pollResponse.latest = true;
                pollResponse.civilian = Civilian.create()._id;
                pollResponse.citizen = Citizen.create()._id;
                pollResponse.poll = Poll.create()._id;
                pollResponse.pollOption = 'abcd1234efgh9876';
				pollResponse.date = new Date();

                PollResponse.save(pollResponse).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('PollResponse.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'PollResponse.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });
    
			it('Valid Call Saves Poll Response.', function(done){
				var pollResponse = PollResponse.create();
				var error = null;
                var compareResult;
                
                pollResponse.comment = 'I very strongly disapprove of this thing.';
                pollResponse.latest = true;
                pollResponse.civilian = Civilian.create()._id;
                pollResponse.citizen = Citizen.create()._id;
                pollResponse.poll = Poll.create()._id;
                pollResponse.pollOption = PollOption.create()._id;
				pollResponse.date = new Date();

				PollResponse.save(pollResponse).then(
					(saved) => {
						PollResponse.findById(pollResponse._id).then(
							(found) => {
								compareResult = PollResponse.compare(pollResponse, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							},
							(findError) => {
								error = findError;
							}
						);
					},
					(saveErr) => {
						error = saveErr;
					}
				).finally(() => {
					if (error)
						done(error);
					else
						done();
				});
			});

		});

	});
    
	describe('PollOption Model Tests', function() {

		describe('PollOption.create()', function() {
		
			it('PollOption.create() creates a PollOption instance.', function() {
				var pollOption = PollOption.create();
				assert(typeof(pollOption) === "object");
			});

			it('PollOption.create() creates a PollOption instance with _id field populated', function(){
				var pollOption = PollOption.create();
				assert(typeof(pollOption._id) === "object" && /^[a-f\d]{24}$/i.test(pollOption._id));
			});
		});

		describe('PollOption.save()', function() {

			it('PollOption.save() throws an error if required fields are missing.', function(done) {
				var pollOption = PollOption.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'PollOption validation failed: name: Path `name` is required.';

				PollOption.save(pollOption).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('PollOption.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'PollOption.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves Poll Option.', function(done){
				var pollOption = PollOption.create();
				var error = null;
                var compareResult;

                pollOption.name = 'Yay';
                pollOption.positive = true;
                pollOption.negative = false;
                pollOption.weight = 1;

				PollOption.save(pollOption).then(
					(saved) => {
						PollOption.findById(pollOption._id).then(
							(found) => {
								compareResult = PollOption.compare(pollOption, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							},
							(findError) => {
								error = findError;
							}
						);
					},
					(saveErr) => {
						error = saveErr;
					}
				).finally(() => {
					if (error)
						done(error);
					else
						done();
				});
			});

		});

	});
    
	describe('Civilian Model Tests', function() {

		describe('Civilian.create()', function() {
		
			it('Civilian.create() creates a Civilian instance.', function() {
				var civilian = Civilian.create();
				assert(typeof(civilian) === "object");
			});

			it('Civilian.create() creates a Civilian instance with _id field populated', function(){
				var civilian = Civilian.create();
				assert(typeof(civilian._id) === "object" && /^[a-f\d]{24}$/i.test(civilian._id));
			});
		});

		describe('Civilian.save()', function() {

			it('Civilian.save() throws an error if required fields are missing.', function(done) {
				var civilian = Civilian.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Civilian validation failed: userAccount: Path `userAccount` is required.';

				Civilian.save(civilian).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Civilian.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Civilian.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Civilian.userAccount must be a valid ID.', function(done) {
				var civilian = Civilian.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Civilian validation failed: userAccount: Cast to ObjectID failed for value "abcd1234efgh9876" at path "userAccount"';

				civilian.userAccount = 'abcd1234efgh9876';
				civilian.startDate = new Date();
                civilian.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];

				Civilian.save(civilian).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Civilian.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Civilian.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Civilian.pollResponses must be a valid Array of IDs.', function(done) {
				var civilian = Civilian.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Civilian validation failed: pollResponses: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "pollResponses"';
                
                civilian.userAccount = UserAccount.create()._id;
				civilian.startDate = new Date();
                civilian.pollResponses = ['abcd1234efgh9876', 'abcd1234efgh9875'];

				Civilian.save(civilian).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Civilian.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Civilian.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves Civilian.', function(done){
				var civilian = Civilian.create();
				var error = null;
                var compareResult;

                civilian.userAccount = UserAccount.create()._id;
				civilian.startDate = new Date();
                civilian.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];

				Civilian.save(civilian).then(
					(saved) => {
						Civilian.findById(civilian._id).then(
							(found) => {
								compareResult = Civilian.compare(civilian, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							},
							(findError) => {
								error = findError;
							}
						);
					},
					(saveErr) => {
						error = saveErr;
					}
				).finally(() => {
					if (error)
						done(error);
					else
						done();
				});
			});

		});

	});
    
	describe('Citizen Model Tests', function() {

		describe('Citizen.create()', function() {
		
			it('Citizen.create() creates a Citizen instance.', function() {
				var citizen = Citizen.create();
				assert(typeof(citizen) === "object");
			});

			it('Citizen.create() creates a Citizen instance with _id field populated', function(){
				var citizen = Citizen.create();
				assert(typeof(citizen._id) === "object" && /^[a-f\d]{24}$/i.test(citizen._id));
			});
		});

		describe('Citizen.save()', function() {

			it('Citizen.save() throws an error if required fields are missing.', function(done) {
				var citizen = Citizen.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Citizen validation failed: userAccount: Path `userAccount` is required.';

				Citizen.save(citizen).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Citizen.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Citizen.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Citizen.userAccount must be a valid ID.', function(done) {
				var citizen = Citizen.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Citizen validation failed: userAccount: Cast to ObjectID failed for value "abcd1234efgh9876" at path "userAccount"';

                citizen.userAccount = 'abcd1234efgh9876';
				citizen.startDate = new Date();
				citizen.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];

				Citizen.save(citizen).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Citizen.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Citizen.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Citizen.pollResponses must be a valid Array of IDs.', function(done) {
				var citizen = Citizen.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Citizen validation failed: pollResponses: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "pollResponses"';
                
                citizen.userAccount = UserAccount.create()._id;
				citizen.startDate = new Date();
                citizen.pollResponses = ['abcd1234efgh9876', 'abcd1234efgh9875'];

				Citizen.save(citizen).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Citizen.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Citizen.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves Citizen.', function(done){
				var citizen = Citizen.create();
				var error = null;
                var compareResult;

                citizen.userAccount = UserAccount.create()._id;
				citizen.startDate = new Date();
                citizen.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];

				Citizen.save(citizen).then(
					(saved) => {
						Citizen.findById(citizen._id).then(
							(found) => {
								compareResult = Citizen.compare(citizen, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							},
							(findError) => {
								error = findError;
							}
						);
					},
					(saveErr) => {
						error = saveErr;
					}
				).finally(() => {
					if (error)
						done(error);
					else
						done();
				});
			});

		});

	});

	after(() => {
		database.close();
	});

});