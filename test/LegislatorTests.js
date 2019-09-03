"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var assert = require('assert');

var database = require('../dist/models/database');

require('../dist/models/Modules/Government/Legislator/LegislatorModule');

var OccupiedPosition = require('../dist/models/Modules/Government/OccupiedPosition');

var Legislator = require('../dist/models/Modules/Government/Legislator/Legislator');

var IndividualLegislativeVote = require('../dist/models/Modules/Government/Legislator/IndividualLegislativeVote');

var LegislativeVoteOption = require('../dist/models/Modules/Government/Legislator/LegislativeVoteOption');

var LegislativeVote = require('../dist/models/Modules/Government/Legislator/LegislativeVote');

var BillSponsorship = require('../dist/models/Modules/Government/Legislator/BillSponsorship');

var Bill = require('../dist/models/Modules/Government/Legislator/Bill');

var BillVersion = require('../dist/models/Modules/Government/Legislator/BillVersion');

var Law = require('../dist/models/Modules/Government/Law');

var Poll = require('../dist/models/Modules/Poll/Poll');

describe('Legislator Module Tests', function () {
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
            return Legislator.clear();

          case 4:
            _context.next = 6;
            return IndividualLegislativeVote.clear();

          case 6:
            _context.next = 8;
            return LegislativeVoteOption.clear();

          case 8:
            _context.next = 10;
            return LegislativeVote.clear();

          case 10:
            _context.next = 12;
            return BillSponsorship.clear();

          case 12:
            _context.next = 14;
            return Bill.clear();

          case 14:
            _context.next = 16;
            return BillVersion.clear();

          case 16:
            _context.next = 18;
            return Law.clear();

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  })));
  describe('Legislator Model Tests', function () {
    describe('Legislator.create()', function () {
      it('Legislator.create() creates a Legislator instance.', function () {
        var legislator = Legislator.create();
        assert(_typeof(legislator) === "object");
      });
      it('Legislator.create() creates a Legislator instance with _id field populated', function () {
        var legislator = Legislator.create();
        assert(_typeof(legislator._id) === "object" && /^[a-f\d]{24}$/i.test(legislator._id));
      });
    });
    describe('Legislator.save()', function () {
      it('Legislator.save() throws an error if required fields are missing.', function (done) {
        var legislator = Legislator.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Legislator validation failed: occupiedPosition: Path `occupiedPosition` is required.';
        Legislator.save(legislator).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Legislator.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Legislator.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Legislator.occupiedPosition must be a valid ID.', function (done) {
        var legislator = Legislator.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Legislator validation failed: occupiedPosition: Cast to ObjectID failed for value "abcd1234efgh9876" at path "occupiedPosition"';
        legislator.occupiedPosition = 'abcd1234efgh9876';
        legislator.billSponsorships = [BillSponsorship.create()._id, BillSponsorship.create()._id];
        legislator.billVersions = [BillVersion.create()._id, BillVersion.create()._id];
        legislator.individualLegislativeVotes = [IndividualLegislativeVote.create()._id, IndividualLegislativeVote.create()._id];
        Legislator.save(legislator).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Legislator.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Legislator.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Legislator.billSponsorships must be a valid Array of IDs.', function (done) {
        var legislator = Legislator.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Legislator validation failed: billSponsorships: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "billSponsorships"';
        legislator.occupiedPosition = OccupiedPosition.create()._id;
        legislator.billSponsorships = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        legislator.billVersions = [BillVersion.create()._id, BillVersion.create()._id];
        legislator.individualLegislativeVotes = [IndividualLegislativeVote.create()._id, IndividualLegislativeVote.create()._id];
        Legislator.save(legislator).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Legislator.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Legislator.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Legislator.billVersions must be a valid Array of IDs.', function (done) {
        var legislator = Legislator.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Legislator validation failed: billVersions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "billVersions"';
        legislator.occupiedPosition = OccupiedPosition.create()._id;
        legislator.billSponsorships = [BillSponsorship.create()._id, BillSponsorship.create()._id];
        legislator.billVersions = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        legislator.individualLegislativeVotes = [IndividualLegislativeVote.create()._id, IndividualLegislativeVote.create()._id];
        Legislator.save(legislator).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Legislator.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Legislator.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Legislator.individualLegislativeVotes must be a valid Array of IDs.', function (done) {
        var legislator = Legislator.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Legislator validation failed: individualLegislativeVotes: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "individualLegislativeVotes"';
        legislator.occupiedPosition = OccupiedPosition.create()._id;
        legislator.billSponsorships = [BillSponsorship.create()._id, BillSponsorship.create()._id];
        legislator.billVersions = [BillVersion.create()._id, BillVersion.create()._id];
        legislator.individualLegislativeVotes = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        Legislator.save(legislator).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Legislator.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Legislator.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Legislator.', function (done) {
        var legislator = Legislator.create();
        var error = null;
        var compareResult;
        legislator.occupiedPosition = OccupiedPosition.create()._id;
        legislator.billSponsorships = [BillSponsorship.create()._id, BillSponsorship.create()._id];
        legislator.billVersions = [BillVersion.create()._id, BillVersion.create()._id];
        legislator.individualLegislativeVotes = [IndividualLegislativeVote.create()._id, IndividualLegislativeVote.create()._id];
        Legislator.save(legislator).then(function (saved) {
          Legislator.findById(legislator._id).then(function (found) {
            compareResult = Legislator.compare(legislator, found);
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
  describe('IndividualLegislativeVote Model Tests', function () {
    describe('IndividualLegislativeVote.create()', function () {
      it('IndividualLegislativeVote.create() creates a IndividualLegislativeVote instance.', function () {
        var individualLegislativeVote = IndividualLegislativeVote.create();
        assert(_typeof(individualLegislativeVote) === "object");
      });
      it('IndividualLegislativeVote.create() creates a IndividualLegislativeVote instance with _id field populated', function () {
        var individualLegislativeVote = IndividualLegislativeVote.create();
        assert(_typeof(individualLegislativeVote._id) === "object" && /^[a-f\d]{24}$/i.test(individualLegislativeVote._id));
      });
    });
    describe('IndividualLegislativeVote.save()', function () {
      it('IndividualLegislativeVote.save() throws an error if required fields are missing.', function (done) {
        var individualLegislativeVote = IndividualLegislativeVote.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'IndividualLegislativeVote validation failed: legislativeVoteOption: Path `legislativeVoteOption` is required., legislativeVote: Path `legislativeVote` is required., legislator: Path `legislator` is required.';
        IndividualLegislativeVote.save(individualLegislativeVote).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('IndividualLegislativeVote.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('IndividualLegislativeVote.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('IndividualLegislativeVote.legislator must be a valid ID.', function (done) {
        var individualLegislativeVote = IndividualLegislativeVote.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'IndividualLegislativeVote validation failed: legislator: Cast to ObjectID failed for value "abcd1234efgh9876" at path "legislator"';
        individualLegislativeVote.legislator = 'abcd1234efgh9876';
        individualLegislativeVote.legislativeVote = LegislativeVote.create()._id;
        individualLegislativeVote.legislativeVoteOption = LegislativeVoteOption.create()._id;
        IndividualLegislativeVote.save(individualLegislativeVote).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('IndividualLegislativeVote.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('IndividualLegislativeVote.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('IndividualLegislativeVote.legislativeVote must be a valid ID.', function (done) {
        var individualLegislativeVote = IndividualLegislativeVote.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'IndividualLegislativeVote validation failed: legislativeVote: Cast to ObjectID failed for value "abcd1234efgh9876" at path "legislativeVote"';
        individualLegislativeVote.legislator = Legislator.create()._id;
        individualLegislativeVote.legislativeVote = 'abcd1234efgh9876';
        individualLegislativeVote.legislativeVoteOption = LegislativeVoteOption.create()._id;
        IndividualLegislativeVote.save(individualLegislativeVote).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('IndividualLegislativeVote.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('IndividualLegislativeVote.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('IndividualLegislativeVote.legislativeVoteOption must be a valid ID.', function (done) {
        var individualLegislativeVote = IndividualLegislativeVote.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'IndividualLegislativeVote validation failed: legislativeVoteOption: Cast to ObjectID failed for value "abcd1234efgh9876" at path "legislativeVoteOption"';
        individualLegislativeVote.legislator = Legislator.create()._id;
        individualLegislativeVote.legislativeVote = LegislativeVote.create()._id;
        individualLegislativeVote.legislativeVoteOption = 'abcd1234efgh9876';
        IndividualLegislativeVote.save(individualLegislativeVote).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('IndividualLegislativeVote.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('IndividualLegislativeVote.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Individual Legislative Vote.', function (done) {
        var individualLegislativeVote = IndividualLegislativeVote.create();
        var error = null;
        var compareResult;
        individualLegislativeVote.legislator = Legislator.create()._id;
        individualLegislativeVote.legislativeVote = LegislativeVote.create()._id;
        individualLegislativeVote.legislativeVoteOption = LegislativeVoteOption.create()._id;
        IndividualLegislativeVote.save(individualLegislativeVote).then(function (saved) {
          IndividualLegislativeVote.findById(individualLegislativeVote._id).then(function (found) {
            compareResult = IndividualLegislativeVote.compare(individualLegislativeVote, found);
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
  describe('LegislativeVote Model Tests', function () {
    describe('LegislativeVote.create()', function () {
      it('LegislativeVote.create() creates a LegislativeVote instance.', function () {
        var legislativeVote = LegislativeVote.create();
        assert(_typeof(legislativeVote) === "object");
      });
      it('LegislativeVote.create() creates a LegislativeVote instance with _id field populated', function () {
        var legislativeVote = LegislativeVote.create();
        assert(_typeof(legislativeVote._id) === "object" && /^[a-f\d]{24}$/i.test(legislativeVote._id));
      });
    });
    describe('LegislativeVote.save()', function () {
      it('LegislativeVote.save() throws an error if required fields are missing.', function (done) {
        var legislativeVote = LegislativeVote.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'LegislativeVote validation failed: billVersion: Path `billVersion` is required., date: Path `date` is required.';
        LegislativeVote.save(legislativeVote).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('LegislativeVote.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('LegislativeVote.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('LegislativeVote.billVersion must be a valid ID.', function (done) {
        var legislativeVote = LegislativeVote.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'LegislativeVote validation failed: billVersion: Cast to ObjectID failed for value "abcd1234efgh9876" at path "billVersion"';
        legislativeVote.date = new Date();
        legislativeVote.billVersion = 'abcd1234efgh9876';
        legislativeVote.individualLegislativeVotes = [IndividualLegislativeVote.create()._id, IndividualLegislativeVote.create()._id];
        LegislativeVote.save(legislativeVote).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('LegislativeVote.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('LegislativeVote.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('LegislativeVote.individualLegislativeVotes must be a valid Array of IDs.', function (done) {
        var legislativeVote = LegislativeVote.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'LegislativeVote validation failed: individualLegislativeVotes: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "individualLegislativeVotes"';
        legislativeVote.date = new Date();
        legislativeVote.billVersion = BillVersion.create()._id;
        legislativeVote.individualLegislativeVotes = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        LegislativeVote.save(legislativeVote).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('LegislativeVote.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('LegislativeVote.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Legislative Vote.', function (done) {
        var legislativeVote = LegislativeVote.create();
        var error = null;
        var compareResult;
        legislativeVote.date = new Date();
        legislativeVote.billVersion = BillVersion.create()._id;
        legislativeVote.individualLegislativeVotes = [IndividualLegislativeVote.create()._id, IndividualLegislativeVote.create()._id];
        LegislativeVote.save(legislativeVote).then(function (saved) {
          LegislativeVote.findById(legislativeVote._id).then(function (found) {
            compareResult = LegislativeVote.compare(legislativeVote, found);
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
  describe('LegislativeVoteOption Model Tests', function () {
    describe('LegislativeVoteOption.create()', function () {
      it('LegislativeVoteOption.create() creates a LegislativeVoteOption instance.', function () {
        var legislativeVoteOption = LegislativeVoteOption.create();
        assert(_typeof(legislativeVoteOption) === "object");
      });
      it('LegislativeVoteOption.create() creates a LegislativeVoteOption instance with _id field populated', function () {
        var legislativeVoteOption = LegislativeVoteOption.create();
        assert(_typeof(legislativeVoteOption._id) === "object" && /^[a-f\d]{24}$/i.test(legislativeVoteOption._id));
      });
    });
    describe('LegislativeVoteOption.save()', function () {
      it('LegislativeVoteOption.save() throws an error if required fields are missing.', function (done) {
        var legislativeVoteOption = LegislativeVoteOption.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'LegislativeVoteOption validation failed: name: Path `name` is required.';
        LegislativeVoteOption.save(legislativeVoteOption).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('LegislativeVoteOption.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('LegislativeVoteOption.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Legislative Vote Definition.', function (done) {
        var legislativeVoteOption = LegislativeVoteOption.create();
        var error = null;
        var compareResult;
        legislativeVoteOption.name = 'Yay';
        legislativeVoteOption.positive = true;
        legislativeVoteOption.negative = false;
        legislativeVoteOption.countsTowardsTotal = true;
        LegislativeVoteOption.save(legislativeVoteOption).then(function (saved) {
          LegislativeVoteOption.Model.findById(legislativeVoteOption._id, function (findError, found) {
            compareResult = LegislativeVoteOption.compare(legislativeVoteOption, found);
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
  describe('Bill Model Tests', function () {
    describe('Bill.create()', function () {
      it('Bill.create() creates a Bill instance.', function () {
        var bill = Bill.create();
        assert(_typeof(bill) === "object");
      });
      it('Bill.create() creates a Bill instance with _id field populated', function () {
        var bill = Bill.create();
        assert(_typeof(bill._id) === "object" && /^[a-f\d]{24}$/i.test(bill._id));
      });
    });
    describe('Bill.save()', function () {
      it('Bill.save() throws an error if required fields are missing.', function (done) {
        var bill = Bill.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Bill validation failed: billVersions: Path `billVersions` is required.Bill validation failed: billSponsorships: Path `billSponsorships` is required. Bill validation failed: name: Path `name` is required., poll: Path `poll` is required.';
        Bill.save(bill).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Bill.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Bill.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Bill.billVersions is a valid Array of IDs.', function (done) {
        var bill = Bill.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Bill validation failed: billVersions: Path `billVersions` is required. Bill validation failed: billVersions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "billVersions"';
        bill.name = 'Get Everyone Using Public Square Act 2019';
        bill.passageDate = new Date();
        bill.signedDate = new Date();
        bill.poll = Poll.create()._id;
        bill.billVersions = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        bill.laws = [Law.create()._id, Law.create()._id];
        bill.billSponsorships = [BillSponsorship.create()._id, BillSponsorship.create().id];
        Bill.save(bill).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Bill.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Bill.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Bill.laws is a valid Array of IDs.', function (done) {
        var bill = Bill.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Bill validation failed: laws: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "laws"';
        bill.name = 'Get Everyone Using Public Square Act 2019';
        bill.passageDate = new Date();
        bill.signedDate = new Date();
        bill.poll = Poll.create()._id;
        bill.billVersions = [BillVersion.create()._id, BillVersion.create()._id];
        bill.laws = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        bill.billSponsorships = [BillSponsorship.create()._id, BillSponsorship.create().id];
        Bill.save(bill).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Bill.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Bill.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Bill.billSponsorships is a valid Array of IDs.', function (done) {
        var bill = Bill.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Bill validation failed: billSponsorships: Path `billSponsorships` is required. Bill validation failed: billSponsorships: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "billSponsorships"';
        bill.name = 'Get Everyone Using Public Square Act 2019';
        bill.passageDate = new Date();
        bill.signedDate = new Date();
        bill.poll = Poll.create()._id;
        bill.billVersions = [BillVersion.create()._id, BillVersion.create()._id];
        bill.laws = [Law.create()._id, Law.create()._id];
        bill.billSponsorships = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        Bill.save(bill).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Bill.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Bill.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Bill.', function (done) {
        var bill = Bill.create();
        var error = null;
        var compareResult;
        bill.name = 'Get Everyone Using Public Square Act 2019';
        bill.passageDate = new Date();
        bill.signedDate = new Date();
        bill.poll = Poll.create()._id;
        bill.billVersions = [BillVersion.create()._id, BillVersion.create()._id];
        bill.laws = [Law.create()._id, Law.create()._id];
        bill.billSponsorships = [BillSponsorship.create()._id, BillSponsorship.create().id];
        Bill.save(bill).then(function (saved) {
          Bill.findById(bill._id).then(function (found) {
            compareResult = Bill.compare(bill, found);
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
  describe('BillVersion Model Tests', function () {
    describe('BillVersion.create()', function () {
      it('BillVersion.create() creates a BillVersion instance.', function () {
        var billVersion = BillVersion.create();
        assert(_typeof(billVersion) === "object");
      });
      it('BillVersion.create() creates a BillVersion instance with _id field populated', function () {
        var billVersion = BillVersion.create();
        assert(_typeof(billVersion._id) === "object" && /^[a-f\d]{24}$/i.test(billVersion._id));
      });
    });
    describe('BillVersion.save()', function () {
      it('BillVersion.save() throws an error if required fields are missing.', function (done) {
        var billVersion = BillVersion.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'BillVersion validation failed: bill: Path `bill` is required., date: Path `date` is required., text: Path `text` is required., versionNumber: Path `versionNumber` is required.';
        BillVersion.save(billVersion).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('BillVersion.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('BillVersion.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('BillVersion.bill must be a valid ID.', function (done) {
        var billVersion = BillVersion.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'BillVersion validation failed: bill: Cast to ObjectID failed for value "abcd1234efgh9876" at path "bill"';
        billVersion.versionNumber = 1;
        billVersion.text = 'Public Square is now owned and operated by the government.';
        billVersion.date = new Date();
        billVersion.bill = 'abcd1234efgh9876';
        billVersion.legislators = [Legislator.create()._id, Legislator.create()._id];
        billVersion.legislativeVotes = [LegislativeVote.create()._id, LegislativeVote.create()._id];
        BillVersion.save(billVersion).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('BillVersion.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('BillVersion.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('BillVersion.legislators must be a valid Array of IDs.', function (done) {
        var billVersion = BillVersion.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'BillVersion validation failed: legislators: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "legislators"';
        billVersion.versionNumber = 1;
        billVersion.text = 'Public Square is now owned and operated by the government.';
        billVersion.date = new Date();
        billVersion.bill = Bill.create()._id;
        billVersion.legislators = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        billVersion.legislativeVotes = [LegislativeVote.create()._id, LegislativeVote.create()._id];
        BillVersion.save(billVersion).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('BillVersion.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('BillVersion.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('BillVersion.legislativeVotes must be a valid Array of IDs.', function (done) {
        var billVersion = BillVersion.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'BillVersion validation failed: legislativeVotes: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "legislativeVotes"';
        billVersion.versionNumber = 1;
        billVersion.text = 'Public Square is now owned and operated by the government.';
        billVersion.date = new Date();
        billVersion.bill = Bill.create()._id;
        billVersion.legislators = [Legislator.create()._id, Legislator.create()._id];
        billVersion.legislativeVotes = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        BillVersion.save(billVersion).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('BillVersion.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('BillVersion.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Bill Version.', function (done) {
        var billVersion = BillVersion.create();
        var error = null;
        var compareResult;
        billVersion.versionNumber = 1;
        billVersion.text = 'Public Square is now owned and operated by the government.';
        billVersion.date = new Date();
        billVersion.bill = Bill.create()._id;
        billVersion.legislators = [Legislator.create()._id, Legislator.create()._id];
        billVersion.legislativeVotes = [LegislativeVote.create()._id, LegislativeVote.create()._id];
        BillVersion.save(billVersion).then(function (saved) {
          BillVersion.findById(billVersion._id).then(function (found) {
            compareResult = BillVersion.compare(billVersion, found);
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
  describe('BillSponsorship Model Tests', function () {
    describe('BillSponsorship.create()', function () {
      it('BillSponsorship.create() creates a BillSponsorship instance.', function () {
        var billSponsorship = BillSponsorship.create();
        assert(_typeof(billSponsorship) === "object");
      });
      it('BillSponsorship.create() creates a BillSponsorship instance with _id field populated', function () {
        var billSponsorship = BillSponsorship.create();
        assert(_typeof(billSponsorship._id) === "object" && /^[a-f\d]{24}$/i.test(billSponsorship._id));
      });
    });
    describe('BillSponsorship.save()', function () {
      it('BillSponsorship.save() throws an error if required fields are missing.', function (done) {
        var billSponsorship = BillSponsorship.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'BillSponsorship validation failed: legislator: Path `legislator` is required., bill: Path `bill` is required., startDate: Path `startDate` is required.';
        BillSponsorship.save(billSponsorship).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('BillSponsorship.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('BillSponsorship.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('BillSponsorship.endDate must be greater than or equal to BillSponsorship.startDate.', function (done) {
        var billSponsorship = BillSponsorship.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'BillSponsorship validation failed: endDate: End Date must be greater than or equal to Start Date.';
        billSponsorship.primary = true;
        billSponsorship.startDate = new Date('2019-01-01');
        billSponsorship.endDate = new Date('2018-01-01');
        billSponsorship.legislator = Legislator.create()._id;
        billSponsorship.bill = Bill.create()._id;
        BillSponsorship.save(billSponsorship).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('BillSponsorship.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('BillSponsorship.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('BillSponsorship.legislator must be a valid ID.', function (done) {
        var billSponsorship = BillSponsorship.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'BillSponsorship validation failed: legislator: Cast to ObjectID failed for value "abcd1234efgh9876" at path "legislator"';
        billSponsorship.primary = true;
        billSponsorship.startDate = new Date('2019-01-01');
        billSponsorship.endDate = new Date('2019-01-02');
        billSponsorship.legislator = 'abcd1234efgh9876';
        billSponsorship.bill = Bill.create()._id;
        BillSponsorship.save(billSponsorship).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('BillSponsorship.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('BillSponsorship.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('BillSponsorship.bill must be a valid ID.', function (done) {
        var billSponsorship = BillSponsorship.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'BillSponsorship validation failed: bill: Cast to ObjectID failed for value "abcd1234efgh9876" at path "bill"';
        billSponsorship.primary = true;
        billSponsorship.startDate = new Date('2019-01-01');
        billSponsorship.endDate = new Date('2019-01-02');
        billSponsorship.legislator = Legislator.create()._id;
        billSponsorship.bill = 'abcd1234efgh9876';
        BillSponsorship.save(billSponsorship).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('BillSponsorship.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('BillSponsorship.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Bill Sponsorship.', function (done) {
        var billSponsorship = BillSponsorship.create();
        var error = null;
        var compareResult;
        billSponsorship.primary = true;
        billSponsorship.startDate = new Date('2019-01-01');
        billSponsorship.endDate = new Date('2019-01-02');
        billSponsorship.legislator = Legislator.create()._id;
        billSponsorship.bill = Bill.create()._id;
        BillSponsorship.save(billSponsorship).then(function (saved) {
          BillSponsorship.findById(billSponsorship._id).then(function (found) {
            compareResult = BillSponsorship.compare(billSponsorship, found);
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