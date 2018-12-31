/* 
 Mongoose Schema and Model Functions
 Model: Government Institution
 Description: Defines individual institutions or departments that make up a Government. For example, a single city government might have Government
    Instituations for the Police Department, the School Board, the City Council, etc. A Government Institution may also have multiple Government
    Positions. For a Government Institution for a City Council, there may be positions for Board Chair, Board Member, Treasurer, etc.
    Government Institutions exist in a tree struction, with only the root institution having a relationship to a Government. For example,
    the California State Legislature might have a relationship to the California State Government, and have 2 child Government Institutions,
    the State Assembly and the State Senate.
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var Government = require('./Government');
var GovernmentPosition = require('./GovernmentPosition');

// Schema and Model Setup
var GovernmentInstitutionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    government: {
        type: Schema.Types.ObjectId,
        ref: 'Government',
        required: [
            function() {
                return this.parentGovernmentInstitution == null;
            },
            'government is required if parentGovernmentInstitution is empty.'
        ],
        validate: {
            validator: function(value) {
                if (value != null && this.parentGovernmentInstitution != null)
                    return false;
                return true;
            },
            message: 'government and parentGovernmentInstitution are mutually exclusive.'
        }
    },
    governmentPositions: {
        type: [Schema.Types.ObjectId],
        ref: 'GovernmentPosition'
    },
    parentGovernmentInstitution: {
        type: Schema.Types.ObjectId,
        ref: 'GovernmentInstitution',
        required: [
            function() {
                return this.government == null;
            },
            'parentGovernmentInstitution is required if government is empty.'
        ]
    },
    childGovernmentInstitutions: {
        type: [Schema.Types.ObjectID],
        ref: 'GovernmentInstitution'
    }
});

var GovernmentInstitution = mongoose.model('GovernmentInstitution', GovernmentInstitutionSchema);

//Methods 

// Create Method
var create = function() {
	return new GovernmentInstitution({
        _id: new mongoose.Types.ObjectId()
	});
}

// Save
var save = function(governmentInstitution, errorMessage, successMessasge) {
	return new Promise(function(resolve, reject) {
        governmentInstitution.save(function(err, saved) {
            if (err) {
                // if (errorMessage != null)
                // 	console.log(errorMessage);
                reject(err);
            }
            else {
                // if (successMessasge != null)
                // 	console.log(successMessasge);

                resolve(saved);
            }
        });
    
	});
}


// Comparison Methods

// This is a member comparison, not an instance comparison. i.e. two separate instances can be equal if their members are equal.
var compare = function(governmentInstitution1, governmentInstitution2) {
    var match = true;
    var message = '';

    if (governmentInstitution1.name != governmentInstitution2.name) {
        match = false;
        message += 'Names do not match. ' + governmentInstitution1.name +' != ' + governmentInstitution2.name + '\n';
    }

    if (governmentInstitution1.description != governmentInstitution2.description) {
        match = false;
        message += 'Descriptions do not match. ' + governmentInstitution1.description +' != ' + governmentInstitution2.description + '\n';
    }

    if (governmentInstitution1.government != governmentInstitution2.government) {
        match = false;
        message += 'Governments do not match. ' + governmentInstitution1.government +' != ' + governmentInstitution2.government + '\n';
    }

    if (governmentInstitution1.parentGovernmentInstitution != governmentInstitution2.parentGovernmentInstitution) {
        match = false;
        message += 'Parent Government Institutions do not match. ' + governmentInstitution1.parentGovernmentInstitution +' != ' + governmentInstitution2.parentGovernmentInstitution + '\n';
    }

	if (governmentInstitution1.childGovernmentInstitutions != null && governmentInstitution2.childGovernmentInstitutions != null) {
		if (governmentInstitution1.childGovernmentInstitutions.length != governmentInstitution2.childGovernmentInstitutions.length) {
			match = false;
			message += "Child Government Institutions do not match. \n";
		}
		else {
			for (var i = 0; i < governmentInstitution1.childGovernmentInstitutions.length; i++) {
				if (governmentInstitution1.childGovernmentInstitutions[i] != governmentInstitution2.childGovernmentInstitutions[i]) {
					match = false;
					message += "Government Institutions do not match. \n";

				}
			}
		}
	}

	if (governmentInstitution1.governmentPositions != null && governmentInstitution2.governmentPositions != null) {
		if (governmentInstitution1.governmentPositions.length != governmentInstitution2.governmentPositions.length) {
			match = false;
			message += "Government Positions do not match. \n";
		}
		else {
			for (var i = 0; i < governmentInstitution1.governmentPositions.length; i++) {
				if (governmentInstitution1.governmentPositions[i] != governmentInstitution2.governmentPositions[i]) {
					match = false;
					message += "Government Positions do not match. \n";

				}
			}
		}
	}
	
	if (match)
		message = 'Government Institutions Match';

	return {
		match: match, 
		message: message
	};
}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		GovernmentInstitution.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// Exports

exports.Model = GovernmentInstitution;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;

