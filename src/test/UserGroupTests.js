var assert = require('assert');
var expect = require('expect');
var promiseFinally = require('promise.prototype.finally');

require('../dist/models/Modules/UserGroup/UserGroupModule');

// Add 'finally()' to 'Promis.prototype'
promiseFinally.shim();

process.on('unhandledRejection', error => {
	console.log('unhandledRejection', error.message);
});


var User = require('../dist/models/Modules/User/User');
var UserAccount = require('../dist/models/Modules/User/UserAccount');
var UserRole = require('../dist/models/Modules/User/UserRole');
var UserGroup = require('../dist/models/Modules/UserGroup/UserGroup');
var GroupMember = require('../dist/models/Modules/UserGroup/GroupMember');
var GroupManager = require('../dist/models/Modules/UserGroup/GroupManager');
var GroupEvent = require('../dist/models/Modules/UserGroup/GroupEvent');


describe('UserGroup Module Tests', function() {
	
	before(function(done) {
		User.clear().then(
			function() {
				UserAccount.clear().then(
					function() {
						UserRole.clear().then(
							function() {
								GroupManager.clear().then(
									function() {
										GroupMember.clear().then(
											function() {
												UserGroup.clear().then(done, done);
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

	describe('UserGroup Model', function() {

		describe('UserGroup.create()', function() {
		
			it('create() creates a UserGroup instance.', function() {
				var userGroup = UserGroup.create();
				assert(typeof(userGroup) === "object");
			});

			it('create() creates a UserGroup instance with _id field populated', function(){
				var userGroup = UserGroup.create();
				assert(typeof(userGroup._id) === "object" && /^[a-f\d]{24}$/i.test(userGroup._id));
			});
		});

		describe('UserGroup.save()', function() {

			it('userGroup.save() throws an error if required fields are missing.', function(done) {
				var userGroup = UserGroup.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'UserGroup validation failed: groupManagers: Validator failed for path `groupManagers` with value ``';

				UserGroup.save(userGroup).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('UserGroup.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'UserGroup.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});


			it('UserGroup.groupManagers must contain valid IDs.', function(done){
				var userGroup = UserGroup.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='UserGroup validation failed: groupManagers: Cast to Array failed for value "Not an Object ID" at path "groupManagers"';

				userGroup.groupManagers =  'Not an Object ID';

				UserGroup.save(userGroup).then(
					function(savedUserGroup) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('UserGroup.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'UserGroup.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});					

			it('Valid Call Saves UserGroup.', function(done){
				var userGroup = UserGroup.create();
				var error = null;
				var compareResult;

				userGroup.groupManagers =  [GroupManager.create()._id];

				UserGroup.save(userGroup).then(
					function(savedUserGroup) {
						UserGroup.Model.findById(userGroup._id, function(findError, found) {
							compareResult = UserGroup.compare(userGroup, found);

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

		describe('UserGroup.addChildren()', function() {

			it('UserGroup.addChildren() rejects with an error if children parameter is not an Array.', function(done) {
				var parentGroup = UserGroup.create();
				var childGroup = UserGroup.create();
				var error = null;
				var expectedErrorMessage = 'Invalid arguments for UserGroup.addChildren(parent, children), children must be an Array.';
				var testFailed = 0;

				parentGroup.groupManagers =  [GroupManager.create()._id];
				childGroup.groupManagers = [GroupManager.create()._id];

				UserGroup.addChildren(parentGroup, childGroup).then(
					function() {
						testFailed = 1;
						error = new Error('UserGroup.save() promise resolved when it should have rejected with an error.');						
					},
					function(saveError) {
						if (saveError.message !== expectedErrorMessage) {
							error = new Error('UserGroup.save() promise rejected with unexpected error:\n' + saveError.message);
							testFailed = 1;
						}
					}
				).finally(function() {
					if (error)
						done(error);
					else
						done();
				});
			});

			it('UserGroup.addChildren() rejects with an error if parent parameter is null.', function(done) {
				var parentGroup = null;
				var childGroup = [UserGroup.create()];
				var error = null;
				var expectedErrorMessage = 'Invalid arguments for UserGroup.addChildren(parent, children), parent cannot be null.';
				var testFailed = 0;

				childGroup.groupManagers = [GroupManager.create()._id];

				UserGroup.addChildren(parentGroup, childGroup).then(
					function() {
						testFailed = 1;
						error = new Error('UserGroup.save() promise resolved when it should have rejected with an error.');						
					},
					function(saveError) {
						if (saveError.message !== expectedErrorMessage) {
							error = new Error('UserGroup.save() promise rejected with unexpected error:\n' + saveError.message);
							testFailed = 1;
						}
					}
				).finally(function() {
					if (error)
						done(error);
					else
						done();
				});
			});

			it('UserGroup.addChildren() rejects with an error if children already have a different parent.', function(done) {
				var parentGroup = UserGroup.create();
				var childGroups = [UserGroup.create(), UserGroup.create()];
				var error = null;
				var expectedErrorMessage = 'UserGroup.addChildren: Illegal attempt to change a UserGroups parent.';
				var testFailed = 0;

				parentGroup.groupManagers =  [GroupManager.create()._id];
				childGroups[0].groupManagers = [GroupManager.create()._id];
				childGroups[1].groupManagers = [GroupManager.create()._id];

				childGroups[0].parentGroup = UserGroup.create()._id;

				UserGroup.addChildren(parentGroup, childGroups).then(
					function() {
						testFailed = 1;
						error = new Error('UserGroup.save() promise resolved when it should have rejected with an error.');						
					},
					function(saveError) {
						if (saveError.message.includes(expectedErrorMessage) == false) {
							error = new Error('UserGroup.save() promise rejected with unexpected error:\n' + saveError.message);
							testFailed = 1;
						}
					}
				).finally(function() {
					if (error)
						done(error);
					else
						done();
				});
			});

			it('UserGroup.addChildren() will only add new children, it will not add a child that is already a child of the parent', function(done){
				var parentGroup = UserGroup.create();
				var childGroups = [UserGroup.create(), UserGroup.create()];
				var error = null;
				var compareResult;
				var testFailed = 0;

				parentGroup.groupManagers =  [GroupManager.create()._id];
				childGroups[0].groupManagers = [GroupManager.create()._id];
				childGroups[1].groupManagers = [GroupManager.create()._id];

				UserGroup.addChildren(parentGroup, childGroups).then(
					function() {
						UserGroup.addChildren(parentGroup, childGroups).then(
							function() {
								UserGroup.Model.findById(parentGroup._id, function(findError, found) {
									if (found.childGroups.length != 2) 
										error = new Error('Parent UserGroup should have 2 children, but it has ' + found.childGroups.length + '.');
								});
							},
							function(saveError) {
								testFailed = 1;
								error = saveError;
							}
						);
					},
					function(saveError) {
						testFailed = 1;
						error = saveError;
					}
				).finally(function() {
					if (error)
						done(error);
					else
						done();
				});
			});	

			it('UserGroup.addChildren Happy Path', function(done){
				var parentGroup = UserGroup.create();
				var childGroups = [UserGroup.create(), UserGroup.create()];
				var error = null;
				var compareResult;
				var testFailed = 0;

				parentGroup.groupManagers =  [GroupManager.create()._id];
				childGroups[0].groupManagers = [GroupManager.create()._id];
				childGroups[1].groupManagers = [GroupManager.create()._id];

				UserGroup.addChildren(parentGroup, childGroups).then(
					function() {
						UserGroup.Model.findById(parentGroup._id, function(findErr, found) {
							found.childGroups.forEach(function(child, index) {
								if (child != childGroups[index]._id)
									error = new Error('Children do not match');
							});
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

	describe('GroupMember Model', function() {

		describe('GroupMember.create()', function() {
		
			it('create() creates a GroupMember instance.', function() {
				var groupMember = GroupMember.create();
				assert(typeof(groupMember) === "object");
			});

			it('create() creates a GroupMember instance with _id field populated', function(){
				var groupMember = GroupMember.create();
				assert(typeof(groupMember._id) === "object" && /^[a-f\d]{24}$/i.test(groupMember._id));
			});
		});

		describe('GroupMember.save()', function() {

			it('GroupMember.save() throws an error if required fields are missing.', function(done) {
				var groupMember = GroupMember.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'GroupMember validation failed: user: Path `user` is required., userGroup: Path `userGroup` is required.';

				GroupMember.save(groupMember).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('GroupMember.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'GroupMember.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});


			it('GroupMember.user and GroupMember.userGroup must contain a valid IDs.', function(done){
				var groupMember = GroupMember.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='GroupMember validation failed: user: Cast to ObjectID failed for value "Not an Object ID" at path "user", userGroup: Cast to ObjectID failed for value "Not an Object ID" at path "userGroup"';

				groupMember.user =  'Not an Object ID';
				groupMember.userGroup = 'Not an Object ID';

				GroupMember.save(groupMember).then(
					function(savedGroupMember) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('GroupMember.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'GroupMember.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});			

			it('Valid Call Saves GroupMember.', function(done){
				var groupMember = GroupMember.create();
				var error = null;
				var compareResult;

				groupMember.user = User.create()._id;
				groupMember.userGroup = UserGroup.create()._id;

				GroupMember.save(groupMember).then(
					function(savedGroupMember) {
						GroupMember.Model.findById(groupMember._id, function(findError, found) {
							compareResult = GroupMember.compare(groupMember, found);

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

	describe('GroupManager Model', function() {

		describe('GroupManager.create()', function() {
		
			it('create() creates a GroupManager instance.', function() {
				var groupManager = GroupManager.create();
				assert(typeof(groupManager) === "object");
			});

			it('create() creates a GroupManager instance with _id field populated', function(){
				var groupManager = GroupManager.create();
				assert(typeof(groupManager._id) === "object" && /^[a-f\d]{24}$/i.test(groupManager._id));
			});
		});

		describe('GroupManager.save()', function() {

			it('GroupManager.save() throws an error if required fields are missing.', function(done) {
				var groupManager = GroupManager.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'GroupManager validation failed: user: Path `user` is required., userGroup: Path `userGroup` is required.';

				GroupManager.save(groupManager).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('GroupManager.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'GroupManager.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});


			it('GroupManager.user and GroupManager.userGroup must contain a valid IDs.', function(done){
				var groupManager = GroupManager.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='GroupManager validation failed: user: Cast to ObjectID failed for value "Not an Object ID" at path "user", userGroup: Cast to ObjectID failed for value "Not an Object ID" at path "userGroup"';

				groupManager.user =  'Not an Object ID';
				groupManager.userGroup = 'Not an Object ID';

				GroupManager.save(groupManager).then(
					function(savedGroupManager) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('GroupManager.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'GroupManager.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});			

			it('Valid Call Saves GroupManager.', function(done){
				var groupManager = GroupManager.create();
				var error = null;
				var compareResult;

				groupManager.user = User.create()._id;
				groupManager.userGroup = UserGroup.create()._id;

				GroupManager.save(groupManager).then(
					function(savedGroupManager) {
						GroupManager.Model.findById(groupManager._id, function(findError, found) {
							compareResult = GroupManager.compare(groupManager, found);

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

	describe('GroupEvent Model', function(){
		describe('GroupEvent.create()', function(){
			it('create() creates a GroupManager instance.', function() {
				var groupEvent = GroupEvent.create();
				assert(typeof(groupEvent) === "object");
			});

			it('create() creates a GroupManager instance with _id field populated', function(){
				var groupEvent = GroupEvent.create();
				assert(typeof(groupEvent._id) === "object" && /^[a-f\d]{24}$/i.test(groupEvent._id));
			});
		});
	});
});