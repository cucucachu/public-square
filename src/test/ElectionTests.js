const assert = require('assert');

const database = require('../dist/models/database')
require('../dist/models/Modules/Government/Election/ElectionModule');
const GovernmentPosition = require('../dist/models/Modules/Government/GovernmentPosition');
const Election = require('../dist/models/Modules/Government/Election/Election');
const Campaign = require('../dist/models/Modules/Government/Election/Campaign');
const Candidate = require('../dist/models/Modules/Government/Election/Candidate');
const ElectionResult = require('../dist/models/Modules/Government/Election/ElectionResult');
const PrimaryElectionResult = require('../dist/models/Modules/Government/Election/PrimaryElectionResult');
const User = require('../dist/models/Modules/User/User');
const GeographicArea = require('../dist/models/Modules/Geography/GeographicArea');

describe('Election Module Tests', function() {

    before(async () => {
		await database.connect();

		await Election.clear();
		await Campaign.clear();
		await Candidate.clear();
		await ElectionResult.clear();
		await PrimaryElectionResult.clear();
    });
    
	describe('Election Model Tests', function() {

		describe('Election.create()', function() {
		
			it('Election.create() creates a Election instance.', function() {
				var election = Election.create();
				assert(typeof(election) === "object");
			});

			it('Election.create() creates a Election instance with _id field populated', function(){
				var election = Election.create();
				assert(typeof(election._id) === "object" && /^[a-f\d]{24}$/i.test(election._id));
			});
		});

		describe('Election.save()', function() {

			it('Election.save() throws an error if required fields are missing.', function(done) {
				var election = Election.create();
				var testFailed = 0;
                var error;
                
                var expectedErrorMessage = 'Election validation failed: campaigns: Path `campaigns` is required. Election validation failed: governmentPosition: Path `governmentPosition` is required.';

				Election.save(election).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Election.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Election.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Election.governmentPosition must be a valid ID', function(done) {
				var election = Election.create();
				var testFailed = 0;
                var error;
                
                var expectedErrorMessage = 'Election validation failed: governmentPosition: Cast to ObjectID failed for value "abcd1234efgh9876" at path "governmentPosition"';

                election.electionDate = new Date('2016-11-07');
                election.termStartDate = new Date('2017-01-06')
                election.governmentPosition = 'abcd1234efgh9876';
                election.campaigns = [Campaign.create()._id, Campaign.create()._id];

				Election.save(election).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Election.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Election.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Election.campaigns must be a valid Array of IDs', function(done) {
				var election = Election.create();
				var testFailed = 0;
                var error;
                
                var expectedErrorMessage = 'Election validation failed: campaigns: Path `campaigns` is required. Election validation failed: campaigns: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "campaigns"';

                election.electionDate = new Date('2016-11-07');
                election.termStartDate = new Date('2017-01-06')
                election.governmentPosition = GovernmentPosition.create()._id;
                election.campaigns = ['abcd1234efgh9876', 'abcd1234efgh9875'];

				Election.save(election).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Election.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Election.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Election.termStartDate must be greater than or equal to Election.electionDate', function(done) {
				var election = Election.create();
				var testFailed = 0;
                var error;
                
                var expectedErrorMessage = 'Election validation failed: termStartDate: Term Start Date must be greater than or equal to Election Date.';

                election.electionDate = new Date('2016-11-07');
                election.termStartDate = new Date('2010-01-06')
                election.governmentPosition = GovernmentPosition.create()._id;
                election.campaigns = [Campaign.create()._id, Campaign.create()._id];

				Election.save(election).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Election.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Election.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves Election.', function(done){
				var election = Election.create();
				var error = null;
                var compareResult;

                election.electionDate = new Date('2016-11-07');
                election.termStartDate = new Date('2017-01-06')
                election.governmentPosition = GovernmentPosition.create()._id;
                election.campaigns = [Campaign.create()._id, Campaign.create()._id];

				Election.save(election).then(
					(saved) => {
						Election.findById(election._id).then(
							(found) => {
								compareResult = Election.compare(election, found);

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
    
	describe('Campaign Model Tests', function() {

		describe('Campaign.create()', function() {
		
			it('Campaign.create() creates a Campaign instance.', function() {
				var campaign = Campaign.create();
				assert(typeof(campaign) === "object");
			});

			it('Campaign.create() creates a Campaign instance with _id field populated', function(){
				var campaign = Campaign.create();
				assert(typeof(campaign._id) === "object" && /^[a-f\d]{24}$/i.test(campaign._id));
			});
		});

		describe('Campaign.save()', function() {

			it('Campaign.save() throws an error if required fields are missing.', function(done) {
				var campaign = Campaign.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Campaign validation failed: election: Path `election` is required., candidate: Path `candidate` is required.';

				Campaign.save(campaign).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Campaign.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Campaign.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Campaign.election must be a valid ID', function(done) {
				var campaign = Campaign.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Campaign validation failed: election: Cast to ObjectID failed for value "abcd1234efgh9876" at path "election"';

                campaign.election = 'abcd1234efgh9876';
                campaign.candidate = Candidate.create()._id;
                campaign.electionResults = [ElectionResult.create()._id, ElectionResult.create()._id];

				Campaign.save(campaign).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Campaign.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Campaign.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Campaign.candidate must be a valid ID', function(done) {
				var campaign = Campaign.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Campaign validation failed: candidate: Cast to ObjectID failed for value "abcd1234efgh9876" at path "candidate"';

                campaign.election = Election.create()._id;
                campaign.candidate = 'abcd1234efgh9876';
                campaign.electionResults = [ElectionResult.create()._id, ElectionResult.create()._id];

				Campaign.save(campaign).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Campaign.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Campaign.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Campaign.electionResults must be a valid Array of IDs', function(done) {
				var campaign = Campaign.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Campaign validation failed: electionResults: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "electionResults"';

                campaign.election = Election.create()._id;
                campaign.candidate = Candidate.create()._id;
                campaign.electionResults = ['abcd1234efgh9876', 'abcd1234efgh9875'];

				Campaign.save(campaign).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Campaign.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Campaign.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves Campaign.', function(done){
				var campaign = Campaign.create();
				var error = null;
                var compareResult;

                campaign.election = Election.create()._id;
                campaign.candidate = Candidate.create()._id;
                campaign.electionResults = [ElectionResult.create()._id, ElectionResult.create()._id]

				Campaign.save(campaign).then(
					(saved) => {
						Campaign.Model.findById(campaign._id).then(
							(found) => {
								compareResult = Campaign.compare(campaign, found);

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
    
	describe('Candidate Model Tests', function() {

		describe('Candidate.create()', function() {
		
			it('Candidate.create() creates a Candidate instance.', function() {
				var candidate = Candidate.create();
				assert(typeof(candidate) === "object");
			});

			it('Candidate.create() creates a Candidate instance with _id field populated', function(){
				var candidate = Candidate.create();
				assert(typeof(candidate._id) === "object" && /^[a-f\d]{24}$/i.test(candidate._id));
			});
		});

		describe('Candidate.save()', function() {

			it('Candidate.save() throws an error if required fields are missing.', function(done) {
				var candidate = Candidate.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Candidate validation failed: campaigns: Path `campaigns` is required. Candidate validation failed: user: Path `user` is required., startDate: Path `startDate` is required.';

				Candidate.save(candidate).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Candidate.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Candidate.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Candidate.user must be a valid ID.', function(done) {
				var candidate = Candidate.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Candidate validation failed: user: Cast to ObjectID failed for value "abcd1234efgh9876" at path "user"';

                candidate.startDate = new Date();
                candidate.user = 'abcd1234efgh9876';
                candidate.campaigns = [Campaign.create()._id, Campaign.create()._id];

				Candidate.save(candidate).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Candidate.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Candidate.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('Candidate.campaigns must be a valid Array of IDs.', function(done) {
				var candidate = Candidate.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'Candidate validation failed: campaigns: Path `campaigns` is required. Candidate validation failed: campaigns: Cast to Array failed for value "[ \'abcd1234efgh9876\', \'abcd1234efgh9875\' ]" at path "campaigns"';

                candidate.startDate = new Date();
                candidate.user = User.create()._id;
                candidate.campaigns = ['abcd1234efgh9876', 'abcd1234efgh9875'];

				Candidate.save(candidate).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('Candidate.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'Candidate.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves Candidate.', function(done){
				var candidate = Candidate.create();
				var error = null;
                var compareResult;

                candidate.startDate = new Date();
                candidate.user = User.create()._id;
                candidate.campaigns = [Campaign.create()._id, Campaign.create()._id];

				Candidate.save(candidate).then(
					(saved) => {
						Candidate.findById(candidate._id).then(
							(found) => {
								compareResult = Candidate.compare(candidate, found);

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
    
	describe('ElectionResult Model Tests', function() {

		describe('ElectionResult.create()', function() {
		
			it('ElectionResult.create() creates a ElectionResult instance.', function() {
				var electionResult = ElectionResult.create();
				assert(typeof(electionResult) === "object");
			});

			it('ElectionResult.create() creates a ElectionResult instance with _id field populated', function(){
				var electionResult = ElectionResult.create();
				assert(typeof(electionResult._id) === "object" && /^[a-f\d]{24}$/i.test(electionResult._id));
			});
		});

		describe('ElectionResult.save()', function() {

			it('ElectionResult.save() throws an error if required fields are missing.', function(done) {
				var electionResult = ElectionResult.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'ElectionResult validation failed: geographicArea: Path `geographicArea` is required., campaign: Path `campaign` is required.';

				ElectionResult.save(electionResult).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('ElectionResult.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'ElectionResult.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('ElectionResult.geographicArea must be a valid ID.', function(done) {
				var electionResult = ElectionResult.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'ElectionResult validation failed: geographicArea: Cast to ObjectID failed for value "abcd1234efgh9876" at path "geographicArea"';

                electionResult.citizenVotes = 98743298579485;
                electionResult.representativeVotes = 14;
                electionResult.geographicArea = 'abcd1234efgh9876';
                electionResult.campaign = Campaign.create()._id;

				ElectionResult.save(electionResult).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('ElectionResult.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'ElectionResult.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('ElectionResult.campaign must be a valid ID.', function(done) {
				var electionResult = ElectionResult.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'ElectionResult validation failed: campaign: Cast to ObjectID failed for value "abcd1234efgh9876" at path "campaign"';

                electionResult.citizenVotes = 98743298579485;
                electionResult.representativeVotes = 14;
                electionResult.geographicArea = GeographicArea.create()._id;
                electionResult.campaign = 'abcd1234efgh9876';

				ElectionResult.save(electionResult).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('ElectionResult.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'ElectionResult.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves Election Result.', function(done){
				var electionResult = ElectionResult.create();
				var error = null;
                var compareResult;

                electionResult.citizenVotes = 98743298579485;
                electionResult.representativeVotes = 14;
                electionResult.geographicArea = GeographicArea.create()._id;
                electionResult.campaign = Campaign.create()._id;

				ElectionResult.save(electionResult).then(
					(saved) => {
						ElectionResult.findById(electionResult._id).then(
							(found) => {
								compareResult = ElectionResult.compare(electionResult, found);

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
    
	describe('PrimaryElectionResult Model Tests', function() {

		describe('PrimaryElectionResult.create()', function() {
		
			it('PrimaryElectionResult.create() creates a PrimaryElectionResult instance.', function() {
				var primaryElectionResult = PrimaryElectionResult.create();
				assert(typeof(primaryElectionResult) === "object");
			});

			it('PrimaryElectionResult.create() creates a PrimaryElectionResult instance with _id field populated', function(){
				var primaryElectionResult = PrimaryElectionResult.create();
				assert(typeof(primaryElectionResult._id) === "object" && /^[a-f\d]{24}$/i.test(primaryElectionResult._id));
			});
		});

		describe('PrimaryElectionResult.save()', function() {

			it('PrimaryElectionResult.save() throws an error if required fields are missing.', function(done) {
				var primaryElectionResult = PrimaryElectionResult.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'PrimaryElectionResult validation failed: geographicArea: Path `geographicArea` is required., campaign: Path `campaign` is required.';

				PrimaryElectionResult.save(primaryElectionResult).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('PrimaryElectionResult.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'PrimaryElectionResult.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('PrimaryElectionResult.geographicArea must be a valid ID.', function(done) {
				var primaryElectionResult = PrimaryElectionResult.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'PrimaryElectionResult validation failed: geographicArea: Cast to ObjectID failed for value "abcd1234efgh9876" at path "geographicArea"';

                primaryElectionResult.citizenVotes = 98743298579485;
                primaryElectionResult.representativeVotes = 14;
                primaryElectionResult.geographicArea = 'abcd1234efgh9876';
                primaryElectionResult.campaign = Campaign.create()._id;

				PrimaryElectionResult.save(primaryElectionResult).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('PrimaryElectionResult.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'PrimaryElectionResult.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});

			it('PrimaryElectionResult.campaign must be a valid ID.', function(done) {
				var primaryElectionResult = PrimaryElectionResult.create();
				var testFailed = 0;
				var error;
                var expectedErrorMessage = 'PrimaryElectionResult validation failed: campaign: Cast to ObjectID failed for value "abcd1234efgh9876" at path "campaign"';

                primaryElectionResult.citizenVotes = 98743298579485;
                primaryElectionResult.representativeVotes = 14;
                primaryElectionResult.geographicArea = GeographicArea.create()._id;
                primaryElectionResult.campaign = 'abcd1234efgh9876';

				PrimaryElectionResult.save(primaryElectionResult).then(
					function(result) {
						testFailed = 1;
					},
					function(rejectionErr) {
						error = rejectionErr;
					}
				)
				.finally(function() {
					if (testFailed) done(new Error('PrimaryElectionResult.save() promise resolved when it should have been rejected with Validation Error'));
					else {
						if (error != null && error.message == expectedErrorMessage) {
							done();
						}
						else{
							done(new Error(
								'PrimaryElectionResult.save() did not return the correct Validation Error.\n' +
								'   Expected: ' + expectedErrorMessage + '\n' +
								'   Actual:   ' + error.message
							));
						}
					}
				});
			});
    
			it('Valid Call Saves Primary Election Result.', function(done){
				var primaryElectionResult = PrimaryElectionResult.create();
				var error = null;
                var compareResult;

                primaryElectionResult.citizenVotes = 98743298579485;
                primaryElectionResult.representativeVotes = 14;
                primaryElectionResult.geographicArea = GeographicArea.create()._id;
                primaryElectionResult.campaign = Campaign.create()._id;

				PrimaryElectionResult.save(primaryElectionResult).then(
					(saved) => {
						PrimaryElectionResult.findById(primaryElectionResult._id).then(
							(found) => {
								compareResult = PrimaryElectionResult.compare(primaryElectionResult, found);

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
	})

});