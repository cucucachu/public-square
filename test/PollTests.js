"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var assert = require('assert');

var expect = require('expect');

var promiseFinally = require('promise.prototype.finally');

require('../dist/models/Modules/Poll/PollModule'); // Add 'finally()' to 'Promis.prototype'


promiseFinally.shim();
process.on('unhandledRejection', function (error) {
  console.log('unhandledRejection', error.message);
});

var Poll = require('../dist/models/Modules/Poll/Poll');

var PollResponse = require('../dist/models/Modules/Poll/PollResponse');

var PollOption = require('../dist/models/Modules/Poll/PollOption');

var Civilian = require('../dist/models/Modules/Poll/Civilian');

var Citizen = require('../dist/models/Modules/Poll/Citizen');

var Government = require('../dist/models/Modules/Government/Government');

var GovernmentInstitution = require('../dist/models/Modules/Government/GovernmentInstitution');

var OccupiedPosition = require('../dist/models/Modules/Government/OccupiedPosition');

var Bill = require('../dist/models/Modules/Government/Legislator/Bill');

var Judgement = require('../dist/models/Modules/Government/Judge/Judgement');

var JudicialOpinion = require('../dist/models/Modules/Government/Judge/JudicialOpinion');

var ExecutiveAction = require('../dist/models/Modules/Government/Executive/ExecutiveAction');

var User = require('../dist/models/Modules/User/User');

describe('Poll Module Tests', function () {
  before(function (done) {
    Poll.clear().then(function () {
      PollResponse.clear().then(function () {
        PollOption.clear().then(function () {
          Civilian.clear().then(function () {
            Citizen.clear().then(done, done);
          }, done);
        }, done);
      }, done);
    }, done);
  });
  describe('Poll Model Tests', function () {
    describe('Poll.create()', function () {
      it('Poll.create() creates a Poll instance.', function () {
        var poll = Poll.create();
        assert(_typeof(poll) === "object");
      });
      it('Poll.create() creates a Poll instance with _id field populated', function () {
        var poll = Poll.create();
        assert(_typeof(poll._id) === "object" && /^[a-f\d]{24}$/i.test(poll._id));
      });
    });
    describe('Poll.save()', function () {
      // it('Poll.save() throws an error if required fields are missing.', function(done) {
      // 	var poll = Poll.create();
      // 	var testFailed = 0;
      // 	var error;
      //     var expectedErrorMessage = '';
      // 	Poll.save(poll).then(
      // 		function(result) {
      // 			testFailed = 1;
      // 		},
      // 		function(rejectionErr) {
      // 			error = rejectionErr;
      // 		}
      // 	)
      // 	.finally(function() {
      // 		if (testFailed) done(new Error('Poll.save() promise resolved when it should have been rejected with Validation Error'));
      // 		else {
      // 			if (error != null && error.message == expectedErrorMessage) {
      // 				done();
      // 			}
      // 			else{
      // 				done(new Error(
      // 					'Poll.save() did not return the correct Validation Error.\n' +
      // 					'   Expected: ' + expectedErrorMessage + '\n' +
      // 					'   Actual:   ' + error.message
      // 				));
      // 			}
      // 		}
      // 	});
      // });
      it('Poll.government must be a valid ID.', function (done) {
        var poll = Poll.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Poll validation failed: government: Cast to ObjectID failed for value "abcd1234efgh9876" at path "government"';
        poll.government = 'abcd1234efgh9876';
        poll.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];
        poll.pollOptions = [PollOption.create()._id, PollOption.create()._id];
        Poll.save(poll).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Poll.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Poll.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Poll.governmentInstitution must be a valid ID.', function (done) {
        var poll = Poll.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Poll validation failed: governmentInstitution: Cast to ObjectID failed for value "abcd1234efgh9876" at path "governmentInstitution"';
        poll.governmentInstitution = 'abcd1234efgh9876';
        poll.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];
        poll.pollOptions = [PollOption.create()._id, PollOption.create()._id];
        Poll.save(poll).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Poll.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Poll.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Poll.occupiedPosition must be a valid ID.', function (done) {
        var poll = Poll.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Poll validation failed: occupiedPosition: Cast to ObjectID failed for value "abcd1234efgh9876" at path "occupiedPosition"';
        poll.occupiedPosition = 'abcd1234efgh9876';
        poll.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];
        poll.pollOptions = [PollOption.create()._id, PollOption.create()._id];
        Poll.save(poll).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Poll.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Poll.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Poll.bill must be a valid ID.', function (done) {
        var poll = Poll.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Poll validation failed: bill: Cast to ObjectID failed for value "abcd1234efgh9876" at path "bill"';
        poll.bill = 'abcd1234efgh9876';
        poll.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];
        poll.pollOptions = [PollOption.create()._id, PollOption.create()._id];
        Poll.save(poll).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Poll.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Poll.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Poll.judgement must be a valid ID.', function (done) {
        var poll = Poll.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Poll validation failed: judgement: Cast to ObjectID failed for value "abcd1234efgh9876" at path "judgement"';
        poll.judgement = 'abcd1234efgh9876';
        poll.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];
        poll.pollOptions = [PollOption.create()._id, PollOption.create()._id];
        Poll.save(poll).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Poll.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Poll.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Poll.judicialOpinion must be a valid ID.', function (done) {
        var poll = Poll.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Poll validation failed: judicialOpinion: Cast to ObjectID failed for value "abcd1234efgh9876" at path "judicialOpinion"';
        poll.judicialOpinion = 'abcd1234efgh9876';
        poll.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];
        poll.pollOptions = [PollOption.create()._id, PollOption.create()._id];
        Poll.save(poll).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Poll.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Poll.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Poll.executiveAction must be a valid ID.', function (done) {
        var poll = Poll.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Poll validation failed: executiveAction: Cast to ObjectID failed for value "abcd1234efgh9876" at path "executiveAction"';
        poll.executiveAction = 'abcd1234efgh9876';
        poll.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];
        poll.pollOptions = [PollOption.create()._id, PollOption.create()._id];
        Poll.save(poll).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Poll.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Poll.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Pollable Relationships are mutually exclusive. (2 set)', function (done) {
        var poll = Poll.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Poll validation failed: judicialOpinion: Only one pollable class allowed per Poll, executiveAction: Only one pollable class allowed per Poll';
        poll.judicialOpinion = JudicialOpinion.create()._id;
        poll.executiveAction = ExecutiveAction.create()._id;
        poll.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];
        poll.pollOptions = [PollOption.create()._id, PollOption.create()._id];
        Poll.save(poll).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Poll.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Poll.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Pollable Relationships are mutually exclusive. (All set)', function (done) {
        var poll = Poll.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Poll validation failed: government: Only one pollable class allowed per Poll, governmentInstitution: Only one pollable class allowed per Poll, occupiedPosition: Only one pollable class allowed per Poll, bill: Only one pollable class allowed per Poll, judgement: Only one pollable class allowed per Poll, judicialOpinion: Only one pollable class allowed per Poll, executiveAction: Only one pollable class allowed per Poll';
        poll.government = Government.create()._id;
        poll.governmentInstitution = GovernmentInstitution.create()._id;
        poll.occupiedPosition = OccupiedPosition.create()._id;
        poll.bill = Bill.create()._id;
        poll.judgement = Judgement.create()._id;
        poll.judicialOpinion = JudicialOpinion.create()._id;
        poll.executiveAction = ExecutiveAction.create()._id;
        poll.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];
        poll.pollOptions = [PollOption.create()._id, PollOption.create()._id];
        Poll.save(poll).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Poll.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Poll.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Poll.pollResponses must be a valid Array of IDs.', function (done) {
        var poll = Poll.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Poll validation failed: pollResponses: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "pollResponses"';
        poll.government = Government.create()._id;
        poll.pollResponses = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        poll.pollOptions = [PollOption.create()._id, PollOption.create()._id];
        Poll.save(poll).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Poll.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Poll.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Poll.pollOptions must be a valid Array of IDs.', function (done) {
        var poll = Poll.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Poll validation failed: pollOptions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "pollOptions"';
        poll.government = Government.create()._id;
        poll.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];
        poll.pollOptions = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        Poll.save(poll).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Poll.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Poll.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Poll.', function (done) {
        var poll = Poll.create();
        var error = null;
        var compareResult;
        poll.government = Government.create()._id;
        poll.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];
        poll.pollOptions = [PollOption.create()._id, PollOption.create()._id];
        Poll.save(poll).then(function (saved) {
          Poll.Model.findById(poll._id, function (findError, found) {
            compareResult = Poll.compare(poll, found);
            if (compareResult.match == false) error = new Error(compareResult.message);
          });
        }, function (saveErr) {
          testFailed = 1;
          error = saveErr;
        }).finally(function () {
          if (error) done(error);else done();
        });
      });
    });
  });
  describe('PollResponse Model Tests', function () {
    describe('PollResponse.create()', function () {
      it('PollResponse.create() creates a PollResponse instance.', function () {
        var pollResponse = PollResponse.create();
        assert(_typeof(pollResponse) === "object");
      });
      it('PollResponse.create() creates a PollResponse instance with _id field populated', function () {
        var pollResponse = PollResponse.create();
        assert(_typeof(pollResponse._id) === "object" && /^[a-f\d]{24}$/i.test(pollResponse._id));
      });
    });
    describe('PollResponse.save()', function () {
      it('PollResponse.save() throws an error if required fields are missing.', function (done) {
        var pollResponse = PollResponse.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'PollResponse validation failed: pollOption: Path `pollOption` is required., poll: Path `poll` is required., civilian: Path `civilian` is required.';
        PollResponse.save(pollResponse).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('PollResponse.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('PollResponse.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('PollResponse.civilian must be a valid ID.', function (done) {
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
        PollResponse.save(pollResponse).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('PollResponse.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('PollResponse.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('PollResponse.citizen must be a valid ID.', function (done) {
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
        PollResponse.save(pollResponse).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('PollResponse.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('PollResponse.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('PollResponse.poll must be a valid ID.', function (done) {
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
        PollResponse.save(pollResponse).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('PollResponse.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('PollResponse.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('PollResponse.pollOption must be a valid ID.', function (done) {
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
        PollResponse.save(pollResponse).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('PollResponse.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('PollResponse.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Poll Response.', function (done) {
        var pollResponse = PollResponse.create();
        var error = null;
        var compareResult;
        pollResponse.comment = 'I very strongly disapprove of this thing.';
        pollResponse.latest = true;
        pollResponse.civilian = Civilian.create()._id;
        pollResponse.citizen = Citizen.create()._id;
        pollResponse.poll = Poll.create()._id;
        pollResponse.pollOption = PollOption.create()._id;
        PollResponse.save(pollResponse).then(function (saved) {
          PollResponse.Model.findById(pollResponse._id, function (findError, found) {
            compareResult = PollResponse.compare(pollResponse, found);
            if (compareResult.match == false) error = new Error(compareResult.message);
          });
        }, function (saveErr) {
          testFailed = 1;
          error = saveErr;
        }).finally(function () {
          if (error) done(error);else done();
        });
      });
    });
  });
  describe('PollOption Model Tests', function () {
    describe('PollOption.create()', function () {
      it('PollOption.create() creates a PollOption instance.', function () {
        var pollOption = PollOption.create();
        assert(_typeof(pollOption) === "object");
      });
      it('PollOption.create() creates a PollOption instance with _id field populated', function () {
        var pollOption = PollOption.create();
        assert(_typeof(pollOption._id) === "object" && /^[a-f\d]{24}$/i.test(pollOption._id));
      });
    });
    describe('PollOption.save()', function () {
      it('PollOption.save() throws an error if required fields are missing.', function (done) {
        var pollOption = PollOption.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'PollOption validation failed: name: Path `name` is required.';
        PollOption.save(pollOption).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('PollOption.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('PollOption.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Poll Option.', function (done) {
        var pollOption = PollOption.create();
        var error = null;
        var compareResult;
        pollOption.name = 'Yay';
        pollOption.positive = true;
        pollOption.negative = false;
        pollOption.weight = 1;
        PollOption.save(pollOption).then(function (saved) {
          PollOption.Model.findById(pollOption._id, function (findError, found) {
            compareResult = PollOption.compare(pollOption, found);
            if (compareResult.match == false) error = new Error(compareResult.message);
          });
        }, function (saveErr) {
          testFailed = 1;
          error = saveErr;
        }).finally(function () {
          if (error) done(error);else done();
        });
      });
    });
  });
  describe('Civilian Model Tests', function () {
    describe('Civilian.create()', function () {
      it('Civilian.create() creates a Civilian instance.', function () {
        var civilian = Civilian.create();
        assert(_typeof(civilian) === "object");
      });
      it('Civilian.create() creates a Civilian instance with _id field populated', function () {
        var civilian = Civilian.create();
        assert(_typeof(civilian._id) === "object" && /^[a-f\d]{24}$/i.test(civilian._id));
      });
    });
    describe('Civilian.save()', function () {
      it('Civilian.save() throws an error if required fields are missing.', function (done) {
        var civilian = Civilian.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Civilian validation failed: user: Path `user` is required.';
        Civilian.save(civilian).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Civilian.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Civilian.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Civilian.user must be a valid ID.', function (done) {
        var civilian = Civilian.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Civilian validation failed: user: Cast to ObjectID failed for value "abcd1234efgh9876" at path "user"';
        civilian.user = 'abcd1234efgh9876';
        civilian.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];
        Civilian.save(civilian).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Civilian.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Civilian.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Civilian.pollResponses must be a valid Array of IDs.', function (done) {
        var civilian = Civilian.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Civilian validation failed: pollResponses: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "pollResponses"';
        civilian.user = User.create()._id;
        civilian.pollResponses = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        Civilian.save(civilian).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Civilian.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Civilian.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Civilian.', function (done) {
        var civilian = Civilian.create();
        var error = null;
        var compareResult;
        civilian.user = User.create()._id;
        civilian.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];
        Civilian.save(civilian).then(function (saved) {
          Civilian.Model.findById(civilian._id, function (findError, found) {
            compareResult = Civilian.compare(civilian, found);
            if (compareResult.match == false) error = new Error(compareResult.message);
          });
        }, function (saveErr) {
          testFailed = 1;
          error = saveErr;
        }).finally(function () {
          if (error) done(error);else done();
        });
      });
    });
  });
  describe('Citizen Model Tests', function () {
    describe('Citizen.create()', function () {
      it('Citizen.create() creates a Citizen instance.', function () {
        var citizen = Citizen.create();
        assert(_typeof(citizen) === "object");
      });
      it('Citizen.create() creates a Citizen instance with _id field populated', function () {
        var citizen = Citizen.create();
        assert(_typeof(citizen._id) === "object" && /^[a-f\d]{24}$/i.test(citizen._id));
      });
    });
    describe('Citizen.save()', function () {
      it('Citizen.save() throws an error if required fields are missing.', function (done) {
        var citizen = Citizen.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Citizen validation failed: user: Path `user` is required.';
        Citizen.save(citizen).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Citizen.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Citizen.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Citizen.user must be a valid ID.', function (done) {
        var citizen = Citizen.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Citizen validation failed: user: Cast to ObjectID failed for value "abcd1234efgh9876" at path "user"';
        citizen.user = 'abcd1234efgh9876';
        citizen.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];
        Citizen.save(citizen).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Citizen.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Citizen.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Citizen.pollResponses must be a valid Array of IDs.', function (done) {
        var citizen = Citizen.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Citizen validation failed: pollResponses: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "pollResponses"';
        citizen.user = User.create()._id;
        citizen.pollResponses = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        Citizen.save(citizen).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Citizen.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Citizen.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Citizen.', function (done) {
        var citizen = Citizen.create();
        var error = null;
        var compareResult;
        citizen.user = User.create()._id;
        citizen.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];
        Citizen.save(citizen).then(function (saved) {
          Citizen.Model.findById(citizen._id, function (findError, found) {
            compareResult = Citizen.compare(citizen, found);
            if (compareResult.match == false) error = new Error(compareResult.message);
          });
        }, function (saveErr) {
          testFailed = 1;
          error = saveErr;
        }).finally(function () {
          if (error) done(error);else done();
        });
      });
    });
  });
});