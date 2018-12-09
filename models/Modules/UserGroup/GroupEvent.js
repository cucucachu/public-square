/* 
 Mongoose Schema and Model Functions
 Model: GroupEvents
 Description: Describes a GroupEvent which is an instance of a UserGroup with a location, start date, and end date.  
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var database = require('../../database');
var Schema = mongoose.Schema;

var UserGroup = require('./UserGroup');

var GroupEventSchema = new Schema({
    createdAt : {
        type : Date, 
        required : true
    },
    startTime : {
        type : Date,
        required : true
    },
    endTime : {
        type : Date,
        required : true
    }
});

var GroupEvent = mongoose.model('GroupEvent', GroupEventSchema);

//Methods 

//Create Model 
var create = function() {
    return new GroupEvent({
        _id : new mongoose.Types.ObjectId(),
        createdAt : new Date(),
    
    });
};

// Save
var save = function(groupEvent, errorMessage, successMessage) {
    return new Promise(function(resolve, reject){
        groupEvent.save(function(error, savedGroupEvent) {
            if (err) {
                if(errorMessage != null) console.log(errorMessage);
                reject(err);
            }
            else {
                if(successMessage != null) console.log(successMessage);
                resolve(savedGroupEvent);
            }
        });
    });
};

var compare = function(groupEvent1, groupEvent2) {
    var match = true;
    var message = '';

    if(groupEvent1.createdAt != groupEvent2.createdAt) {
        match = false;
        message += 'Created dates do not match. ' + groupEvent1.createdAt +' != ' + groupEvent2.createdAt + '\n';
    }
    if(groupEvent1.startTime != groupEvent2.startTime) {
        match = false;
        message += 'Start time does not match. ' + groupEvent1.startTime +' != ' + groupEvent2.startTime + '\n';
    }
    if(groupEvent1.endTime != groupEvent2.endTime) {
        match = false;
        message += 'End time does not match. ' + groupEvent1.endTime +' != ' + groupEvent2.endTime + '\n';
    }

    if(match) {
        message = 'Group Events Match';
    }
    return{
        match: match,
        message: message
    };

}

// Clear the collection. Never run in production! Only run in a test environment.
var clear = function() {
	return new Promise(function(resolve, reject) {	
		groupEvent.deleteMany({}, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}


// Exports
exports.Model = GroupEvent;
exports.create = create;
exports.save = save;
exports.compare = compare;
exports.clear = clear;