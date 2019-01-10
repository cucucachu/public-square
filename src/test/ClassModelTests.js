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

            var relatedInstance1 = Class2.create();

            instance1.name = "Name 1";
            instance1.class2 = relatedInstance1._id;

            instance2.name = "Name 1";
            instance2.class2 = relatedInstance1._id;

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
            
            var relatedInstance1 = Class2.create();

            instance1.name = "Name 1";
            instance1.class2 = relatedInstance1;

            instance2.name = "Name 2";
            instance2.class2 = relatedInstance1;

            compareResult = Class1.compare(instance1, instance2);

            if (compareResult.match == true) {
                throw new Error('ClassModel.compare should have returned false because the names are different.')
            }
            if (compareResult.message != expectedCompareMessage) {
                throw new Error(
                    'ClassModel.compare() returned the wrong error message.\n' + 
                    'Expected: ' + expectedCompareMessage + '\n' +
                    'Actual:   ' + compareResult.message
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
                throw new Error('ClassModel.compare should have returned false because singular relationships are different.')
            }
            if (compareResult.message != expectedCompareMessage) {
                throw new Error(
                    'ClassModel.compare() returned the wrong error message.\n' + 
                    'Expected: ' + expectedCompareMessage + '\n' +
                    'Actual:   ' + compareResult.message
                );
            }
        });

        it('ClassModel.compare() returns false one of the singular relationships is empty.', function() {
            var instance1 = Class1.create();
            var instance2 = Class1.create();
            var compareResult;
            var expectedCompareMessage = 'Class1.class2\'s do not match.';

            instance1.name = "Name 1";
            instance1.class2 = Class2.create()._id;

            instance2.name = "Name 1";

            compareResult = Class1.compare(instance1, instance2);

            if (compareResult.match == true) {
                throw new Error('ClassModel.compare should have returned false because singular relationships are different.')
            }
            if (compareResult.message != expectedCompareMessage) {
                throw new Error(
                    'ClassModel.compare() returned the wrong error message.\n' + 
                    'Expected: ' + expectedCompareMessage + '\n' +
                    'Actual:   ' + compareResult.message
                );
            }
        });

        it('ClassModel.compare() returns false if one instance in a non-singular relationship is different.', function() {
            var instance1 = Class2.create();
            var instance2 = Class2.create();
            var compareResult;
            var expectedCompareMessage = 'Class2.class1s\'s do not match.';

            var relatedInstance1 = Class2.create();

            instance1.name = "Name 1";
            instance1.class1s = [relatedInstance1._id, Class1.create()._id];

            instance2.name = "Name 1";
            instance2.class1s =  [relatedInstance1._id, Class1.create()._id];

            compareResult = Class2.compare(instance1, instance2);

            if (compareResult.match == true) {
                throw new Error('ClassModel.compare should have returned false because singular relationships are different.')
            }
            if (compareResult.message != expectedCompareMessage) {
                throw new Error(
                    'ClassModel.compare() returned the wrong error message.\n' + 
                    'Expected: ' + expectedCompareMessage + '\n' +
                    'Actual:   ' + compareResult.message
                );
            }
        });

        it('ClassModel.compare() returns false if all instances in a non-singular relationship is different.', function() {
            var instance1 = Class2.create();
            var instance2 = Class2.create();
            var compareResult;
            var expectedCompareMessage = 'Class2.class1s\'s do not match.';

            instance1.name = "Name 1";
            instance1.class1s = [Class1.create()._id, Class1.create()._id];

            instance2.name = "Name 1";
            instance2.class1s =  [Class1.create()._id, Class1.create()._id];

            compareResult = Class2.compare(instance1, instance2);

            if (compareResult.match == true) {
                throw new Error('ClassModel.compare should have returned false because singular relationships are different.')
            }
            if (compareResult.message != expectedCompareMessage) {
                throw new Error(
                    'ClassModel.compare() returned the wrong error message.\n' + 
                    'Expected: ' + expectedCompareMessage + '\n' +
                    'Actual:   ' + compareResult.message
                );
            }
        });

        it('ClassModel.compare() returns false if non-singular relationship is different (one not set).', function() {
            var instance1 = Class2.create();
            var instance2 = Class2.create();
            var compareResult;
            var expectedCompareMessage = 'Class2.class1s\'s do not match.';

            instance1.name = "Name 1";
            instance1.class1s = [Class1.create()._id, Class1.create()._id];

            instance2.name = "Name 1";
            instance2.class1s =  [];

            compareResult = Class2.compare(instance1, instance2);

            if (compareResult.match == true) {
                throw new Error('ClassModel.compare should have returned false because singular relationships are different.')
            }
            if (compareResult.message != expectedCompareMessage) {
                throw new Error(
                    'ClassModel.compare() returned the wrong error message.\n' + 
                    'Expected: ' + expectedCompareMessage + '\n' +
                    'Actual:   ' + compareResult.message
                );
            }
        });

        it('ClassModel.compare() returns false if non-singular relationship have different lengths.', function() {
            var instance1 = Class2.create();
            var instance2 = Class2.create();
            var compareResult;
            var expectedCompareMessage = 'Class2.class1s\'s do not match.';

            let relatedInstance1 = Class2.create();
            let relatedInstance2 = Class2.create();

            instance1.name = "Name 1";
            instance1.class1s = [relatedInstance1, relatedInstance2];

            instance2.name = "Name 1";
            instance2.class1s = [relatedInstance1, relatedInstance2, relatedInstance1];

            compareResult = Class2.compare(instance1, instance2);

            if (compareResult.match == true) {
                throw new Error('ClassModel.compare should have returned false because singular relationships are different.')
            }
            if (compareResult.message != expectedCompareMessage) {
                throw new Error(
                    'ClassModel.compare() returned the wrong error message.\n' + 
                    'Expected: ' + expectedCompareMessage + '\n' +
                    'Actual:   ' + compareResult.message
                );
            }
        });

    });

    describe('ClassModel.validate()', function() {

        describe('Mutex Validation', function() {
            
            it('2 attribute fields have a mutex and both are set. Error thrown.', function() {
                let expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field boolean with mutex \'a\'. Field date with mutex \'a\'.';
                let expectedErrorMutex = /^Mutex violations found for instance .* Field boolean with mutex \'a\'. Field date with mutex \'a\'.$/;
                
                let schema = {
                    boolean: {
                        type: Boolean,
                        mutex: 'a'
                    },
                    date: {
                        type: Date,
                        mutex: 'a'
                    }
                };

                let MutexClassA = new ClassModel({
                    className: 'MutexClassA', 
                    schema: schema
                });

                let instance = MutexClassA.create();

                instance.boolean = true;
                instance.date = new Date();

                try {
                    ClassModel.validate(schema, instance);
                }
                catch (validationError) {
                    if (expectedErrorMutex.test(validationError.message)) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }

                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
            
            it('2 attribute fields have a mutex and one is set. No error thrown.', function() {
                let schema = {
                    boolean: {
                        type: Boolean,
                        mutex: 'a'
                    },
                    date: {
                        type: Date,
                        mutex: 'a'
                    }
                };

                let MutexClassAA = new ClassModel({
                    className: 'MutexClassAA', 
                    schema: schema
                });

                let instance = MutexClassAA.create();

                instance.boolean = true;

                try {
                    ClassModel.validate(schema, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }
                
                return true;
            });
            
            it('2 singular relationship fields have a mutex and both are set. Error thrown.', function() {
                let expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field class1 with mutex \'a\'. Field class2 with mutex \'a\'.';
                let expectedErrorMutex = /^Mutex violations found for instance .* Field class1 with mutex \'a\'. Field class2 with mutex \'a\'.$/;
            
                let schema = {
                    class1: {
                        type: Schema.Types.ObjectId,
                        ref: 'Class1',
                        mutex: 'a'
                    },
                    class2: {
                        type: Schema.Types.ObjectId,
                        ref: 'Class2',
                        mutex: 'a'
                    }
                };

                let MutexClassB = new ClassModel({
                    className: 'MutexClassB', 
                    schema: schema
                });

                let instance = MutexClassB.create();

                instance.class1 = Class1.create()._id;
                instance.class2 = Class2.create()._id;

                try {
                    ClassModel.validate(schema, instance);
                }
                catch (validationError) {
                    if (expectedErrorMutex.test(validationError.message)) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }

                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
            
            it('2 singular relationship fields have a mutex and one is set. No error thrown.', function() {
                let schema = {
                    class1: {
                        type: Schema.Types.ObjectId,
                        ref: 'Class1',
                        mutex: 'a'
                    },
                    class2: {
                        type: Schema.Types.ObjectId,
                        ref: 'Class2',
                        mutex: 'a'
                    }
                };

                let MutexClassBB = new ClassModel({
                    className: 'MutexClassBB', 
                    schema: schema
                });

                let instance = MutexClassBB.create();

                instance.class1 = Class1.create()._id;

                try {
                    ClassModel.validate(schema, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('2 non-singular relationship fields have a mutex and both are set. Error thrown.', function() {
                let expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field class1s with mutex \'a\'. Field class2s with mutex \'a\'.';
                let expectedErrorMutex = /^Mutex violations found for instance .* Field class1s with mutex \'a\'. Field class2s with mutex \'a\'.$/;
            
                let schema = {
                    class1s: {
                        type: [Schema.Types.ObjectId],
                        ref: 'Class1',
                        mutex: 'a'
                    },
                    class2s: {
                        type: [Schema.Types.ObjectId],
                        ref: 'Class2',
                        mutex: 'a'
                    }
                };

                let MutexClassC = new ClassModel({
                    className: 'MutexClassC', 
                    schema: schema
                });

                let instance = MutexClassC.create();

                instance.class1s = [Class1.create()._id, Class1.create()._id];
                instance.class2s = [Class2.create()._id, Class2.create()._id];

                try {
                    ClassModel.validate(schema, instance);
                }
                catch (validationError) {
                    if (expectedErrorMutex.test(validationError.message)) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }

                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
            
            it('2 non-singular relationship fields have a mutex and one is set. No error thrown.', function() {
                let schema = {
                    class1s: {
                        type: [Schema.Types.ObjectId],
                        ref: 'Class1',
                        mutex: 'a'
                    },
                    class2s: {
                        type: [Schema.Types.ObjectId],
                        ref: 'Class2',
                        mutex: 'a'
                    }
                };

                let MutexClassCC = new ClassModel({
                    className: 'MutexClassCC', 
                    schema: schema
                });

                let instance = MutexClassCC.create();

                instance.class1s = [Class1.create()._id, Class1.create()._id];

                try {
                    ClassModel.validate(schema, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });

        });

    });

    describe('ClassModel.save()', function() {    

        it('ClassModel.save() works properly.', function(done) {
            var instance1 = Class1.create();
            var error = null;
            var compareResult;
            var testFailed;

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

});

