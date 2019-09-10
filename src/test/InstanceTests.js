
require("@babel/polyfill");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassModel = require('../dist/models/ClassModel');
const Instance = require('../dist/models/Instance');
const TestClassModels = require('./TestClassModels');

// Load all TestClassModels 
{
    var CompareClass1 = TestClassModels.CompareClass1;
    var CompareClass2 = TestClassModels.CompareClass2;
    var TestClassWithNumber = TestClassModels.TestClassWithNumber;
    var TestClassWithBoolean = TestClassModels.TestClassWithBoolean;
    var TestClassWithAllSimpleFields = TestClassModels.TestClassWithAllSimpleFields;
    var AllFieldsRequiredClass = TestClassModels.AllFieldsRequiredClass;
    var AllFieldsInRequiredGroupClass = TestClassModels.AllFieldsInRequiredGroupClass;
    var AbstractClass = TestClassModels.AbstractClass;
}

function testForError(functionName, expectedErrorMessage, functionToCall) {
    let errorThrown = false;

    try {
        functionToCall();
    }
    catch (error) {
        if (error.message != expectedErrorMessage) {
            throw new Error(
                functionName + ' threw an error, but not the expected one.\n' + 
                'expected: ' + expectedErrorMessage + '\n' + 
                'actual:   ' + error.message
            )
        }
        errorThrown = true;
    }

    if (!errorThrown)
        throw new Error(functionName + ' did not throw an error when it should have.');
}


describe('Instance Tests', () => {



    // Simple Documents
    {
        var documentOfTestClassWithBoolean = new TestClassWithBoolean.Model({
            boolean: false
        });

        var documentOfTestClassWithNumber = new TestClassWithNumber.Model({
            number: 17
        });
    }

    before(() => {

    });

    describe('Instance.constructor Tests', () => {

        describe('Instance Constructor Requirements Tests', () => {

            it('Instance.constructor(), parameter classModel is required', () => {
                const expectedErrorMessage = 'Instance.constructor(), parameter classModel is required.';

                testForError('Instance.constructor()', expectedErrorMessage, () => {
                    new Instance();
                });
            });

            it('Instance.constructor(), first parameter classModel must be an instance of ClassModel.', () => {
                const expectedErrorMessage = 'Instance.constructor(), first parameter classModel must be an instance of ClassModel.';

                testForError('Instance.constructor()', expectedErrorMessage, () => {
                    new Instance(1);
                });
            });

            it('Instance.constructor(), classModel cannot be abstract.', () => {
                const expectedErrorMessage = 'Instance.constructor(), classModel cannot be abstract.';

                testForError('Instance.constructor()', expectedErrorMessage, () => {
                    new Instance(AbstractClass);
                });
            });

            it('Instance.constructor(), if called without a document, parameter saved must be false.', () => {
                const expectedErrorMessage = 'Instance.constructor(), if called without a document, parameter saved must be false.';

                testForError('Instance.constructor()', expectedErrorMessage, () => {
                    new Instance(TestClassWithNumber, null, true);
                });
            });

            it('Instance.constructor(), given document is not an instance of the given classModel.', () => {
                const expectedErrorMessage = 'Instance.constructor(), given document is not an instance of the given classModel.';

                testForError('Instance.constructor()', expectedErrorMessage, () => {
                    new Instance(TestClassWithNumber, documentOfTestClassWithBoolean);
                });
            });

        });

        describe('Instance Constructor Sets Given Properties.', () => {

            it('ClassModel property is set.', () => {
                const instance = new Instance(TestClassWithNumber);
                if (instance.classModel != TestClassWithNumber)
                    throw new Error('ClassModel property not set by constructor.');
            });

            it('Document property is set.', () => {
                const instance = new Instance(TestClassWithBoolean, documentOfTestClassWithBoolean);
                if (!instance.documentEquals(documentOfTestClassWithBoolean))
                    throw new Error('Saved property not defaulted by constructor.');
            });

            it('Saved defaults to false.', () => {
                const instance = new Instance(TestClassWithBoolean, documentOfTestClassWithBoolean);
                if (instance.saved != false)
                    throw new Error('Saved property not defaulted by constructor.');
            });

            it('Deleted defaults to false', () => {
                const instance = new Instance(TestClassWithBoolean, documentOfTestClassWithBoolean);
                if (instance.deleted != false)
                    throw new Error('Deleted property not defaulted by constructor.');
            });

            it('Saved property is set.', () => {
                const instance = new Instance(TestClassWithBoolean, documentOfTestClassWithBoolean, true, false);
                if (instance.saved != true)
                    throw new Error('Saved property not set by constructor.');
            });
            
        }); 

    });

    describe('Instance Traps Tests', () => {

        describe('Set Trap', () => {

            it('Setting a property that is part of the schema sets the property on the document.', () => {
                const testDocument = new TestClassWithBoolean.Model({
                    boolean: false
                });
                const instance = new Instance(TestClassWithBoolean, testDocument);
                if (instance.getDocumentProperty('boolean') != false)
                    throw new Error();

                instance.boolean = true;

                if (instance.getDocumentProperty('boolean') != true)
                    throw new Error();
                
                if (instance.boolean != instance.getDocumentProperty('boolean'))
                    throw new Error();
            });

            it('Attempting to change the class model of an instance throws an error.', () => {
                const instance = new Instance(TestClassWithBoolean, documentOfTestClassWithBoolean);
                testForError('instance.classModel = ...', 'Illegal attempt to change the classModel of an Instance.', () => {
                    instance.classModel = TestClassWithNumber;
                });
            });

            it('Attempting to change the id of an instance throws an error.', () => {
                const instance = new Instance(TestClassWithBoolean);
                testForError('instance.id = ...', 'Illegal attempt to change the id of an Instance.', () => {
                    instance.id = TestClassWithNumber;
                });
            });

            it('Attempting to change the _id of an instance throws an error.', () => {
                const instance = new Instance(TestClassWithBoolean);
                testForError('instance._id = ...', 'Illegal attempt to change the _id of an Instance.', () => {
                    instance._id = TestClassWithNumber;
                });
            });

        });

        describe('Get Trap', () => {

            it('Getting a property that is part of the schema gets the property from the document.', () => {
                const instance = new Instance(TestClassWithNumber, documentOfTestClassWithNumber);
                if (instance.number != 17)
                    throw new Error();
            });

            it('Getting the id of an instance gets the id from the document.', () => {
                const instance = new Instance(TestClassWithNumber);
                if (!instance.id)
                    throw new Error('Could not get the id of the instance.');
            });

            it('Getting the _id of an instance gets the _id from the document.', () => {
                const instance = new Instance(TestClassWithNumber);
                if (!instance._id)
                    throw new Error('Could not get the _id of the instance.');
            });

        });

        describe('Has Trap', () => {

            it('Checking for a property that is part of the schema checks for the property on the document.', () => {
                const instance = new Instance(TestClassWithNumber, documentOfTestClassWithNumber);
                if (!('number' in instance))
                    throw new Error();
            });

        });

        describe('Delete Trap', () => {

            it('Deleting a property that is part of the schema deletes the property from the document.', () => {
                const testDocument = new TestClassWithNumber.Model({
                    number: 17
                });
                const instance = new Instance(TestClassWithNumber, testDocument);
                
                if (instance.number != 17)
                    throw new Error('Instance.number should initially be 17.');

                delete instance.number;

                if (instance.number != undefined)
                    throw new Error('Instance.number was not deleted. It\'s value is ' + instance.number);
                
                if (instance.getDocumentProperty('number') != undefined)
                    throw new Error('Instance.number was deleted, but number was not deleted from the underlying document.');
            });

            it('Deleting the class model of an instance throws an error.', () => {
                const instance = new Instance(TestClassWithNumber);
                
                testForError('delete instance.classModel', 'Illegal attempt to delete the classModel property of an Instance.', () => {
                    delete instance.classModel;
                })
            });

            it('Deleting the save method of an instance throws an error.', () => {
                const instance = new Instance(TestClassWithNumber);
                
                testForError('delete instance.classModel', 'Illegal attempt to delete the save property of an Instance.', () => {
                    delete instance.save;
                })
            });

            it('Deleting the saved property of an instance throws an error.', () => {
                const instance = new Instance(TestClassWithNumber);
                
                testForError('delete instance.classModel', 'Illegal attempt to delete the saved property of an Instance.', () => {
                    delete instance.saved;
                })
            });

        });

        describe('OwnKeys trap', () => {

            it('Object.getOwnPropertySymbols() returns nothing.', () => {
                const instance = new Instance(TestClassWithNumber);
                const symbols = Object.getOwnPropertySymbols(instance);

                if (symbols.length) {
                    throw new Error('Found these symbols: ' + symbols.map(symbol => String(symbol)));
                }
            });

        });

    });

    describe('instance.assign()', () => {

        it('instance.assign assigns all fields.', () => {
            const instance = new Instance(TestClassWithAllSimpleFields);
            const objectToAssign = {
                string: 'String',
                strings: ['String', 'String'],
                date: new Date(),
                boolean: true,
                booleans: [true, false],
                number: 17,
                numbers: [1, 2, 3]
            }
            instance.assign(objectToAssign);
            for (const key in objectToAssign) {
                if (Array.isArray(objectToAssign[key])) {
                    for (const index in objectToAssign[key]) {
                        if (objectToAssign[key][index] != instance[key][index]) {
                            throw new Error('Values for key ' + key + ' were not assigned');
                        }
                    }
                }
                else if (objectToAssign[key] != instance[key]) {
                    throw new Error('Values for key ' + key + ' were not assigned');
                }
            }
        });

    });

    describe('instance.validate()', () => {

        describe('Required Validation', () => {

            it('All fields are required. All are set. No error thrown.', () => {
                const instance = new Instance(AllFieldsRequiredClass);
                instance.assign({
                    string: 'String',
                    strings: ['String'],
                    date: new Date(),
                    boolean: true,
                    booleans: [true],
                    number: 1,
                    numbers: [1],
                    class1: CompareClass1.create(),
                    class2s: CompareClass2.create()
                });
                    
                instance.validate();

                return true;

            });

            it('All fields are required. All but string are set. Error thrown.', () => {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: string: Path `string` is required.';
                const instance = new Instance(AllFieldsRequiredClass);
                instance.assign({
                    strings: ['String'],
                    date: new Date(),
                    boolean: true,
                    booleans: [true],
                    number: 1,
                    numbers: [1],
                    class1: CompareClass1.create(),
                    class2s: CompareClass2.create()
                });

                try {
                    instance.validate();
                }
                catch (error) {
                    if (error.message != expectedErrorMessage) {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + error.message
                        );
                    }
                }

                return true;

            });

        });

        describe('Required Group Validation', () => {
                
            it('Multiple fields (one of each type) share a required group no fields are set. Error thrown.', () => {
                const expectedErrorMessage = 'Required Group violations found for requirement group(s):  a';
                const instance = new Instance(AllFieldsInRequiredGroupClass);
    
                try {
                    instance.validate();
                }
                catch (error) {
                    if (error.message == expectedErrorMessage) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + error.message
                        );
                    }
                }
    
                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
                
            it('Multiple fields (one of each type) share a required group boolean is set to false. Error thrown.', () => {
                let expectedErrorMessage = 'Required Group violations found for requirement group(s):  a';
                const instance = new Instance(AllFieldsInRequiredGroupClass);

                instance.boolean = false;
    
                try {
                    instance.validate();
                }
                catch (error) {
                    if (error.message == expectedErrorMessage) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + error.message
                        );
                    }
                }
    
                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
                
            it('Multiple fields (one of each type) share a required group string is set to "". Error thrown.', () => {
                let expectedErrorMessage = 'Required Group violations found for requirement group(s):  a';
                const instance = new Instance(AllFieldsInRequiredGroupClass);
    
                instance.string = '';

                try {
                    instance.validate();
                }
                catch (error) {
                    if (error.message == expectedErrorMessage) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + error.message
                        );
                    }
                }
    
                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
            
            it('Multiple fields (one of each type) share a required group and strings is set. No error thrown.', () => {
                const instance = new Instance(AllFieldsInRequiredGroupClass);
                instance.strings = ['String'];

                try {
                    instance.validate();
                }
                catch (error) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + error.message
                    );
                }

                return true;
            });
            
            it('Multiple fields (one of each type) share a required group and boolean is set. No error thrown.', () => {
                const instance = new Instance(AllFieldsInRequiredGroupClass);
                instance.boolean = true;

                try {
                    instance.validate();
                }
                catch (error) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + error.message
                    );
                }

                return true;
            });
            
        });

        describe('Mutex Validation', () => {
            
            it('2 attribute fields (boolean, date) have a mutex and both are set. Error thrown.', () => {
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
                    accessControlled: false,
                    updateControlled: false,
                    className: 'MutexClassA', 
                    schema: schema
                });

                let instance = new Instance(MutexClassA);
                instance.assign({
                    boolean: true,
                    date: new Date(),
                });

                try {
                    instance.validate();
                }
                catch (error) {
                    if (expectedErrorMutex.test(error.message)) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + error.message
                        );
                    }
                }

                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
            
            it('2 attribute fields (boolean, date) have a mutex and one (boolean) is set. No error thrown.', () => {
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
                    accessControlled: false,
                    updateControlled: false,
                    className: 'MutexClassAA', 
                    schema: schema
                });

                let instance = new Instance(MutexClassAA);

                instance.boolean = true;

                try {
                    instance.validate();
                }
                catch (error) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + error.message
                    );
                }
                
                return true;
            });
            
            it('2 singular relationship fields have a mutex and both are set. Error thrown.', () => {
                let expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field class1 with mutex \'a\'. Field class2 with mutex \'a\'.';
                let expectedErrorMutex = /^Mutex violations found for instance .* Field class1 with mutex \'a\'. Field class2 with mutex \'a\'.$/;
            
                let schema = {
                    class1: {
                        type: Schema.Types.ObjectId,
                        ref: 'CompareClass1',
                        mutex: 'a'
                    },
                    class2: {
                        type: Schema.Types.ObjectId,
                        ref: 'CompareClass2',
                        mutex: 'a'
                    }
                };

                let MutexClassB = new ClassModel({
                    accessControlled: false,
                    updateControlled: false,
                    className: 'MutexClassB', 
                    schema: schema
                });

                let instance = new Instance(MutexClassB);

                instance.class1 = CompareClass1.create()._id;
                instance.class2 = CompareClass2.create()._id;

                try {
                    MutexClassB.validate(instance);
                }
                catch (error) {
                    if (expectedErrorMutex.test(error.message)) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + error.message
                        );
                    }
                }

                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
            
            it('2 singular relationship fields have a mutex and one is set. No error thrown.', () => {
                let schema = {
                    class1: {
                        type: Schema.Types.ObjectId,
                        ref: 'CompareClass1',
                        mutex: 'a'
                    },
                    class2: {
                        type: Schema.Types.ObjectId,
                        ref: 'CompareClass2',
                        mutex: 'a'
                    }
                };

                let MutexClassBB = new ClassModel({
                    accessControlled: false,
                    updateControlled: false,
                    className: 'MutexClassBB', 
                    schema: schema
                });

                let instance = new Instance(MutexClassBB);

                instance.class1 = CompareClass1.create()._id;

                try {
                    instance.validate();
                }
                catch (error) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + error.message
                    );
                }

                return true;
            });
            
            it('2 non-singular relationship fields have a mutex and both are set. Error thrown.', () => {
                let expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field class1s with mutex \'a\'. Field class2s with mutex \'a\'.';
                let expectedErrorMutex = /^Mutex violations found for instance .* Field class1s with mutex \'a\'. Field class2s with mutex \'a\'.$/;
            
                let schema = {
                    class1s: {
                        type: [Schema.Types.ObjectId],
                        ref: 'CompareClass1',
                        mutex: 'a'
                    },
                    class2s: {
                        type: [Schema.Types.ObjectId],
                        ref: 'CompareClass2',
                        mutex: 'a'
                    }
                };

                let MutexClassC = new ClassModel({
                    accessControlled: false,
                    updateControlled: false,
                    className: 'MutexClassC', 
                    schema: schema
                });

                let instance = new Instance(MutexClassC);

                instance.class1s = [CompareClass1.create()._id, CompareClass1.create()._id];
                instance.class2s = [CompareClass2.create()._id, CompareClass2.create()._id];

                try {
                    instance.validate();
                }
                catch (error) {
                    if (expectedErrorMutex.test(error.message)) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + error.message
                        );
                    }
                }

                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });

        });

    });

});