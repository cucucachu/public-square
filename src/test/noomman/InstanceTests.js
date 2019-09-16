
require("@babel/polyfill");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const database = require('../../dist/noomman/database');
const Instance = require('../../dist/noomman/Instance');
const InstanceSet = require('../../dist/noomman/InstanceSet');
const TestClassModels = require('./helpers/TestClassModels');
const TestingFunctions = require('./helpers/TestingFunctions');
const testForError = TestingFunctions.testForError;
const testForErrorMutex = TestingFunctions.testForErrorMutex;
const testForErrorAsync = TestingFunctions.testForErrorAsync;

// Load all TestClassModels 
{
    // Compare Classes
    var CompareClass1 = TestClassModels.CompareClass1;
    var CompareClass2 = TestClassModels.CompareClass2;

    // Simple Classes
    var TestClassWithNumber = TestClassModels.TestClassWithNumber;
    var TestClassWithBoolean = TestClassModels.TestClassWithBoolean;
    var TestClassWithAllSimpleFields = TestClassModels.TestClassWithAllSimpleFields;

    // Validation Classes
    var AllFieldsRequiredClass = TestClassModels.AllFieldsRequiredClass;
    var AllFieldsInRequiredGroupClass = TestClassModels.AllFieldsInRequiredGroupClass;
    var AllFieldsMutexClass = TestClassModels.AllFieldsMutexClass;
    var AbstractClass = TestClassModels.AbstractClass;
    var MutexClassA = TestClassModels.MutexClassA;
    var MutexClassB = TestClassModels.MutexClassB;
    var MutexClassC = TestClassModels.MutexClassC;

    // Inheritance Classes
    var SuperClass = TestClassModels.SuperClass;
    var AbstractSuperClass = TestClassModels.AbstractSuperClass;
    var DiscriminatedSuperClass = TestClassModels.DiscriminatedSuperClass;
    var AbstractDiscriminatedSuperClass = TestClassModels.AbstractDiscriminatedSuperClass;
    var SubClassOfSuperClass = TestClassModels.SubClassOfSuperClass;
    var SubClassOfAbstractSuperClass = TestClassModels.SubClassOfAbstractSuperClass;
    var AbstractSubClassOfSuperClass = TestClassModels.AbstractSubClassOfSuperClass;
    var SubClassOfMultipleSuperClasses = TestClassModels.SubClassOfMultipleSuperClasses;
    var SubClassOfDiscriminatorSuperClass = TestClassModels.SubClassOfDiscriminatorSuperClass;
    var DiscriminatedSubClassOfSuperClass = TestClassModels.DiscriminatedSubClassOfSuperClass;
    var SubClassOfDiscriminatedSubClassOfSuperClass = TestClassModels.SubClassOfDiscriminatedSubClassOfSuperClass;
    var SubClassOfSubClassOfSuperClass = TestClassModels.SubClassOfSubClassOfSuperClass;
    var SubClassOfAbstractSubClassOfSuperClass = TestClassModels.SubClassOfAbstractSubClassOfSuperClass;

    // Relationship Classes
    var SingularRelationshipClass = TestClassModels.SingularRelationshipClass;
    var NonSingularRelationshipClass = TestClassModels.NonSingularRelationshipClass;
    var SubClassOfSingularRelationshipClass = TestClassModels.SubClassOfSingularRelationshipClass;
    var SubClassOfNonSingularRelationshipClass = TestClassModels.SubClassOfNonSingularRelationshipClass;

    // Update Controlled Classes
    var UpdateControlledSuperClass = TestClassModels.UpdateControlledSuperClass;
    var ClassControlsUpdateControlledSuperClass = TestClassModels.ClassControlsUpdateControlledSuperClass;
    var UpdateControlledClassUpdateControlledByParameters = TestClassModels.UpdateControlledClassUpdateControlledByParameters;
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

    before(async () => {
        await database.connect();
    });

    after(() => {
        database.close();
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
                    class1: new Instance(CompareClass1).id,
                    class2s: [new Instance(CompareClass2).id]
                });
                    
                instance.validate();
            });

            it('All fields are required. All but string are set. Error thrown.', () => {
                const expectedErrorMessage = 'AllFieldsRequiredClass validation failed: string: Path `string` is required.';
                const instance = new Instance(AllFieldsRequiredClass);
                instance.assign({
                    strings: ['String'],
                    date: new Date(),
                    boolean: true,
                    booleans: [true],
                    number: 1,
                    numbers: [1],
                    class1: new Instance(CompareClass1).id,
                    class2s: [new Instance(CompareClass2).id]
                });

                testForError('instance.validate()', expectedErrorMessage, () => {
                    instance.validate();
                });

            });

            it('All fields are required. String is set to empty string. Error thrown.', () => {
                const expectedErrorMessage = 'AllFieldsRequiredClass validation failed: string: Path `string` is required.';
                const instance = new Instance(AllFieldsRequiredClass);
                instance.assign({
                    string: '',
                    strings: ['String'],
                    date: new Date(),
                    boolean: true,
                    booleans: [true],
                    number: 1,
                    numbers: [1],
                    class1: new Instance(CompareClass1).id,
                    class2s: [new Instance(CompareClass2).id]
                });

                testForError('instance.validate()', expectedErrorMessage, () => {
                    instance.validate();
                });

            });

            it('All fields are required. All but Stings are set. Error thrown.', () => {
                const expectedErrorMessage = 'AllFieldsRequiredClass validation failed: strings: Path `strings` is required.';
                const instance = new Instance(AllFieldsRequiredClass);
                instance.assign({
                    string: 'String',
                    date: new Date(),
                    boolean: true,
                    booleans: [true],
                    number: 1,
                    numbers: [1],
                    class1: new Instance(CompareClass1).id,
                    class2s: [new Instance(CompareClass2).id]
                });

                testForError('instance.validate()', expectedErrorMessage, () => {
                    instance.validate();
                });

            });

            it('All fields are required. Strings is set to empty array. Error thrown.', () => {
                const expectedErrorMessage = 'AllFieldsRequiredClass validation failed: strings: Path `strings` is required.';
                const instance = new Instance(AllFieldsRequiredClass);
                instance.assign({
                    string: 'String',
                    strings: [],
                    date: new Date(),
                    boolean: true,
                    booleans: [true],
                    number: 1,
                    numbers: [1],
                    class1: new Instance(CompareClass1).id,
                    class2s: [new Instance(CompareClass2).id]
                });

                testForError('instance.validate()', expectedErrorMessage, () => {
                    instance.validate();
                });

            });

            it('All fields are required. All but date are set. Error thrown.', () => {
                const expectedErrorMessage = 'AllFieldsRequiredClass validation failed: date: Path `date` is required.';
                const instance = new Instance(AllFieldsRequiredClass);
                instance.assign({
                    string: 'String',
                    strings: ['String'],
                    boolean: true,
                    booleans: [true],
                    number: 1,
                    numbers: [1],
                    class1: new Instance(CompareClass1).id,
                    class2s: [new Instance(CompareClass2).id]
                });

                testForError('instance.validate()', expectedErrorMessage, () => {
                    instance.validate();
                });

            });

            it('All fields are required. All but boolean are set. Error thrown.', () => {
                const expectedErrorMessage = 'AllFieldsRequiredClass validation failed: boolean: Path `boolean` is required.';
                const instance = new Instance(AllFieldsRequiredClass);
                instance.assign({
                    string: 'String',
                    strings: ['String'],
                    date: new Date(),
                    booleans: [true],
                    number: 1,
                    numbers: [1],
                    class1: new Instance(CompareClass1).id,
                    class2s: [new Instance(CompareClass2).id]
                });

                testForError('instance.validate()', expectedErrorMessage, () => {
                    instance.validate();
                });

            });

            it('All fields are required. All but booleans are set. Error thrown.', () => {
                const expectedErrorMessage = 'AllFieldsRequiredClass validation failed: booleans: Path `booleans` is required.';
                const instance = new Instance(AllFieldsRequiredClass);
                instance.assign({
                    string: 'String',
                    strings: ['String'],
                    date: new Date(),
                    boolean: true,
                    number: 1,
                    numbers: [1],
                    class1: new Instance(CompareClass1).id,
                    class2s: [new Instance(CompareClass2).id]
                });

                testForError('instance.validate()', expectedErrorMessage, () => {
                    instance.validate();
                });

            });

            it('All fields are required. Booleans set to empty array. Error thrown.', () => {
                const expectedErrorMessage = 'AllFieldsRequiredClass validation failed: booleans: Path `booleans` is required.';
                const instance = new Instance(AllFieldsRequiredClass);
                instance.assign({
                    string: 'String',
                    strings: ['String'],
                    date: new Date(),
                    boolean: true,
                    booleans: [],
                    number: 1,
                    numbers: [1],
                    class1: new Instance(CompareClass1).id,
                    class2s: [new Instance(CompareClass2).id]
                });

                testForError('instance.validate()', expectedErrorMessage, () => {
                    instance.validate();
                });

            });

            it('All fields are required. All but number are set. Error thrown.', () => {
                const expectedErrorMessage = 'AllFieldsRequiredClass validation failed: number: Path `number` is required.';
                const instance = new Instance(AllFieldsRequiredClass);
                instance.assign({
                    string: 'String',
                    strings: ['String'],
                    date: new Date(),
                    boolean: true,
                    booleans: [true],
                    numbers: [1],
                    class1: new Instance(CompareClass1).id,
                    class2s: [new Instance(CompareClass2).id]
                });

                testForError('instance.validate()', expectedErrorMessage, () => {
                    instance.validate();
                });

            });

            it('All fields are required. All but numbers are set. Error thrown.', () => {
                const expectedErrorMessage = 'AllFieldsRequiredClass validation failed: numbers: Path `numbers` is required.';
                const instance = new Instance(AllFieldsRequiredClass);
                instance.assign({
                    string: 'String',
                    strings: ['String'],
                    date: new Date(),
                    boolean: true,
                    booleans: [true],
                    number: 1,
                    class1: new Instance(CompareClass1).id,
                    class2s: [new Instance(CompareClass2).id]
                });

                testForError('instance.validate()', expectedErrorMessage, () => {
                    instance.validate();
                });

            });

            it('All fields are required. Numbers is set to an empty array. Error thrown.', () => {
                const expectedErrorMessage = 'AllFieldsRequiredClass validation failed: numbers: Path `numbers` is required.';
                const instance = new Instance(AllFieldsRequiredClass);
                instance.assign({
                    string: 'String',
                    strings: ['String'],
                    date: new Date(),
                    boolean: true,
                    booleans: [true],
                    number: 1,
                    numbers: [],
                    class1: new Instance(CompareClass1).id,
                    class2s: [new Instance(CompareClass2).id]
                });

                testForError('instance.validate()', expectedErrorMessage, () => {
                    instance.validate();
                });

            });

            it('All fields are required. All but class1 are set. Error thrown.', () => {
                const expectedErrorMessage = 'AllFieldsRequiredClass validation failed: class1: Path `class1` is required.';
                const instance = new Instance(AllFieldsRequiredClass);
                instance.assign({
                    string: 'String',
                    strings: ['String'],
                    date: new Date(),
                    boolean: true,
                    booleans: [true],
                    number: 1,
                    numbers: [1],
                    class2s: [new Instance(CompareClass2).id]
                });

                testForError('instance.validate()', expectedErrorMessage, () => {
                    instance.validate();
                });

            });

            it('All fields are required. All but class2s are set. Error thrown.', () => {
                const expectedErrorMessage = 'AllFieldsRequiredClass validation failed: class2s: Path `class2s` is required.';
                const instance = new Instance(AllFieldsRequiredClass);
                instance.assign({
                    string: 'String',
                    strings: ['String'],
                    date: new Date(),
                    boolean: true,
                    booleans: [true],
                    number: 1,
                    numbers: [1],
                    class1: new Instance(CompareClass1).id,
                });

                testForError('instance.validate()', expectedErrorMessage, () => {
                    instance.validate();
                });

            });

            it('All fields are required. Class2s is set to empty array. Error thrown.', () => {
                const expectedErrorMessage = 'AllFieldsRequiredClass validation failed: class2s: Path `class2s` is required.';
                const instance = new Instance(AllFieldsRequiredClass);
                instance.assign({
                    string: 'String',
                    strings: ['String'],
                    date: new Date(),
                    boolean: true,
                    booleans: [true],
                    number: 1,
                    numbers: [1],
                    class1: new Instance(CompareClass1).id,
                    class2s: []
                });

                testForError('instance.validate()', expectedErrorMessage, () => {
                    instance.validate();
                });

            });

        });

        describe('Required Group Validation', () => {
                
            it('Multiple fields (one of each type) share a required group no fields are set. Error thrown.', () => {
                const expectedErrorMessage = 'Required Group violations found for requirement group(s):  a';
                const instance = new Instance(AllFieldsInRequiredGroupClass);
    
                testForError('instance.validate()', expectedErrorMessage, () => {
                    instance.validate();
                });
            });
                
            it('Multiple fields (one of each type) share a required group boolean is set to false. Error thrown.', () => {
                const expectedErrorMessage = 'Required Group violations found for requirement group(s):  a';
                const instance = new Instance(AllFieldsInRequiredGroupClass);
                instance.boolean = false;
    
                testForError('instance.validate()', expectedErrorMessage, () => {
                    instance.validate();
                });
            });
                
            it('Multiple fields (one of each type) share a required group string is set to "". Error thrown.', () => {
                const expectedErrorMessage = 'Required Group violations found for requirement group(s):  a';
                const instance = new Instance(AllFieldsInRequiredGroupClass);
                instance.string = '';
    
                testForError('instance.validate()', expectedErrorMessage, () => {
                    instance.validate();
                });
            });
                
            it('Multiple fields (one of each type) share a required group class2s is set to empty array. Error thrown.', () => {
                const expectedErrorMessage = 'Required Group violations found for requirement group(s):  a';
                const instance = new Instance(AllFieldsInRequiredGroupClass);
                instance.class2s = [];
    
                testForError('instance.validate()', expectedErrorMessage, () => {
                    instance.validate();
                });
            });
            
            it('Multiple fields (one of each type) share a required group and string is set. No error thrown.', () => {
                const instance = new Instance(AllFieldsInRequiredGroupClass);
                instance.string = 'String';

                instance.validate();
            });
            
            it('Multiple fields (one of each type) share a required group and strings is set. No error thrown.', () => {
                const instance = new Instance(AllFieldsInRequiredGroupClass);
                instance.strings = ['String'];

                instance.validate();
            });
            
            it('Multiple fields (one of each type) share a required group and boolean is set. No error thrown.', () => {
                const instance = new Instance(AllFieldsInRequiredGroupClass);
                instance.boolean = true;

                instance.validate();
            });
            
            it('Multiple fields (one of each type) share a required group and booleans is set. No error thrown.', () => {
                const instance = new Instance(AllFieldsInRequiredGroupClass);
                instance.booleans = [true];

                instance.validate();
            });
            
            it('Multiple fields (one of each type) share a required group and date is set. No error thrown.', () => {
                const instance = new Instance(AllFieldsInRequiredGroupClass);
                instance.date = new Date();

                instance.validate();
            });
            
            it('Multiple fields (one of each type) share a required group and number is set. No error thrown.', () => {
                const instance = new Instance(AllFieldsInRequiredGroupClass);
                instance.number = 1;

                instance.validate();
            });
            
            it('Multiple fields (one of each type) share a required group and number is set to 0. No error thrown.', () => {
                const instance = new Instance(AllFieldsInRequiredGroupClass);
                instance.number = 0;

                instance.validate();
            });
            
            it('Multiple fields (one of each type) share a required group and numbers is set. No error thrown.', () => {
                const instance = new Instance(AllFieldsInRequiredGroupClass);
                instance.numbers = [1];

                instance.validate();
            });
            
            it('Multiple fields (one of each type) share a required group and class1 is set. No error thrown.', () => {
                const instance = new Instance(AllFieldsInRequiredGroupClass);
                instance.class1 = (new Instance(CompareClass1)).id;

                instance.validate();
            });
            
            it('Multiple fields (one of each type) share a required group and class2s is set. No error thrown.', () => {
                const instance = new Instance(AllFieldsInRequiredGroupClass);
                instance.class2s = [(new Instance(CompareClass2)).id];

                instance.validate();
            });
            
        });

        describe('Mutex Validation', () => {
            
            it('2 attribute fields (boolean, date) have a mutex and both are set. Error thrown.', () => {
                const expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field boolean with mutex \'a\'. Field date with mutex \'a\'.';
                const expectedErrorMutex = /^Mutex violations found for instance .* Field boolean with mutex \'a\'. Field date with mutex \'a\'.$/;
                const instance = new Instance(MutexClassA);
                instance.boolean = true;
                instance.date = new Date();

                testForErrorMutex('instance.validate()', expectedErrorMessage, expectedErrorMutex, () => {
                    instance.validate();
                });
            });
            
            it('2 attribute fields (boolean, date) have a mutex and one (boolean) is set. No error thrown.', () => {
                const instance = new Instance(MutexClassA);
                instance.boolean = true;

                instance.validate();
            });
            
            it('2 singular relationship fields have a mutex and both are set. Error thrown.', () => {
                const expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field class1 with mutex \'a\'. Field class2 with mutex \'a\'.';
                const expectedErrorMutex = /^Mutex violations found for instance .* Field class1 with mutex \'a\'. Field class2 with mutex \'a\'.$/;
                const instance = new Instance(MutexClassB);

                instance.class1 = (new Instance(CompareClass1)).id;
                instance.class2 = (new Instance(CompareClass2)).id;

                testForErrorMutex('instance.validate()', expectedErrorMessage, expectedErrorMutex, () => {
                    instance.validate();
                });
            });
            
            it('2 singular relationship fields have a mutex and one is set. No error thrown.', () => {
                const instance = new Instance(MutexClassB);
                instance.class1 = (new Instance(CompareClass1)).id;

                instance.validate();
            });
            
            it('2 non-singular relationship fields have a mutex and both are set. Error thrown.', () => {
                const expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field class1s with mutex \'a\'. Field class2s with mutex \'a\'.';
                const expectedErrorMutex = /^Mutex violations found for instance .* Field class1s with mutex \'a\'. Field class2s with mutex \'a\'.$/;
                const instance = new Instance(MutexClassC);

                instance.class1s = [(new Instance(CompareClass1)).id, (new Instance(CompareClass1)).id];
                instance.class2s = [(new Instance(CompareClass2)).id, (new Instance(CompareClass2)).id];

                testForErrorMutex('instance.validate()', expectedErrorMessage, expectedErrorMutex, () => {
                    instance.validate();
                });
            });
            
            it('2 non-singular relationship fields have a mutex and one is set. No error thrown.', () => {
                const instance = new Instance(MutexClassC);
                instance.class1s = [(new Instance(CompareClass1)).id, (new Instance(CompareClass1)).id];

                instance.validate();
            });
            
            it('Multiple fields (one of each type) have a mutex and string is set. No error thrown.', () => {
                const instance = new Instance(AllFieldsMutexClass);
                instance.string = 'String';

                instance.validate();
            });
            
            it('Multiple fields (one of each type) have a mutex and date is set. No error thrown.', () => {
                const instance = new Instance(AllFieldsMutexClass);
                instance.date = new Date();

                instance.validate();
            });
            
            it('Multiple fields (one of each type) have a mutex and boolean is set to false. No error thrown.', () => {
                const instance = new Instance(AllFieldsMutexClass);
                instance.boolean = false;

                instance.validate();
            });
            
            it('Multiple fields (one of each type) have a mutex and boolean is set to true. No error thrown.', () => {
                const instance = new Instance(AllFieldsMutexClass);
                instance.boolean = true;

                instance.validate();
            });
            
            it('Multiple fields (one of each type) have a mutex and number is set to 0. No error thrown.', () => {
                const instance = new Instance(AllFieldsMutexClass);
                instance.number = 0;

                instance.validate();
            });
            
            it('Multiple fields (one of each type) have a mutex and number is set to 1. No error thrown.', () => {
                const instance = new Instance(AllFieldsMutexClass);
                instance.number = 1;

                instance.validate();
            });
            
            it('Multiple fields (one of each type) have a mutex and numbers is set to empty array. No error thrown.', () => {
                const instance = new Instance(AllFieldsMutexClass);
                instance.numbers = [];

                instance.validate();
            });
            
            it('Multiple fields (one of each type) have a mutex and numbers is set to an array of 0s. No error thrown.', () => {
                const instance = new Instance(AllFieldsMutexClass);
                instance.numbers = [0, 0, 0];

                instance.validate();
            });
            
            it('Multiple fields (one of each type) have a mutex and numbers is set to an array of 1s. No error thrown.', () => {
                const instance = new Instance(AllFieldsMutexClass);
                instance.numbers = [1, 1, 1];

                instance.validate();
            });
            
            it('Multiple fields (one of each type) have a mutex and class1 is set. No error thrown.', () => {
                const instance = new Instance(AllFieldsMutexClass);
                instance.class1 = (new Instance(CompareClass1)).id;

                instance.validate();
            });
            
            it('Multiple fields (one of each type) have a mutex and class2s are set to a single instance. No error thrown.', () => {
                const instance = new Instance(AllFieldsMutexClass);
                instance.class2s = (new Instance(CompareClass2)).id;

                instance.validate();
            });
            
            it('Multiple fields (one of each type) have a mutex and class2s are set to multiple instances. No error thrown.', () => {
                const instance = new Instance(AllFieldsMutexClass);
                instance.class2s = [(new Instance(CompareClass2)).id, (new Instance(CompareClass2)).id];

                instance.validate();
            });
            
            it('Multiple fields (one of each type) have a mutex and none are set. No error thrown.', () => {
                const instance = new Instance(AllFieldsMutexClass);

                instance.validate();
            });
            
            it('Multiple fields (one of each type) have a mutex and number is set to 1 and numbers, strings, booleans, and class2s are set to empty array. No error thrown.', () => {
                const instance = new Instance(AllFieldsMutexClass);
                instance.number = 1;
                instance.numbers = [];
                instance.booleans = [];
                instance.strings = [];
                instance.class2s = [];

                instance.validate();
            });
            
            it('Multiple fields (one of each type) have a mutex and number is set to 0 and numbers are set to an array of 0s. Error thrown.', () => {
                const expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field number with mutex \'a\'. Field numbers with mutex \'a\'.';
                const expectedErrorMutex = /^Mutex violations found for instance .* Field number with mutex \'a\'. Field numbers with mutex \'a\'.$/;
                const instance = new Instance(AllFieldsMutexClass);
                instance.number = 0;
                instance.numbers = [0, 0, 0];

                testForErrorMutex('instance.validate()', expectedErrorMessage, expectedErrorMutex, () => {
                    instance.validate();
                });
            });
                
            it('Multiple fields (one of each type) have a mutex and number is set to 1 and booleans is set to [false]. Error thrown.', () => {
                const expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field booleans with mutex \'a\'. Field number with mutex \'a\'.';
                const expectedErrorMutex = /^Mutex violations found for instance .* Field booleans with mutex \'a\'. Field number with mutex \'a\'.$/;
                const instance = new Instance(AllFieldsMutexClass);
                instance.number = 1;
                instance.booleans = [false];

                testForErrorMutex('instance.validate()', expectedErrorMessage, expectedErrorMutex, () => {
                    instance.validate();
                });
            });
                
            it('Multiple fields (one of each type) have a mutex and number is set to 1 and strings is set to [\"\"]. Error thrown.', () => {
                const expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field strings with mutex \'a\'. Field number with mutex \'a\'.';
                const expectedErrorMutex = /^Mutex violations found for instance .* Field strings with mutex \'a\'. Field number with mutex \'a\'.$/;
                const instance = new Instance(AllFieldsMutexClass);
                instance.number = 1;
                instance.strings = [''];

                testForErrorMutex('instance.validate()', expectedErrorMessage, expectedErrorMutex, () => {
                    instance.validate();
                });
            });

        });

    });

    describe('instance.save()', () => {

        // Set up updateControlled Instances
        {
            // ClassControlsUpdateControlledSuperClass Instances
            var instanceOfClassControlsUpdateControlledSuperClassAllowed = new Instance(ClassControlsUpdateControlledSuperClass);
            instanceOfClassControlsUpdateControlledSuperClassAllowed.allowed = true;
            
            var instanceOfClassControlsUpdateControlledSuperClassNotAllowed = new Instance(ClassControlsUpdateControlledSuperClass);
            instanceOfClassControlsUpdateControlledSuperClassNotAllowed.allowed = false;

            // UpdateControlledSuperClass Instances
            var instanceOfUpdateControlledSuperClassPasses = new Instance(UpdateControlledSuperClass);
            instanceOfUpdateControlledSuperClassPasses.name = 'instanceOfUpdateControlledSuperClassPasses';
            instanceOfUpdateControlledSuperClassPasses.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;

            var instanceOfUpdateControlledSuperClassFailsRelationship = new Instance(UpdateControlledSuperClass);
            instanceOfUpdateControlledSuperClassFailsRelationship.name = 'instanceOfUpdateControlledSuperClassFailsRelationship';
            instanceOfUpdateControlledSuperClassFailsRelationship.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassNotAllowed;

            
        }

        before(async () => {
            await instanceOfClassControlsUpdateControlledSuperClassAllowed.save();
            await instanceOfClassControlsUpdateControlledSuperClassNotAllowed.save();
        });

        after(async () => {
            await AllFieldsRequiredClass.clear();
            await UpdateControlledSuperClass.clear();
            await UpdateControlledClassUpdateControlledByParameters.clear();
        });

        it('instance.save() works properly.', async () => {
            const instance = new Instance(AllFieldsRequiredClass);
            instance.assign({
                string: 'String',
                strings: ['String'],
                date: new Date(),
                boolean: true,
                booleans: [true],
                number: 1,
                numbers: [1],
                class1: new Instance(CompareClass1).id,
                class2s: [new Instance(CompareClass2).id],
            });
            await instance.save();
            const found = await AllFieldsRequiredClass.findById(instance._id);

            if (!found) 
                throw new Error('instance.save() did not throw an error, but was not saved.');

            if (instance.id != found.id)
                throw new Error('instance.save() did not throw an error, but the instance found is different than the instance saved.');

            if (!instance.saved) 
                throw new Error('instance.save() did not set the saved property to true.');
        });

        it('instance.save() throws an error when instance is invalid. Instance not saved.', async () => {
            const expectedErrorMessage = 'Caught validation error when attempting to save Instance: AllFieldsRequiredClass validation failed: string: Path `string` is required.';
            const instance = new Instance(AllFieldsRequiredClass);
            instance.assign({
                strings: ['String'],
                date: new Date(),
                boolean: true,
                booleans: [true],
                number: 1,
                numbers: [1],
                class1: new Instance(CompareClass1).id,
                class2s: [new Instance(CompareClass2).id],
            });

            await testForErrorAsync('instance.save', expectedErrorMessage, async () => {
                return instance.save();
            });

            const found = await AllFieldsRequiredClass.findById(instance._id);

            if (found) 
                throw new Error('instance was saved.');
        });

        it('instance.save() throws an error if instance has already been deleted. Instance not saved.', async () => {
            const expectedErrorMessage = 'instance.save(): You cannot save an instance which has been deleted.';
            const instance = new Instance(AllFieldsRequiredClass);
            instance.assign({
                string: 'String',
                strings: ['String'],
                date: new Date(),
                boolean: true,
                booleans: [true],
                number: 1,
                numbers: [1],
                class1: new Instance(CompareClass1).id,
                class2s: [new Instance(CompareClass2).id],
            });

            instance.deleted = true;

            await testForErrorAsync('instance.save', expectedErrorMessage, async () => {
                return instance.save();
            });
        });

        it('instance.save() called on an instance of an update controlled class. Instance saved.', async () => {
            const instance = new Instance(UpdateControlledSuperClass);
            instance.name = 'instanceOfUpdateControlledSuperClassPasses-saveAll';
            instance.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;

            await instance.save();

            const instanceSaved = await UpdateControlledSuperClass.findById(instance._id);
            
            if (!instanceSaved)
                throw new Error('Instance was not saved.');

            await instance.delete(instance);
        });

        it('instance.save() fails due to update control check.', async () => {
            const instance = instanceOfUpdateControlledSuperClassFailsRelationship;
            const expectedErrorMessage = 'Caught validation error when attempting to save Instance: Illegal attempt to update instances: ' + instance.id;
            
            await testForErrorAsync('Instance.save()', expectedErrorMessage, async () => {
                return instance.save();
            });
            
            const instanceFound = await UpdateControlledSuperClass.findById(instance.id);

            if (instanceFound) 
                throw new Error('.save() threw an error, but the instance was saved anyway.');
        });

        it('instance.save() called on an instance of an update controlled class with updateControlMethodParameters. Instance saved.', async () => {
            const instance = new Instance(UpdateControlledClassUpdateControlledByParameters);
            const updateControlMethodParameters = [1, 1, true];
            
            await instance.save(...updateControlMethodParameters);
            const instanceSaved = UpdateControlledClassUpdateControlledByParameters.findById(instance.id);
            
            if (!instanceSaved)
                throw new Error('Instance was not saved.');

            await instance.delete();
        });

        it('instance.save() called on an instance of an update controlled class with updateControlMethodParameters. Save fails due to update control check.', async () => {
            const instance = new Instance(UpdateControlledClassUpdateControlledByParameters);
            const expectedErrorMessage = 'Caught validation error when attempting to save Instance: Illegal attempt to update instances: ' + instance.id;
            const updateControlMethodParameters = [-2, 1, true];

            await testForErrorAsync('InstanceSet.save()', expectedErrorMessage, async () => {
                return instance.save(...updateControlMethodParameters);
            })
            
            const instanceFound = await UpdateControlledClassUpdateControlledByParameters.findById(instance._id);

            if (instanceFound) 
                throw new Error('.save() threw an error, but the instance was saved anyway.')
        });

    });

    describe('instance.delete()', () => {

        it('Instance can be deleted as expected.', async () => {
            const instance = new Instance(AllFieldsRequiredClass);
            instance.assign({
                string: 'String',
                strings: ['String'],
                date: new Date(),
                boolean: true,
                booleans: [true],
                number: 1,
                numbers: [1],
                class1: new Instance(CompareClass1).id,
                class2s: [new Instance(CompareClass2).id],
            });
            await instance.save();
            await instance.delete();

            const found = await AllFieldsRequiredClass.findById(instance._id);

            if (found) 
                throw new Error('instance.delete() did no throw an error, but the instance was not deleted.');

            if (!instance.deleted)
                throw new Error('Instance was deleted, but the deleted property was not set to true.');

        });

        it('Instance cannot be deleted if it has never been saved.', async () => {
            const expectedErrorMessage = 'instance.delete(): You cannot delete an instance which hasn\'t been saved yet';
            const instance = new Instance(AllFieldsRequiredClass);
            instance.assign({
                string: 'String',
                strings: ['String'],
                date: new Date(),
                boolean: true,
                booleans: [true],
                number: 1,
                numbers: [1],
                class1: new Instance(CompareClass1).id,
                class2s: [new Instance(CompareClass2).id],
            });

            await testForErrorAsync('instance.delete()', expectedErrorMessage, async() => {
                return instance.delete();
            });
        });

    });

    describe('ClassModel.walk()', () => {

        // Create instances for tests.
        {
            var instanceOfSingularRelationshipClassA = new Instance (SingularRelationshipClass);
            var instanceOfSingularRelationshipClassB = new Instance (SingularRelationshipClass);
            var instanceOfNonSingularRelationshipClass = new Instance (NonSingularRelationshipClass);
            var instanceOfSubClassOfSingularRelationshipClassA = new Instance (SubClassOfSingularRelationshipClass);
            var instanceOfSubClassOfSingularRelationshipClassB = new Instance (SubClassOfSingularRelationshipClass);
            var instanceOfSubClassOfNonSingularRelationshipClass = new Instance (SubClassOfNonSingularRelationshipClass);
    
            instanceOfSingularRelationshipClassA.singularRelationship = instanceOfNonSingularRelationshipClass._id;
            instanceOfSingularRelationshipClassA.boolean = true;
            instanceOfSingularRelationshipClassB.singularRelationship = instanceOfNonSingularRelationshipClass._id;
            instanceOfSingularRelationshipClassB.boolean = false;
            instanceOfNonSingularRelationshipClass.nonSingularRelationship = [instanceOfSingularRelationshipClassA._id, instanceOfSingularRelationshipClassB._id];
    
            instanceOfSubClassOfSingularRelationshipClassA.singularRelationship = instanceOfSubClassOfNonSingularRelationshipClass._id;
            instanceOfSubClassOfSingularRelationshipClassA.boolean = true;
            instanceOfSubClassOfSingularRelationshipClassB.singularRelationship = instanceOfSubClassOfNonSingularRelationshipClass._id;
            instanceOfSubClassOfSingularRelationshipClassB.boolean = false;
            instanceOfSubClassOfNonSingularRelationshipClass.nonSingularRelationship = [instanceOfSubClassOfSingularRelationshipClassA._id, instanceOfSubClassOfSingularRelationshipClassB._id];
        }

        before(async () => {
            await instanceOfSingularRelationshipClassA.save();
            await instanceOfSingularRelationshipClassB.save();
            await instanceOfNonSingularRelationshipClass.save();
            await instanceOfSubClassOfSingularRelationshipClassA.save();
            await instanceOfSubClassOfSingularRelationshipClassB.save();
            await instanceOfSubClassOfNonSingularRelationshipClass.save();
        });

        after(async () => {
            await SingularRelationshipClass.clear();
            await NonSingularRelationshipClass.clear();
            await SubClassOfSingularRelationshipClass.clear();
            await SubClassOfNonSingularRelationshipClass.clear();
        });

        describe('Instance.walk() validations.', () => {

            it('instance.walk() throws an error when relationship is null.', async () => {
                const instance = new Instance(SingularRelationshipClass);
                const expectedErrorMessage = 'instance.walk() called with insufficient arguments. Should be walk(relationship, <optional>filter).';
                
                await testForErrorAsync('instnace.walk()', expectedErrorMessage, async() => {
                    return instance.walk(null);
                })
            });

            it('instance.walk() throws an error when relationship is undefined.', async () => {
                const instance = new Instance(SingularRelationshipClass);
                const expectedErrorMessage = 'instance.walk() called with insufficient arguments. Should be walk(relationship, <optional>filter).';
                
                await testForErrorAsync('instnace.walk()', expectedErrorMessage, async() => {
                    return instance.walk();
                })
            });

            it('instance.walk() throws an error when relationship is not a string.', async () => {
                const instance = new Instance(SingularRelationshipClass);
                const expectedErrorMessage = 'instance.walk(): First argument needs to be a String representing the name of the relationship.';
                
                await testForErrorAsync('instnace.walk()', expectedErrorMessage, async() => {
                    return instance.walk({ some: 'object' });
                })
            });

            it('instance.walk() throws an error when relationship is not part of the classModel\'s schema.', async () => {
                const instance = new Instance(SingularRelationshipClass);
                const expectedErrorMessage = 'instance.walk(): First argument needs to be a relationship property in SingularRelationshipClass\'s schema.';
                
                await testForErrorAsync('instnace.walk()', expectedErrorMessage, async() => {
                    return instance.walk('random property');
                })
            });

            it('instance.walk() throws an error when relationship is actually an attribute.', async () => {
                const instance = new Instance(SingularRelationshipClass);
                const expectedErrorMessage = 'instance.walk(): property "boolean" is not a relationship.';
                
                await testForErrorAsync('instnace.walk()', expectedErrorMessage, async() => {
                    return instance.walk('boolean');
                })
            });

            it('instance.walk() throws an error when filter is not an object.', async () => {
                const instance = new Instance(SingularRelationshipClass);
                const expectedErrorMessage = 'instance.walk(): Second argument needs to be an object.';
                
                await testForErrorAsync('instnace.walk()', expectedErrorMessage, async() => {
                    return instance.walk('singularRelationship', 'Not an object.');
                })
            });

        });

        describe('Test walking the relationships.', () => {

            it('Walking a singular relationship.', async () => {
                const expectedInstance = instanceOfNonSingularRelationshipClass;
                const instance = await instanceOfSingularRelationshipClassA.walk('singularRelationship');

                if (!instance)
                    throw new Error('walk() did not return anything.');

                if (!expectedInstance.equals(instance))
                    throw new Error('walk() did not return the correct instance.');
            });

            it('Walking a nonsingular relationship.', async () => {
                const expectedInstanceSet = new InstanceSet(SingularRelationshipClass, [
                    instanceOfSingularRelationshipClassA,
                    instanceOfSingularRelationshipClassB
                ]);
                const instanceSet = await instanceOfNonSingularRelationshipClass.walk('nonSingularRelationship');

                if (!expectedInstanceSet.equals(instanceSet))
                    throw new Error('walk() did not return the correct instances.');
            });

            it('Walking a singular relationship by calling walk() from the super class.', async () => {
                const expectedInstance = instanceOfSubClassOfNonSingularRelationshipClass;
                const instance = await instanceOfSubClassOfSingularRelationshipClassA.walk('singularRelationship');

                if (!instance)
                    throw new Error('walk() did not return anything.');

                if (!expectedInstance.equals(instance))
                    throw new Error('walk() did not return the correct instance.');
            });

            it('Walking a nonsingular relationship by calling walk() from the super class.', async () => {
                const expectedInstanceSet = new InstanceSet(SingularRelationshipClass, [
                    instanceOfSubClassOfSingularRelationshipClassA,
                    instanceOfSubClassOfSingularRelationshipClassB
                ]);
                const instanceSet = await instanceOfSubClassOfNonSingularRelationshipClass.walk('nonSingularRelationship');

                if (!expectedInstanceSet.equals(instanceSet))
                    throw new Error('walk() did not return the correct instances.');
            });

            it('Walking a nonsingular relationship by calling walk() from the super class with a filter.', async () => {
                const expectedInstanceSet = new InstanceSet(SingularRelationshipClass, [
                    instanceOfSubClassOfSingularRelationshipClassA,
                ]);

                const filter = { boolean: true };

                const instanceSet = await instanceOfSubClassOfNonSingularRelationshipClass.walk('nonSingularRelationship', filter);

                if (!expectedInstanceSet.equals(instanceSet))
                    throw new Error('walk() did not return the correct instances.');
            });

        });

    });

    describe('instance.isInstanceOf()', () => {
        
        it('When called with it\'s own class, returns true', () => {
            const instance = new Instance(TestClassWithNumber);
            if (!instance.isInstanceOf(TestClassWithNumber))
                throw new Error('isInstanceOf() returned false.');
        });
        
        it('When called with a super class, returns true', () => {
            const instance = new Instance(SubClassOfSuperClass);
            if (!instance.isInstanceOf(SuperClass))
                throw new Error('isInstanceOf() returned false.');
        });
        
        it('When called with a discriminated super class, returns true', () => {
            const instance = new Instance(SubClassOfDiscriminatorSuperClass);
            if (!instance.isInstanceOf(DiscriminatedSuperClass))
                throw new Error('isInstanceOf() returned false.');
        });
        
        it('When called with a sub class of a discriminated sub class of a super class, returns true', () => {
            const instance = new Instance(SubClassOfDiscriminatedSubClassOfSuperClass);
            if (!instance.isInstanceOf(SuperClass))
                throw new Error('isInstanceOf() returned false.');
        });
        
        it('When called with a abstract super class, returns true', () => {
            const instance = new Instance(SubClassOfAbstractSuperClass);
            if (!instance.isInstanceOf(AbstractSuperClass))
                throw new Error('isInstanceOf() returned false.');
        });
        
        it('When called with an unrelated class, throws an error.', () => {
            const instance = new Instance(TestClassWithBoolean);
            if (instance.isInstanceOf(TestClassWithNumber))
                throw new Error('isInstanceOf returned true.');
        });
        
        it('When called with a subclass of the class of instance, throws an error.', () => {
            const instance = new Instance(SuperClass);
            if (instance.isInstanceOf(SubClassOfSuperClass))
                throw new Error('isInstanceOf returned true.');
        });

    });


});