const assert = require('assert');

const database = require('../dist/models/database');
require('../dist/models/Modules/Government/Executive/ExecutiveModule');
const Executive = require('../dist/models/Modules/Government/Executive/Executive');
const ExecutiveAction = require('../dist/models/Modules/Government/Executive/ExecutiveAction');
const IndividualExecutiveAction = require('../dist/models/Modules/Government/Executive/IndividualExecutiveAction');
const GroupExecutiveAction = require('../dist/models/Modules/Government/Executive/GroupExecutiveAction');
const ExecutiveVote = require('../dist/models/Modules/Government/Executive/ExecutiveVote');
const IndividualExecutiveVote = require('../dist/models/Modules/Government/Executive/IndividualExecutiveVote');
const ExecutiveVoteOption = require('../dist/models/Modules/Government/Executive/ExecutiveVoteOption');
const OccupiedPosition = require('../dist/models/Modules/Government/OccupiedPosition');
const Poll = require('../dist/models/Modules/Poll/Poll');

describe.skip('Executive Module Tests', function() {

    before(async () => {
		await database.connect();

		await Executive.clear();
		await ExecutiveAction.clear();
		await ExecutiveVote.clear();
		await IndividualExecutiveAction.clear();
		await ExecutiveVoteOption.clear();
    });
    
	describe('Executive Model Tests', function() {

		describe('Executive.create()', function() {
		
			it('Executive.create() creates a Executive instance.', function() {
				var executive = Executive.create();
				assert(typeof(executive) === "object");
			});

			it('Executive.create() creates a Executive instance with _id field populated', function(){
				var executive = Executive.create();
				assert(typeof(executive._id) === "object" && /^[a-f\d]{24}$/i.test(executive._id));
			});
		});

		describe('Executive.save()', function() {

			it('Executive.save() throws an error if required fields are missing.', function(done) {
				var executive = Executive.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Executive validation failed: occupiedPosition: Path `occupiedPosition` is required.';
                
				Executive.save(executive).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Executive.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Executive.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
            it('Executive.occupiedPosition must be a valid ID.', function(done) {
                var executive = Executive.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'Executive validation failed: occupiedPosition: Cast to ObjectID failed for value "abcd1234efgh9876" at path "occupiedPosition"';

                executive.occupiedPosition = 'abcd1234efgh9876';
                executive.executiveActions = [IndividualExecutiveAction.create()._id, GroupExecutiveAction.create()._id];
                executive.individualExecutiveVotes = [IndividualExecutiveVote.create()._id, IndividualExecutiveVote.create()._id];

                Executive.save(executive).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('Executive.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'Executive.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });
    
            it('Executive.executiveActions must be a valid Array of IDs.', function(done) {
                var executive = Executive.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'Executive validation failed: executiveActions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "executiveActions"';

                executive.occupiedPosition = OccupiedPosition.create()._id;
                executive.executiveActions = ['abcd1234efgh9876', 'abcd1234efgh9875'];
                executive.individualExecutiveVotes = [IndividualExecutiveVote.create()._id, IndividualExecutiveVote.create()._id];

                Executive.save(executive).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('Executive.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'Executive.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });
    
            it('Executive.individualExecutiveVotes must be a valid Array of IDs.', function(done) {
                var executive = Executive.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'Executive validation failed: individualExecutiveVotes: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "individualExecutiveVotes"';

                executive.occupiedPosition = OccupiedPosition.create()._id;
                executive.executiveActions = [IndividualExecutiveAction.create()._id, GroupExecutiveAction.create()._id];
                executive.individualExecutiveVotes = ['abcd1234efgh9876', 'abcd1234efgh9875'];

                Executive.save(executive).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('Executive.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'Executive.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });

			it('Valid Call Saves Executive.', function(done){
                var executive = Executive.create();
				var error = null;
				var compareResult;

                executive.occupiedPosition = OccupiedPosition.create()._id;
                executive.executiveActions = [IndividualExecutiveAction.create()._id, GroupExecutiveAction.create()._id];
                executive.individualExecutiveVotes = [IndividualExecutiveVote.create()._id, IndividualExecutiveVote.create()._id];

				Executive.save(executive).then(
					(saved) => {
						Executive.findById(executive._id).then(
							(found) => {
								compareResult = Executive.compare(executive, found);

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
    
	describe('ExecutiveAction Model Tests', function() {

		describe('ExecutiveAction.create()', function() {

			it('You cannot created an instance of an abstract class.', function() {
				let expectedErrorMessage = 'You cannot create an instance of an abstract class.';
	
				try {
					ExecutiveAction.create();
				}
				catch(error) {
					if (error.message != expectedErrorMessage) {
						throw new Error('ExecutiveAction.create() did not throw the expected error.\n' +
							'Expected: ' + expectedErrorMessage + '\n' + 
							'Actual:   ' + error.message
						);
					}
					else {
						return true;
					}
				}
	
				throw new Error('ExecutiveAction.create() should have thrown the error: ' + expectedErrorMessage);
			});
		});

	});
    
	describe('IndividualExecutiveAction Model Tests', function() {

		describe('IndividualExecutiveAction.create()', function() {
		
			it('IndividualExecutiveAction.create() creates a IndividualExecutiveAction instance.', function() {
				var individualExecutiveAction = IndividualExecutiveAction.create();
				assert(typeof(individualExecutiveAction) === "object");
			});

			it('IndividualExecutiveAction.create() creates a IndividualExecutiveAction instance with _id field populated', function(){
				var individualExecutiveAction = IndividualExecutiveAction.create();
				assert(typeof(individualExecutiveAction._id) === "object" && /^[a-f\d]{24}$/i.test(individualExecutiveAction._id));
			});
		});

		describe('IndividualExecutiveAction.save()', function() {

			it('IndividualExecutiveAction.save() throws an error if required fields are missing.', function(done) {
				var individualExecutiveAction = IndividualExecutiveAction.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'IndividualExecutiveAction validation failed: text: Path `text` is required., name: Path `name` is required., poll: Path `poll` is required.';

				IndividualExecutiveAction.save(individualExecutiveAction).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('IndividualExecutiveAction.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'IndividualExecutiveAction.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('IndividualExecutiveAction.effectiveDate must be greater than or equal to IndividualExecutiveAction.passedDate.', function(done) {
				var individualExecutiveAction = IndividualExecutiveAction.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'IndividualExecutiveAction validation failed: effectiveDate: Effective Date must be greater than or equal to Passed Date.';

                individualExecutiveAction.name = 'Give Candy to the Babies Act';
                individualExecutiveAction.text = 'Every baby gets a candy.';
                individualExecutiveAction.passedDate = new Date('2020-01-01');
				individualExecutiveAction.effectiveDate = new Date('2010-01-01');
				individualExecutiveAction.poll = Poll.create()._id;
                individualExecutiveAction.executives = [Executive.create()._id, Executive.create()._id];

				IndividualExecutiveAction.save(individualExecutiveAction).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('IndividualExecutiveAction.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'IndividualExecutiveAction.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('IndividualExecutiveAction.executives is a valid Array of IDs.', function(done) {
				var individualExecutiveAction = IndividualExecutiveAction.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'IndividualExecutiveAction validation failed: executives: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "executives"';

                individualExecutiveAction.name = 'Give Candy to the Babies Act';
                individualExecutiveAction.text = 'Every baby gets a candy.';
                individualExecutiveAction.passedDate = new Date('2020-01-01');
                individualExecutiveAction.effectiveDate = new Date('2020-01-01');
				individualExecutiveAction.poll = Poll.create()._id;
                individualExecutiveAction.executives = ['abcd1234efgh9876', 'abcd1234efgh9875'];

				IndividualExecutiveAction.save(individualExecutiveAction).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('IndividualExecutiveAction.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'IndividualExecutiveAction.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves IndividualExecutiveAction.', function(done){
				var individualExecutiveAction = IndividualExecutiveAction.create();
				var error = null;
                var compareResult;

                individualExecutiveAction.name = 'Give Candy to the Babies Act';
                individualExecutiveAction.text = 'Every baby gets a candy.';
                individualExecutiveAction.passedDate = new Date('2020-01-01');
                individualExecutiveAction.effectiveDate = new Date('2020-01-01');
				individualExecutiveAction.poll = Poll.create()._id;
                individualExecutiveAction.executives = [Executive.create()._id, Executive.create()._id];

				IndividualExecutiveAction.save(individualExecutiveAction).then(
					(saved) => {
						IndividualExecutiveAction.findById(individualExecutiveAction._id).then(
							(found) => {
								compareResult = IndividualExecutiveAction.compare(individualExecutiveAction, found);

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
    
	describe('GroupExecutiveAction Model Tests', function() {

		describe('GroupExecutiveAction.create()', function() {
		
			it('GroupExecutiveAction.create() creates a GroupExecutiveAction instance.', function() {
				var groupExecutiveAction = GroupExecutiveAction.create();
				assert(typeof(groupExecutiveAction) === "object");
			});

			it('GroupExecutiveAction.create() creates a GroupExecutiveAction instance with _id field populated', function(){
				var groupExecutiveAction = GroupExecutiveAction.create();
				assert(typeof(groupExecutiveAction._id) === "object" && /^[a-f\d]{24}$/i.test(groupExecutiveAction._id));
			});
		});

		describe('GroupExecutiveAction.save()', function() {

			it('GroupExecutiveAction.save() throws an error if required fields are missing.', function(done) {
				var groupExecutiveAction = GroupExecutiveAction.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'GroupExecutiveAction validation failed: text: Path `text` is required., name: Path `name` is required., poll: Path `poll` is required.';

				GroupExecutiveAction.save(groupExecutiveAction).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('GroupExecutiveAction.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'GroupExecutiveAction.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('GroupExecutiveAction.effectiveDate must be greater than or equal to GroupExecutiveAction.passedDate.', function(done) {
				var groupExecutiveAction = GroupExecutiveAction.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'GroupExecutiveAction validation failed: effectiveDate: Effective Date must be greater than or equal to Passed Date.';

                groupExecutiveAction.name = 'Give Candy to the Babies Act';
                groupExecutiveAction.text = 'Every baby gets a candy.';
                groupExecutiveAction.passedDate = new Date('2020-01-01');
				groupExecutiveAction.effectiveDate = new Date('2010-01-01');
				groupExecutiveAction.poll = Poll.create()._id;
                groupExecutiveAction.executives = [Executive.create()._id, Executive.create()._id];
                groupExecutiveAction.executiveVotes = [ExecutiveVote.create()._id, ExecutiveVote.create()._id];

				GroupExecutiveAction.save(groupExecutiveAction).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('GroupExecutiveAction.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'GroupExecutiveAction.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('GroupExecutiveAction.executives is a valid Array of IDs.', function(done) {
				var groupExecutiveAction = GroupExecutiveAction.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'GroupExecutiveAction validation failed: executives: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "executives"';

                groupExecutiveAction.name = 'Give Candy to the Babies Act';
                groupExecutiveAction.text = 'Every baby gets a candy.';
                groupExecutiveAction.passedDate = new Date('2020-01-01');
                groupExecutiveAction.effectiveDate = new Date('2020-01-01');
				groupExecutiveAction.poll = Poll.create()._id;
                groupExecutiveAction.executives = ['abcd1234efgh9876', 'abcd1234efgh9875'];
                groupExecutiveAction.executiveVotes = [ExecutiveVote.create()._id, ExecutiveVote.create()._id];

				GroupExecutiveAction.save(groupExecutiveAction).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('GroupExecutiveAction.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'GroupExecutiveAction.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('GroupExecutiveAction.executiveVotes is a valid Array of IDs.', function(done) {
				var groupExecutiveAction = GroupExecutiveAction.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'GroupExecutiveAction validation failed: executiveVotes: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "executiveVotes"';

                groupExecutiveAction.name = 'Give Candy to the Babies Act';
                groupExecutiveAction.text = 'Every baby gets a candy.';
                groupExecutiveAction.passedDate = new Date('2020-01-01');
                groupExecutiveAction.effectiveDate = new Date('2020-01-01');
				groupExecutiveAction.poll = Poll.create()._id;
                groupExecutiveAction.executives = [Executive.create()._id, Executive.create()._id];
                groupExecutiveAction.executiveVotes = ['abcd1234efgh9876', 'abcd1234efgh9875'];

				GroupExecutiveAction.save(groupExecutiveAction).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('GroupExecutiveAction.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'GroupExecutiveAction.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves GroupExecutiveAction.', function(done){
				var groupExecutiveAction = GroupExecutiveAction.create();
				var error = null;
                var compareResult;

                groupExecutiveAction.name = 'Give Candy to the Babies Act';
                groupExecutiveAction.text = 'Every baby gets a candy.';
                groupExecutiveAction.passedDate = new Date('2020-01-01');
                groupExecutiveAction.effectiveDate = new Date('2020-01-01');
				groupExecutiveAction.poll = Poll.create()._id;
                groupExecutiveAction.executives = [Executive.create()._id, Executive.create()._id];
                groupExecutiveAction.executiveVotes = [ExecutiveVote.create()._id, ExecutiveVote.create()._id];

				GroupExecutiveAction.save(groupExecutiveAction).then(
					(saved) => {
						GroupExecutiveAction.findById(groupExecutiveAction._id).then(
							(found) => {
								compareResult = GroupExecutiveAction.compare(groupExecutiveAction, found);

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
    
	describe('ExecutiveVote Model Tests', function() {

		describe('ExecutiveVote.create()', function() {
		
			it('ExecutiveVote.create() creates a ExecutiveVote instance.', function() {
				var executiveVote = ExecutiveVote.create();
				assert(typeof(executiveVote) === "object");
			});

			it('ExecutiveVote.create() creates a ExecutiveVote instance with _id field populated', function(){
				var executiveVote = ExecutiveVote.create();
				assert(typeof(executiveVote._id) === "object" && /^[a-f\d]{24}$/i.test(executiveVote._id));
			});
		});

		describe('ExecutiveVote.save()', function() {

			it('ExecutiveVote.save() throws an error if required fields are missing.', function(done) {
				var executiveVote = ExecutiveVote.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'ExecutiveVote validation failed: groupExecutiveAction: Path `groupExecutiveAction` is required., date: Path `date` is required.';

				ExecutiveVote.save(executiveVote).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('ExecutiveVote.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'ExecutiveVote.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('ExecutiveVote.groupExecutiveAction must be a valid ID.', function(done) {
				var executiveVote = ExecutiveVote.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'ExecutiveVote validation failed: groupExecutiveAction: Cast to ObjectID failed for value "abcd1234efgh9876" at path "groupExecutiveAction"';

                executiveVote.date = new Date();
                executiveVote.groupExecutiveAction = 'abcd1234efgh9876';
                executiveVote.individualExecutiveVotes = [IndividualExecutiveVote.create()._id, IndividualExecutiveVote.create()._id];
                
				ExecutiveVote.save(executiveVote).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('ExecutiveVote.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'ExecutiveVote.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('ExecutiveVote.individualExecutiveVotes must be a valid Array of IDs.', function(done) {
				var executiveVote = ExecutiveVote.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'ExecutiveVote validation failed: individualExecutiveVotes: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "individualExecutiveVotes"';

                executiveVote.date = new Date();
                executiveVote.groupExecutiveAction = GroupExecutiveAction.create()._id;
                executiveVote.individualExecutiveVotes = ['abcd1234efgh9876', 'abcd1234efgh9875'];
                
				ExecutiveVote.save(executiveVote).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('ExecutiveVote.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'ExecutiveVote.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves Executive Vote.', function(done){
				var executiveVote = ExecutiveVote.create();
				var error = null;
                var compareResult;

                executiveVote.date = new Date();
                executiveVote.groupExecutiveAction = GroupExecutiveAction.create()._id;
                executiveVote.individualExecutiveVotes = [IndividualExecutiveVote.create()._id, IndividualExecutiveVote.create()._id];

				ExecutiveVote.save(executiveVote).then(
					(saved) => {
						ExecutiveVote.findById(executiveVote._id).then(
							function(found) {
								compareResult = ExecutiveVote.compare(executiveVote, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							}
						);
						(findError) => {
							error = findError;
						}
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
    
	describe('IndividualExecutiveVote Model Tests', function() {

		describe('IndividualExecutiveVote.create()', function() {
		
			it('IndividualExecutiveVote.create() creates a IndividualExecutiveVote instance.', function() {
				var individualExecutiveVote = IndividualExecutiveVote.create();
				assert(typeof(individualExecutiveVote) === "object");
			});

			it('IndividualExecutiveVote.create() creates a IndividualExecutiveVote instance with _id field populated', function(){
				var individualExecutiveVote = IndividualExecutiveVote.create();
				assert(typeof(individualExecutiveVote._id) === "object" && /^[a-f\d]{24}$/i.test(individualExecutiveVote._id));
			});
		});

		describe('IndividualExecutiveVote.save()', function() {

			it('IndividualExecutiveVote.save() throws an error if required fields are missing.', function(done) {
				var individualExecutiveVote = IndividualExecutiveVote.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'IndividualExecutiveVote validation failed: executiveVoteOption: Path `executiveVoteOption` is required., executiveVote: Path `executiveVote` is required., executive: Path `executive` is required.'; 

				IndividualExecutiveVote.save(individualExecutiveVote).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('IndividualExecutiveVote.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'IndividualExecutiveVote.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
            it('IndividualExecutiveVote.executive must be a valid ID.', function(done) {
				var individualExecutiveVote = IndividualExecutiveVote.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'IndividualExecutiveVote validation failed: executive: Cast to ObjectID failed for value "abcd1234efgh9876" at path "executive"';

                individualExecutiveVote.executive = 'abcd1234efgh9876';
                individualExecutiveVote.executiveVote = ExecutiveVote.create()._id;
                individualExecutiveVote.executiveVoteOption = ExecutiveVoteOption.create()._id;

                IndividualExecutiveVote.save(individualExecutiveVote).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('IndividualExecutiveVote.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'IndividualExecutiveVote.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });
    
            it('IndividualExecutiveVote.executiveVote must be a valid ID.', function(done) {
				var individualExecutiveVote = IndividualExecutiveVote.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'IndividualExecutiveVote validation failed: executiveVote: Cast to ObjectID failed for value "abcd1234efgh9876" at path "executiveVote"';

                individualExecutiveVote.executive = Executive.create()._id;
                individualExecutiveVote.executiveVote = 'abcd1234efgh9876';
                individualExecutiveVote.executiveVoteOption = ExecutiveVoteOption.create()._id;

                IndividualExecutiveVote.save(individualExecutiveVote).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('IndividualExecutiveVote.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'IndividualExecutiveVote.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });
    
            it('IndividualExecutiveVote.executiveVoteOption must be a valid ID.', function(done) {
				var individualExecutiveVote = IndividualExecutiveVote.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'IndividualExecutiveVote validation failed: executiveVoteOption: Cast to ObjectID failed for value "abcd1234efgh9876" at path "executiveVoteOption"';

                individualExecutiveVote.executive = Executive.create()._id;
                individualExecutiveVote.executiveVote = ExecutiveVote.create()._id;
                individualExecutiveVote.executiveVoteOption = 'abcd1234efgh9876';

                IndividualExecutiveVote.save(individualExecutiveVote).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('IndividualExecutiveVote.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'IndividualExecutiveVote.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });
    
			it('Valid Call Saves Individual Executive Vote.', function(done){
				var individualExecutiveVote = IndividualExecutiveVote.create();
				var error = null;
                var compareResult;
                
                individualExecutiveVote.executive = Executive.create()._id;
                individualExecutiveVote.executiveVote = ExecutiveVote.create()._id;
                individualExecutiveVote.executiveVoteOption = ExecutiveVoteOption.create()._id;

				IndividualExecutiveVote.save(individualExecutiveVote).then(
					(saved) => {
						IndividualExecutiveVote.findById(individualExecutiveVote._id).then(
							(found) => {
								compareResult = IndividualExecutiveVote.compare(individualExecutiveVote, found);

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
    
	describe('ExecutiveVoteOption Model Tests', function() {

		describe('ExecutiveVoteOption.create()', function() {
		
			it('ExecutiveVoteOption.create() creates a ExecutiveVoteOption instance.', function() {
				var executiveVoteOption = ExecutiveVoteOption.create();
				assert(typeof(executiveVoteOption) === "object");
			});

			it('ExecutiveVoteOption.create() creates a ExecutiveVoteOption instance with _id field populated', function(){
				var executiveVoteOption = ExecutiveVoteOption.create();
				assert(typeof(executiveVoteOption._id) === "object" && /^[a-f\d]{24}$/i.test(executiveVoteOption._id));
			});
		});

		describe('ExecutiveVoteOption.save()', function() {

			it('ExecutiveVoteOption.save() throws an error if required fields are missing.', function(done) {
				var executiveVoteOption = ExecutiveVoteOption.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'ExecutiveVoteOption validation failed: name: Path `name` is required.';

				ExecutiveVoteOption.save(executiveVoteOption).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('ExecutiveVoteOption.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'ExecutiveVoteOption.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves Legislative Vote Definition.', function(done){
				var executiveVoteOption = ExecutiveVoteOption.create();
				var error = null;
                var compareResult;

                executiveVoteOption.name = 'Yay';
                executiveVoteOption.positive = true;
                executiveVoteOption.negative = false;
                executiveVoteOption.countsTowardsTotal = true;

				ExecutiveVoteOption.save(executiveVoteOption).then(
					(saved) => {
						ExecutiveVoteOption.findById(executiveVoteOption._id).then(
							(found) => {
								compareResult = ExecutiveVoteOption.compare(executiveVoteOption, found);

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
	})
    
});