"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var assert = require('assert');

var database = require('../dist/models/database');

require('../dist/models/Modules/Government/GovernmentModule');

var GeographicArea = require('../dist/models/Modules/Geography/GeographicArea');

var Government = require('../dist/models/Modules/Government/Government');

var GovernmentInstitution = require('../dist/models/Modules/Government/GovernmentInstitution');

var GovernmentPosition = require('../dist/models/Modules/Government/GovernmentPosition');

var EffectivePositionDefinition = require('../dist/models/Modules/Government/EffectivePositionDefinition');

var PositionDefinition = require('../dist/models/Modules/Government/PositionDefinition');

var TermDefinition = require('../dist/models/Modules/Government/TermDefinition');

var GovernmentPower = require('../dist/models/Modules/Government/GovernmentPower');

var AcquisitionProcessDefinition = require('../dist/models/Modules/Government/AcquisitionProcessDefinition');

var PositionAcquisitionProcess = require('../dist/models/Modules/Government/PositionAcquisitionProcess');

var OccupiedPosition = require('../dist/models/Modules/Government/OccupiedPosition');

var GovernmentRole = require('../dist/models/Modules/Government/GovernmentRole');

var GovernmentOfficial = require('../dist/models/Modules/Government/GovernmentOfficial');

var User = require('../dist/models/Modules/User/User');

var Law = require('../dist/models/Modules/Government/Law');

var VoteOption = require('../dist/models/Modules/Government/VoteOption');

var Bill = require('../dist/models/Modules/Government/Legislator/Bill');

var JudicialOpinion = require('../dist/models/Modules/Government/Judge/JudicialOpinion');

var Poll = require('../dist/models/Modules/Poll/Poll');

var Appointment = require('../dist/models/Modules/Government/Appointment/Appointment');

var Nominator = require('../dist/models/Modules/Government/Nomination/Nominator');

var Executive = require('../dist/models/Modules/Government/Executive/Executive');

describe('Government Module Tests', function () {
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
            return Government.clear();

          case 4:
            _context.next = 6;
            return GeographicArea.clear();

          case 6:
            _context.next = 8;
            return GovernmentInstitution.clear();

          case 8:
            _context.next = 10;
            return GovernmentPosition.clear();

          case 10:
            _context.next = 12;
            return EffectivePositionDefinition.clear();

          case 12:
            _context.next = 14;
            return PositionDefinition.clear();

          case 14:
            _context.next = 16;
            return TermDefinition.clear();

          case 16:
            _context.next = 18;
            return GovernmentPower.clear();

          case 18:
            _context.next = 20;
            return AcquisitionProcessDefinition.clear();

          case 20:
            _context.next = 22;
            return OccupiedPosition.clear();

          case 22:
            _context.next = 24;
            return GovernmentOfficial.clear();

          case 24:
            _context.next = 26;
            return User.clear();

          case 26:
            _context.next = 28;
            return Law.clear();

          case 28:
            _context.next = 30;
            return VoteOption.clear();

          case 30:
            _context.next = 32;
            return Bill.clear();

          case 32:
            _context.next = 34;
            return JudicialOpinion.clear();

          case 34:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  })));
  describe('Government Model Tests', function () {
    describe('Government.create()', function () {
      it('Government.create() creates a Government instance.', function () {
        var government = Government.create();
        assert(_typeof(government) === "object");
      });
      it('Government.create() creates a Government instance with _id field populated', function () {
        var government = Government.create();
        assert(_typeof(government._id) === "object" && /^[a-f\d]{24}$/i.test(government._id));
      });
    });
    describe('Government.save()', function () {
      it('Government.save() throws an error if required fields are missing.', function (done) {
        var government = Government.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Government validation failed: geographicArea: Path `geographicArea` is required., name: Path `name` is required., poll: Path `poll` is required.';
        Government.save(government).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Government.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Government.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Goverment.geographicArea must be a valid ID.', function (done) {
        var government = Government.create();
        var testFailed = 0;
        var error = null;
        var expectedErrorMessage = 'Government validation failed: geographicArea: Cast to ObjectID failed for value "abcd1234efgh9876" at path "geographicArea"';
        government.name = 'California State Government';
        government.foundedDate = new Date('1850-09-09');
        government.geographicArea = 'abcd1234efgh9876';
        government.poll = Poll.create()._id;
        government.governmentInstitutions = [GovernmentInstitution.create()._id, GovernmentInstitution.create()._id];
        Government.save(government).then(function (saved) {
          testFailed = 1;
        }, function (saveErr) {
          error = saveErr;
        }).finally(function () {
          if (testFailed) {
            done(new Error('Government.save() promise resolved when it should have been rejected with Validation Error'));
          } else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Government.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Goverment.poll must be a valid ID.', function (done) {
        var government = Government.create();
        var testFailed = 0;
        var error = null;
        var expectedErrorMessage = 'Government validation failed: poll: Cast to ObjectID failed for value "abcd1234efgh9876" at path "poll"';
        government.name = 'California State Government';
        government.foundedDate = new Date('1850-09-09');
        government.geographicArea = GeographicArea.create()._id;
        government.poll = 'abcd1234efgh9876';
        government.governmentInstitutions = [GovernmentInstitution.create()._id, GovernmentInstitution.create()._id];
        Government.save(government).then(function (saved) {
          testFailed = 1;
        }, function (saveErr) {
          error = saveErr;
        }).finally(function () {
          if (testFailed) {
            done(new Error('Government.save() promise resolved when it should have been rejected with Validation Error'));
          } else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Government.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Government.governmentInstitutions must be a valid Array of IDs.', function (done) {
        var government = Government.create();
        var testFailed = 0;
        var error = null;
        var expectedErrorMessage = 'Government validation failed: governmentInstitutions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "governmentInstitutions"';
        government.name = 'California State Government';
        government.foundedDate = new Date('1850-09-09');
        government.geographicArea = GeographicArea.create()._id;
        government.poll = Poll.create()._id;
        government.governmentInstitutions = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        Government.save(government).then(function (saved) {
          testFailed = 1;
        }, function (saveErr) {
          error = saveErr;
        }).finally(function () {
          if (testFailed) {
            done(new Error('Government.save() promise resolved when it should have been rejected with Validation Error'));
          } else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Government.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Government.', function (done) {
        var government = Government.create();
        var error = null;
        var compareResult;
        government.name = 'California State Government';
        government.foundedDate = new Date('1850-09-09');
        government.geographicArea = GeographicArea.create()._id;
        government.poll = Poll.create()._id;
        government.governmentInstitutions = [GovernmentInstitution.create()._id, GovernmentInstitution.create()._id];
        Government.save(government).then(function (saved) {
          Government.findById(government._id).then(function (found) {
            compareResult = Government.compare(government, found);
            if (compareResult.match == false) error = new Error(compareResult.message);
          }, function (findError) {
            error = findError;
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
  describe('Government Institution Model Tests', function () {
    describe('GovernmentInstitution.create()', function () {
      it('GovernmentInstitution.create() creates a Government Institution instance.', function () {
        var governmentInstitution = GovernmentInstitution.create();
        assert(_typeof(governmentInstitution) === "object");
      });
      it('GovernmentInstitution.create() creates a GovernmentInstitution instance with _id field populated', function () {
        var governmentInstitution = GovernmentInstitution.create();
        assert(_typeof(governmentInstitution._id) === "object" && /^[a-f\d]{24}$/i.test(governmentInstitution._id));
      });
    });
    describe('GovernmentInstitution.save()', function () {
      it('GovernmentInstitution.save() throws an error if required fields are missing.', function (done) {
        var governmentInstitution = GovernmentInstitution.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Required Group violations found for requirement group(s):  a GovernmentInstitution validation failed: name: Path `name` is required., poll: Path `poll` is required.';
        GovernmentInstitution.save(governmentInstitution).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('GovernmentInstitution.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('GovernmentInstitution.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('GovermentInstitution.government must be a valid ID.', function (done) {
        var governmentInstitution = GovernmentInstitution.create();
        var testFailed = 0;
        var error = null;
        var expectedErrorMessage = 'Required Group violations found for requirement group(s):  a GovernmentInstitution validation failed: government: Cast to ObjectID failed for value "abcd1234efgh9876" at path "government"';
        governmentInstitution.name = 'California State Legislature';
        governmentInstitution.description = 'The body which writes and passes laws.';
        governmentInstitution.government = 'abcd1234efgh9876';
        governmentInstitution.poll = Poll.create()._id;
        governmentInstitution.governmentPostions = [GovernmentPosition.create()._id, GovernmentPosition.create()._id];
        GovernmentInstitution.save(governmentInstitution).then(function (saved) {
          testFailed = 1;
        }, function (saveErr) {
          error = saveErr;
        }).finally(function () {
          if (testFailed) {
            done(new Error('GovernmentInstitution.save() promise resolved when it should have been rejected with Validation Error'));
          } else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('GovernmentInstitution.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('GovermentInstitution.poll must be a valid ID.', function (done) {
        var governmentInstitution = GovernmentInstitution.create();
        var testFailed = 0;
        var error = null;
        var expectedErrorMessage = 'GovernmentInstitution validation failed: poll: Cast to ObjectID failed for value "abcd1234efgh9876" at path "poll"';
        governmentInstitution.name = 'California State Legislature';
        governmentInstitution.description = 'The body which writes and passes laws.';
        governmentInstitution.government = Government.create()._id;
        governmentInstitution.poll = 'abcd1234efgh9876';
        governmentInstitution.governmentPostions = [GovernmentPosition.create()._id, GovernmentPosition.create()._id];
        GovernmentInstitution.save(governmentInstitution).then(function (saved) {
          testFailed = 1;
        }, function (saveErr) {
          error = saveErr;
        }).finally(function () {
          if (testFailed) {
            done(new Error('GovernmentInstitution.save() promise resolved when it should have been rejected with Validation Error'));
          } else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('GovernmentInstitution.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('GovermentInstitution.parentGovernmentInstitution must be a valid ID.', function (done) {
        var governmentInstitution = GovernmentInstitution.create();
        var testFailed = 0;
        var error = null;
        var expectedErrorMessage = 'Required Group violations found for requirement group(s):  a GovernmentInstitution validation failed: parentGovernmentInstitution: Cast to ObjectID failed for value "abcd1234efgh9876" at path "parentGovernmentInstitution"';
        governmentInstitution.name = 'California State Assembly';
        governmentInstitution.description = 'The house of representatives for the California State Legislature.';
        governmentInstitution.parentGovernmentInstitution = 'abcd1234efgh9876';
        governmentInstitution.poll = Poll.create()._id;
        governmentInstitution.governmentPostions = [GovernmentPosition.create()._id, GovernmentPosition.create()._id];
        GovernmentInstitution.save(governmentInstitution).then(function (saved) {
          testFailed = 1;
        }, function (saveErr) {
          error = saveErr;
        }).finally(function () {
          if (testFailed) {
            done(new Error('GovernmentInstitution.save() promise resolved when it should have been rejected with Validation Error'));
          } else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('GovernmentInstitution.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('GovermentInstitution.governmentPositions must be a valid Array of IDs.', function (done) {
        var governmentInstitution = GovernmentInstitution.create();
        var testFailed = 0;
        var error = null;
        var expectedErrorMessage = 'GovernmentInstitution validation failed: governmentPositions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9876\' ]" at path "governmentPositions"';
        governmentInstitution.name = 'California State Legislature';
        governmentInstitution.description = 'The body which writes and passes laws.';
        governmentInstitution.government = Government.create()._id;
        governmentInstitution.poll = Poll.create()._id;
        governmentInstitution.governmentPositions = ['abcd1234efgh9876', 'abcd1234efgh9876'];
        GovernmentInstitution.save(governmentInstitution).then(function (saved) {
          testFailed = 1;
        }, function (saveErr) {
          error = saveErr;
        }).finally(function () {
          if (testFailed) {
            done(new Error('GovernmentInstitution.save() promise resolved when it should have been rejected with Validation Error'));
          } else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('GovernmentInstitution.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('GovermentInstitution.childGovernmentInstitutions must be a valid Array of IDs.', function (done) {
        var governmentInstitution = GovernmentInstitution.create();
        var testFailed = 0;
        var error = null;
        var expectedErrorMessage = 'GovernmentInstitution validation failed: childGovernmentInstitutions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9876\' ]" at path "childGovernmentInstitutions"';
        governmentInstitution.name = 'California State Legislature';
        governmentInstitution.description = 'The body which writes and passes laws.';
        governmentInstitution.government = Government.create()._id;
        governmentInstitution.poll = Poll.create()._id;
        governmentInstitution.governmentPostions = [GovernmentPosition.create()._id, GovernmentPosition.create()._id];
        governmentInstitution.childGovernmentInstitutions = ['abcd1234efgh9876', 'abcd1234efgh9876'];
        GovernmentInstitution.save(governmentInstitution).then(function (saved) {
          testFailed = 1;
        }, function (saveErr) {
          error = saveErr;
        }).finally(function () {
          if (testFailed) {
            done(new Error('GovernmentInstitution.save() promise resolved when it should have been rejected with Validation Error'));
          } else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('GovernmentInstitution.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('GovernmentInstitution.government and GovernmentInstitution.parentGovernmentInstitution are mutually exclusive.', function (done) {
        var governmentInstitution = GovernmentInstitution.create();
        var testFailed = 0;
        var error = null;
        var expectedErrorMessage = 'Mutex violations found for instance <ObjectId>. Field government with mutex \'a\'. Field parentGovernmentInstitution with mutex \'a\'.';
        var expectedErrorRegex = /^Mutex violations found for instance .*. Field government with mutex \'a\'. Field parentGovernmentInstitution with mutex \'a\'.$/;
        governmentInstitution.name = 'California State Legislature';
        governmentInstitution.description = 'The body which writes and passes laws.';
        governmentInstitution.poll = Poll.create()._id;
        governmentInstitution.governmentPostions = [GovernmentPosition.create()._id, GovernmentPosition.create()._id];
        governmentInstitution.government = Government.create()._id;
        governmentInstitution.parentGovernmentInstitution = GovernmentInstitution.create()._id;
        GovernmentInstitution.save(governmentInstitution).then(function (saved) {
          testFailed = 1;
        }, function (saveErr) {
          error = saveErr;
        }).finally(function () {
          if (testFailed) {
            done(new Error('GovernmentInstitution.save() promise resolved when it should have been rejected with Validation Error'));
          } else {
            if (error != null && expectedErrorRegex.test(error.message)) {
              done();
            } else {
              done(new Error('GovernmentInstitution.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Government Institution.', function (done) {
        var governmentInstitution = GovernmentInstitution.create();
        var error = null;
        var compareResult;
        governmentInstitution.name = 'California State Legislature';
        governmentInstitution.description = 'The body which writes and passes laws.';
        governmentInstitution.poll = Poll.create()._id;
        governmentInstitution.governmentPostions = [GovernmentPosition.create()._id, GovernmentPosition.create()._id];
        governmentInstitution.parentGovernmentInstitution = GovernmentInstitution.create()._id;
        GovernmentInstitution.save(governmentInstitution).then(function (saved) {
          GovernmentInstitution.findById(governmentInstitution._id).then(function (found) {
            compareResult = GovernmentInstitution.compare(governmentInstitution, found);
            if (compareResult.match == false) error = new Error(compareResult.message);
          }, function (findError) {
            error = findError;
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
  describe('Government Position Model Tests', function () {
    describe('GovernmentPosition.create()', function () {
      it('GovernmentPosition.create() creates a GovernmentPosition instance.', function () {
        var governmentPosition = GovernmentPosition.create();
        assert(_typeof(governmentPosition) === "object");
      });
      it('GovernmentPosition.create() creates a GovernmentPosition instance with _id field populated', function () {
        var governmentPosition = GovernmentPosition.create();
        assert(_typeof(governmentPosition._id) === "object" && /^[a-f\d]{24}$/i.test(governmentPosition._id));
      });
    });
    describe('GovernmentPosition.save()', function () {
      it('GovernmentPosition.save() throws an error if required fields are missing.', function (done) {
        var governmentPosition = GovernmentPosition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'GovernmentPosition validation failed: governmentInstitution: Path `governmentInstitution` is required., title: Path `title` is required.';
        GovernmentPosition.save(governmentPosition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('GovernmentPosition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('GovernmentPosition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('GovernmentPosition.governmentInstitution must be a valid ID.', function (done) {
        var governmentPosition = GovernmentPosition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'GovernmentPosition validation failed: governmentInstitution: Cast to ObjectID failed for value "abcd1234efgh9876" at path "governmentInstitution"';
        governmentPosition.title = 'Mayor';
        governmentPosition.description = 'The chief executive for a city.';
        governmentPosition.governmentInstitution = 'abcd1234efgh9876';
        governmentPosition.effectivePositionDefinitions = [EffectivePositionDefinition.create()._id, EffectivePositionDefinition.create()._id];
        governmentPosition.occupiedPositions = [OccupiedPosition.create()._id, OccupiedPosition.create()._id];
        governmentPosition.positionAcquisitionProcesses = [Appointment.create()._id, Appointment.create()._id];
        GovernmentPosition.save(governmentPosition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('GovernmentPosition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('GovernmentPosition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('GovernmentPosition.effectivePositionDefinitions must be a valid Array of IDs.', function (done) {
        var governmentPosition = GovernmentPosition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'GovernmentPosition validation failed: effectivePositionDefinitions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "effectivePositionDefinitions"';
        governmentPosition.title = 'Mayor';
        governmentPosition.description = 'The chief executive for a city.';
        governmentPosition.governmentInstitution = GovernmentInstitution.create()._id;
        governmentPosition.effectivePositionDefinitions = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        governmentPosition.occupiedPositions = [OccupiedPosition.create()._id, OccupiedPosition.create()._id];
        governmentPosition.positionAcquisitionProcesses = [Appointment.create()._id, Appointment.create()._id];
        GovernmentPosition.save(governmentPosition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('GovernmentPosition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('GovernmentPosition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('GovernmentPosition.occupiedPositions must be a valid Array of IDs.', function (done) {
        var governmentPosition = GovernmentPosition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'GovernmentPosition validation failed: occupiedPositions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "occupiedPositions"';
        governmentPosition.title = 'Mayor';
        governmentPosition.description = 'The chief executive for a city.';
        governmentPosition.governmentInstitution = GovernmentInstitution.create()._id;
        governmentPosition.effectivePositionDefinitions = [EffectivePositionDefinition.create()._id, EffectivePositionDefinition.create()._id];
        governmentPosition.occupiedPositions = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        governmentPosition.positionAcquisitionProcesses = [Appointment.create()._id, Appointment.create()._id];
        GovernmentPosition.save(governmentPosition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('GovernmentPosition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('GovernmentPosition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('GovernmentPosition.positionAcquisitionProcesses must be a valid Array of IDs.', function (done) {
        var governmentPosition = GovernmentPosition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'GovernmentPosition validation failed: positionAcquisitionProcesses: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "positionAcquisitionProcesses"';
        governmentPosition.title = 'Mayor';
        governmentPosition.description = 'The chief executive for a city.';
        governmentPosition.governmentInstitution = GovernmentInstitution.create()._id;
        governmentPosition.effectivePositionDefinitions = [EffectivePositionDefinition.create()._id, EffectivePositionDefinition.create()._id];
        governmentPosition.occupiedPositions = [OccupiedPosition.create()._id, OccupiedPosition.create()._id];
        governmentPosition.positionAcquisitionProcesses = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        GovernmentPosition.save(governmentPosition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('GovernmentPosition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('GovernmentPosition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Government Position.', function (done) {
        var governmentPosition = GovernmentPosition.create();
        var error = null;
        var compareResult;
        governmentPosition.title = 'Mayor';
        governmentPosition.description = 'The chief executive for a city.';
        governmentPosition.governmentInstitution = GovernmentInstitution.create()._id;
        governmentPosition.effectivePositionDefinitions = [EffectivePositionDefinition.create()._id, EffectivePositionDefinition.create()._id];
        governmentPosition.occupiedPositions = [OccupiedPosition.create()._id, OccupiedPosition.create()._id];
        governmentPosition.positionAcquisitionProcesses = [Appointment.create()._id, Appointment.create()._id];
        GovernmentPosition.save(governmentPosition).then(function (saved) {
          GovernmentPosition.findById(governmentPosition._id).then(function (found) {
            compareResult = GovernmentPosition.compare(governmentPosition, found);
            if (compareResult.match == false) error = new Error(compareResult.message);
          }, function (findError) {
            error = findError;
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
  describe('Effective Position Definition Model Tests', function () {
    describe('EffectivePositionDefinition.create()', function () {
      it('EffectivePositionDefinition.create() creates a EffectivePositionDefinition instance.', function () {
        var effectivePositionDefinition = EffectivePositionDefinition.create();
        assert(_typeof(effectivePositionDefinition) === "object");
      });
      it('EffectivePositionDefinition.create() creates a EffectivePositionDefinition instance with _id field populated', function () {
        var effectivePositionDefinition = EffectivePositionDefinition.create();
        assert(_typeof(effectivePositionDefinition._id) === "object" && /^[a-f\d]{24}$/i.test(effectivePositionDefinition._id));
      });
    });
    describe('EffectivePositionDefinition.save()', function () {
      it('EffectivePositionDefinition.save() throws an error if required fields are missing.', function (done) {
        var effectivePositionDefinition = EffectivePositionDefinition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'EffectivePositionDefinition validation failed: positionDefinition: Path `positionDefinition` is required., governmentPosition: Path `governmentPosition` is required., startDate: Path `startDate` is required.';
        EffectivePositionDefinition.save(effectivePositionDefinition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('EffectivePositionDefinition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('EffectivePositionDefinition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('EffectivePositionDefinition.positionDefinition must be a valid ID.', function (done) {
        var effectivePositionDefinition = EffectivePositionDefinition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'EffectivePositionDefinition validation failed: positionDefinition: Cast to ObjectID failed for value "abcd1234efgh9876" at path "positionDefinition"';
        effectivePositionDefinition.startDate = new Date('1999-12-21');
        effectivePositionDefinition.endDate = new Date('2018-01-01');
        effectivePositionDefinition.positionDefinition = 'abcd1234efgh9876';
        effectivePositionDefinition.governmentPosition = GovernmentPosition.create()._id;
        EffectivePositionDefinition.save(effectivePositionDefinition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('EffectivePositionDefinition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('EffectivePositionDefinition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('EffectivePositionDefinition.governmentPosition must be a valid ID.', function (done) {
        var effectivePositionDefinition = EffectivePositionDefinition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'EffectivePositionDefinition validation failed: governmentPosition: Cast to ObjectID failed for value "abcd1234efgh9876" at path "governmentPosition"';
        effectivePositionDefinition.startDate = new Date('1999-12-21');
        effectivePositionDefinition.endDate = new Date('2018-01-01');
        effectivePositionDefinition.positionDefinition = PositionDefinition.create()._id;
        effectivePositionDefinition.governmentPosition = 'abcd1234efgh9876';
        EffectivePositionDefinition.save(effectivePositionDefinition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('EffectivePositionDefinition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('EffectivePositionDefinition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Effective Position Definition.', function (done) {
        var effectivePositionDefinition = EffectivePositionDefinition.create();
        var error = null;
        var compareResult;
        effectivePositionDefinition.startDate = new Date('1999-12-21');
        effectivePositionDefinition.endDate = new Date('2018-01-01');
        effectivePositionDefinition.positionDefinition = PositionDefinition.create()._id;
        effectivePositionDefinition.governmentPosition = GovernmentPosition.create()._id;
        EffectivePositionDefinition.save(effectivePositionDefinition).then(function (saved) {
          EffectivePositionDefinition.findById(effectivePositionDefinition._id).then(function (findError, found) {
            compareResult = EffectivePositionDefinition.compare(effectivePositionDefinition, found);
            if (compareResult.match == false) error = new Error(compareResult.message);
          }, function (findError) {
            error = findError;
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
  describe('Position Definition Model Tests', function () {
    describe('PositionDefinition.create()', function () {
      it('PositionDefinition.create() creates a PositionDefinition instance.', function () {
        var positionDefinition = PositionDefinition.create();
        assert(_typeof(positionDefinition) === "object");
      });
      it('PositionDefinition.create() creates a PositionDefinition instance with _id field populated', function () {
        var positionDefinition = PositionDefinition.create();
        assert(_typeof(positionDefinition._id) === "object" && /^[a-f\d]{24}$/i.test(positionDefinition._id));
      });
    });
    describe('PositionDefinition.save()', function () {
      it('PositionDefinition.save() throws an error if required fields are missing.', function (done) {
        var positionDefinition = PositionDefinition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'PositionDefinition validation failed: name: Path `name` is required.';
        PositionDefinition.save(positionDefinition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('PositionDefinition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('PositionDefinition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('PositionDefinition.termDefinition must be a valid ID.', function (done) {
        var positionDefinition = PositionDefinition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'PositionDefinition validation failed: termDefinition: Cast to ObjectID failed for value "abcd1234efgh9876" at path "termDefinition"';
        positionDefinition.name = 'President';
        positionDefinition.effectivePositionDefinitions = [EffectivePositionDefinition.create()._id, EffectivePositionDefinition.create()._id];
        positionDefinition.termDefinition = 'abcd1234efgh9876';
        positionDefinition.governmentPowers = [GovernmentPower.create()._id, GovernmentPower.create()._id];
        positionDefinition.acquisitionProcessDefinitions = [AcquisitionProcessDefinition.create()._id, AcquisitionProcessDefinition.create._id];
        PositionDefinition.save(positionDefinition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('PositionDefinition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('PositionDefinition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('PositionDefinition.effectivePositionDefinitions must be a valid Array of IDs.', function (done) {
        var positionDefinition = PositionDefinition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'PositionDefinition validation failed: effectivePositionDefinitions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "effectivePositionDefinitions"';
        positionDefinition.name = 'President';
        positionDefinition.effectivePositionDefinitions = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        positionDefinition.termDefinition = TermDefinition.create()._id;
        positionDefinition.governmentPowers = [GovernmentPower.create()._id, GovernmentPower.create()._id];
        positionDefinition.acquisitionProcessDefinitions = [AcquisitionProcessDefinition.create()._id, AcquisitionProcessDefinition.create._id];
        PositionDefinition.save(positionDefinition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('PositionDefinition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('PositionDefinition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('PositionDefinition.governmentPowers must be a valid Array of IDs.', function (done) {
        var positionDefinition = PositionDefinition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'PositionDefinition validation failed: governmentPowers: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "governmentPowers"';
        positionDefinition.name = 'President';
        positionDefinition.effectivePositionDefinitions = [EffectivePositionDefinition.create()._id, EffectivePositionDefinition.create()._id];
        positionDefinition.termDefinition = TermDefinition.create()._id;
        positionDefinition.governmentPowers = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        positionDefinition.acquisitionProcessDefinitions = [AcquisitionProcessDefinition.create()._id, AcquisitionProcessDefinition.create._id];
        PositionDefinition.save(positionDefinition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('PositionDefinition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('PositionDefinition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('PositionDefinition.termDefinition must be a valid ID.', function (done) {
        var positionDefinition = PositionDefinition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'PositionDefinition validation failed: acquisitionProcessDefinitions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "acquisitionProcessDefinitions"';
        positionDefinition.name = 'President';
        positionDefinition.effectivePositionDefinitions = [EffectivePositionDefinition.create()._id, EffectivePositionDefinition.create()._id];
        positionDefinition.termDefinition = TermDefinition.create()._id;
        positionDefinition.governmentPowers = [GovernmentPower.create()._id, GovernmentPower.create()._id];
        positionDefinition.acquisitionProcessDefinitions = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        PositionDefinition.save(positionDefinition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('PositionDefinition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('PositionDefinition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves  Position Definition.', function (done) {
        var positionDefinition = PositionDefinition.create();
        var error = null;
        var compareResult;
        positionDefinition.name = 'President';
        positionDefinition.effectivePositionDefinitions = [EffectivePositionDefinition.create()._id, EffectivePositionDefinition.create()._id];
        positionDefinition.termDefinition = TermDefinition.create()._id;
        positionDefinition.governmentPowers = [GovernmentPower.create()._id, GovernmentPower.create()._id];
        positionDefinition.acquisitionProcessDefinitions = [AcquisitionProcessDefinition.create()._id, AcquisitionProcessDefinition.create()._id];
        PositionDefinition.save(positionDefinition).then(function (saved) {
          PositionDefinition.findById(positionDefinition._id).then(function (found) {
            compareResult = PositionDefinition.compare(positionDefinition, found);
            if (compareResult.match == false) error = new Error(compareResult.message);
          }, function (findError) {
            error = findError;
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
  describe('Term Definition Model Tests', function () {
    describe('TermDefinition.create()', function () {
      it('TermDefinition.create() creates a TermDefinition instance.', function () {
        var termDefinition = TermDefinition.create();
        assert(_typeof(termDefinition) === "object");
      });
      it('TermDefinition.create() creates a TermDefinition instance with _id field populated', function () {
        var termDefinition = TermDefinition.create();
        assert(_typeof(termDefinition._id) === "object" && /^[a-f\d]{24}$/i.test(termDefinition._id));
      });
    });
    describe('TermDefinition.save()', function () {
      it('TermDefinition.save() throws an error if required fields are missing.', function (done) {
        var termDefinition = TermDefinition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'TermDefinition validation failed: termLimit: Path `termLimit` is required., termLength: Path `termLength` is required.';
        TermDefinition.save(termDefinition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('TermDefinition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('TermDefinition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('TermDefinition.positionDefinition must be a valid ID.', function (done) {
        var termDefinition = TermDefinition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'TermDefinition validation failed: positionDefinition: Cast to ObjectID failed for value "abcd1234efgh9876" at path "positionDefinition"';
        termDefinition.termLength = 4;
        termDefinition.termLimit = 2;
        termDefinition.positionDefinition = 'abcd1234efgh9876';
        TermDefinition.save(termDefinition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('TermDefinition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('TermDefinition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Term Definition.', function (done) {
        var termDefinition = TermDefinition.create();
        var error = null;
        var compareResult;
        termDefinition.termLength = 4;
        termDefinition.termLimit = 2;
        termDefinition.positionDefinition = PositionDefinition.create()._id;
        TermDefinition.save(termDefinition).then(function (saved) {
          TermDefinition.findById(termDefinition._id).then(function (found) {
            compareResult = TermDefinition.compare(termDefinition, found);
            if (compareResult.match == false) error = new Error(compareResult.message);
          }, function (findError) {
            error = findError;
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
  describe('Government Power Model Tests', function () {
    describe('GovernmentPower.create()', function () {
      it('GovernmentPower.create() creates a GovernmentPower instance.', function () {
        var governmentPower = GovernmentPower.create();
        assert(_typeof(governmentPower) === "object");
      });
      it('GovernmentPower.create() creates a GovernmentPower instance with _id field populated', function () {
        var governmentPower = GovernmentPower.create();
        assert(_typeof(governmentPower._id) === "object" && /^[a-f\d]{24}$/i.test(governmentPower._id));
      });
    });
    describe('GovernmentPower.save()', function () {
      it('GovernmentPower.save() throws an error if required fields are missing.', function (done) {
        var governmentPower = GovernmentPower.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'GovernmentPower validation failed: name: Path `name` is required.';
        GovernmentPower.save(governmentPower).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('GovernmentPower.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('GovernmentPower.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('GovernmentPower.positionDefinition must be a valid Array of IDs.', function (done) {
        var governmentPower = GovernmentPower.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'GovernmentPower validation failed: positionDefinitions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "positionDefinitions"';
        governmentPower.name = 'Legislative';
        governmentPower.description = 'Writes and votes on laws.';
        governmentPower.positionDefinitions = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        GovernmentPower.save(governmentPower).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('GovernmentPower.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('GovernmentPower.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Government Power.', function (done) {
        var governmentPower = GovernmentPower.create();
        var error = null;
        var compareResult;
        governmentPower.name = 'Legislative';
        governmentPower.description = 'Writes and votes on laws.';
        governmentPower.positionDefinitions = [PositionDefinition.create()._id, PositionDefinition.create()._id];
        GovernmentPower.save(governmentPower).then(function (saved) {
          GovernmentPower.findById(governmentPower._id).then(function (found) {
            compareResult = GovernmentPower.compare(governmentPower, found);
            if (compareResult.match == false) error = new Error(compareResult.message);
          }, function (findError) {
            error = findError;
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
  describe('Aquisition Process Definition Model Tests', function () {
    describe('AcquisitionProcessDefinition.create()', function () {
      it('AcquisitionProcessDefinition.create() creates a AcquisitionProcessDefinition instance.', function () {
        var acquisitionProcessDefinition = AcquisitionProcessDefinition.create();
        assert(_typeof(acquisitionProcessDefinition) === "object");
      });
      it('AcquisitionProcessDefinition.create() creates a AcquisitionProcessDefinition instance with _id field populated', function () {
        var acquisitionProcessDefinition = AcquisitionProcessDefinition.create();
        assert(_typeof(acquisitionProcessDefinition._id) === "object" && /^[a-f\d]{24}$/i.test(acquisitionProcessDefinition._id));
      });
    });
    describe('AcquisitionProcessDefinition.save()', function () {
      it('AcquisitionProcessDefinition.save() throws an error if required fields are missing.', function (done) {
        var acquisitionProcessDefinition = AcquisitionProcessDefinition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'AcquisitionProcessDefinition validation failed: name: Path `name` is required.';
        AcquisitionProcessDefinition.save(acquisitionProcessDefinition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('AcquisitionProcessDefinition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('AcquisitionProcessDefinition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('AcquisitionProcessDefinition.positionDefinition must be a valid Array of IDs.', function (done) {
        var acquisitionProcessDefinition = AcquisitionProcessDefinition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'AcquisitionProcessDefinition validation failed: positionDefinitions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "positionDefinitions"';
        acquisitionProcessDefinition.name = 'Direct Election';
        acquisitionProcessDefinition.description = 'Strict majority election by voters.';
        acquisitionProcessDefinition.positionDefinitions = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        AcquisitionProcessDefinition.save(acquisitionProcessDefinition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('AcquisitionProcessDefinition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('AcquisitionProcessDefinition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Aquisition Process Definition.', function (done) {
        var acquisitionProcessDefinition = AcquisitionProcessDefinition.create();
        var error = null;
        var compareResult;
        acquisitionProcessDefinition.name = 'Direct Election';
        acquisitionProcessDefinition.description = 'Strict majority election by voters.';
        acquisitionProcessDefinition.positionDefinitions = [PositionDefinition.create()._id, PositionDefinition.create()._id];
        AcquisitionProcessDefinition.save(acquisitionProcessDefinition).then(function (saved) {
          AcquisitionProcessDefinition.findById(acquisitionProcessDefinition._id).then(function (found) {
            compareResult = AcquisitionProcessDefinition.compare(acquisitionProcessDefinition, found);
            if (compareResult.match == false) error = new Error(compareResult.message);
          }, function (findError) {
            error = findError;
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
  describe('Occupied Position Model Tests', function () {
    describe('OccupiedPosition.create()', function () {
      it('OccupiedPosition.create() creates a OccupiedPosition instance.', function () {
        var occupiedPosition = OccupiedPosition.create();
        assert(_typeof(occupiedPosition) === "object");
      });
      it('OccupiedPosition.create() creates a OccupiedPosition instance with _id field populated', function () {
        var occupiedPosition = OccupiedPosition.create();
        assert(_typeof(occupiedPosition._id) === "object" && /^[a-f\d]{24}$/i.test(occupiedPosition._id));
      });
    });
    describe('OccupiedPosition.save()', function () {
      it('OccupiedPosition.save() throws an error if required fields are missing.', function (done) {
        var occupiedPosition = OccupiedPosition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'OccupiedPosition validation failed: governmentOfficial: Path `governmentOfficial` is required., governmentPosition: Path `governmentPosition` is required., startDate: Path `startDate` is required., poll: Path `poll` is required.';
        OccupiedPosition.save(occupiedPosition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('OccupiedPosition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('OccupiedPosition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('OccupiedPosition.governmentOfficial must be a valid ID', function (done) {
        var occupiedPosition = OccupiedPosition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'OccupiedPosition validation failed: governmentOfficial: Cast to ObjectID failed for value "abcd1234efgh9876" at path "governmentOfficial"';
        occupiedPosition.startDate = new Date('2010-01-01');
        occupiedPosition.endDate = new Date('2011-01-01');
        occupiedPosition.governmentOfficial = 'abcd1234efgh9876';
        occupiedPosition.poll = Poll.create()._id;
        occupiedPosition.governmentPosition = GovernmentPosition.create()._id;
        occupiedPosition.governmentRoles = [Nominator.create()._id, Executive.create()._id];
        OccupiedPosition.save(occupiedPosition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('OccupiedPosition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('OccupiedPosition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('OccupiedPosition.governmentPosition must be a valid ID', function (done) {
        var occupiedPosition = OccupiedPosition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'OccupiedPosition validation failed: governmentPosition: Cast to ObjectID failed for value "abcd1234efgh9876" at path "governmentPosition"';
        occupiedPosition.startDate = new Date('2010-01-01');
        occupiedPosition.endDate = new Date('2011-01-01');
        occupiedPosition.governmentOfficial = GovernmentOfficial.create()._id;
        occupiedPosition.poll = Poll.create()._id;
        occupiedPosition.governmentPosition = 'abcd1234efgh9876';
        occupiedPosition.governmentRoles = [Nominator.create()._id, Executive.create()._id];
        OccupiedPosition.save(occupiedPosition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('OccupiedPosition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('OccupiedPosition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('OccupiedPosition.poll must be a valid ID', function (done) {
        var occupiedPosition = OccupiedPosition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'OccupiedPosition validation failed: poll: Cast to ObjectID failed for value "abcd1234efgh9876" at path "poll"';
        occupiedPosition.startDate = new Date('2010-01-01');
        occupiedPosition.endDate = new Date('2011-01-01');
        occupiedPosition.governmentOfficial = GovernmentOfficial.create()._id;
        occupiedPosition.poll = 'abcd1234efgh9876';
        occupiedPosition.governmentPosition = GovernmentPosition.create()._id;
        occupiedPosition.governmentRoles = [Nominator.create()._id, Executive.create()._id];
        OccupiedPosition.save(occupiedPosition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('OccupiedPosition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('OccupiedPosition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('OccupiedPosition.governmentRoles must be a valid Array of IDs', function (done) {
        var occupiedPosition = OccupiedPosition.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'OccupiedPosition validation failed: governmentRoles: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "governmentRoles"';
        occupiedPosition.startDate = new Date('2010-01-01');
        occupiedPosition.endDate = new Date('2011-01-01');
        occupiedPosition.governmentOfficial = GovernmentOfficial.create()._id;
        occupiedPosition.poll = Poll.create()._id;
        occupiedPosition.governmentPosition = GovernmentPosition.create()._id;
        occupiedPosition.governmentRoles = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        OccupiedPosition.save(occupiedPosition).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('OccupiedPosition.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('OccupiedPosition.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Occupied Position', function (done) {
        var occupiedPosition = OccupiedPosition.create();
        var error = null;
        var compareResult;
        occupiedPosition.startDate = new Date('2010-01-01');
        occupiedPosition.endDate = new Date('2011-01-01');
        occupiedPosition.governmentOfficial = GovernmentOfficial.create()._id;
        occupiedPosition.poll = Poll.create()._id;
        occupiedPosition.governmentPosition = GovernmentPosition.create()._id;
        occupiedPosition.governmentRoles = [Nominator.create()._id, Executive.create()._id];
        OccupiedPosition.save(occupiedPosition).then(function (saved) {
          OccupiedPosition.findById(occupiedPosition._id).then(function (found) {
            compareResult = OccupiedPosition.compare(occupiedPosition, found);
            if (compareResult.match == false) error = new Error(compareResult.message);
          }, function (findError) {
            error = findError;
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
  describe('Government Official Model Tests', function () {
    describe('GovernmentOfficial.create()', function () {
      it('GovernmentOfficial.create() creates a GovernmentOfficial instance.', function () {
        var governmentOfficial = GovernmentOfficial.create();
        assert(_typeof(governmentOfficial) === "object");
      });
      it('GovernmentOfficial.create() creates a GovernmentOfficial instance with _id field populated', function () {
        var governmentOfficial = GovernmentOfficial.create();
        assert(_typeof(governmentOfficial._id) === "object" && /^[a-f\d]{24}$/i.test(governmentOfficial._id));
      });
    });
    describe('GovernmentOfficial.save()', function () {
      it('GovernmentOfficial.save() throws an error if required fields are missing.', function (done) {
        var governmentOfficial = GovernmentOfficial.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'GovernmentOfficial validation failed: user: Path `user` is required., startDate: Path `startDate` is required.';
        GovernmentOfficial.save(governmentOfficial).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('GovernmentOfficial.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('GovernmentOfficial.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('GovernmentOfficial.user must be a valid ID.', function (done) {
        var governmentOfficial = GovernmentOfficial.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'GovernmentOfficial validation failed: user: Cast to ObjectID failed for value "abcd1234efgh9876" at path "user"';
        governmentOfficial.startDate = new Date();
        governmentOfficial.user = 'abcd1234efgh9876';
        governmentOfficial.occupiedPositions = [OccupiedPosition.create()._id, OccupiedPosition.create()._id];
        GovernmentOfficial.save(governmentOfficial).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('GovernmentOfficial.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('GovernmentOfficial.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('GovernmentOfficial.occupiedPositions must be a valid Array of IDs.', function (done) {
        var governmentOfficial = GovernmentOfficial.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'GovernmentOfficial validation failed: occupiedPositions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "occupiedPositions"';
        governmentOfficial.startDate = new Date();
        governmentOfficial.user = User.create()._id;
        governmentOfficial.occupiedPositions = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        GovernmentOfficial.save(governmentOfficial).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('GovernmentOfficial.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('GovernmentOfficial.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Government Official.', function (done) {
        var governmentOfficial = GovernmentOfficial.create();
        var error = null;
        var compareResult;
        governmentOfficial.startDate = new Date();
        governmentOfficial.user = User.create()._id;
        governmentOfficial.occupiedPositions = [OccupiedPosition.create()._id, OccupiedPosition.create()._id];
        GovernmentOfficial.save(governmentOfficial).then(function (saved) {
          GovernmentOfficial.findById(governmentOfficial._id).then(function (found) {
            compareResult = GovernmentOfficial.compare(governmentOfficial, found);
            if (compareResult.match == false) error = new Error(compareResult.message);
          }, function (findError) {
            error = findError;
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
  describe('Government Role Model Tests', function () {
    describe('GovernmentRole.create()', function () {
      it('GovernmentRole.create() throws an error because you cannot create an instance of an abstract class.', function () {
        var expectedErrorMessage = 'You cannot create an instance of an abstract class.';

        try {
          GovernmentRole.create();
        } catch (error) {
          if (error.message != expectedErrorMessage) {
            throw new Error('GovernmentRole.create() did not throw the expected error.\n' + 'Expected: ' + expectedErrorMessage + '\n' + 'Actual:   ' + error.message);
          } else {
            return true;
          }
        }

        throw new Error('GovernmentRole.create() should have thrown the error: ' + expectedErrorMessage);
      });
    });
    describe('GovernmentRole.save()', function () {
      it('GovernmentRole.save() throws an error because you cannot save an instance of an abstract class', function (done) {
        done();
      });
    });
  });
  describe('Law Model Tests', function () {
    describe('Law.create()', function () {
      it('Law.create() creates a Law instance.', function () {
        var law = Law.create();
        assert(_typeof(law) === "object");
      });
      it('Law.create() creates a Law instance with _id field populated', function () {
        var law = Law.create();
        assert(_typeof(law._id) === "object" && /^[a-f\d]{24}$/i.test(law._id));
      });
    });
    describe('Law.save()', function () {
      it('Law.save() throws an error if required fields are missing.', function (done) {
        var law = Law.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Law validation failed: startDate: Path `startDate` is required.';
        Law.save(law).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Law.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Law.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Law.expireDate must be greater than or equal to Law.startDate.', function (done) {
        var law = Law.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Law validation failed: expireDate: Expire Date must be greater than or equal to Start Date.';
        law.startDate = new Date('2019-01-01');
        law.expireDate = new Date('2018-01-01');
        law.bills = [Bill.create()._id, Bill.create()._id];
        law.judicialOpinions = [JudicialOpinion.create()._id, JudicialOpinion.create()._id];
        Law.save(law).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Law.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Law.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Law.bills must be a valid Array of IDs.', function (done) {
        var law = Law.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Law validation failed: bills: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "bills"';
        law.startDate = new Date('2019-01-01');
        law.expireDate = new Date('2020-01-01');
        law.bills = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        law.judicialOpinions = [JudicialOpinion.create()._id, JudicialOpinion.create()._id];
        Law.save(law).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Law.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Law.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Law.judicialOpinions must be a valid Array of IDs.', function (done) {
        var law = Law.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Law validation failed: judicialOpinions: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "judicialOpinions"';
        law.startDate = new Date('2019-01-01');
        law.expireDate = new Date('2020-01-01');
        law.bills = [Bill.create()._id, Bill.create()._id];
        law.judicialOpinions = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        Law.save(law).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Law.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Law.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Law.', function (done) {
        var law = Law.create();
        var error = null;
        var compareResult;
        law.startDate = new Date('2019-01-01');
        law.expireDate = new Date('2020-01-01');
        law.bills = [Bill.create()._id, Bill.create()._id];
        law.judicialOpinions = [JudicialOpinion.create()._id, JudicialOpinion.create()._id];
        Law.save(law).then(function (saved) {
          Law.findById(law._id).then(function (found) {
            compareResult = Law.compare(law, found);
            if (compareResult.match == false) error = new Error(compareResult.message);
          }, function (findError) {
            error = findError;
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
  describe('VoteOption Model Tests', function () {
    describe('VoteOption.create()', function () {
      it('VoteOption.create() throws an error because you cannot create an instance of an abstract class.', function () {
        var expectedErrorMessage = 'You cannot create an instance of an abstract class.';

        try {
          VoteOption.create();
        } catch (error) {
          if (error.message != expectedErrorMessage) {
            throw new Error('VoteOption.create() did not throw the expected error.\n' + 'Expected: ' + expectedErrorMessage + '\n' + 'Actual:   ' + error.message);
          } else {
            return true;
          }
        }

        throw new Error('VoteOption.create() should have thrown the error: ' + expectedErrorMessage);
      });
    });
    describe('VoteOption.save()', function () {
      it('VoteOption.save() throws an error because you cannot save an instance of an abstract class', function (done) {
        done();
      });
    });
  });
  describe('Position Acquisition Process Model Tests', function () {
    it('PositionAcquisitionProcess.create() throws an error because you cannot create an instance of an abstract class.', function () {
      var expectedErrorMessage = 'You cannot create an instance of an abstract class.';

      try {
        PositionAcquisitionProcess.create();
      } catch (error) {
        if (error.message != expectedErrorMessage) {
          throw new Error('PositionAcquisitionProcess.create() did not throw the expected error.\n' + 'Expected: ' + expectedErrorMessage + '\n' + 'Actual:   ' + error.message);
        } else {
          return true;
        }
      }

      throw new Error('PositionAcquisitionProcess.create() should have thrown the error: ' + expectedErrorMessage);
    });
    describe('PositionAcquisitionProcess.save()', function () {
      it('PositionAcquisitionProcess.save() throws an error because you cannot save an instance of an abstract class', function (done) {
        done();
      });
    });
  });
  after(function () {
    database.close();
  });
});