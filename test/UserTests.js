"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require('../dist/models/Modules/User/UserModule');

var assert = require('assert');

var promiseFinally = require('promise.prototype.finally');

require('../dist/models/Modules/Poll/PollModule'); // Add 'finally()' to 'Promis.prototype'


promiseFinally.shim();
process.on('unhandledRejection', function (error) {
  console.log('unhandledRejection', error.message);
});

var Person = require('../dist/models/Modules/User/Person');

var UserAccount = require('../dist/models/Modules/User/UserAccount');

var UserRole = require('../dist/models/Modules/User/UserRole');

var PersonRole = require('../dist/models/Modules/User/PersonRole');

var GovernmentOfficial = require('../dist/models/Modules/Government/GovernmentOfficial');

var AuthToken = require('../dist/models/Modules/User/AuthToken');

var Address = require('../dist/models/Modules/Geography/Address');

var Citizen = require('../dist/models/Modules/Poll/Citizen');

var GroupMember = require('../dist/models/Modules/UserGroup/GroupMember');

describe('User Module Tests', function () {
  before(function (done) {
    Person.clear().then(function () {
      UserAccount.clear().then(function () {
        UserRole.clear().then(function () {
          PersonRole.clear().then(function () {
            AuthToken.clear().finally(done);
          });
        });
      });
    });
  });
  describe('Person Model', function () {
    describe('Person.create()', function () {
      it('create() creates a person instance.', function () {
        var person = Person.create();
        assert(_typeof(person) === "object");
      });
      it('create() creates a person instance with _id field populated', function () {
        var person = Person.create();
        assert(_typeof(person._id) === "object" && /^[a-f\d]{24}$/i.test(person._id));
      });
    });
    describe('Person.save()', function () {
      it('Required fields validation', function (done) {
        var person = Person.create();
        var testFailed = 0;
        var error;
        var expectedErrorMessage = 'Person validation failed: lastName: Path `lastName` is required., firstName: Path `firstName` is required.';
        Person.save(person).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          error = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('Person.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Person.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Person.userAccount must be a valid ID', function (done) {
        var person = Person.create();
        var testFailed = 0;
        var error = null;
        var expectedErrorMessage = 'Person validation failed: userAccount: Cast to ObjectID failed for value "abcd1234efgh9876" at path "userAccount"';
        person.firstName = 'firstName';
        person.middleName = 'middleName';
        person.lastName = 'lastName';
        person.userAccount = 'abcd1234efgh9876';
        person.address = Address.create();
        person.personRoles = [GovernmentOfficial.create(), GovernmentOfficial.create()];
        Person.save(person).then(function (savedPerson) {
          testFailed = 1;
        }, function (saveErr) {
          error = saveErr;
        }).finally(function () {
          if (testFailed) {
            done(new Error('Person.save() promise resolved when it should have been rejected with Validation Error'));
          } else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Person.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Person.address must be a valid ID', function (done) {
        var person = Person.create();
        var testFailed = 0;
        var error = null;
        var expectedErrorMessage = 'Person validation failed: address: Cast to ObjectID failed for value "abcd1234efgh9876" at path "address"';
        person.firstName = 'firstName';
        person.middleName = 'middleName';
        person.lastName = 'lastName';
        person.userAccount = UserAccount.create();
        person.address = 'abcd1234efgh9876';
        person.personRoles = [GovernmentOfficial.create(), GovernmentOfficial.create()];
        Person.save(person).then(function (savedPerson) {
          testFailed = 1;
        }, function (saveErr) {
          error = saveErr;
        }).finally(function () {
          if (testFailed) {
            done(new Error('Person.save() promise resolved when it should have been rejected with Validation Error'));
          } else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Person.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Person.personRoles must be a valid ID', function (done) {
        var person = Person.create();
        var testFailed = 0;
        var error = null;
        var expectedErrorMessage = 'Person validation failed: personRoles: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "personRoles"';
        person.firstName = 'firstName';
        person.middleName = 'middleName';
        person.lastName = 'lastName';
        person.address = Address.create();
        person.userAccount = UserAccount.create();
        person.personRoles = ['abcd1234efgh9876', 'abcd1234efgh9875'];
        Person.save(person).then(function (savedPerson) {
          testFailed = 1;
        }, function (saveErr) {
          error = saveErr;
        }).finally(function () {
          if (testFailed) {
            done(new Error('Person.save() promise resolved when it should have been rejected with Validation Error'));
          } else {
            if (error != null && error.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('Person.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + error.message));
            }
          }
        });
      });
      it('Valid call saves person', function (done) {
        var person = Person.create();
        var error = null;
        person.firstName = 'firstName';
        person.middleName = 'middleName';
        person.lastName = 'lastName';
        person.userAccount = UserAccount.create();
        person.address = Address.create();
        person.personRoles = [GovernmentOfficial.create(), GovernmentOfficial.create()];
        Person.save(person).then(function (savedPerson) {
          Person.findOne({
            _id: savedPerson._id
          }).then(function (findErr, foundPerson) {
            if (findErr) {
              error = findErr;
            } else {
              var compareResult = Person.compare(person, foundPerson);

              if (compareResult.match == false) {
                error = new Error(compareResult.message);
              }
            }
          });
        }, function (saveErr) {
          error = saveErr;
        }).finally(function () {
          if (error) {
            done(error);
          } else {
            done();
          }
        });
      });
    });
  });
  describe('User Account Model', function () {
    describe('UserAccount.create()', function () {
      it('create() creates a userAccount instance', function () {
        var userAccount = UserAccount.create();
        assert(_typeof(userAccount) === "object");
      });
      it('create() creates a userAccount instance with _id field populated', function () {
        var userAccount = UserAccount.create();
        assert(_typeof(userAccount._id) === "object" && /^[a-f\d]{24}$/i.test(userAccount._id));
      });
    });
    describe('UserAccount.save()', function () {
      it('Required fields validation', function (done) {
        var userAccount = UserAccount.create();
        var testFailed = 0;
        var err;
        var expectedErrorMessage = 'UserAccount validation failed: person: Path `person` is required., passwordHash: Path `passwordHash` is required., email: Path `email` is required.';
        UserAccount.save(userAccount).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          err = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('UserAccount.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (err != null && err.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('UserAccount.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + err.message));
            }
          }
        });
      });
      it('UserAccount.person must be a valid ID', function (done) {
        var userAccount = UserAccount.create();
        var testFailed = 0;
        var err = null;
        var expectedErrorMessage = 'UserAccount validation failed: person: Cast to ObjectID failed for value "asdf1234zyxw9876" at path "person"';
        userAccount.email = 'email@domain.com';
        userAccount.passwordHash = 'aasdf;lkjwoiethoinwaf;f;vno32890y4r8qhpajr98etj8tntaijffijfa';
        userAccount.person = 'asdf1234zyxw9876';
        userAccount.authToken = AuthToken.create();
        userAccount.userRoles = [Citizen.create(), GroupMember.create()];
        UserAccount.save(userAccount).then(function (savedUserAccount) {
          testFailed = 1;
        }, function (saveErr) {
          err = saveErr;
        }).finally(function () {
          if (testFailed) {
            done(new Error('UserAccount.save() promise resolved when it should have been rejected with Validation Error'));
          } else {
            if (err != null && err.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('UserAccount.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + err.message));
            }
          }
        });
      });
      it('UserAccount.authToken must be a valid ID', function (done) {
        var userAccount = UserAccount.create();
        var testFailed = 0;
        var err = null;
        var expectedErrorMessage = 'UserAccount validation failed: authToken: Cast to ObjectID failed for value "asdf1234zyxw9876" at path "authToken"';
        userAccount.email = 'email@domain.com';
        userAccount.passwordHash = 'aasdf;lkjwoiethoinwaf;f;vno32890y4r8qhpajr98etj8tntaijffijfa';
        userAccount.person = Person.create();
        userAccount.authToken = 'asdf1234zyxw9876';
        userAccount.userRoles = [Citizen.create(), GroupMember.create()];
        UserAccount.save(userAccount).then(function (savedUserAccount) {
          testFailed = 1;
        }, function (saveErr) {
          err = saveErr;
        }).finally(function () {
          if (testFailed) {
            done(new Error('UserAccount.save() promise resolved when it should have been rejected with Validation Error'));
          } else {
            if (err != null && err.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('UserAccount.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + err.message));
            }
          }
        });
      });
      it('UserAccount.userRoles must be a valid array of IDs', function (done) {
        var userAccount = UserAccount.create();
        var testFailed = 0;
        var err = null;
        var expectedErrorMessage = 'UserAccount validation failed: userRoles: Cast to Array failed for value "[ \'asdf1234zyxw9876\', \'asdf1234zyxw9875\' ]" at path "userRoles"';
        userAccount.email = 'email@domain.com';
        userAccount.passwordHash = 'aasdf;lkjwoiethoinwaf;f;vno32890y4r8qhpajr98etj8tntaijffijfa';
        userAccount.person = Person.create();
        userAccount.authToken = AuthToken.create();
        userAccount.userRoles = ['asdf1234zyxw9876', 'asdf1234zyxw9875'];
        UserAccount.save(userAccount).then(function (savedUserAccount) {
          testFailed = 1;
        }, function (saveErr) {
          err = saveErr;
        }).finally(function () {
          if (testFailed) {
            done(new Error('UserAccount.save() promise resolved when it should have been rejected with Validation Error'));
          } else {
            if (err != null && err.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('UserAccount.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + err.message));
            }
          }
        });
      });
      it('UserAccount.email must be a valid email address', function (done) {
        var userAccount = UserAccount.create();
        var testFailed = 0;
        var err = null;
        var expectedErrorMessage = 'UserAccount validation failed: email: Invalid Email';
        userAccount.email = 'email.domain.com';
        userAccount.passwordHash = 'aasdf;lkjwoiethoinwaf;f;vno32890y4r8qhpajr98etj8tntaijffijfa';
        userAccount.person = Person.create();
        userAccount.authToken = AuthToken.create();
        userAccount.userRoles = [Citizen.create(), GroupMember.create()];
        UserAccount.save(userAccount).then(function (savedUserAccount) {
          testFailed = 1;
        }, function (saveErr) {
          err = saveErr;
        }).finally(function () {
          if (testFailed) {
            done(new Error('UserAccount.save() promise resolved when it should have been rejected with Validation Error'));
          } else {
            if (err != null && err.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('UserAccount.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + err.message));
            }
          }
        });
      });
      it('Valid call saves userAccount', function (done) {
        var userAccount = UserAccount.create();
        var err = null;
        userAccount.email = 'email@domain.com';
        userAccount.passwordHash = 'aasdf;lkjwoiethoinwaf;f;vno32890y4r8qhpajr98etj8tntaijffijfa';
        userAccount.person = Person.create();
        userAccount.authToken = AuthToken.create();
        userAccount.userRoles = [Citizen.create(), GroupMember.create()];
        UserAccount.save(userAccount).then(function (savedUserAccount) {
          UserAccount.findOne({
            _id: savedUserAccount._id
          }).then(function (findErr, foundUserAccount) {
            if (findErr) {
              err = findErr;
            } else {
              var compareResult = UserAccount.compare(userAccount, foundUserAccount);

              if (compareResult.match == false) {
                err = new Error(compareResult.message);
              }
            }
          });
        }, function (saveErr) {
          err = saveErr;
        }).finally(function () {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
      });
    });
  });
  describe('User Role Model', function () {
    describe('UserRole.create()', function () {
      it('create() throws an error because the class is abstract.', function () {
        var expectedErrorMessage = 'You cannot create an instance of an abstract class.';
        var testFailed = true;

        try {
          var userRole = UserRole.create();
        } catch (error) {
          testFailed = false;
          if (error.message != expectedErrorMessage) throw new Error('create() did not throw the correct error.\n' + 'Expected: ' + expectedErrorMessage + '\n' + 'Actual:   ' + error.message);
        }

        if (testFailed) throw new Error('create() ran succesfully when it should have thrown an error.');
      });
    });
  });
  describe('AuthToken Model', function () {
    describe('AuthToken.create()', function () {
      it('create() creates a user instance.', function () {
        var authToken = AuthToken.create();
        assert(_typeof(authToken) === "object");
      });
      it('create() creates a authToken instance with _id field populated', function () {
        var authToken = AuthToken.create();
        assert(_typeof(authToken._id) === "object" && /^[a-f\d]{24}$/i.test(authToken._id));
      });
    });
    describe('AuthToken.save()', function () {
      it('Required fields validation', function (done) {
        var authToken = AuthToken.create();
        var testFailed = 0;
        var err;
        var expectedErrorMessage = 'AuthToken validation failed: userAccount: Path `userAccount` is required., expiresAt: Path `expiresAt` is required., createdAt: Path `createdAt` is required.';
        AuthToken.save(authToken).then(function (result) {
          testFailed = 1;
        }, function (rejectionErr) {
          err = rejectionErr;
        }).finally(function () {
          if (testFailed) done(new Error('AuthToken.save() promise resolved when it should have been rejected with Validation Error'));else {
            if (err != null && err.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('AuthToken.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + err.message));
            }
          }
        });
      });
      it('AuthToken.UserAccount must be a valid ID', function (done) {
        var authToken = AuthToken.create();
        var testFailed = 0;
        var err = null;
        var expectedErrorMessage = 'AuthToken validation failed: userAccount: Cast to ObjectID failed for value "abcd1234efgh9876" at path "userAccount"';
        authToken.createdAt = new Date();
        authToken.expiresAt = new Date() + 1;
        authToken.userAccount = 'abcd1234efgh9876';
        AuthToken.save(authToken).then(function (savedAuthToken) {
          testFailed = 1;
        }, function (saveErr) {
          err = saveErr;
        }).finally(function () {
          if (testFailed) {
            done(new Error('AuthToken.save() promise resolved when it should have been rejected with Validation Error'));
          } else {
            if (err != null && err.message == expectedErrorMessage) {
              done();
            } else {
              done(new Error('AuthToken.save() did not return the correct Validation Error.\n' + '   Expected: ' + expectedErrorMessage + '\n' + '   Actual:   ' + err.message));
            }
          }
        });
      });
      it('Valid call saves authToken', function (done) {
        var authToken = AuthToken.create();
        var err = null;
        authToken.createdAt = new Date();
        authToken.expiresAt = new Date() + 1;
        authToken.userAccount = UserAccount.create()._id;
        AuthToken.save(authToken).then(function (savedAuthToken) {
          AuthToken.findOne({
            _id: savedAuthToken._id
          }).then(function (foundAuthToken) {
            var compareResult = AuthToken.compare(authToken, foundAuthToken);

            if (compareResult.match == false) {
              err = new Error(compareResult.message);
            }
          }, function (findError) {
            error = findError;
          });
        }, function (saveErr) {
          err = saveErr;
        }).finally(function () {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
      });
    });
  });
});