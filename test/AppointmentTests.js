"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var assert = require('assert');

var expect = require('expect');

var promiseFinally = require('promise.prototype.finally');

require('../dist/models/Modules/Government/Appointment/AppointmentModule'); // Add 'finally()' to 'Promis.prototype'


promiseFinally.shim();
process.on('unhandledRejection', function (error) {
  console.log('unhandledRejection', error.message);
});

var GovernmentPosition = require('../dist/models/Modules/Government/GovernmentPosition');

var OccupiedPosition = require('../dist/models/Modules/Government/OccupiedPosition');

var GovernmentRole = require('../dist/models/Modules/Government/GovernmentRole');

var PositionAcquisitionProcess = require('../dist/models/Modules/Government/PositionAcquisitionProcess');

var User = require('../dist/models/Modules/User/User');

var UserRole = require('../dist/models/Modules/User/UserRole');

var Appointment = require('../dist/models/Modules/Government/Appointment/Appointment');

var Appointer = require('../dist/models/Modules/Government/Appointment/Appointer');

var Appointee = require('../dist/models/Modules/Government/Appointment/Appointee');

describe('Appointment Module Tests', function () {
  before(function (done) {
    PositionAcquisitionProcess.clear().then(function () {
      GovernmentRole.clear().then(function () {
        UserRole.clear().then(done, done);
      }, done);
    }, done);
  });
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
        var expectedErrorMessage = 'Appointment validation failed: governmentPosition: Path `governmentPosition` is required., appointee: Path `appointee` is required., appointer: Path `appointer` is required.';
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
          Appointment.Model.findById(appointment._id, function (findError, found) {
            compareResult = Appointment.compare(appointment, found);
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
          Appointer.Model.findById(appointer._id, function (findError, found) {
            compareResult = Appointer.compare(appointer, found);
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
        var expectedErrorMessage = 'Appointee validation failed: user: Path `user` is required.';
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
        var expectedErrorMessage = 'Appointee validation failed: appointments: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "appointments"';
        appointee.user = User.create()._id;
        appointee.appointments = ['abcd1234efgh9876', 'abcd1234efgh9875'];
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
        Appointee.save(appointee).then(function (saved) {
          Appointee.Model.findById(appointee._id, function (findError, found) {
            compareResult = Appointee.compare(appointee, found);
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