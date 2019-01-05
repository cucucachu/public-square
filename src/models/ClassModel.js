/*
  Description: Defines an application class model using Mongoose to handle database interactions, and adding extra functionallity that mongoose
    does not provide.
*/

var mongoose = require('mongoose');

class ClassModel {
    // className;
    // schema = {};
    // model;
    // discriminatorFor;
    // superClasses = [];
    // subClasses =[];

    constructor(parameters) {
        this.className = parameters.className;
        this.schema = parameters.schema;
        this.superClasses = parameters.superClasses;
        this.discriminatorFor = parameters.discriminatorFor;

        if (this.discriminatorFor) {
            this.model = discriminatorFor.model.discriminator(this.className, this.discriminatorFor)
        }
        else {
            this.model = mongoose.model(this.className, this.schema);
        }
    }

    // Save
    save(instance) {	
        return new Promise(function(resolve, reject) {
            instance.save(function(err, saved) {
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
    compare(civilian1, civilian2) {
        var match = true;
        var message = '';
    
        if (civilian1.startDate != civilian2.startDate) {
            match = false;
            message += 'Start Dates do not match. ' + civilian1.startDate +' != ' + civilian2.startDate + '\n';
        }
    
        if (civilian1.user != civilian2.user) {
            match = false;
            message += 'Users do not match. ' + civilian1.user +' != ' + civilian2.user + '\n';
        }
    
        if (civilian1.pollResponses != null && civilian2.pollResponses != null) {
            if (civilian1.pollResponses.length != civilian2.pollResponses.length) {
                match = false;
                message += "Poll Responses do not match. \n";
            }
            else {
                for (var i = 0; i < civilian1.pollResponses.length; i++) {
                    if (civilian1.pollResponses[i] != civilian2.pollResponses[i]) {
                        match = false;
                        message += "Poll Responses do not match. \n";
    
                    }
                }
            }
        }
    
        if (match)
            message = 'Civilians Match';
    
        return {
            match: match, 
            message: message
        };
    }

    // Clear the collection. Never run in production! Only run in a test environment.
    clear() {	
        return new Promise(function(resolve, reject) {	
		    this.model.deleteMany({}, function(err) {
                if (err) reject(err);
                else resolve();
            });
	    });
    }
}

module.exports = ClassModel;