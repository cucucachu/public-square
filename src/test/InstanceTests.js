
require("@babel/polyfill");
const mongoose = require('mongoose');

const ClassModel = require('../dist/models/ClassModel');
const Instance = require('../dist/models/Instance');

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
    const TestClassWithNumber = new ClassModel({
        className: 'TestClassWithNumber',
        accessControlled: false,
        updateControlled: false,
        schema: {
            number: {
                type: Number
            }
        }
    });
    const TestClassWithBoolean = new ClassModel({
        className: 'TestClassWithBoolean',
        accessControlled: false,
        updateControlled: false,
        schema: {
            boolean: {
                type: Boolean
            }
        }
    });

    const AbstractClass = new ClassModel({
        className: 'AbstractClass',
        accessControlled: false,
        updateControlled: false,
        abstract: true,
        schema: {
            number: {
                type: Number
            }
        }
    });

    const documentOfTestClassWithBoolean = new TestClassWithBoolean.Model({
        boolean: false
    });

    const documentOfTestClassWithNumber = new TestClassWithNumber.Model({
        number: 17
    });
    
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

        });

        describe('Get Trap', () => {

            it('Getting a property that is part of the schema gets the property from the document.', () => {
                const instance = new Instance(TestClassWithNumber, documentOfTestClassWithNumber);
                if (instance.number != 17)
                    throw new Error();
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

});