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
    
    var allFieldsRequiredClassSchema = {
        string: {
            type:String,
            required: true
        },
        strings: {
            type:[String],
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        boolean: {
            type: Boolean,
            required: true
        },
        booleans: {
            type: [Boolean],
            required: true
        },
        number: {
            type: Number,
            required: true
        },
        numbers: {
            type: [Number],
            required: true
        },
        class1: {
            type: Schema.Types.ObjectId,
            ref: 'Class1',
            required: true
        },
        class2s: {
            type: [Schema.Types.ObjectId],
            ref: 'Class2',
            required: true
        }
    };

    var AllFieldsRequiredClass = new ClassModel({
        className: 'AllFieldsRequiredClass', 
        schema: allFieldsRequiredClassSchema
    });           
    
    var allFieldsMutexClassSchema = {
        string: {
            type:String,
            mutex: 'a'
        },
        strings: {
            type:[String],
            mutex: 'a'
        },
        date: {
            type: Date,
            mutex: 'a'
        },
        boolean: {
            type: Boolean,
            mutex: 'a'
        },
        booleans: {
            type: [Boolean],
            mutex: 'a'
        },
        number: {
            type: Number,
            mutex: 'a'
        },
        numbers: {
            type: [Number],
            mutex: 'a'
        },
        class1: {
            type: Schema.Types.ObjectId,
            ref: 'Class1',
            mutex: 'a'
        },
        class2s: {
            type: [Schema.Types.ObjectId],
            ref: 'Class2',
            mutex: 'a'
        }
    };

    var AllFieldsMutexClass = new ClassModel({
        className: 'AllFieldsMutexClass', 
        schema: allFieldsMutexClassSchema
    });       
    
    var allFieldsInRequiredGroupClassSchema = {
        string: {
            type:String,
            requiredGroup: 'a'
        },
        strings: {
            type:[String],
            requiredGroup: 'a'
        },
        date: {
            type: Date,
            requiredGroup: 'a'
        },
        boolean: {
            type: Boolean,
            requiredGroup: 'a'
        },
        booleans: {
            type: [Boolean],
            requiredGroup: 'a'
        },
        number: {
            type: Number,
            requiredGroup: 'a'
        },
        numbers: {
            type: [Number],
            requiredGroup: 'a'
        },
        class1: {
            type: Schema.Types.ObjectId,
            ref: 'Class1',
            requiredGroup: 'a'
        },
        class2s: {
            type: [Schema.Types.ObjectId],
            ref: 'Class2',
            requiredGroup: 'a'
        }
    };

    var AllFieldsInRequiredGroupClass = new ClassModel({
        className: 'AllFieldsInRequiredGroupClass',
        schema: allFieldsInRequiredGroupClassSchema
    })

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

        describe('Required Validation', function() {

            it('All fields are required. All are set. No error thrown.', function() {
                let instance = AllFieldsRequiredClass.create();

                instance.string = 'String';
                instance.strings = ['String'];
                instance.date = new Date();
                instance.boolean = true;
                instance.booleans = [true];
                instance.number = 1;
                instance.numbers = [1];
                instance.class1 = Class1.create()._id;
                instance.class2s = [Class2.create()._id];

                try {
                    ClassModel.validate(AllFieldsRequiredClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;

            });
                
            it('All fields are required. All but string are set. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: string: Path `string` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.strings = ['String'];
                instance.date = new Date();
                instance.boolean = true;
                instance.booleans = [true];
                instance.number = 1;
                instance.numbers = [1];
                instance.class1 = Class1.create()._id;
                instance.class2s = [Class2.create()._id];
    
                try {
                    ClassModel.validate(AllFieldsRequiredClass, instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
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
                
            it('All fields are required. All are set, but string is set to empty string. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: string: Path `string` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.string = '';
                instance.strings = ['String'];
                instance.date = new Date();
                instance.boolean = true;
                instance.booleans = [true];
                instance.number = 1;
                instance.numbers = [1];
                instance.class1 = Class1.create()._id;
                instance.class2s = [Class2.create()._id];
    
                try {
                    ClassModel.validate(AllFieldsRequiredClass, instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
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
                
            it('All fields are required. All but strings are set. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: strings: Path `strings` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.string = 'String';
                instance.date = new Date();
                instance.boolean = true;
                instance.booleans = [true];
                instance.number = 1;
                instance.numbers = [1];
                instance.class1 = Class1.create()._id;
                instance.class2s = [Class2.create()._id];

    
                try {
                    ClassModel.validate(AllFieldsRequiredClass, instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
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
                
            it('All fields are required. All but date are set. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: date: Path `date` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.string = 'String';
                instance.strings = ['String'];
                instance.boolean = true;
                instance.booleans = [true];
                instance.number = 1;
                instance.numbers = [1];
                instance.class1 = Class1.create()._id;
                instance.class2s = [Class2.create()._id];

    
                try {
                    ClassModel.validate(AllFieldsRequiredClass, instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
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
                
            it('All fields are required. All but boolean are set. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: boolean: Path `boolean` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.string = 'String';
                instance.strings = ['String'];
                instance.date = new Date();
                instance.booleans = [true];
                instance.number = 1;
                instance.numbers = [1];
                instance.class1 = Class1.create()._id;
                instance.class2s = [Class2.create()._id];

    
                try {
                    ClassModel.validate(AllFieldsRequiredClass, instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
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
                
            it('All fields are required. All are set, but boolean is set to false. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: boolean: Path `boolean` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.string = 'String';
                instance.strings = ['String'];
                instance.date = new Date();
                instance.boolean = false;
                instance.booleans = [true];
                instance.number = 1;
                instance.numbers = [1];
                instance.class1 = Class1.create()._id;
                instance.class2s = [Class2.create()._id];

    
                try {
                    ClassModel.validate(AllFieldsRequiredClass, instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
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
                
            it('All fields are required. All but booleans are set. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: booleans: Path `booleans` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.string = 'String';
                instance.strings = ['String'];
                instance.date = new Date();
                instance.boolean = true;
                instance.number = 1;
                instance.numbers = [1];
                instance.class1 = Class1.create()._id;
                instance.class2s = [Class2.create()._id];

    
                try {
                    ClassModel.validate(AllFieldsRequiredClass, instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
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
                
            it('All fields are required. All but number are set. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: number: Path `number` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.string = 'String';
                instance.strings = ['String'];
                instance.date = new Date();
                instance.boolean = true;
                instance.booleans = [true];
                instance.numbers = [1];
                instance.class1 = Class1.create()._id;
                instance.class2s = [Class2.create()._id];

    
                try {
                    ClassModel.validate(AllFieldsRequiredClass, instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
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
                
            it('All fields are required. All but numbers are set. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: numbers: Path `numbers` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.string = 'String';
                instance.strings = ['String'];
                instance.date = new Date();
                instance.boolean = true;
                instance.booleans = [true];
                instance.number = 1;
                instance.class1 = Class1.create()._id;
                instance.class2s = [Class2.create()._id];

    
                try {
                    ClassModel.validate(AllFieldsRequiredClass, instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
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
                
            it('All fields are required. All but class1 are set. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: class1: Path `class1` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.string = 'String';
                instance.strings = ['String'];
                instance.date = new Date();
                instance.boolean = true;
                instance.booleans = [true];
                instance.number = 1;
                instance.numbers = [1];
                instance.class2s = [Class2.create()._id];

    
                try {
                    ClassModel.validate(AllFieldsRequiredClass, instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
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
                
            it('All fields are required. All but class2s are set. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: class2s: Path `class2s` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.string = 'String';
                instance.strings = ['String'];
                instance.date = new Date();
                instance.boolean = true;
                instance.booleans = [true];
                instance.number = 1;
                instance.numbers = [1];
                instance.class1 = Class1.create()._id;

    
                try {
                    ClassModel.validate(AllFieldsRequiredClass, instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
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

        });

        describe('Required Group Validation', function() {
                
            it('multiple fields (one of each type) share a required group no fields are set. Error thrown.', function() {
                let expectedErrorMessage = 'Required Group violations found for requirement group(s):  a';
            
                let instance = AllFieldsInRequiredGroupClass.create();
    
                try {
                    ClassModel.validate(AllFieldsInRequiredGroupClass, instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
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
                
            it('multiple fields (one of each type) share a required group boolean is set to false. Error thrown.', function() {
                let expectedErrorMessage = 'Required Group violations found for requirement group(s):  a';
            
                let instance = AllFieldsInRequiredGroupClass.create();

                instance.boolean = false;
    
                try {
                    ClassModel.validate(AllFieldsInRequiredGroupClass, instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
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
                
            it('multiple fields (one of each type) share a required group string is set to "". Error thrown.', function() {
                let expectedErrorMessage = 'Required Group violations found for requirement group(s):  a';
            
                let instance = AllFieldsInRequiredGroupClass.create();
    
                instance.string = '';

                try {
                    ClassModel.validate(AllFieldsInRequiredGroupClass, instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
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
                
            it('multiple fields (one of each type) share a required group class2s is set to empty array. Error thrown.', function() {
                let expectedErrorMessage = 'Required Group violations found for requirement group(s):  a';
            
                let instance = AllFieldsInRequiredGroupClass.create();

                instance.class2s = [];
    
                try {
                    ClassModel.validate(AllFieldsInRequiredGroupClass, instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
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
            
            it('multiple fields (one of each type) share a required group and string is set. No error thrown.', function() {

                let instance = AllFieldsInRequiredGroupClass.create();

                instance.string = 'String';

                try {
                    ClassModel.validate(AllFieldsInRequiredGroupClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) share a required group and strings is set. No error thrown.', function() {

                let instance = AllFieldsInRequiredGroupClass.create();

                instance.strings = ['String'];

                try {
                    ClassModel.validate(AllFieldsInRequiredGroupClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) share a required group and boolean is set. No error thrown.', function() {

                let instance = AllFieldsInRequiredGroupClass.create();

                instance.boolean = true;

                try {
                    ClassModel.validate(AllFieldsInRequiredGroupClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) share a required group and booleans is set. No error thrown.', function() {

                let instance = AllFieldsInRequiredGroupClass.create();

                instance.booleans = [true];

                try {
                    ClassModel.validate(AllFieldsInRequiredGroupClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) share a required group and date is set. No error thrown.', function() {

                let instance = AllFieldsInRequiredGroupClass.create();

                instance.date = new Date();

                try {
                    ClassModel.validate(AllFieldsInRequiredGroupClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) share a required group and number is set. No error thrown.', function() {

                let instance = AllFieldsInRequiredGroupClass.create();

                instance.number = 1;

                try {
                    ClassModel.validate(AllFieldsInRequiredGroupClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) share a required group and number is set to 0. No error thrown.', function() {

                let instance = AllFieldsInRequiredGroupClass.create();

                instance.number = 0;

                try {
                    ClassModel.validate(AllFieldsInRequiredGroupClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) share a required group and numbers is set. No error thrown.', function() {

                let instance = AllFieldsInRequiredGroupClass.create();

                instance.numbers = [1];

                try {
                    ClassModel.validate(AllFieldsInRequiredGroupClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) share a required group and class1 is set. No error thrown.', function() {

                let instance = AllFieldsInRequiredGroupClass.create();

                instance.class1 = Class1.create()._id;

                try {
                    ClassModel.validate(AllFieldsInRequiredGroupClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) share a required group and class2s is set. No error thrown.', function() {

                let instance = AllFieldsInRequiredGroupClass.create();

                instance.class2s = [Class2.create()._id];

                try {
                    ClassModel.validate(AllFieldsInRequiredGroupClass, instance);
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

        describe('Mutex Validation', function() {
            
            it('2 attribute fields (boolean, date) have a mutex and both are set. Error thrown.', function() {
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
                    ClassModel.validate(MutexClassA, instance);
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
            
            it('2 attribute fields (boolean, date) have a mutex and one (boolean) is set. No error thrown.', function() {
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
                    ClassModel.validate(MutexClassAA, instance);
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
                    ClassModel.validate(MutexClassB, instance);
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
                    ClassModel.validate(MutexClassBB, instance);
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
                    ClassModel.validate(MutexClassC, instance);
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
                    ClassModel.validate(MutexClassCC, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and string is set. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.string = 'String';

                try {
                    ClassModel.validate(AllFieldsMutexClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and date is set. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.date = new Date();

                try {
                    ClassModel.validate(AllFieldsMutexClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and boolean is set to false. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.boolean = false;

                try {
                    ClassModel.validate(AllFieldsMutexClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and boolean is set to true. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.boolean = true;

                try {
                    ClassModel.validate(AllFieldsMutexClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and number is set to 0. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.number = 0;

                try {
                    ClassModel.validate(AllFieldsMutexClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and number is set to 1. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.number = 1;

                try {
                    ClassModel.validate(AllFieldsMutexClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and numbers is set to empty array. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.numbers = [];

                try {
                    ClassModel.validate(AllFieldsMutexClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and numbers is set to an array of 0s. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.numbers = [0, 0, 0];

                try {
                    ClassModel.validate(AllFieldsMutexClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and numbers is set to an array of 1s. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.numbers = [1, 1, 1];

                try {
                    ClassModel.validate(AllFieldsMutexClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and class1 is set. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.class1 = Class1.create()._id;

                try {
                    ClassModel.validate(AllFieldsMutexClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and class2s are set to a single instance. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.class2s = Class2.create()._id;

                try {
                    ClassModel.validate(AllFieldsMutexClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and class2s are set to multiple instances. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.class2s = [Class2.create()._id, Class2.create()._id];

                try {
                    ClassModel.validate(AllFieldsMutexClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and none are set. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                try {
                    ClassModel.validate(AllFieldsMutexClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and number is set to 1 and numbers, strings, booleans, and class2s are set to empty array. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.number = 1;
                instance.numbers = [];
                instance.booleans = [];
                instance.strings = [];
                instance.class2s = [];

                try {
                    ClassModel.validate(AllFieldsMutexClass, instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and number is set to 0 and numbers are set to an array of 0s. Error thrown.', function() {
                let expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field number with mutex \'a\'. Field numbers with mutex \'a\'.';
                let expectedErrorMutex = /^Mutex violations found for instance .* Field number with mutex \'a\'. Field numbers with mutex \'a\'.$/;
            
                let instance = AllFieldsMutexClass.create();

                instance.number = 0;
                instance.numbers = [0, 0, 0];

                try {
                    ClassModel.validate(AllFieldsMutexClass, instance);
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
                
            it('multiple fields (one of each type) have a mutex and number is set to 1 and booleans is set to [false]. Error thrown.', function() {
                let expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field booleans with mutex \'a\'. Field number with mutex \'a\'.';
                let expectedErrorMutex = /^Mutex violations found for instance .* Field booleans with mutex \'a\'. Field number with mutex \'a\'.$/;
            
                let instance = AllFieldsMutexClass.create();
    
                instance.number = 1;
                instance.booleans = [false];
    
                try {
                    ClassModel.validate(AllFieldsMutexClass, instance);
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
                
            it('multiple fields (one of each type) have a mutex and number is set to 1 and strings is set to [\"\"]. Error thrown.', function() {
                let expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field strings with mutex \'a\'. Field number with mutex \'a\'.';
                let expectedErrorMutex = /^Mutex violations found for instance .* Field strings with mutex \'a\'. Field number with mutex \'a\'.$/;
            
                let instance = AllFieldsMutexClass.create();
    
                instance.number = 1;
                instance.strings = [''];
    
                try {
                    ClassModel.validate(AllFieldsMutexClass, instance);
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

