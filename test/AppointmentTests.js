"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var assert = require('assert');

var database = require('../dist/models/database');

require('../dist/models/Modules/Government/Appointment/AppointmentModule');

var GovernmentPosition = require('../dist/models/Modules/Government/GovernmentPosition');

var OccupiedPosition = require('../dist/models/Modules/Government/OccupiedPosition');

var User = require('../dist/models/Modules/User/User');

var Appointment = require('../dist/models/Modules/Government/Appointment/Appointment');

var Appointer = require('../dist/models/Modules/Government/Appointment/Appointer');

var Appointee = require('../dist/models/Modules/Government/Appointment/Appointee');

describe('Appointment Module Tests', function () {
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
            return Appointment.clear();

          case 4:
            _context.next = 6;
            return Appointer.clear();

          case 6:
            _context.next = 8;
            return Appointee.clear();

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  })));
  describe('Appointment Model Tests', function () {
    describe('Appointment.create()', function () {
      it('Appointment.create() creates a Appointment instance.', function () {
        var appointment = Appointment.create();
        assert(_typeof(appointment) === "object");
      });
      it('Appointment.create() creates a Appointment instance with _id field populated', function () {
        var appointment = Appointment.create();
        assert(_typeof(appointment._id) === "object" && /^[a-f\d]{24}$/i.test(appointment._id));
      });
    });
    describe('Appointment.save()', function () {
      it('Appointment.save() throws an error if required fields are missing.', function (done) {
        var appointment = Appointment.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Appointment validation failed: appointee: Path `appointee` is required., appointer: Path `appointer` is required., governmentPosition: Path `governmentPosition` is required.';
        Appointment.save(appointment).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Appointment.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Appointment.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Appointment.governmentPosition must be a valid ID', function (done) {
        var appointment = Appointment.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Appointment validation failed: governmentPosition: Cast to ObjectID failed for value "abcd1234efgh9876" at path "governmentPosition"';
        appointment.appointmentDate = new Date('2016-11-07');
        appointment.positionStartDate = new Date('2017-01-06');
        appointment.governmentPosition = 'abcd1234efgh9876';
        appointment.appointer = Appointer.create()._id;
        appointment.appointee = Appointee.create()._id;
        Appointment.save(appointment).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Appointment.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Appointment.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Appointment.appointer must be a valid ID', function (done) {
        var appointment = Appointment.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Appointment validation failed: appointer: Cast to ObjectID failed for value "abcd1234efgh9876" at path "appointer"';
        appointment.appointmentDate = new Date('2016-11-07');
        appointment.positionStartDate = new Date('2017-01-06');
        appointment.governmentPosition = GovernmentPosition.create()._id;
        appointment.appointer = 'abcd1234efgh9876';
        appointment.appointee = Appointee.create()._id;
        Appointment.save(appointment).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Appointment.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Appointment.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Appointment.appointee must be a valid  ID', function (done) {
        var appointment = Appointment.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Appointment validation failed: appointee: Cast to ObjectID failed for value "abcd1234efgh9876" at path "appointee"';
        appointment.appointmentDate = new Date('2016-11-07');
        appointment.positionStartDate = new Date('2017-01-06');
        appointment.governmentPosition = GovernmentPosition.create()._id;
        appointment.appointer = Appointer.create()._id;
        appointment.appointee = 'abcd1234efgh9876';
        Appointment.save(appointment).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Appointment.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Appointment.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Appointment.positionStartDate must be greater than or equal to Appointment.appointmentDate', function (done) {
        var appointment = Appointment.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Appointment validation failed: positionStartDate: Term Start Date must be greater than or equal to Appointment Date.';
        appointment.appointmentDate = new Date('2016-11-07');
        appointment.positionStartDate = new Date('2015-01-06');
        appointment.governmentPosition = GovernmentPosition.create()._id;
        appointment.appointer = Appointer.create()._id;
        appointment.appointee = Appointee.create()._id;
        Appointment.save(appointment).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Appointment.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Appointment.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Appointment.', function (done) {
        var appointment = Appointment.create();
        var error = null;
        var compareResult;
        appointment.appointmentDate = new Date('2016-11-07');
        appointment.positionStartDate = new Date('2017-01-06');
        appointment.governmentPosition = GovernmentPosition.create()._id;
        appointment.appointer = Appointer.create()._id;
        appointment.appointee = Appointee.create()._id;
        Appointment.save(appointment).then(function (saved) {
          Appointment.findById(appointment._id).then(function (found) {
            compareResult = Appointment.compare(appointment, found);
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
  describe('Appointer Model Tests', function () {
    describe('Appointer.create()', function () {
      it('Appointer.create() creates a Appointer instance.', function () {
        var appointer = Appointer.create();
        assert(_typeof(appointer) === "object");
      });
      it('Appointer.create() creates a Appointer instance with _id field populated', function () {
        var appointer = Appointer.create();
        assert(_typeof(appointer._id) === "object" && /^[a-f\d]{24}$/i.test(appointer._id));
      });
    });
    describe('Appointer.save()', function () {
      it('Appointer.save() throws an error if required fields are missing.', function (done) {
        var appointer = Appointer.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Appointer validation failed: occupiedPosition: Path `occupiedPosition` is required.';
        Appointer.save(appointer).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Appointer.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Appointer.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Appointer.occupiedPosition must be a valid ID.', function (done) {
        var appointer = Appointer.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Appointer validation failed: occupiedPosition: Cast to ObjectID failed for value "abcd1234efgh9876" at path "occupiedPosition"';
        appointer.occupiedPosition = 'abcd1234efgh9876';
        appointer.appointments = [Appointment.create()._id, Appointment.create()._id];
        Appointer.save(appointer).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Appointer.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Appointer.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Appointer.appointments must be a valid Array of IDs.', function (done) {
        var appointer = Appointer.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Appointer validation failed: appointments: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "appointments"';
        appointer.occupiedPosition = OccupiedPosition.create()._id;
        appointer.appointments = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        Appointer.save(appointer).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Appointer.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Appointer.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Appointer.', function (done) {
        var appointer = Appointer.create();
        var error = null;
        var compareResult;
        appointer.occupiedPosition = OccupiedPosition.create()._id;
        appointer.appointments = [Appointment.create()._id, Appointment.create()._id];
        Appointer.save(appointer).then(function (saved) {
          Appointer.findById(appointer._id).then(function (found) {
            compareResult = Appointer.compare(appointer, found);
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
  describe('Appointee Model Tests', function () {
    describe('Appointee.create()', function () {
      it('Appointee.create() creates a Appointee instance.', function () {
        var appointee = Appointee.create();
        assert(_typeof(appointee) === "object");
      });
      it('Appointee.create() creates a Appointee instance with _id field populated', function () {
        var appointee = Appointee.create();
        assert(_typeof(appointee._id) === "object" && /^[a-f\d]{24}$/i.test(appointee._id));
      });
    });
    describe('Appointee.save()', function () {
      it('Appointee.save() throws an error if required fields are missing.', function (done) {
        var appointee = Appointee.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Appointee validation failed: appointments: Path `appointments` is required. Appointee validation failed: user: Path `user` is required., startDate: Path `startDate` is required.';
        Appointee.save(appointee).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Appointee.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Appointee.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Appointee.user must be a valid ID.', function (done) {
        var appointee = Appointee.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Appointee validation failed: user: Cast to ObjectID failed for value "abcd1234efgh9876" at path "user"';
        appointee.user = 'abcd1234efgh9876';
        appointee.appointments = [Appointment.create()._id, Appointment.create()._id];
        appointee.startDate = new Date();
        Appointee.save(appointee).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Appointee.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Appointee.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Appointee.appointments must be a valid Array of IDs.', function (done) {
        var appointee = Appointee.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Appointee validation failed: appointments: Path `appointments` is required. Appointee validation failed: appointments: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "appointments"';
        appointee.user = User.create()._id;
        appointee.appointments = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        appointee.startDate = new Date();
        Appointee.save(appointee).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Appointee.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Appointee.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid Call Saves Appointee.', function (done) {
        var appointee = Appointee.create();
        var error = null;
        var compareResult;
        appointee.user = User.create()._id;
        appointee.appointments = [Appointment.create()._id, Appointment.create()._id];
        appointee.startDate = new Date();
        Appointee.save(appointee).then(function (saved) {
          Appointee.findById(appointee._id).then(function (found) {
            compareResult = Appointee.compare(appointee, found);
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