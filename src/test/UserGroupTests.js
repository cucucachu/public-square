const assert = require('assert');

const database = require('../dist/models/database');
require('../dist/models/Modules/UserGroup/UserGroupModule');
const User = require('../dist/models/Modules/User/User');
const UserRole = require('../dist/models/Modules/User/UserRole');
const UserGroup = require('../dist/models/Modules/UserGroup/UserGroup');
const GroupMember = require('../dist/models/Modules/UserGroup/GroupMember');
const GroupManager = require('../dist/models/Modules/UserGroup/GroupManager');
const GroupEvent = require('../dist/models/Modules/UserGroup/GroupEvent');
const Organization = require('../dist/models/Modules/UserGroup/Organization');
const OrganizationMember = require('../dist/models/Modules/UserGroup/OrganizationMember');
const Address = require('../dist/models/Modules/Geography/Address');


describe('UserGroup Module Tests', function() {
	
	before(async () => {
		await database.connect();

		await UserRole.clear();
		await UserGroup.clear();
		await GroupEvent.clear();
		await Organization.clear();
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
				var expectedErrorMessage = 'UserGroup validation failed: groupManagers: Path `groupManagers` is required. UserGroup validation failed: createdAt: Path `createdAt` is required., name: Path `name` is required.';

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

			it('UserGroup.parentGroup must be a valid ID.', function(done){
				var userGroup = UserGroup.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='UserGroup validation failed: parentGroup: Cast to ObjectID failed for value "abcd1234efgh9876" at path "parentGroup"';

				userGroup.name = 'The Best User Group';
				userGroup.createdAt = new Date();
				userGroup.endDate = new Date();
				userGroup.parentGroup = 'abcd1234efgh9876';
				userGroup.childGroups = [UserGroup.create()._id, GroupEvent.create()._id];
				userGroup.groupMembers = [GroupMember.create()._id, GroupMember.create()._id];
				userGroup.groupManagers =  [GroupManager.create()._id, GroupManager.create()._id];


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

			it('UserGroup.childGroups must be a valid array of IDs.', function(done){
				var userGroup = UserGroup.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='UserGroup validation failed: childGroups: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "childGroups"';

				userGroup.name = 'The Best User Group';
				userGroup.createdAt = new Date();
				userGroup.endDate = new Date();
				userGroup.parentGroup = UserGroup.create()._id;
				userGroup.childGroups = ['abcd1234efgh9876', 'abcd1234efgh9875'];
				userGroup.groupMembers = [GroupMember.create()._id, GroupMember.create()._id];
				userGroup.groupManagers =  [GroupManager.create()._id, GroupManager.create()._id];


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

			it('UserGroup.groupMembers must be a valid array of IDs.', function(done){
				var userGroup = UserGroup.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='UserGroup validation failed: groupMembers: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "groupMembers"';

				userGroup.name = 'The Best User Group';
				userGroup.createdAt = new Date();
				userGroup.endDate = new Date();
				userGroup.parentGroup = UserGroup.create()._id;
				userGroup.childGroups = [UserGroup.create()._id, GroupEvent.create()._id];
				userGroup.groupMembers = ['abcd1234efgh9876', 'abcd1234efgh9875'];
				userGroup.groupManagers =  [GroupManager.create()._id, GroupManager.create()._id];


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

			it('UserGroup.groupManagers must be a valid array of IDs.', function(done){
				var userGroup = UserGroup.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='UserGroup validation failed: groupManagers: Path `groupManagers` is required. UserGroup validation failed: groupManagers: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "groupManagers"';

				userGroup.name = 'The Best User Group';
				userGroup.createdAt = new Date();
				userGroup.endDate = new Date();
				userGroup.parentGroup = UserGroup.create()._id;
				userGroup.childGroups = [UserGroup.create()._id, GroupEvent.create()._id];
				userGroup.groupMembers = [GroupMember.create()._id, GroupMember.create()._id];
				userGroup.groupManagers =  ['abcd1234efgh9876', 'abcd1234efgh9875'];


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

				userGroup.name = 'The Best User Group';
				userGroup.createdAt = new Date();
				userGroup.endDate = new Date();
				userGroup.parentGroup = UserGroup.create()._id;
				userGroup.childGroups = [UserGroup.create()._id, GroupEvent.create()._id];
				userGroup.groupMembers = [GroupMember.create()._id, GroupMember.create()._id];
				userGroup.groupManagers =  [GroupManager.create()._id, GroupManager.create()._id];

				UserGroup.save(userGroup).then(
					(savedUserGroup) => {
						UserGroup.findById(userGroup._id).then(
							(found) => {
								compareResult = UserGroup.compare(userGroup, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							}, 
							(findError) => {
								error = findError;
							}
						);
					},
					(saveErr) => {
						error = saveErr;
					}
				).finally(() => {
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
				var expectedErrorMessage = 'GroupMember validation failed: userGroups: Path `userGroups` is required. GroupMember validation failed: user: Path `user` is required., startDate: Path `startDate` is required.';

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

			it('GroupMember.user must contain a valid ID.', function(done){
				var groupMember = GroupMember.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='GroupMember validation failed: user: Cast to ObjectID failed for value "abcd1234efgh9876" at path "user"';

				groupMember.startDate = new Date();
				groupMember.user =  'abcd1234efgh9876';
				groupMember.userGroups = [UserGroup.create()._id, Organization.create()._id];

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

			it('GroupMember.userGroups must be a valid Array of IDs.', function(done){
				var groupMember = GroupMember.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='GroupMember validation failed: userGroups: Path `userGroups` is required. GroupMember validation failed: userGroups: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "userGroups"';

				groupMember.startDate = new Date();
				groupMember.user =  User.create()._id;
				groupMember.userGroups = ['abcd1234efgh9876', 'abcd1234efgh9875'];

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

				groupMember.startDate = new Date();
				groupMember.user =  User.create()._id;
				groupMember.userGroups = [UserGroup.create()._id, Organization.create()._id];

				GroupMember.save(groupMember).then(
					(savedGroupMember) => {
						GroupMember.findById(groupMember._id).then(
							(found) => {
								compareResult = GroupMember.compare(groupMember, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							},
							(findError) => {
								error = findError;
							}
						);
					},
					(saveErr) => {
						error = saveErr;
					}
				).finally(() => {
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
				var expectedErrorMessage = 'GroupManager validation failed: userGroups: Path `userGroups` is required. GroupManager validation failed: user: Path `user` is required., startDate: Path `startDate` is required.';

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

			it('GroupManager.user must be a valid ID', function(done){
				var groupManager = GroupManager.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='GroupManager validation failed: user: Cast to ObjectID failed for value "abcd1234efgh9876" at path "user"';

				groupManager.startDate = new Date();
				groupManager.user = 'abcd1234efgh9876';
				groupManager.userGroups = [UserGroup.create()._id, Organization.create()._id];

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

			it('GroupManager.userGroups must be a valid Array of IDs', function(done){
				var groupManager = GroupManager.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='GroupManager validation failed: userGroups: Path `userGroups` is required. GroupManager validation failed: userGroups: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "userGroups"';

				groupManager.startDate = new Date();
				groupManager.user = User.create()._id;
				groupManager.userGroups = ['abcd1234efgh9876', 'abcd1234efgh9875'];

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

				groupManager.startDate = new Date();
				groupManager.user = User.create()._id;
				groupManager.userGroups = [UserGroup.create()._id, Organization.create()._id];

				GroupManager.save(groupManager).then(
					(savedGroupManager) => {
						GroupManager.findById(groupManager._id).then(
							(found) => {
								compareResult = GroupManager.compare(groupManager, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							},
							(findError) => {
								error = findError;
							}
						);
					},
					(saveErr) => {
						error = saveErr;
					}
				).finally(() => {
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

			it('create() creates a GroupEvent instance.', function() {
				var groupEvent = GroupEvent.create();
				assert(typeof(groupEvent) === "object");
			});

			it('create() creates a GroupEvent instance with _id field populated', function(){
				var groupEvent = GroupEvent.create();
				assert(typeof(groupEvent._id) === "object" && /^[a-f\d]{24}$/i.test(groupEvent._id));
			});

		});

		describe('GroupEvent.save()', function() {

			it('userGroup.save() throws an error if required fields are missing.', function(done) {
				var groupEvent = GroupEvent.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'GroupEvent validation failed: groupManagers: Path `groupManagers` is required. GroupEvent validation failed: endTime: Path `endTime` is required., startTime: Path `startTime` is required., createdAt: Path `createdAt` is required., name: Path `name` is required.';

				GroupEvent.save(groupEvent).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('GroupEvent.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'GroupEvent.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('GroupEvent.parentGroup must be a valid ID.', function(done){
				var groupEvent = GroupEvent.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='GroupEvent validation failed: parentGroup: Cast to ObjectID failed for value "abcd1234efgh9876" at path "parentGroup"';

				groupEvent.name = 'The Best User Group';
				groupEvent.createdAt = new Date();
				groupEvent.endDate = new Date();
				groupEvent.startTime = new Date();
				groupEvent.endTime = new Date();
				groupEvent.addresses = [Address.create()._id, Address.create()._id];
				groupEvent.parentGroup = 'abcd1234efgh9876';
				groupEvent.childGroups = [GroupEvent.create()._id, GroupEvent.create()._id];
				groupEvent.groupMembers = [GroupMember.create()._id, GroupMember.create()._id];
				groupEvent.groupManagers =  [GroupManager.create()._id, GroupManager.create()._id];


				GroupEvent.save(groupEvent).then(
					function(savedGroupEvent) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('GroupEvent.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'GroupEvent.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});	

			it('GroupEvent.addresses must be a valid array of IDs.', function(done){
				var groupEvent = GroupEvent.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='GroupEvent validation failed: addresses: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "addresses"';

				groupEvent.name = 'The Best User Group';
				groupEvent.createdAt = new Date();
				groupEvent.endDate = new Date();
				groupEvent.startTime = new Date();
				groupEvent.endTime = new Date();
				groupEvent.addresses = ['abcd1234efgh9876', 'abcd1234efgh9875'];
				groupEvent.parentGroup = GroupEvent.create()._id;
				groupEvent.childGroups = [GroupEvent.create()._id, GroupEvent.create()._id];
				groupEvent.groupMembers = [GroupMember.create()._id, GroupMember.create()._id];
				groupEvent.groupManagers =  [GroupManager.create()._id, GroupManager.create()._id];


				GroupEvent.save(groupEvent).then(
					function(savedGroupEvent) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('GroupEvent.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'GroupEvent.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});	

			it('GroupEvent.childGroups must be a valid array of IDs.', function(done){
				var groupEvent = GroupEvent.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='GroupEvent validation failed: childGroups: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "childGroups"';

				groupEvent.name = 'The Best User Group';
				groupEvent.createdAt = new Date();
				groupEvent.endDate = new Date();
				groupEvent.startTime = new Date();
				groupEvent.endTime = new Date();
				groupEvent.addresses = [Address.create()._id, Address.create()._id];
				groupEvent.parentGroup = GroupEvent.create()._id;
				groupEvent.childGroups = ['abcd1234efgh9876', 'abcd1234efgh9875'];
				groupEvent.groupMembers = [GroupMember.create()._id, GroupMember.create()._id];
				groupEvent.groupManagers =  [GroupManager.create()._id, GroupManager.create()._id];


				GroupEvent.save(groupEvent).then(
					function(savedGroupEvent) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('GroupEvent.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'GroupEvent.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});	

			it('GroupEvent.groupMembers must be a valid array of IDs.', function(done){
				var groupEvent = GroupEvent.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='GroupEvent validation failed: groupMembers: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "groupMembers"';

				groupEvent.name = 'The Best User Group';
				groupEvent.createdAt = new Date();
				groupEvent.endDate = new Date();
				groupEvent.startTime = new Date();
				groupEvent.endTime = new Date();
				groupEvent.addresses = [Address.create()._id, Address.create()._id];
				groupEvent.parentGroup = GroupEvent.create()._id;
				groupEvent.childGroups = [GroupEvent.create()._id, GroupEvent.create()._id];
				groupEvent.groupMembers = ['abcd1234efgh9876', 'abcd1234efgh9875'];
				groupEvent.groupManagers =  [GroupManager.create()._id, GroupManager.create()._id];


				GroupEvent.save(groupEvent).then(
					function(savedGroupEvent) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('GroupEvent.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'GroupEvent.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});	

			it('GroupEvent.groupManagers must be a valid array of IDs.', function(done){
				var groupEvent = GroupEvent.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='GroupEvent validation failed: groupManagers: Path `groupManagers` is required. GroupEvent validation failed: groupManagers: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "groupManagers"';

				groupEvent.name = 'The Best User Group';
				groupEvent.createdAt = new Date();
				groupEvent.endDate = new Date();
				groupEvent.startTime = new Date();
				groupEvent.endTime = new Date();
				groupEvent.addresses = [Address.create()._id, Address.create()._id];
				groupEvent.parentGroup = GroupEvent.create()._id;
				groupEvent.childGroups = [GroupEvent.create()._id, GroupEvent.create()._id];
				groupEvent.groupMembers = [GroupMember.create()._id, GroupMember.create()._id];
				groupEvent.groupManagers =  ['abcd1234efgh9876', 'abcd1234efgh9875'];


				GroupEvent.save(groupEvent).then(
					function(savedGroupEvent) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('GroupEvent.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'GroupEvent.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});				

			it('Valid Call Saves GroupEvent.', function(done){
				var groupEvent = GroupEvent.create();
				var error = null;
				var compareResult;

				groupEvent.name = 'The Best User Group';
				groupEvent.createdAt = new Date();
				groupEvent.endDate = new Date();
				groupEvent.startTime = new Date();
				groupEvent.endTime = new Date();
				groupEvent.addresses = [Address.create()._id, Address.create()._id];
				groupEvent.parentGroup = GroupEvent.create()._id;
				groupEvent.childGroups = [GroupEvent.create()._id, GroupEvent.create()._id];
				groupEvent.groupMembers = [GroupMember.create()._id, GroupMember.create()._id];
				groupEvent.groupManagers =  [GroupManager.create()._id, GroupManager.create()._id];

				GroupEvent.save(groupEvent).then(
					(savedGroupEvent) => {
						GroupEvent.findById(groupEvent._id).then(
							(found) => {
								compareResult = GroupEvent.compare(groupEvent, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							}, 
							(findError) => {
								error = findError;
							}
						);
					},
					(saveErr) => {
						error = saveErr;
					}
				).finally(() => {
					if (error)
						done(error);
					else
						done();
				});
			});

		});

	});

	describe('Organization Model', function(){

		describe('Organization.create()', function(){

			it('create() creates a Organization instance.', function() {
				var organization = Organization.create();
				assert(typeof(organization) === "object");
			});

			it('create() creates a Organization instance with _id field populated', function(){
				var organization = Organization.create();
				assert(typeof(organization._id) === "object" && /^[a-f\d]{24}$/i.test(organization._id));
			});

		});

		describe('Organization.save()', function() {

			it('userGroup.save() throws an error if required fields are missing.', function(done) {
				var organization = Organization.create();
				var testFailed = 0;
				var error;
				var expectedErrorMessage = 'Organization validation failed: groupManagers: Path `groupManagers` is required. Organization validation failed: createdAt: Path `createdAt` is required., name: Path `name` is required.';

				Organization.save(organization).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Organization.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Organization.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Organization.parentGroup must be a valid ID.', function(done){
				var organization = Organization.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='Organization validation failed: parentGroup: Cast to ObjectID failed for value "abcd1234efgh9876" at path "parentGroup"';

				organization.name = 'The Best User Group';
				organization.createdAt = new Date();
				organization.endDate = new Date();
				organization.addresses = [Address.create()._id, Address.create()._id];
				organization.parentGroup = 'abcd1234efgh9876';
				organization.childGroups = [Organization.create()._id, Organization.create()._id];
				organization.groupMembers = [GroupMember.create()._id, GroupMember.create()._id];
				organization.groupManagers =  [GroupManager.create()._id, GroupManager.create()._id];
				organization.organizationMembers = [OrganizationMember.create()._id, OrganizationMember.create()._id];


				Organization.save(organization).then(
					function(savedOrganization) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('Organization.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'Organization.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});	

			it('Organization.addresses must be a valid array of IDs.', function(done){
				var organization = Organization.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='Organization validation failed: addresses: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "addresses"';

				organization.name = 'The Best User Group';
				organization.createdAt = new Date();
				organization.endDate = new Date();
				organization.addresses = ['abcd1234efgh9876', 'abcd1234efgh9875'];
				organization.parentGroup = Organization.create()._id;
				organization.childGroups = [Organization.create()._id, Organization.create()._id];
				organization.groupMembers = [GroupMember.create()._id, GroupMember.create()._id];
				organization.groupManagers =  [GroupManager.create()._id, GroupManager.create()._id];
				organization.organizationMembers = [OrganizationMember.create()._id, OrganizationMember.create()._id];


				Organization.save(organization).then(
					function(savedOrganization) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('Organization.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'Organization.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});	

			it('Organization.childGroups must be a valid array of IDs.', function(done){
				var organization = Organization.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='Organization validation failed: childGroups: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "childGroups"';

				organization.name = 'The Best User Group';
				organization.createdAt = new Date();
				organization.endDate = new Date();
				organization.addresses = [Address.create()._id, Address.create()._id];
				organization.parentGroup = Organization.create()._id;
				organization.childGroups = ['abcd1234efgh9876', 'abcd1234efgh9875'];
				organization.groupMembers = [GroupMember.create()._id, GroupMember.create()._id];
				organization.groupManagers =  [GroupManager.create()._id, GroupManager.create()._id];
				organization.organizationMembers = [OrganizationMember.create()._id, OrganizationMember.create()._id];


				Organization.save(organization).then(
					function(savedOrganization) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('Organization.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'Organization.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});	

			it('Organization.groupMembers must be a valid array of IDs.', function(done){
				var organization = Organization.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='Organization validation failed: groupMembers: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "groupMembers"';

				organization.name = 'The Best User Group';
				organization.createdAt = new Date();
				organization.endDate = new Date();
				organization.addresses = [Address.create()._id, Address.create()._id];
				organization.parentGroup = Organization.create()._id;
				organization.childGroups = [Organization.create()._id, Organization.create()._id];
				organization.groupMembers = ['abcd1234efgh9876', 'abcd1234efgh9875'];
				organization.groupManagers =  [GroupManager.create()._id, GroupManager.create()._id];
				organization.organizationMembers = [OrganizationMember.create()._id, OrganizationMember.create()._id];


				Organization.save(organization).then(
					function(savedOrganization) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('Organization.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'Organization.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});	

			it('Organization.groupManagers must be a valid array of IDs.', function(done){
				var organization = Organization.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='Organization validation failed: groupManagers: Path `groupManagers` is required. Organization validation failed: groupManagers: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "groupManagers"';

				organization.name = 'The Best User Group';
				organization.createdAt = new Date();
				organization.endDate = new Date();
				organization.addresses = [Address.create()._id, Address.create()._id];
				organization.parentGroup = Organization.create()._id;
				organization.childGroups = [Organization.create()._id, Organization.create()._id];
				organization.groupMembers = [GroupMember.create()._id, GroupMember.create()._id];
				organization.groupManagers =  ['abcd1234efgh9876', 'abcd1234efgh9875'];
				organization.organizationMembers = [OrganizationMember.create()._id, OrganizationMember.create()._id];


				Organization.save(organization).then(
					function(savedOrganization) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('Organization.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'Organization.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});	

			it('Organization.organizationMembers must be a valid array of IDs.', function(done){
				var organization = Organization.create();
				var testFailed = 0;
				var error = null;

				var expectedErrorMessage ='Organization validation failed: organizationMembers: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "organizationMembers"';

				organization.name = 'The Best User Group';
				organization.createdAt = new Date();
				organization.endDate = new Date();
				organization.addresses = [Address.create()._id, Address.create()._id];
				organization.parentGroup = Organization.create()._id;
				organization.childGroups = [Organization.create()._id, Organization.create()._id];
				organization.groupMembers = [GroupMember.create()._id, GroupMember.create()._id];
				organization.groupManagers =  [GroupManager.create()._id, GroupManager.create()._id];
				organization.organizationMembers = ['abcd1234efgh9876', 'abcd1234efgh9875'];


				Organization.save(organization).then(
					function(savedOrganization) {
						testFailed = 1;
					},
					function(saveErr) {
						error = saveErr;
					}
				).finally(function() {
					if(testFailed) {
						done(new Error('Organization.save() promise resolved when it should have been rejected with Validation Error'));
					}
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else {
							done(new Error(
								'Organization.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});				

			it('Valid Call Saves Organization.', function(done){
				var organization = Organization.create();
				var error = null;
				var compareResult;

				organization.name = 'The Best User Group';
				organization.createdAt = new Date();
				organization.endDate = new Date();
				organization.addresses = [Address.create()._id, Address.create()._id];
				organization.parentGroup = Organization.create()._id;
				organization.childGroups = [Organization.create()._id, Organization.create()._id];
				organization.groupMembers = [GroupMember.create()._id, GroupMember.create()._id];
				organization.groupManagers =  [GroupManager.create()._id, GroupManager.create()._id];
				organization.organizationMembers = [OrganizationMember.create()._id, OrganizationMember.create()._id];

				Organization.save(organization).then(
					(savedOrganization) => {
						Organization.findById(organization._id).then(
							(found) => {
								compareResult = Organization.compare(organization, found);

								if (compareResult.match == false)
									error = new Error(compareResult.message);
							}, 
							(findError) => {
								error = findError;
							}
						);
					},
					(saveErr) => {
						error = saveErr;
					}
				).finally(() => {
					if (error)
						done(error);
					else
						done();
				});
			});

		});

	});

	after(() => {
		database.close();
	});
});