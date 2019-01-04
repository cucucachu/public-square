var assert = require('assert');
var expect = require('expect');
var promiseFinally = require('promise.prototype.finally');

// Add 'finally()' to 'Promis.prototype'
promiseFinally.shim();

process.on('unhandledRejection', error => {
	console.log('unhandledRejection', error.message);
});

var Poll = require('../models/Modules/Poll/Poll');
var PollResponse = require('../models/Modules/Poll/PollResponse');
var PollOption = require('../models/Modules/Poll/PollOption');
var Civilian = require('../models/Modules/Poll/Civilian');
var Citizen = require('../models/Modules/Poll/Citizen');

var Government = require('../models/Modules/Government/Government');
var GovernmentInstitution = require('../models/Modules/Government/GovernmentInstitution');
var OccupiedPosition = require('../models/Modules/Government/OccupiedPosition');
var Bill = require('../models/Modules/Government/Legislator/Bill');
var Judgement = require('../models/Modules/Government/Judge/Judgement');
var JudicialOpinion = require('../models/Modules/Government/Judge/JudicialOpinion');
var ExecutiveAction = require('../models/Modules/Government/Executive/ExecutiveAction');

describe('Poll Module Tests', function() {

    before(function(done) {
        Poll.clear().then(
            function() {
                PollResponse.clear().then(
                    function() {
                        PollOption.clear().then(
                            function() {
                                Civilian.clear().then(
                                    function() {
                                        Citizen.clear().then(done, done);
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

});