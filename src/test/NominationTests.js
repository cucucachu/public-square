var assert = require('assert');
var expect = require('expect');
var promiseFinally = require('promise.prototype.finally');

require('../dist/models/Modules/Government/Nomination/NominationModule');

// Add 'finally()' to 'Promis.prototype'
promiseFinally.shim();

process.on('unhandledRejection', error => {
	console.log('unhandledRejection', error.message);
});

var GovernmentPosition = require('../dist/models/Modules/Government/GovernmentPosition');
var OccupiedPosition = require('../dist/models/Modules/Government/OccupiedPosition');
var GovernmentRole = require('../dist/models/Modules/Government/GovernmentRole');
var PositionAcquisitionProcess = require('../dist/models/Modules/Government/PositionAcquisitionProcess');
var User = require('../dist/models/Modules/User/User');
var UserRole = require('../dist/models/Modules/User/UserRole');
var Nomination = require('../dist/models/Modules/Government/Nomination/Nomination');
var Nominator = require('../dist/models/Modules/Government/Nomination/Nominator');
var Nominee = require('../dist/models/Modules/Government/Nomination/Nominee');
var ConfirmationVote = require('../dist/models/Modules/Government/Nomination/ConfirmationVote');
var IndividualConfirmationVote = require('../dist/models/Modules/Government/Nomination/IndividualConfirmationVote');
var ConfirmationVoteOption = require('../dist/models/Modules/Government/Nomination/ConfirmationVoteOption');
var Confirmer = require('../dist/models/Modules/Government/Nomination/Confirmer');

describe('Nomination Module Tests', function() {

    before(function(done) {
        Nomination.clear().then(
            function() {
                Nominator.clear().then(
                    function() {
                        Nominee.clear().then(
                            function() {
                                ConfirmationVote.clear().then(
                                    function() {
                                        IndividualConfirmationVote.clear().then(
                                            function() {
                                                ConfirmationVoteOption.clear().then(
                                                    function() {
                                                        Confirmer.clear().then(done, done);
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
    
	describe('Nomination Model Tests', function() {

		describe('Nomination.create()', function() {
		
			it('Nomination.create() creates a Nomination instance.', function() {
				var nomination = Nomination.create();
				assert(typeof(nomination) === "object");
			});

			it('Nomination.create() creates a Nomination instance with _id field populated', function(){
				var nomination = Nomination.create();
				assert(typeof(nomination._id) === "object" && /^[a-f\d]{24}$/i.test(nomination._id));
			});
		});

		describe('Nomination.save()', function() {

			it('Nomination.save() throws an error if required fields are missing.', function(done) {
				var nomination = Nomination.create();
				var testFailed = 0;
                var error;
                
                var expectedErrorMessage = 'Nomination validation failed: governmentPosition: Path `governmentPosition` is required., nominee: Path `nominee` is required., nominator: Path `nominator` is required.';

				Nomination.save(nomination).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Nomination.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Nomination.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Nomination.governmentPosition must be a valid ID', function(done) {
				var nomination = Nomination.create();
				var testFailed = 0;
                var error;
                
                var expectedErrorMessage = 'Nomination validation failed: governmentPosition: Cast to ObjectID failed for value "abcd1234efgh9876" at path "governmentPosition"';

                nomination.nominationDate = new Date('2016-11-07');
                nomination.positionStartDate = new Date('2017-01-06')
                nomination.governmentPosition = 'abcd1234efgh9876';
                nomination.nominator = Nominator.create()._id;
                nomination.nominee = Nominee.create()._id;
                nomination.confirmationVotes = [ConfirmationVote.create()._id, ConfirmationVote.create()._id];

				Nomination.save(nomination).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Nomination.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Nomination.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Nomination.nominator must be a valid ID', function(done) {
				var nomination = Nomination.create();
				var testFailed = 0;
                var error;
                
                var expectedErrorMessage = 'Nomination validation failed: nominator: Cast to ObjectID failed for value "abcd1234efgh9876" at path "nominator"';

                nomination.nominationDate = new Date('2016-11-07');
                nomination.positionStartDate = new Date('2017-01-06')
                nomination.governmentPosition = GovernmentPosition.create()._id;
                nomination.nominator = 'abcd1234efgh9876';
                nomination.nominee = Nominee.create()._id;
                nomination.confirmationVotes = [ConfirmationVote.create()._id, ConfirmationVote.create()._id];

				Nomination.save(nomination).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Nomination.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Nomination.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Nomination.nominee must be a valid ID', function(done) {
				var nomination = Nomination.create();
				var testFailed = 0;
                var error;
                
                var expectedErrorMessage = 'Nomination validation failed: nominee: Cast to ObjectID failed for value "abcd1234efgh9876" at path "nominee"';

                nomination.nominationDate = new Date('2016-11-07');
                nomination.positionStartDate = new Date('2017-01-06')
                nomination.governmentPosition = GovernmentPosition.create()._id;
                nomination.nominator = Nominator.create()._id;
                nomination.nominee = 'abcd1234efgh9876';
                nomination.confirmationVotes = [ConfirmationVote.create()._id, ConfirmationVote.create()._id];

				Nomination.save(nomination).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Nomination.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Nomination.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Nomination.confirmationVotes must be a valid Array of IDs', function(done) {
				var nomination = Nomination.create();
				var testFailed = 0;
                var error;
                
                var expectedErrorMessage = 'Nomination validation failed: confirmationVotes: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "confirmationVotes"';

                nomination.nominationDate = new Date('2016-11-07');
                nomination.positionStartDate = new Date('2017-01-06')
                nomination.governmentPosition = GovernmentPosition.create()._id;
                nomination.nominator = Nominator.create()._id;
                nomination.nominee = Nominee.create()._id;
                nomination.confirmationVotes = ['abcd1234efgh9876', 'abcd1234efgh9875'];

				Nomination.save(nomination).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Nomination.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Nomination.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Nomination.positionStartDate must be greater than or equal to Nomination.nominationDate', function(done) {
				var nomination = Nomination.create();
				var testFailed = 0;
                var error;
                
                var expectedErrorMessage = 'Nomination validation failed: positionStartDate: Position Start Date must be greater than or equal to Nomination Date.';

                nomination.nominationDate = new Date('2016-11-07');
                nomination.positionStartDate = new Date('2015-01-06')
                nomination.governmentPosition = GovernmentPosition.create()._id;
                nomination.nominator = Nominator.create()._id;
                nomination.nominee = Nominee.create()._id;
                nomination.confirmationVotes = [ConfirmationVote.create()._id, ConfirmationVote.create()._id];

				Nomination.save(nomination).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Nomination.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Nomination.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves Nomination.', function(done){
				var nomination = Nomination.create();
				var error = null;
                var compareResult;

                nomination.nominationDate = new Date('2016-11-07');
                nomination.positionStartDate = new Date('2017-01-06')
                nomination.governmentPosition = GovernmentPosition.create()._id;
                nomination.nominator = Nominator.create()._id;
                nomination.nominee = Nominee.create()._id;
                nomination.confirmationVotes = [ConfirmationVote.create()._id, ConfirmationVote.create()._id];

				Nomination.save(nomination).then(
					function(saved) {
						Nomination.Model.findById(nomination._id, function(findError, found) {
							compareResult = Nomination.compare(nomination, found);

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
    
	describe('Nominator Model Tests', function() {

		describe('Nominator.create()', function() {
		
			it('Nominator.create() creates a Nominator instance.', function() {
				var nominator = Nominator.create();
				assert(typeof(nominator) === "object");
			});

			it('Nominator.create() creates a Nominator instance with _id field populated', function(){
				var nominator = Nominator.create();
				assert(typeof(nominator._id) === "object" && /^[a-f\d]{24}$/i.test(nominator._id));
			});
		});

		describe('Nominator.save()', function() {

			it('Nominator.save() throws an error if required fields are missing.', function(done) {
				var nominator = Nominator.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Nominator validation failed: occupiedPosition: Path `occupiedPosition` is required.';

				Nominator.save(nominator).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Nominator.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Nominator.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
            it('Nominator.occupiedPosition must be a valid ID.', function(done) {
                var nominator = Nominator.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'Nominator validation failed: occupiedPosition: Cast to ObjectID failed for value "abcd1234efgh9876" at path "occupiedPosition"';

                nominator.occupiedPosition = 'abcd1234efgh9876';
                nominator.nominations = [Nomination.create()._id, Nomination.create()._id];

                Nominator.save(nominator).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('Nominator.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'Nominator.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });
    
            it('Nominator.nominations must be a valid Array of IDs.', function(done) {
                var nominator = Nominator.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'Nominator validation failed: nominations: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "nominations"';

                nominator.occupiedPosition = OccupiedPosition.create()._id;
                nominator.nominations = ['abcd1234efgh9876','abcd1234efgh9875'];

                Nominator.save(nominator).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('Nominator.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'Nominator.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });

			it('Valid Call Saves Nominator.', function(done){
                var nominator = Nominator.create();
				var error = null;
				var compareResult;

                nominator.occupiedPosition = OccupiedPosition.create()._id;
                nominator.nominations = [Nomination.create()._id, Nomination.create()._id];

				Nominator.save(nominator).then(
					function(saved) {
						Nominator.Model.findById(nominator._id, function(findError, found) {
							compareResult = Nominator.compare(nominator, found);

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
    
	describe('Nominee Model Tests', function() {

		describe('Nominee.create()', function() {
		
			it('Nominee.create() creates a Nominee instance.', function() {
				var nominee = Nominee.create();
				assert(typeof(nominee) === "object");
			});

			it('Nominee.create() creates a Nominee instance with _id field populated', function(){
				var nominee = Nominee.create();
				assert(typeof(nominee._id) === "object" && /^[a-f\d]{24}$/i.test(nominee._id));
			});
		});

		describe('Nominee.save()', function() {

			it('Nominee.save() throws an error if required fields are missing.', function(done) {
				var nominee = Nominee.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Nominee validation failed: user: Path `user` is required.';

				Nominee.save(nominee).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Nominee.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Nominee.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Nominee.user must be a valid ID.', function(done) {
				var nominee = Nominee.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Nominee validation failed: user: Cast to ObjectID failed for value "abcd1234efgh9876" at path "user"';

                nominee.user = 'abcd1234efgh9876';
                nominee.nominations = [Nomination.create()._id, Nomination.create()._id];

				Nominee.save(nominee).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Nominee.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Nominee.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Nominee.nominations must be a valid Array of IDs.', function(done) {
				var nominee = Nominee.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Nominee validation failed: nominations: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "nominations"';
                
                nominee.user = User.create()._id;
                nominee.nominations = ['abcd1234efgh9876', 'abcd1234efgh9875'];

				Nominee.save(nominee).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Nominee.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Nominee.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves Nominee.', function(done){
				var nominee = Nominee.create();
				var error = null;
                var compareResult;

                nominee.user = User.create()._id;
                nominee.nominations = [Nomination.create()._id, Nomination.create()._id];

				Nominee.save(nominee).then(
					function(saved) {
						Nominee.Model.findById(nominee._id, function(findError, found) {
							compareResult = Nominee.compare(nominee, found);

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
    
	describe('ConfirmationVote Model Tests', function() {

		describe('ConfirmationVote.create()', function() {
		
			it('ConfirmationVote.create() creates a ConfirmationVote instance.', function() {
				var confirmationVote = ConfirmationVote.create();
				assert(typeof(confirmationVote) === "object");
			});

			it('ConfirmationVote.create() creates a ConfirmationVote instance with _id field populated', function(){
				var confirmationVote = ConfirmationVote.create();
				assert(typeof(confirmationVote._id) === "object" && /^[a-f\d]{24}$/i.test(confirmationVote._id));
			});
		});

		describe('ConfirmationVote.save()', function() {

			it('ConfirmationVote.save() throws an error if required fields are missing.', function(done) {
				var confirmationVote = ConfirmationVote.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'ConfirmationVote validation failed: nomination: Path `nomination` is required., date: Path `date` is required.';

				ConfirmationVote.save(confirmationVote).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('ConfirmationVote.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'ConfirmationVote.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('ConfirmationVote.nomination must be a valid ID.', function(done) {
				var confirmationVote = ConfirmationVote.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'ConfirmationVote validation failed: nomination: Cast to ObjectID failed for value "abcd1234efgh9876" at path "nomination"';

                confirmationVote.date = new Date();
                confirmationVote.nomination = 'abcd1234efgh9876';
                confirmationVote.individualConfirmationVotes = [IndividualConfirmationVote.create()._id, IndividualConfirmationVote.create()._id];
                
				ConfirmationVote.save(confirmationVote).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('ConfirmationVote.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'ConfirmationVote.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('ConfirmationVote.individualConfirmationVotes must be a valid Array of IDs.', function(done) {
				var confirmationVote = ConfirmationVote.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'ConfirmationVote validation failed: individualConfirmationVotes: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "individualConfirmationVotes"';

                confirmationVote.date = new Date();
                confirmationVote.nomination = Nomination.create()._id;
                confirmationVote.individualConfirmationVotes = ['abcd1234efgh9876', 'abcd1234efgh9875'];
                
				ConfirmationVote.save(confirmationVote).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('ConfirmationVote.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'ConfirmationVote.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves Confirmation Vote.', function(done){
				var confirmationVote = ConfirmationVote.create();
				var error = null;
                var compareResult;

                confirmationVote.date = new Date();
                confirmationVote.nomination = Nomination.create()._id;
                confirmationVote.individualConfirmationVotes = [IndividualConfirmationVote.create()._id, IndividualConfirmationVote.create()._id];

				ConfirmationVote.save(confirmationVote).then(
					function(saved) {
						ConfirmationVote.Model.findById(confirmationVote._id, function(findError, found) {
							compareResult = ConfirmationVote.compare(confirmationVote, found);

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
    
	describe('IndividualConfirmationVote Model Tests', function() {

		describe('IndividualConfirmationVote.create()', function() {
		
			it('IndividualConfirmationVote.create() creates a IndividualConfirmationVote instance.', function() {
				var individualConfirmationVote = IndividualConfirmationVote.create();
				assert(typeof(individualConfirmationVote) === "object");
			});

			it('IndividualConfirmationVote.create() creates a IndividualConfirmationVote instance with _id field populated', function(){
				var individualConfirmationVote = IndividualConfirmationVote.create();
				assert(typeof(individualConfirmationVote._id) === "object" && /^[a-f\d]{24}$/i.test(individualConfirmationVote._id));
			});
		});

		describe('IndividualConfirmationVote.save()', function() {

			it('IndividualConfirmationVote.save() throws an error if required fields are missing.', function(done) {
				var individualConfirmationVote = IndividualConfirmationVote.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'IndividualConfirmationVote validation failed: confirmationVoteOption: Path `confirmationVoteOption` is required., confirmationVote: Path `confirmationVote` is required., confirmer: Path `confirmer` is required.'; 

				IndividualConfirmationVote.save(individualConfirmationVote).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('IndividualConfirmationVote.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'IndividualConfirmationVote.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
            it('IndividualConfirmationVote.confirmer must be a valid ID.', function(done) {
				var individualConfirmationVote = IndividualConfirmationVote.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'IndividualConfirmationVote validation failed: confirmer: Cast to ObjectID failed for value "abcd1234efgh9876" at path "confirmer"';

                individualConfirmationVote.confirmer = 'abcd1234efgh9876';
                individualConfirmationVote.confirmationVote = ConfirmationVote.create()._id;
                individualConfirmationVote.confirmationVoteOption = ConfirmationVoteOption.create()._id;

                IndividualConfirmationVote.save(individualConfirmationVote).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('IndividualConfirmationVote.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'IndividualConfirmationVote.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });
    
            it('IndividualConfirmationVote.confirmationVote must be a valid ID.', function(done) {
				var individualConfirmationVote = IndividualConfirmationVote.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'IndividualConfirmationVote validation failed: confirmationVote: Cast to ObjectID failed for value "abcd1234efgh9876" at path "confirmationVote"';

                individualConfirmationVote.confirmer = Confirmer.create()._id;
                individualConfirmationVote.confirmationVote = 'abcd1234efgh9876';
                individualConfirmationVote.confirmationVoteOption = ConfirmationVoteOption.create()._id;

                IndividualConfirmationVote.save(individualConfirmationVote).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('IndividualConfirmationVote.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'IndividualConfirmationVote.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });
    
            it('IndividualConfirmationVote.confirmationVoteOption must be a valid ID.', function(done) {
				var individualConfirmationVote = IndividualConfirmationVote.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'IndividualConfirmationVote validation failed: confirmationVoteOption: Cast to ObjectID failed for value "abcd1234efgh9876" at path "confirmationVoteOption"';

                individualConfirmationVote.confirmer = Confirmer.create()._id;
                individualConfirmationVote.confirmationVote = ConfirmationVote.create()._id;
                individualConfirmationVote.confirmationVoteOption = 'abcd1234efgh9876';

                IndividualConfirmationVote.save(individualConfirmationVote).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('IndividualConfirmationVote.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'IndividualConfirmationVote.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });
    
			it('Valid Call Saves Individual Confirmation Vote.', function(done){
				var individualConfirmationVote = IndividualConfirmationVote.create();
				var error = null;
                var compareResult;
                
                individualConfirmationVote.confirmer = Confirmer.create()._id;
                individualConfirmationVote.confirmationVote = ConfirmationVote.create()._id;
                individualConfirmationVote.confirmationVoteOption = ConfirmationVoteOption.create()._id;

				IndividualConfirmationVote.save(individualConfirmationVote).then(
					function(saved) {
						IndividualConfirmationVote.Model.findById(individualConfirmationVote._id, function(findError, found) {
							compareResult = IndividualConfirmationVote.compare(individualConfirmationVote, found);

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
    
	describe('ConfirmationVoteOption Model Tests', function() {

		describe('ConfirmationVoteOption.create()', function() {
		
			it('ConfirmationVoteOption.create() creates a ConfirmationVoteOption instance.', function() {
				var confirmationVoteOption = ConfirmationVoteOption.create();
				assert(typeof(confirmationVoteOption) === "object");
			});

			it('ConfirmationVoteOption.create() creates a ConfirmationVoteOption instance with _id field populated', function(){
				var confirmationVoteOption = ConfirmationVoteOption.create();
				assert(typeof(confirmationVoteOption._id) === "object" && /^[a-f\d]{24}$/i.test(confirmationVoteOption._id));
			});
		});

		describe('ConfirmationVoteOption.save()', function() {

			it('ConfirmationVoteOption.save() throws an error if required fields are missing.', function(done) {
				var confirmationVoteOption = ConfirmationVoteOption.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'ConfirmationVoteOption validation failed: name: Path `name` is required.';

				ConfirmationVoteOption.save(confirmationVoteOption).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('ConfirmationVoteOption.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'ConfirmationVoteOption.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves Confirmation Vote Definition.', function(done){
				var confirmationVoteOption = ConfirmationVoteOption.create();
				var error = null;
                var compareResult;

                confirmationVoteOption.name = 'Yay';
                confirmationVoteOption.positive = true;
                confirmationVoteOption.negative = false;
                confirmationVoteOption.countsTowardsTotal = true;

				ConfirmationVoteOption.save(confirmationVoteOption).then(
					function(saved) {
						ConfirmationVoteOption.Model.findById(confirmationVoteOption._id, function(findError, found) {
							compareResult = ConfirmationVoteOption.compare(confirmationVoteOption, found);

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
    
	describe('Confirmer Model Tests', function() {

		describe('Confirmer.create()', function() {
		
			it('Confirmer.create() creates a Confirmer instance.', function() {
				var confirmer = Confirmer.create();
				assert(typeof(confirmer) === "object");
			});

			it('Confirmer.create() creates a Confirmer instance with _id field populated', function(){
				var confirmer = Confirmer.create();
				assert(typeof(confirmer._id) === "object" && /^[a-f\d]{24}$/i.test(confirmer._id));
			});
		});

		describe('Confirmer.save()', function() {

			it('Confirmer.save() throws an error if required fields are missing.', function(done) {
				var confirmer = Confirmer.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Confirmer validation failed: occupiedPosition: Path `occupiedPosition` is required.';
                
				Confirmer.save(confirmer).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Confirmer.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Confirmer.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
            it('Confirmer.occupiedPosition must be a valid ID.', function(done) {
                var confirmer = Confirmer.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'Confirmer validation failed: occupiedPosition: Cast to ObjectID failed for value "abcd1234efgh9876" at path "occupiedPosition"';

                confirmer.occupiedPosition = 'abcd1234efgh9876';
                confirmer.individualConfirmationVotes = [IndividualConfirmationVote.create()._id, IndividualConfirmationVote.create()._id];

                Confirmer.save(confirmer).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('Confirmer.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'Confirmer.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });
    
            it('Confirmer.individualConfirmationVotes must be a valid Array of IDs.', function(done) {
                var confirmer = Confirmer.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'Confirmer validation failed: individualConfirmationVotes: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "individualConfirmationVotes"';

                confirmer.occupiedPosition = OccupiedPosition.create()._id;
                confirmer.individualConfirmationVotes = ['abcd1234efgh9876', 'abcd1234efgh9875'];

                Confirmer.save(confirmer).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('Confirmer.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'Confirmer.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });

			it('Valid Call Saves Confirmer.', function(done){
                var confirmer = Confirmer.create();
				var error = null;
				var compareResult;

                confirmer.occupiedPosition = OccupiedPosition.create()._id;
                confirmer.individualConfirmationVotes = [IndividualConfirmationVote.create()._id, IndividualConfirmationVote.create()._id];

				Confirmer.save(confirmer).then(
					function(saved) {
						Confirmer.Model.findById(confirmer._id, function(findError, found) {
							compareResult = Confirmer.compare(confirmer, found);

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