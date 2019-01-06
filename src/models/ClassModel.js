/*
  Description: Defines an application class model using Mongoose to handle database interactions, and adding extra functionallity that mongoose
    does not provide.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

class ClassModel {

    constructor(parameters) {
        if (!parameters.className)
            throw new Error('className is required.');
            
        if (!parameters.schema)
            throw new Error('schema is required.');

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

    // Create
    create() {
        return new this.model({
            _id: new mongoose.Types.ObjectId
        })
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

    // Query Methods
    findById(id, callback) {
        this.model.findById(id, callback);
    }


    // Comparison Methods
    
    // This is a member comparison, not an instance comparison. i.e. two separate instances can be equal if their members are equal.
    compare(instance1, instance2) {
        var match = true;
        var message = '';

        var schema = this.schema;
        var className = this.className;

        Object.keys(schema).forEach(function(key) {
            if (key != '_id') {
                if (schema[key].type != [Schema.Types.ObjectId] || schema[key].singular == true) {
                    if (instance1[key] != instance2[key]) {
                        match = false;
                        message += className + '.' + key + '\'s do not match.';
                    }
                }
                else {
                    if (instance1[key].length != instance2[key].length) {
                        match = false;
                        message += className + '.' + key + '\'s do not match.';
                    }
                    else {
                        for (var i = 0; i < instance1[key].length; i++) {
                            if (instance1[key][i] != instance2[key][i]) {
                                match = false;
                                message += className + '.' + key + '\'s do not match.';
                            }
                        }
                    }
                }
            }
        });
    
        if (match)
            message = this.className + 's Match';
    
        return {
            match: match, 
            message: message
        };
    }

    // Clear the collection. Never run in production! Only run in a test environment.
    clear() {
        var model = this.model;

        return new Promise(function(resolve, reject) {	
		    model.deleteMany({}, function(err) {
                if (err) reject(err);
                else resolve();
            });
	    });
    }
}

module.exports = ClassModel;