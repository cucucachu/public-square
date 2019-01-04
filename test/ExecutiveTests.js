var assert = require('assert');
var expect = require('expect');
var promiseFinally = require('promise.prototype.finally');

// Add 'finally()' to 'Promis.prototype'
promiseFinally.shim();

process.on('unhandledRejection', error => {
	console.log('unhandledRejection', error.message);
});

var Executive = require('../models/Modules/Government/Executive/Executive');
var ExecutiveAction = require('../models/Modules/Government/Executive/ExecutiveAction');
var IndividualExecutiveAction = require('../models/Modules/Government/Executive/IndividualExecutiveAction');
var GroupExecutiveAction = require('../models/Modules/Government/Executive/GroupExecutiveAction');
var ExecutiveVote = require('../models/Modules/Government/Executive/ExecutiveVote');
var IndividualExecutiveVote = require('../models/Modules/Government/Executive/IndividualExecutiveVote');
var ExecutiveVoteOption = require('../models/Modules/Government/Executive/ExecutiveVoteOption');
var OccupiedPosition = require('../models/Modules/Government/OccupiedPosition');

describe('Executive Module Tests', function() {

    before(function(done) {
        Executive.clear().then(
            function() {
                ExecutiveAction.clear().then(
                    function() {
                        ExecutiveVote.clear().then(
                            function() {
                                IndividualExecutiveVote.clear().then(
                                    function() {
                                        ExecutiveVoteOption.clear().then(done, done);
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
                executive.executiveActions = [ExecutiveAction.create()._id, ExecutiveAction.create()._id];
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
                executive.executiveActions = [ExecutiveAction.create()._id, ExecutiveAction.create()._id];
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
                executive.executiveActions = [ExecutiveAction.create()._id, ExecutiveAction.create()._id];
                executive.individualExecutiveVotes = [IndividualExecutiveVote.create()._id, IndividualExecutiveVote.create()._id];

				Executive.save(executive).then(
					function(saved) {
						Executive.Model.findById(executive._id, function(findError, found) {
							compareResult = Executive.compare(executive, found);

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
    
	describe('ExecutiveAction Model Tests', function() {

		describe('ExecutiveAction.create()', function() {
		
			it('ExecutiveAction.create() creates a ExecutiveAction instance.', function() {
				var executiveAction = ExecutiveAction.create();
				assert(typeof(executiveAction) === "object");
			});

			it('ExecutiveAction.create() creates a ExecutiveAction instance with _id field populated', function(){
				var executiveAction = ExecutiveAction.create();
				assert(typeof(executiveAction._id) === "object" && /^[a-f\d]{24}$/i.test(executiveAction._id));
			});
		});

		describe('ExecutiveAction.save()', function() {

			it('ExecutiveAction.save() throws an error if required fields are missing.', function(done) {
				var executiveAction = ExecutiveAction.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'ExecutiveAction validation failed: text: Path `text` is required., name: Path `name` is required.';

				ExecutiveAction.save(executiveAction).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('ExecutiveAction.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'ExecutiveAction.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('ExecutiveAction.effectiveDate must be greater than or equal to ExecutiveAction.passedDate.', function(done) {
				var executiveAction = ExecutiveAction.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'ExecutiveAction validation failed: effectiveDate: Effective Date must be greater than or equal to Passed Date.';

                executiveAction.name = 'Give Candy to the Babies Act';
                executiveAction.text = 'Every baby gets a candy.';
                executiveAction.passedDate = new Date('2020-01-01');
                executiveAction.effectiveDate = new Date('2010-01-01');
                executiveAction.executives = [Executive.create()._id, Executive.create()._id];

				ExecutiveAction.save(executiveAction).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('ExecutiveAction.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'ExecutiveAction.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('ExecutiveAction.executives is a valid Array of IDs.', function(done) {
				var executiveAction = ExecutiveAction.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'ExecutiveAction validation failed: executives: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "executives"';

                executiveAction.name = 'Give Candy to the Babies Act';
                executiveAction.text = 'Every baby gets a candy.';
                executiveAction.passedDate = new Date('2020-01-01');
                executiveAction.effectiveDate = new Date('2020-01-01');
                executiveAction.executives = ['abcd1234efgh9876', 'abcd1234efgh9875'];

				ExecutiveAction.save(executiveAction).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('ExecutiveAction.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'ExecutiveAction.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves ExecutiveAction.', function(done){
				var executiveAction = ExecutiveAction.create();
				var error = null;
                var compareResult;

                executiveAction.name = 'Give Candy to the Babies Act';
                executiveAction.text = 'Every baby gets a candy.';
                executiveAction.passedDate = new Date('2020-01-01');
                executiveAction.effectiveDate = new Date('2020-01-01');
                executiveAction.executives = [Executive.create()._id, Executive.create()._id];

				ExecutiveAction.save(executiveAction).then(
					function(saved) {
						ExecutiveAction.Model.findById(executiveAction._id, function(findError, found) {
							compareResult = ExecutiveAction.compare(executiveAction, found);

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
                var expectedErrorMessage = 'IndividualExecutiveAction validation failed: text: Path `text` is required., name: Path `name` is required.';

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
                individualExecutiveAction.executives = [Executive.create()._id, Executive.create()._id];

				IndividualExecutiveAction.save(individualExecutiveAction).then(
					function(saved) {
						IndividualExecutiveAction.Model.findById(individualExecutiveAction._id, function(findError, found) {
							compareResult = IndividualExecutiveAction.compare(individualExecutiveAction, found);

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
                var expectedErrorMessage = 'GroupExecutiveAction validation failed: text: Path `text` is required., name: Path `name` is required.';

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
                groupExecutiveAction.executives = [Executive.create()._id, Executive.create()._id];
                groupExecutiveAction.executiveVotes = [ExecutiveVote.create()._id, ExecutiveVote.create()._id];

				GroupExecutiveAction.save(groupExecutiveAction).then(
					function(saved) {
						GroupExecutiveAction.Model.findById(groupExecutiveAction._id, function(findError, found) {
							compareResult = GroupExecutiveAction.compare(groupExecutiveAction, found);

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
					function(saved) {
						ExecutiveVote.Model.findById(executiveVote._id, function(findError, found) {
							compareResult = ExecutiveVote.compare(executiveVote, found);

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
					function(saved) {
						IndividualExecutiveVote.Model.findById(individualExecutiveVote._id, function(findError, found) {
							compareResult = IndividualExecutiveVote.compare(individualExecutiveVote, found);

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
					function(saved) {
						ExecutiveVoteOption.Model.findById(executiveVoteOption._id, function(findError, found) {
							compareResult = ExecutiveVoteOption.compare(executiveVoteOption, found);

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