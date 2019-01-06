var assert = require('assert');
var expect = require('expect');
var promiseFinally = require('promise.prototype.finally');

var ClassModel = require('../dist/models/ClassModel');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('../dist/models/database');


promiseFinally.shim();

process.on('unhandledRejection', error => {
	console.log('unhandledRejection', error.message);
});

describe('Class Model Tests', function() {

    describe('Class Model Constructor', function() {

        it('Constructor excepts and sets parameters.', function() {
            var schema = {
                text: {
                    type: String,
                    required: true
                },
                singularRelationship: {
                    type: Schema.Types.ObjectId,
                    ref: 'OtherClass',
                    required: true
                },
                nonSingularRelationship: {
                    type: [Schema.Types.ObjectId],
                    ref: 'OtherClass'
                }
            }

            var classModel = new ClassModel({
                className: 'Class',
                schema: schema
            });

            if (classModel.className != 'Class')
                return false;
            if (classModel.schema != schema)
                return false;
            return true;
        });

        it('ClassName is required.', function() {
            var schema = {
                text: {
                    type: String,
                    required: true
                },
                singularRelationship: {
                    type: Schema.Types.ObjectId,
                    ref: 'OtherClass',
                    required: true
                },
                nonSingularRelationship: {
                    type: [Schema.Types.ObjectId],
                    ref: 'OtherClass'
                }
            }

            try {
                var classModel = new ClassModel({
                    schema: schema
                });
            }
            catch(error) {
                if (error.message == 'className is required.')
                    return true;
                else 
                    throw new Error(error.message);
            }

            throw new Error('Constructor should have thrown an error: className is required.');
        });

        it('Schema is required.', function() {
            try {
                var classModel = new ClassModel({
                    className: 'Class'
                });
            }
            catch(error) {
                if (error.message == 'schema is required.')
                    return true;
                else 
                    throw new Error(error.message);
            }

            throw new Error('Constructor should have thrown an error: schema is required.');
        });
        
    });
    
    //Define 2 Classes to be used in the rest of the tests.
    var Class1Schema = {
        name: {
            type: String,
            required: true
        },
        class2: {
            type: Schema.Types.ObjectId,
            ref: 'Class2',
            required: true,
            singular: true
        }
    }

    var Class2Schema = {
        name: {
            type: String,
            required: true
        },
        class1s: {
            type: [Schema.Types.ObjectId],
            ref: 'Class1'
        }
    }

    var Class1 = new ClassModel({
        className: 'Class1',
        schema: Class1Schema
    });

    var Class2 = new ClassModel({
        className: 'Class2',
        schema: Class2Schema
    });

    describe('ClassModel.compare()', function() {

        it('ClassModel.compare() returns true if instances are the same instance.', function() {
            var instance1 = Class1.create();
            var compareResult;

            instance1.name = " Name 1";
            instance1.class2 = Class2.create()._id;

            compareResult = Class1.compare(instance1, instance1);

            if (compareResult.match == false) {
                throw new Error('ClassModel.compare should have returned true.')
            }
        });

        it('ClassModel.compare() returns true if all fields are the same.', function() {
            var instance1 = Class1.create();
            var instance2 = Class1.create();
            var compareResult;

            var relatedinstance1 = Class2.create();

            instance1.name = "Name 1";
            instance1.class2 = relatedinstance1._id;

            instance2.name = "Name 1";
            instance2.class2 = relatedinstance1._id;

            compareResult = Class1.compare(instance1, instance2);

            if (compareResult.match == false) {
                throw new Error('ClassModel.compare should have returned true.')
            }
        });

        it('ClassModel.compare() returns false if an attribute is different.', function() {
            var instance1 = Class1.create();
            var instance2 = Class1.create();
            var compareResult;
            var expectedCompareMessage = 'Class1.name\'s do not match.';
            
            var relatedinstance1 = Class2.create();

            instance1.name = "Name 1";
            instance1.class2 = relatedinstance1;

            instance2.name = "Name 2";
            instance2.class2 = relatedinstance1;

            compareResult = Class1.compare(instance1, instance2);

            if (compareResult.match == true) {
                throw new Error('ClassModel.compare should have returned false because the names are different.')
            }
            if (compareResult.message != expectedCompareMessage) {
                throw new Error(
                    'ClassModel.compare() returned the wrong error message.\n' + 
                    'Expected: ' + expectedCompareMessage + '\n' +
                    'Actual: ' + compareResult.message
                );
            }
        });

        it('ClassModel.compare() returns false if singular relationship is different.', function() {
            var instance1 = Class1.create();
            var instance2 = Class1.create();
            var compareResult;
            var expectedCompareMessage = 'Class1.class2\'s do not match.';

            instance1.name = "Name 1";
            instance1.class2 = Class2.create()._id;

            instance2.name = "Name 1";
            instance2.class2 = Class2.create()._id;

            compareResult = Class1.compare(instance1, instance2);

            if (compareResult.match == true) {
                throw new Error('ClassModel.compare should have returned false because the names are different.')
            }
            if (compareResult.message != expectedCompareMessage) {
                throw new Error(
                    'ClassModel.compare() returned the wrong error message.\n' + 
                    'Expected: ' + expectedCompareMessage + '\n' +
                    'Actual: ' + compareResult.message
                );
            }
        });

        it('ClassModel.compare() returns false if one instance in a non-singular relationship is different.', function() {
            var instance1 = Class2.create();
            var instance2 = Class2.create();
            var compareResult;
            var expectedCompareMessage = 'Class2.class1s\'s do not match.';

            var relatedinstance1 = Class2.create();

            instance1.name = "Name 1";
            instance1.class1s = [relatedinstance1._id, Class1.create()._id];

            instance2.name = "Name 1";
            instance2.class1s =  [relatedinstance1._id, Class1.create()._id];

            compareResult = Class2.compare(instance1, instance2);

            if (compareResult.match == true) {
                throw new Error('ClassModel.compare should have returned false because the names are different.')
            }
            if (compareResult.message != expectedCompareMessage) {
                throw new Error(
                    'ClassModel.compare() returned the wrong error message.\n' + 
                    'Expected: ' + expectedCompareMessage + '\n' +
                    'Actual: ' + compareResult.message
                );
            }
        });

    });

    describe('ClassModel.save()', function() {

        it('ClassModel.save() works properly.', function(done) {
            var instance1 = Class1.create();
            var error = null;
            var testFailed;
            var compareResult;

            instance1.name = "Name 1";
            instance1.class2 = Class2.create()._id;

            Class1.save(instance1).then(    
                function(saved) {
                    Class1.findById(instance1._id, function(findError, found) {
                        compareResult = Class1.compare(instance1, found);
            
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

    after(function(done) {
        Class1.clear().then(done, done);
    });

});

