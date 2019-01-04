var assert = require('assert');
var expect = require('expect');
var promiseFinally = require('promise.prototype.finally');

// Add 'finally()' to 'Promis.prototype'
promiseFinally.shim();

process.on('unhandledRejection', error => {
	console.log('unhandledRejection', error.message);
});

var Judge = require('../models/Modules/Government/Judge/Judge');
var IndividualJudgement = require('../models/Modules/Government/Judge/IndividualJudgement');
var JudgementDefinition = require('../models/Modules/Government/Judge/JudgementDefinition');
var Judgement = require('../models/Modules/Government/Judge/Judgement');
var JudicialCase = require('../models/Modules/Government/Judge/JudicialCase');
var JudicialOpinion = require('../models/Modules/Government/Judge/JudicialOpinion');
var OccupiedPosition = require('../models/Modules/Government/OccupiedPosition');
var Law = require('../models/Modules/Government/Law');

describe('Judge Module Tests', function() {

    before(function(done) {
        Judge.clear().then(
            function() {
                IndividualJudgement.clear().then(
                    function() {
                        JudgementDefinition.clear().then(
                            function() {
                                Judgement.clear().then(
                                    function() {
                                        JudicialCase.clear().then(
                                            function() {
                                                JudicialOpinion.clear().then(done, done);
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

    
	describe('Judge Model Tests', function() {

		describe('Judge.create()', function() {
		
			it('Judge.create() creates a Judge instance.', function() {
				var judge = Judge.create();
				assert(typeof(judge) === "object");
			});

			it('Judge.create() creates a Judge instance with _id field populated', function(){
				var judge = Judge.create();
				assert(typeof(judge._id) === "object" && /^[a-f\d]{24}$/i.test(judge._id));
			});
		});

		describe('Judge.save()', function() {

			it('Judge.save() throws an error if required fields are missing.', function(done) {
				var judge = Judge.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Judge validation failed: occupiedPosition: Path `occupiedPosition` is required.';
                
				Judge.save(judge).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Judge.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Judge.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
            it('Judge.occupiedPosition must be a valid ID.', function(done) {
                var judge = Judge.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'Judge validation failed: occupiedPosition: Cast to ObjectID failed for value "abcd1234efgh9876" at path "occupiedPosition"';

                judge.occupiedPosition = 'abcd1234efgh9876';
                judge.individualJudgements = [IndividualJudgement.create()._id, IndividualJudgement.create()._id];
                judge.writesJudicialOpinions = [JudicialOpinion.create()._id, JudicialOpinion.create()._id];
                judge.signsJudicialOpinions = [JudicialOpinion.create()._id, JudicialOpinion.create()._id];

                Judge.save(judge).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('Judge.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'Judge.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });
    
            it('Judge.individualJudgements must be a valid Array of IDs.', function(done) {
                var judge = Judge.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'Judge validation failed: individualJudgements: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "individualJudgements"';

                judge.occupiedPosition = OccupiedPosition.create()._id;
                judge.individualJudgements = ['abcd1234efgh9876', 'abcd1234efgh9875'];
                judge.writesJudicialOpinions = [JudicialOpinion.create()._id, JudicialOpinion.create()._id];
                judge.signsJudicialOpinions = [JudicialOpinion.create()._id, JudicialOpinion.create()._id];

                Judge.save(judge).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('Judge.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'Judge.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });
    
            it('Judge.writesJudicialOpinions must be a valid Array of IDs.', function(done) {
                var judge = Judge.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'Judge validation failed: writesJudicialOpinions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "writesJudicialOpinions"';

                judge.occupiedPosition = OccupiedPosition.create()._id;
                judge.individualJudgements = [IndividualJudgement.create()._id, IndividualJudgement.create()._id];
                judge.writesJudicialOpinions = ['abcd1234efgh9876', 'abcd1234efgh9875'];
                judge.signsJudicialOpinions = [JudicialOpinion.create()._id, JudicialOpinion.create()._id];

                Judge.save(judge).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('Judge.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'Judge.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });
    
            it('Judge.signsJudicialOpinions must be a valid Array of IDs.', function(done) {
                var judge = Judge.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'Judge validation failed: signsJudicialOpinions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "signsJudicialOpinions"';

                judge.occupiedPosition = OccupiedPosition.create()._id;
                judge.individualJudgements = [IndividualJudgement.create()._id, IndividualJudgement.create()._id];
                judge.writesJudicialOpinions = [JudicialOpinion.create()._id, JudicialOpinion.create()._id];
                judge.signsJudicialOpinions = ['abcd1234efgh9876', 'abcd1234efgh9875'];

                Judge.save(judge).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('Judge.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'Judge.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });

			it('Valid Call Saves Judge.', function(done){
                var judge = Judge.create();
				var error = null;
				var compareResult;

                judge.occupiedPosition = OccupiedPosition.create()._id;
                judge.individualJudgements = [IndividualJudgement.create()._id, IndividualJudgement.create()._id];
                judge.writesJudicialOpinions = [JudicialOpinion.create()._id, JudicialOpinion.create()._id];
                judge.signsJudicialOpinions = [JudicialOpinion.create()._id, JudicialOpinion.create()._id];

				Judge.save(judge).then(
					function(saved) {
						Judge.Model.findById(judge._id, function(findError, found) {
							compareResult = Judge.compare(judge, found);

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
    
	describe('IndividualJudgement Model Tests', function() {

		describe('IndividualJudgement.create()', function() {
		
			it('IndividualJudgement.create() creates a IndividualJudgement instance.', function() {
				var individualJudgement = IndividualJudgement.create();
				assert(typeof(individualJudgement) === "object");
			});

			it('IndividualJudgement.create() creates a IndividualJudgement instance with _id field populated', function(){
				var individualJudgement = IndividualJudgement.create();
				assert(typeof(individualJudgement._id) === "object" && /^[a-f\d]{24}$/i.test(individualJudgement._id));
			});
		});

		describe('IndividualJudgement.save()', function() {

			it('IndividualJudgement.save() throws an error if required fields are missing.', function(done) {
				var individualJudgement = IndividualJudgement.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'IndividualJudgement validation failed: judgementDefinition: Path `judgementDefinition` is required., judgement: Path `judgement` is required., judge: Path `judge` is required.'; 

				IndividualJudgement.save(individualJudgement).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('IndividualJudgement.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'IndividualJudgement.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
            it('IndividualJudgement.judge must be a valid ID.', function(done) {
				var individualJudgement = IndividualJudgement.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'IndividualJudgement validation failed: judge: Cast to ObjectID failed for value "abcd1234efgh9876" at path "judge"';

                individualJudgement.judge = 'abcd1234efgh9876';
                individualJudgement.judgement = Judgement.create()._id;
                individualJudgement.judgementDefinition = JudgementDefinition.create()._id;

                IndividualJudgement.save(individualJudgement).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('IndividualJudgement.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'IndividualJudgement.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });
    
            it('IndividualJudgement.judgement must be a valid ID.', function(done) {
				var individualJudgement = IndividualJudgement.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'IndividualJudgement validation failed: judgement: Cast to ObjectID failed for value "abcd1234efgh9876" at path "judgement"';

                individualJudgement.judge = Judge.create()._id;
                individualJudgement.judgement = 'abcd1234efgh9876';
                individualJudgement.judgementDefinition = JudgementDefinition.create()._id;

                IndividualJudgement.save(individualJudgement).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('IndividualJudgement.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'IndividualJudgement.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });
    
            it('IndividualJudgement.judgementDefinition must be a valid ID.', function(done) {
				var individualJudgement = IndividualJudgement.create();
                var testFailed = 0;
                var error;
                var expectedErrorMessage = 'IndividualJudgement validation failed: judgementDefinition: Cast to ObjectID failed for value "abcd1234efgh9876" at path "judgementDefinition"';

                individualJudgement.judge = Judge.create()._id;
                individualJudgement.judgement = Judgement.create()._id;
                individualJudgement.judgementDefinition = 'abcd1234efgh9876';

                IndividualJudgement.save(individualJudgement).then(
                    function(result) {
                        testFailed = 1;
                    },
                    function(rejectionErr) {
                        error = rejectionErr;
                    }
                )
                .finally(function() {
                    if (testFailed) done(new Error('IndividualJudgement.save() promise resolved when it should have been rejected with Validation Error'));
                    else {
                        if (error != null && error.message == expectedErrorMessage) {
                            done();
                        }
                        else{
                            done(new Error(
                                'IndividualJudgement.save() did not return the correct Validation Error.\n' +
                                '   Expected: ' + expectedErrorMessage + '\n' +
                                '   Actual:   ' + error.message
                            ));
                        }
                    }
                });
            });
    
			it('Valid Call Saves Individual Judgement.', function(done){
				var individualJudgement = IndividualJudgement.create();
				var error = null;
                var compareResult;
                
                individualJudgement.judge = Judge.create()._id;
                individualJudgement.judgement = Judgement.create()._id;
                individualJudgement.judgementDefinition = JudgementDefinition.create()._id;

				IndividualJudgement.save(individualJudgement).then(
					function(saved) {
						IndividualJudgement.Model.findById(individualJudgement._id, function(findError, found) {
							compareResult = IndividualJudgement.compare(individualJudgement, found);

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
    
	describe('JudgementDefinition Model Tests', function() {

		describe('JudgementDefinition.create()', function() {
		
			it('JudgementDefinition.create() creates a JudgementDefinition instance.', function() {
				var judgementDefinition = JudgementDefinition.create();
				assert(typeof(judgementDefinition) === "object");
			});

			it('JudgementDefinition.create() creates a JudgementDefinition instance with _id field populated', function(){
				var judgementDefinition = JudgementDefinition.create();
				assert(typeof(judgementDefinition._id) === "object" && /^[a-f\d]{24}$/i.test(judgementDefinition._id));
			});
		});

		describe('JudgementDefinition.save()', function() {

			it('JudgementDefinition.save() throws an error if required fields are missing.', function(done) {
				var judgementDefinition = JudgementDefinition.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'JudgementDefinition validation failed: name: Path `name` is required.';

				JudgementDefinition.save(judgementDefinition).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('JudgementDefinition.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'JudgementDefinition.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves Judgement Definition.', function(done){
				var judgementDefinition = JudgementDefinition.create();
				var error = null;
                var compareResult;

                judgementDefinition.name = 'Yay';
                judgementDefinition.positive = true;
                judgementDefinition.negative = false;
                judgementDefinition.countsTowardsTotal = true;

				JudgementDefinition.save(judgementDefinition).then(
					function(saved) {
						JudgementDefinition.Model.findById(judgementDefinition._id, function(findError, found) {
							compareResult = JudgementDefinition.compare(judgementDefinition, found);

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
    
	describe('Judgement Model Tests', function() {

		describe('Judgement.create()', function() {
		
			it('Judgement.create() creates a Judgement instance.', function() {
				var judgement = Judgement.create();
				assert(typeof(judgement) === "object");
			});

			it('Judgement.create() creates a Judgement instance with _id field populated', function(){
				var judgement = Judgement.create();
				assert(typeof(judgement._id) === "object" && /^[a-f\d]{24}$/i.test(judgement._id));
			});
		});

		describe('Judgement.save()', function() {

			it('Judgement.save() throws an error if required fields are missing.', function(done) {
				var judgement = Judgement.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Judgement validation failed: judicialCase: Path `judicialCase` is required., date: Path `date` is required.';

				Judgement.save(judgement).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Judgement.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Judgement.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Judgement.judicialCase must be a valid ID.', function(done) {
				var judgement = Judgement.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Judgement validation failed: judicialCase: Cast to ObjectID failed for value "abcd1234efgh9876" at path "judicialCase"';

                judgement.date = new Date();
                judgement.judicialCase = 'abcd1234efgh9876';
                judgement.individualJudgements = [IndividualJudgement.create()._id, IndividualJudgement.create()._id];
                
				Judgement.save(judgement).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Judgement.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Judgement.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Judgement.individualJudgements must be a valid Array of IDs.', function(done) {
				var judgement = Judgement.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Judgement validation failed: individualJudgements: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "individualJudgements"';

                judgement.date = new Date();
                judgement.judicialCase = JudicialCase.create()._id;
                judgement.individualJudgements = ['abcd1234efgh9876', 'abcd1234efgh9875'];
                
				Judgement.save(judgement).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Judgement.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Judgement.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves Judgement.', function(done){
				var judgement = Judgement.create();
				var error = null;
                var compareResult;

                judgement.date = new Date();
                judgement.judicialCase = JudicialCase.create()._id;
                judgement.individualJudgements = [IndividualJudgement.create()._id, IndividualJudgement.create()._id];

				Judgement.save(judgement).then(
					function(saved) {
						Judgement.Model.findById(judgement._id, function(findError, found) {
							compareResult = Judgement.compare(judgement, found);

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
    
	describe('JudicialCase Model Tests', function() {

		describe('JudicialCase.create()', function() {
		
			it('JudicialCase.create() creates a JudicialCase instance.', function() {
				var judicialCase = JudicialCase.create();
				assert(typeof(judicialCase) === "object");
			});

			it('JudicialCase.create() creates a JudicialCase instance with _id field populated', function(){
				var judicialCase = JudicialCase.create();
				assert(typeof(judicialCase._id) === "object" && /^[a-f\d]{24}$/i.test(judicialCase._id));
			});
		});

		describe('JudicialCase.save()', function() {

			it('JudicialCase.save() throws an error if required fields are missing.', function(done) {
				var judicialCase = JudicialCase.create();
				var testFailed = 0;
                var error;
                
                var expectedErrorMessage = 'JudicialCase validation failed: name: Path `name` is required.';

				JudicialCase.save(judicialCase).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('JudicialCase.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'JudicialCase.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('JudicialCase.judgements must be a valid Array of IDs', function(done) {
				var judicialCase = JudicialCase.create();
				var testFailed = 0;
                var error;
                
                var expectedErrorMessage = 'JudicialCase validation failed: judgements: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "judgements"';

                judicialCase.name = 'Jones V. World';
                judicialCase.filedDate = new Date('2016-11-07');
                judicialCase.judgements = ['abcd1234efgh9876', 'abcd1234efgh9875'];
                judicialCase.judicialOpinions = [JudicialOpinion.create()._id, JudicialOpinion.create()._id];

				JudicialCase.save(judicialCase).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('JudicialCase.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'JudicialCase.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('JudicialCase.judicialOpinions must be a valid Array of IDs', function(done) {
				var judicialCase = JudicialCase.create();
				var testFailed = 0;
                var error;
                
                var expectedErrorMessage = 'JudicialCase validation failed: judicialOpinions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "judicialOpinions"';


                judicialCase.name = 'Jones V. World';
                judicialCase.filedDate = new Date('2016-11-07');
                judicialCase.judgements = [Judgement.create()._id, Judgement.create()._id];
                judicialCase.judicialOpinions = ['abcd1234efgh9876', 'abcd1234efgh9875'];

				JudicialCase.save(judicialCase).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('JudicialCase.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'JudicialCase.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves JudicialCase.', function(done){
				var judicialCase = JudicialCase.create();
				var error = null;
                var compareResult;

                judicialCase.name = 'Jones V. World';
                judicialCase.filedDate = new Date('2016-11-07');
                judicialCase.judgements = [Judgement.create()._id, Judgement.create()._id];
                judicialCase.judicialOpinions = [JudicialOpinion.create()._id, JudicialOpinion.create()._id];

				JudicialCase.save(judicialCase).then(
					function(saved) {
						JudicialCase.Model.findById(judicialCase._id, function(findError, found) {
							compareResult = JudicialCase.compare(judicialCase, found);

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
    
	describe('JudicialOpinion Model Tests', function() {

		describe('JudicialOpinion.create()', function() {
		
			it('JudicialOpinion.create() creates a JudicialOpinion instance.', function() {
				var judicialOpinion = JudicialOpinion.create();
				assert(typeof(judicialOpinion) === "object");
			});

			it('JudicialOpinion.create() creates a JudicialOpinion instance with _id field populated', function(){
				var judicialOpinion = JudicialOpinion.create();
				assert(typeof(judicialOpinion._id) === "object" && /^[a-f\d]{24}$/i.test(judicialOpinion._id));
			});
		});

		describe('JudicialOpinion.save()', function() {

			it('JudicialOpinion.save() throws an error if required fields are missing.', function(done) {
				var judicialOpinion = JudicialOpinion.create();
				var testFailed = 0;
                var error;
                
                var expectedErrorMessage = 'JudicialOpinion validation failed: judicialCase: Path `judicialCase` is required., text: Path `text` is required.';

				JudicialOpinion.save(judicialOpinion).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('JudicialOpinion.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'JudicialOpinion.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('JudicialOpinion.judicialCase must be a valid of ID.', function(done) {
				var judicialOpinion = JudicialOpinion.create();
				var testFailed = 0;
                var error;
                
                var expectedErrorMessage = 'JudicialOpinion validation failed: judicialCase: Cast to ObjectID failed for value "abcd1234efgh9876" at path "judicialCase"';

                judicialOpinion.text = 'I think hamburgers are alright.';
                judicialOpinion.judicialCase = 'abcd1234efgh9876';
                judicialOpinion.writtenByJudges = [Judge.create()._id, Judge.create()._id];
                judicialOpinion.signedByJudges = [Judge.create()._id, Judge.create()._id];
                judicialOpinion.laws = [Law.create()._id, Law.create()._id];

				JudicialOpinion.save(judicialOpinion).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('JudicialOpinion.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'JudicialOpinion.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('JudicialOpinion.writtenByJudges must be a valid Array of IDs.', function(done) {
				var judicialOpinion = JudicialOpinion.create();
				var testFailed = 0;
                var error;
                
                var expectedErrorMessage = 'JudicialOpinion validation failed: writtenByJudges: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9876\' ]" at path "writtenByJudges"';

                judicialOpinion.text = 'I think hamburgers are alright.';
                judicialOpinion.judicialCase = JudicialCase.create()._id;
                judicialOpinion.writtenByJudges = ['abcd1234efgh9876', 'abcd1234efgh9876'];
                judicialOpinion.signedByJudges = [Judge.create()._id, Judge.create()._id];
                judicialOpinion.laws = [Law.create()._id, Law.create()._id];

				JudicialOpinion.save(judicialOpinion).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('JudicialOpinion.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'JudicialOpinion.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('JudicialOpinion.signedByJudges must be a valid Array of IDs.', function(done) {
				var judicialOpinion = JudicialOpinion.create();
				var testFailed = 0;
                var error;
                
                var expectedErrorMessage = 'JudicialOpinion validation failed: signedByJudges: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9876\' ]" at path "signedByJudges"';

                judicialOpinion.text = 'I think hamburgers are alright.';
                judicialOpinion.judicialCase = JudicialCase.create()._id;
                judicialOpinion.writtenByJudges = [Judge.create()._id, Judge.create()._id];
                judicialOpinion.signedByJudges = ['abcd1234efgh9876', 'abcd1234efgh9876'];
                judicialOpinion.laws = [Law.create()._id, Law.create()._id];

				JudicialOpinion.save(judicialOpinion).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('JudicialOpinion.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'JudicialOpinion.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('JudicialOpinion.laws must be a valid Array of IDs.', function(done) {
				var judicialOpinion = JudicialOpinion.create();
				var testFailed = 0;
                var error;
                
                var expectedErrorMessage = 'JudicialOpinion validation failed: laws: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9876\' ]" at path "laws"';

                judicialOpinion.text = 'I think hamburgers are alright.';
                judicialOpinion.judicialCase = JudicialCase.create()._id;
                judicialOpinion.writtenByJudges = [Judge.create()._id, Judge.create()._id];
                judicialOpinion.signedByJudges = [Judge.create()._id, Judge.create()._id];
                judicialOpinion.laws = ['abcd1234efgh9876', 'abcd1234efgh9876'];

				JudicialOpinion.save(judicialOpinion).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('JudicialOpinion.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'JudicialOpinion.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves JudicialOpinion.', function(done){
				var judicialOpinion = JudicialOpinion.create();
				var error = null;
                var compareResult;

                judicialOpinion.text = 'I think hamburgers are alright.';
                judicialOpinion.judicialCase = JudicialCase.create()._id;
                judicialOpinion.writtenByJudges = [Judge.create()._id, Judge.create()._id];
                judicialOpinion.signedByJudges = [Judge.create()._id, Judge.create()._id];
                judicialOpinion.laws = [Law.create()._id, Law.create()._id];

				JudicialOpinion.save(judicialOpinion).then(
					function(saved) {
						JudicialOpinion.Model.findById(judicialOpinion._id, function(findError, found) {
							if (findError) {
								error = findError;
							}
							else {
								compareResult = JudicialOpinion.compare(judicialOpinion, found);
	
								if (compareResult.match == false)
									error = new Error(compareResult.message);
							}

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