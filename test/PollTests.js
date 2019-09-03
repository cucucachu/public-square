"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var assert = require('assert');

var database = require('../dist/models/database');

require('../dist/models/Modules/Poll/PollModule');

var Poll = require('../dist/models/Modules/Poll/Poll');

var PollResponse = require('../dist/models/Modules/Poll/PollResponse');

var PollOption = require('../dist/models/Modules/Poll/PollOption');

var Civilian = require('../dist/models/Modules/Poll/Civilian');

var Citizen = require('../dist/models/Modules/Poll/Citizen');

var Government = require('../dist/models/Modules/Government/Government');

var GeographicArea = require('../dist/models/Modules/Geography/GeographicArea');

var User = require('../dist/models/Modules/User/User');

describe('Poll Module Tests', function () {
  before(
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return database.connect();

          case 2:
            _context.next = 4;
            return Poll.clear();

          case 4:
            _context.next = 6;
            return PollResponse.clear();

          case 6:
            _context.next = 8;
            return PollOption.clear();

          case 8:
            _context.next = 10;
            return Civilian.clear();

          case 10:
            _context.next = 12;
            return Citizen.clear();

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  })));
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
      it('Poll.save() throws an error if required fields are missing.', function (done) {
        var poll = Poll.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Poll validation failed: pollable: Path `pollable` is required.';
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
        poll.pollable = Government.create()._id;
        poll.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];
        poll.pollOptions = [PollOption.create()._id, PollOption.create()._id];
        Poll.save(poll).then(function (saved) {
          Poll.findById(poll._id).then(function (found) {
            compareResult = Poll.compare(poll, found);
            if (compareResult.match == false) error = new Error(compareResult.message);
          }, function (findError) {
            error = findError;
          });
        }, function (saveErr) {
          error = saveErr;
        }).finally(function () {
          if (error) done(error);else done();
        });
      });
    });
    describe('Poll.walk()', function () {
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
      before(function (done) {
        Poll.save(poll).then(function () {
          Government.save(government).finally(done);
        });
      });
      it('Poll.walk(poll, \'pollable\') returns an instance of pollable.', function (done) {
        var expectedInstance = government;
        var error;
        Poll.walk(poll, 'pollable').then(function (foundInstance) {
          if (foundInstance == null) error = new Error('Poll.walk() did not return an instance.');else {
            if (!foundInstance._id.equals(expectedInstance._id)) {
              error = new Error('Poll.walk returned an instance, but it is not the right one.');
            }
          }
        }, function (walkError) {
          error = walkError;
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
        var expectedErrorMessage = 'PollResponse validation failed: pollOption: Path `pollOption` is required., poll: Path `poll` is required., civilian: Path `civilian` is required., date: Path `date` is required.';
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
        pollResponse.date = new Date();
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
        pollResponse.date = new Date();
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
        pollResponse.date = new Date();
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
        pollResponse.date = new Date();
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
        pollResponse.date = new Date();
        PollResponse.save(pollResponse).then(function (saved) {
          PollResponse.findById(pollResponse._id).then(function (found) {
            compareResult = PollResponse.compare(pollResponse, found);
            if (compareResult.match == false) error = new Error(compareResult.message);
          }, function (findError) {
            error = findError;
          });
        }, function (saveErr) {
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
          PollOption.findById(pollOption._id).then(function (found) {
            compareResult = PollOption.compare(pollOption, found);
            if (compareResult.match == false) error = new Error(compareResult.message);
          }, function (findError) {
            error = findError;
          });
        }, function (saveErr) {
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
        var expectedErrorMessage = 'Civilian validation failed: user: Path `user` is required., startDate: Path `startDate` is required.';
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
        civilian.startDate = new Date();
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
        civilian.startDate = new Date();
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
        civilian.startDate = new Date();
        civilian.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];
        Civilian.save(civilian).then(function (saved) {
          Civilian.findById(civilian._id).then(function (found) {
            compareResult = Civilian.compare(civilian, found);
            if (compareResult.match == false) error = new Error(compareResult.message);
          }, function (findError) {
            error = findError;
          });
        }, function (saveErr) {
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
        var expectedErrorMessage = 'Citizen validation failed: user: Path `user` is required., startDate: Path `startDate` is required.';
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
        citizen.startDate = new Date();
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
        citizen.startDate = new Date();
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
        citizen.startDate = new Date();
        citizen.pollResponses = [PollResponse.create()._id, PollResponse.create()._id];
        Citizen.save(citizen).then(function (saved) {
          Citizen.findById(citizen._id).then(function (found) {
            compareResult = Citizen.compare(citizen, found);
            if (compareResult.match == false) error = new Error(compareResult.message);
          }, function (findError) {
            error = findError;
          });
        }, function (saveErr) {
          error = saveErr;
        }).finally(function () {
          if (error) done(error);else done();
        });
      });
    });
  });
  after(function () {
    database.close();
  });
});