
require("@babel/polyfill");
const mongoose = require('mongoose');
const moment = require('moment');

const database = require('../../dist/noomman/database');
const Instance = require('../../dist/noomman/Instance');
const InstanceSet = require('../../dist/noomman/InstanceSet');
const TestClassModels = require('./helpers/TestClassModels');
const TestingFunctions = require('./helpers/TestingFunctions');
const testForError = TestingFunctions.testForError;
const testForErrorRegex = TestingFunctions.testForErrorRegex;
const testForErrorAsync = TestingFunctions.testForErrorAsync;
const arraysEqual = TestingFunctions.arraysEqual;
const objectsEqual = TestingFunctions.objectsEqual;

// Load all TestClassModels 
{
    // Compare Classes
    var CompareClass1 = TestClassModels.CompareClass1;
    var CompareClass2 = TestClassModels.CompareClass2;

    // Simple Classes
    var TestClassWithNumber = TestClassModels.TestClassWithNumber;
    var TestClassWithBoolean = TestClassModels.TestClassWithBoolean;
    var TestClassWithAllSimpleFields = TestClassModels.TestClassWithAllSimpleFields;
    var AllAttributesAndRelationshipsClass = TestClassModels.AllAttributesAndRelationshipsClass;

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
            _id: new mongoose.Types.ObjectId(),
            boolean: false
        });

        var documentOfTestClassWithNumber = new TestClassWithNumber.Model({
            _id: new mongoose.Types.ObjectId(),
            number: 17
        });

        var documentOfDiscriminatedSubClassOfSuperClass = new DiscriminatedSubClassOfSuperClass.Model({
            _id: new mongoose.Types.ObjectId(),
            __t: 'DiscriminatedSubClassOfSuperClass',
            discriminatedBoolean: true,
            discriminatedNumber: 1,
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

            it('Instance.constructor(), given document is not an instance of the given classModel.', () => {
                const expectedErrorMessage = 'Instance.constructor(), given document is not an instance of the given classModel.';

                testForError('Instance.constructor()', expectedErrorMessage, () => {
                    new Instance(TestClassWithNumber, documentOfTestClassWithBoolean);
                });
            });

            it.skip('Instance.constructor(), document does not have an ObjectId.', () => {
                const expectedErrorMessage = '';
                const document = Object.create(TestClassWithNumber.Model);
                document.number = 1;
                Object.defineProperty(document, 'constructor', {
                    value: TestClassWithNumber,
                });

                console.log(JSON.stringify(document, null, 2));

                testForError('Instance.constructor()', expectedErrorMessage, () => {
                    new Instance(TestClassWithNumber, document);
                });
            });

        });

        describe('Instance Constructor Sets Given Properties.', () => {

            describe('Instance Properties Set', () => {

                it('ClassModel property is set.', () => {
                    const instance = new Instance(TestClassWithNumber);
                    if (instance.classModel != TestClassWithNumber)
                        throw new Error('ClassModel property not set by constructor.');
                });
    
                it('Current instance state is set when document given.', () => {
                    const instance = new Instance(TestClassWithBoolean, documentOfTestClassWithBoolean);
                    if (!instance.currentState)
                        throw new Error('Instance does not have a current instance state.');
                });
    
                it('Current instance state is set when no document given.', () => {
                    const instance = new Instance(TestClassWithBoolean);
                    if (!instance.currentState)
                        throw new Error('Instance does not have a current instance state.');
                });
    
                it('Previous instance state is set when document given.', () => {
                    const instance = new Instance(TestClassWithBoolean, documentOfTestClassWithBoolean);
                    if (!instance.previousState)
                        throw new Error('Instance does not have a previous instance state.');
                });
    
                it('Previous instance state is null when no document given.', () => {
                    const instance = new Instance(TestClassWithBoolean);
                    if (instance.previousState !== null)
                        throw new Error('Instance has previous instance state.');
                });     
    
                it('Saved is true when a new instance is previous with a document.', () => {
                    const instance = new Instance(TestClassWithBoolean, documentOfTestClassWithBoolean);
                    if (instance.saved() != true)
                        throw new Error('saved() returning true for an unsaved Instance.');
                });
    
                it('Deleted defaults to false', () => {
                    const instance = new Instance(TestClassWithBoolean, documentOfTestClassWithBoolean);
                    if (instance.deleted() != false)
                        throw new Error('saved() returning true for an Instance which has not been deleted.');
                });
    
                it('__t property is set', () => {
                    const instance = new Instance(DiscriminatedSubClassOfSuperClass, documentOfDiscriminatedSubClassOfSuperClass);
    
                    if (instance.__t !== 'DiscriminatedSubClassOfSuperClass')
                        throw new Error('__t property not set.');
                });
    
                it('_id property is set', () => {
                    const instance = new Instance(DiscriminatedSubClassOfSuperClass, documentOfDiscriminatedSubClassOfSuperClass);
    
                    if (instance._id !== documentOfDiscriminatedSubClassOfSuperClass._id)
                        throw new Error('_id property not set.');
                });

            });

            describe('Instance State Properties Set', () => {

                describe('Attributes Set', () => {

                    describe('When Document Given', () => {

                        describe('On Current State', () => {

                            it('Document attributes are set on current instance state when document given.', () => {
                                const document = new TestClassWithBoolean.Model({
                                    boolean: false
                                });
                                const instance = new Instance(TestClassWithBoolean, document);
                                
                                if (instance.currentState.boolean !== false)
                                    throw new Error('Property not set on current instance state.');
                            });

                            it('Document attributes are set to null on current instance state when document given without attribute.', () => {
                                const document = new TestClassWithBoolean.Model({});
                                const instance = new Instance(TestClassWithBoolean, document);
                                
                                if (instance.currentState.boolean === undefined || instance.currentState.boolean !== null)
                                    throw new Error('Property not set on current instance state.');
                            });
        
                            it('List Document attributes are set on current instance state when document given.', () => {
                                const booleans = [false, true];
                                const document = new AllAttributesAndRelationshipsClass.Model({
                                    booleans: booleans,
                                });
                                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                                if (!arraysEqual(booleans, instance.currentState.booleans))
                                    throw new Error('Property not set on current instance state.');
                            });
            
                            it('List document attributes are set to empty array when document given with empty array.', () => {
                                const booleans = [];
                                const document = new AllAttributesAndRelationshipsClass.Model({
                                    booleans: booleans,
                                });
                                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                                if (!arraysEqual(booleans, instance.currentState.booleans))
                                    throw new Error('Property not set on current instance state.');
                            });
            
                            it('List document attributes are set to empty array when document given with attribute set to null.', () => {
                                const booleans = null;
                                const document = new AllAttributesAndRelationshipsClass.Model({
                                    booleans: booleans,
                                });
                                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                                if (!arraysEqual([], instance.currentState.booleans))
                                    throw new Error('Property not set on current instance state.');
                            });
            
                            it('List document attributes are set to empty array when document given with attribute not set.', () => {
                                const document = new AllAttributesAndRelationshipsClass.Model({});
                                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                                if (!arraysEqual([], instance.currentState.booleans))
                                    throw new Error('Property not set on current instance state.');
                            });

                        });

                        describe('On Previous State', () => {
        
                            it('Document attributes are set on previous instance state when document given.', () => {
                                const document = new TestClassWithBoolean.Model({
                                    boolean: false
                                });
                                const instance = new Instance(TestClassWithBoolean, document);
                                
                                if (instance.previousState.boolean !== false)
                                    throw new Error('Property not set on current instance state.');
                            });

                            it('Document attributes are set to null on previous instance state when document given without attribute.', () => {
                                const document = new TestClassWithBoolean.Model({});
                                const instance = new Instance(TestClassWithBoolean, document);
                                
                                if (instance.previousState.boolean === undefined || instance.previousState.boolean !== null)
                                    throw new Error('Property not set on previouis instance state.');
                            });
        
                            it('List Document attributes are set on previous instance state when document given.', () => {
                                const booleans = [false, true];
                                const document = new AllAttributesAndRelationshipsClass.Model({
                                    booleans: booleans,
                                });
                                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                                if (!arraysEqual(booleans, instance.previousState.booleans))
                                    throw new Error('Property not set on current instance state.');
                            });
            
                            it('List document attributes are set to empty array on previous instance state when document given with empty array.', () => {
                                const booleans = [];
                                const document = new AllAttributesAndRelationshipsClass.Model({
                                    booleans: booleans,
                                });
                                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                                if (!arraysEqual(booleans, instance.previousState.booleans))
                                    throw new Error('Property not set on previous instance state.');
                            });
            
                            it('List document attributes are set to empty array when document given with attribute set to null.', () => {
                                const booleans = null;
                                const document = new AllAttributesAndRelationshipsClass.Model({
                                    booleans: booleans,
                                });
                                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                                if (!arraysEqual([], instance.previousState.booleans))
                                    throw new Error('Property not set on previous instance state.');
                            });
            
                            it('List document attributes are set to empty array when document given with attribute not set.', () => {
                                const document = new AllAttributesAndRelationshipsClass.Model({});
                                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                                if (!arraysEqual([], instance.previousState.booleans))
                                    throw new Error('Property not set on previous instance state.');
                            });

                        });

                    });

                    describe('When no Document Given', () => {

                        it('Boolean attributes are set to null when no document given.', () => {
                            const instance = new Instance(TestClassWithBoolean);
                            
                            if (instance.currentState.boolean === undefined || instance.currentState.boolean !== null)
                                throw new Error('Attribute not set to null on current state.');
                        });

                        it('Number attributes are set to null when no document given.', () => {
                            const instance = new Instance(TestClassWithNumber);
                            
                            if (instance.currentState.number === undefined || instance.currentState.number !== null)
                                throw new Error('Attribute not set to null on current state.');
                        });

                        it('Boolean list attributes are set to empty array when no document given.', () => {
                            const instance = new Instance(AllAttributesAndRelationshipsClass);
                            const attribute = 'booleans';
                            
                            if (instance.currentState[attribute] === undefined)
                                throw new Error('Attribute is undefined.');
                            
                            if (!Array.isArray(instance.currentState[attribute]) || instance.currentState[attribute].length)
                                throw new Error('Attribute is not an empty array.');
                        });

                        it('Number list attributes are set to empty array when no document given.', () => {
                            const instance = new Instance(AllAttributesAndRelationshipsClass);
                            const attribute = 'numbers';
                            
                            if (instance.currentState[attribute] === undefined)
                                throw new Error('Attribute is undefined.');
                            
                            if (!Array.isArray(instance.currentState[attribute]) || instance.currentState[attribute].length)
                                throw new Error('Attribute is not an empty array.');
                        });

                        it('String list attributes are set to empty array when no document given.', () => {
                            const instance = new Instance(AllAttributesAndRelationshipsClass);
                            const attribute = 'strings';
                            
                            if (instance.currentState[attribute] === undefined)
                                throw new Error('Attribute is undefined.');
                            
                            if (!Array.isArray(instance.currentState[attribute]) || instance.currentState[attribute].length)
                                throw new Error('Attribute is not an empty array.');
                        });

                    });

                });

                describe('Relationships Set', () => {
                    
                    describe('Singular Relationship', () => {

                        describe('When Document Given', () => {
    
                            describe('On Current State', () => {
    
                                it('Document contains object Id for related intance.', () => {
                                    const objectId = new mongoose.Types.ObjectId;
                                    const document = new SingularRelationshipClass.Model({
                                        singularRelationship: objectId,
                                    });
                                    const instance = new Instance(SingularRelationshipClass, document);
    
                                    if (instance.currentState.singularRelationship !== objectId)
                                        throw new Error('Related id is not set correctly.');
                                });
    
                                it('Document relationship set to null.', () => {
                                    const document = new SingularRelationshipClass.Model({
                                        singularRelationship: null,
                                    });
                                    const instance = new Instance(SingularRelationshipClass, document);
    
                                    if (instance.currentState.singularRelationship !== null)
                                        throw new Error('Related id is not set correctly.');
                                });
    
                                it('Document relationship not set.', () => {
                                    const document = new SingularRelationshipClass.Model({
                                    });
                                    const instance = new Instance(SingularRelationshipClass, document);
    
                                    if (instance.currentState.singularRelationship !== null)
                                        throw new Error('Related id is not set correctly.');
    
                                });
    
                            });
    
                            describe('On Previous State', () => {
    
                                it('Document contains object Id for related intance.', () => {
                                    const objectId = new mongoose.Types.ObjectId;
                                    const document = new SingularRelationshipClass.Model({
                                        singularRelationship: objectId,
                                    });
                                    const instance = new Instance(SingularRelationshipClass, document);
    
                                    if (instance.previousState.singularRelationship !== objectId)
                                        throw new Error('Related id is not set correctly.');
                                });
    
                                it('Document relationship set to null.', () => {
                                    const document = new SingularRelationshipClass.Model({
                                        singularRelationship: null,
                                    });
                                    const instance = new Instance(SingularRelationshipClass, document);
    
                                    if (instance.previousState.singularRelationship !== null)
                                        throw new Error('Related id is not set correctly.');
                                });
    
                                it('Document relationship not set.', () => {
                                    const document = new SingularRelationshipClass.Model({
                                    });
                                    const instance = new Instance(SingularRelationshipClass, document);
    
                                    if (instance.previousState.singularRelationship !== null)
                                        throw new Error('Related id is not set correctly.');
                                });
    
                            });
    
                        });
    
                        describe('When No Document Given', () => {
    
                            it('Relationship set to null.', () => {
                                const instance = new Instance(SingularRelationshipClass);
    
                                if (instance.currentState.singularRelationship !== null)
                                    throw new Error('Related id is not set correctly.');
                            });
                        
                        });

                    });

                    describe('Non Singular Relationship', () => {

                        describe('When Document Given', () => {

                            describe('On Current State', () => {
    
                                it('Document contains object Ids for related intances.', () => {
                                    const objectIds = [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId];
                                    const document = new NonSingularRelationshipClass.Model({
                                        nonSingularRelationship: objectIds,
                                    });
                                    const instance = new Instance(NonSingularRelationshipClass, document);
    
                                    for (const index in objectIds) {
                                        if (objectIds[index] !== instance.currentState.nonSingularRelationship[index])
                                            throw new Error('Related ids are not set correctly.');
                                    }
                                });
    
                                it('Document relationship set to empty array.', () => {
                                    const document = new NonSingularRelationshipClass.Model({
                                        nonSingularRelationship: null,
                                    });
                                    const instance = new Instance(NonSingularRelationshipClass, document);
    
                                    if (!arraysEqual(instance.currentState.nonSingularRelationship, []))
                                        throw new Error('Related ids are not set correctly.');
                                });
    
                                it('Document relationship not set to empty array', () => {
                                    const document = new NonSingularRelationshipClass.Model({});
                                    const instance = new Instance(NonSingularRelationshipClass, document);
    
                                    if (!Array.isArray(instance.currentState.nonSingularRelationship) || instance.currentState.nonSingularRelationship.length)
                                        throw new Error('Related ids are not set correctly.');
                                });

                            });

                            describe('On Previous State', () => {
    
                                it('Document contains object Ids for related intances.', () => {
                                    const objectIds = [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId];
                                    const document = new NonSingularRelationshipClass.Model({
                                        nonSingularRelationship: objectIds,
                                    });
                                    const instance = new Instance(NonSingularRelationshipClass, document);
    
                                    for (const index in objectIds) {
                                        if (objectIds[index] !== instance.currentState.nonSingularRelationship[index])
                                            throw new Error('Related ids are not set correctly.');
                                    }
                                });
    
                                it('Document relationship set to empty array.', () => {
                                    const document = new NonSingularRelationshipClass.Model({
                                        nonSingularRelationship: null,
                                    });
                                    const instance = new Instance(NonSingularRelationshipClass, document);
    
                                    if (!arraysEqual(instance.previousState.nonSingularRelationship, []))
                                        throw new Error('Related ids are not set correctly.');
                                });
    
                                it('Document relationship not set to empty array', () => {
                                    const document = new NonSingularRelationshipClass.Model({});
                                    const instance = new Instance(NonSingularRelationshipClass, document);
    
                                    if (!Array.isArray(instance.previousState.nonSingularRelationship) || instance.previousState.nonSingularRelationship.length)
                                        throw new Error('Related ids are not set correctly.');    
                                });

                            });

                        });

                        describe('When No Document Given', () => {

                            describe('On Current State', () => {
    
                                it('Document relationship not set to empty array', () => {
                                    const instance = new Instance(NonSingularRelationshipClass);
    
                                    if (!arraysEqual(instance.currentState.nonSingularRelationship, []))
                                        throw new Error('Related ids are not set correctly.');
                                });

                            });

                        });

                    });

                });

            });
            
        }); 

    });

    describe('Instance Traps Tests', () => {

        describe('Set Trap', () => {

            describe('Validations', () => {

                describe('Changing Instance\'s own properties', () => {

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

                describe('Attribute Validations.', () => {

                    describe('Non-List Attributes', () => {
    
                        it('Attempting to set a non list attribute to an array.', () => {
                            const attributeName = 'boolean';
                            const value = [];
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            const expectedErrorMessage = 'Illegal attempt to set an Attribute to an Array.';

                            testForError('Instance Set Trap', expectedErrorMessage, () => {
                                instance[attributeName] = value;
                            });        
                        });
    
                        it('Attempting to set a boolean attribute to something other than a boolean.', () => {
                            const attributeName = 'boolean';
                            const value = 0;
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            const expectedErrorMessage = 'Illegal attempt to set a Boolean Attribute to something other than a Boolean.';

                            testForError('Instance Set Trap', expectedErrorMessage, () => {
                                instance[attributeName] = value;
                            });
                        });
    
                        it('Attempting to set a number attribute to something other than a number.', () => {
                            const attributeName = 'number';
                            const value = false;
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            const expectedErrorMessage = 'Illegal attempt to set a Number Attribute to something other than a Number.';

                            testForError('Instance Set Trap', expectedErrorMessage, () => {
                                instance[attributeName] = value;
                            });
                        });
    
                        it('Attempting to set a string attribute to something other than a string.', () => {
                            const attributeName = 'string';
                            const value = false;
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            const expectedErrorMessage = 'Illegal attempt to set a String Attribute to something other than a String.';

                            testForError('Instance Set Trap', expectedErrorMessage, () => {
                                instance[attributeName] = value;
                            });
                        });
    
                        it('Attempting to set a date attribute to something other than a date.', () => {
                            const attributeName = 'date';
                            const value = '1999-01-01';
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            const expectedErrorMessage = 'Illegal attempt to set a Date Attribute to something other than a Date.';

                            testForError('Instance Set Trap', expectedErrorMessage, () => {
                                instance[attributeName] = value;
                            });
                        });
                    });

                    describe('List Attributes', () => {
    
                        it('Attempting to set a list attribute to a single value.', () => {
                            const attributeName = 'booleans';
                            const value = true;
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            const expectedErrorMessage = 'Illegal attempt to set a List Attribute to something other than an Array.';

                            testForError('Instance Set Trap', expectedErrorMessage, () => {
                                instance[attributeName] = value;
                            });
                        });
    
                        it('Attempting to set a boolean list attribute to an array of something other than booleans.', () => {
                            const attributeName = 'booleans';
                            const value = [true, 1];
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            const expectedErrorMessage = 'Illegal attempt to set a Boolean List Attribute to an array containing non-Boolean element(s).';

                            testForError('Instance Set Trap', expectedErrorMessage, () => {
                                instance[attributeName] = value;
                            });
                        });
    
                        it('Attempting to set a number list attribute to an array of something other than numbers.', () => {
                            const attributeName = 'numbers';
                            const value = [1, 234, '14'];
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            const expectedErrorMessage = 'Illegal attempt to set a Number List Attribute to an array containing non-Number element(s).';

                            testForError('Instance Set Trap', expectedErrorMessage, () => {
                                instance[attributeName] = value;
                            });
                        });
    
                        it('Attempting to set a string list attribute to an array of something other than strings.', () => {
                            const attributeName = 'strings';
                            const value = ['1', '2', 'word', 'This is a sentence.', 5];
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            const expectedErrorMessage = 'Illegal attempt to set a String List Attribute to an array containing non-String element(s).';

                            testForError('Instance Set Trap', expectedErrorMessage, () => {
                                instance[attributeName] = value;
                            });            
                        });
    
                        it('Attempting to set a date list attribute to an array of something other than dates.', () => {
                            const attributeName = 'dates';
                            const value = [new Date(), {some: 'object'}];
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            const expectedErrorMessage = 'Illegal attempt to set a Date List Attribute to an array containing non-Date element(s).';

                            testForError('Instance Set Trap', expectedErrorMessage, () => {
                                instance[attributeName] = value;
                            });            
                        });

                    });

                });

                describe ('Relationship Validations.', () => {

                    describe('Singular Relationships', () => {
    
                        it('Attempting to set a singular relationship to something that is not an Instance.', () => {
                            const relationshipName = 'class1';
                            const value = 'fake id';
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            const expectedErrorMessage = 'Illegal attempt to set a singular relationship to a value which is not an Instance of the correct ClassModel.';

                            testForError('Instance Set Trap', expectedErrorMessage, () => {
                                instance[relationshipName] = value;
                            });
                        });
    
                        it('Attempting to set a singular relationship to an Instance of a different class.', () => {
                            const relationshipName = 'class1';
                            const value = new Instance(SuperClass);
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            const expectedErrorMessage = 'Illegal attempt to set a singular relationship to a value which is not an Instance of the correct ClassModel.';

                            testForError('Instance Set Trap', expectedErrorMessage, () => {
                                instance[relationshipName] = value;
                            });
                        });
    
                        it('Attempting to set a singular relationship to an InstanceSet.', () => {
                            const relationshipName = 'class1';
                            const value = new InstanceSet(AllAttributesAndRelationshipsClass);
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            const expectedErrorMessage = 'Illegal attempt to set a singular relationship to a value which is not an Instance of the correct ClassModel.';

                            testForError('Instance Set Trap', expectedErrorMessage, () => {
                                instance[relationshipName] = value;
                            });
                        });

                    });

                    describe('Non-Singular Relationships', () => {
    
                        it('Attempting to set a non-singular relationship to something that is not an InstanceSet.', () => {
                            const relationshipName = 'class2s';
                            const value = ['fake id', 'fake id2'];
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            const expectedErrorMessage = 'Illegal attempt to set a non-singular relationship to a value which is not an InstanceSet of the correct ClassModel.';

                            testForError('Instance Set Trap', expectedErrorMessage, () => {
                                instance[relationshipName] = value;
                            });
                        });
    
                        it('Attempting to set a non-singular relationship to an InstanceSet of a different class.', () => {
                            const relationshipName = 'class2s';
                            const value = new InstanceSet(SuperClass);
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            const expectedErrorMessage = 'Illegal attempt to set a non-singular relationship to a value which is not an InstanceSet of the correct ClassModel.';

                            testForError('Instance Set Trap', expectedErrorMessage, () => {
                                instance[relationshipName] = value;
                            });
                        });
            
                        it('Attempting to set a non-singular relationship to an Instance.', () => {
                            const relationshipName = 'class2s';
                            const value = new Instance(CompareClass2);
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            const expectedErrorMessage = 'Illegal attempt to set a non-singular relationship to a value which is not an InstanceSet of the correct ClassModel.';

                            testForError('Instance Set Trap', expectedErrorMessage, () => {
                                instance[relationshipName] = value;
                            });
                        });

                    });

                });

            });

            describe('Setting Attributes', () => {

                describe('Non-List Attributes', () => {

                    describe('Boolean Attributes', () => {

                        it('Setting a boolean attribute sets the attribute on the currentState.', () => {
                            const document = new TestClassWithBoolean.Model({
                                boolean: false
                            });
                            const instance = new Instance(TestClassWithBoolean, document);
                            
                            if (instance.currentState.boolean !== false || instance.boolean !== false)
                                throw new Error();
            
                            instance.boolean = true;
            
                            if (instance.currentState.boolean !== true)
                                throw new Error('instance.currentState.boolean not set.');
                            
                            if (instance.boolean !== true)
                                throw new Error('instance.boolean not set.');
                        });

                        it('Setting a boolean attribute to null sets the attribute to null on the current state.', () => {
                            const document = new TestClassWithBoolean.Model({
                                boolean: false
                            });
                            const instance = new Instance(TestClassWithBoolean, document);
                            
                            if (instance.currentState.boolean !== false || instance.boolean !== false)
                                throw new Error();
            
                            instance.boolean = null;
            
                            if (instance.currentState.boolean !== null)
                                throw new Error('instance.currentState.boolean not set.');
                            
                            if (instance.boolean !== null)
                                throw new Error('instance.boolean not set.');
                        });

                        it('Setting a boolean attribute to undefined sets the attribute to null on the current state.', () => {
                            const document = new TestClassWithBoolean.Model({
                                boolean: false
                            });
                            const instance = new Instance(TestClassWithBoolean, document);
                            
                            if (instance.currentState.boolean !== false || instance.boolean !== false)
                                throw new Error();
            
                            instance.boolean = undefined;
            
                            if (instance.currentState.boolean !== null)
                                throw new Error('instance.currentState.boolean not set.');
                            
                            if (instance.boolean !== null)
                                throw new Error('instance.boolean not set.');
                        });
        
                    });
        
                    describe('Number Attributes', () => {

                        it('Setting a number attribute sets the attribute on the currentState.', () => {
                            const originalValue = 2;
                            const newValue = 3;
                            const attributeName = 'number';

                            const document = new AllAttributesAndRelationshipsClass.Model({
                                [attributeName]: originalValue
                            });
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            
                            if (instance.currentState[attributeName] !== originalValue || instance[attributeName] !== originalValue)
                                throw new Error();
            
                            instance[attributeName] = newValue;
            
                            if (instance.currentState[attributeName] !== newValue)
                                throw new Error('instance.currentState.' + attributeName + ' not set.');
                            
                            if (instance[attributeName] !== newValue)
                                throw new Error('instance.' + attributeName + ' not set.');
                        });

                        it('Setting a number attribute to 0 sets the attribute on the currentState.', () => {
                            const originalValue = 2;
                            const newValue = 0;
                            const attributeName = 'number';

                            const document = new AllAttributesAndRelationshipsClass.Model({
                                [attributeName]: originalValue
                            });
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            
                            if (instance.currentState[attributeName] !== originalValue || instance[attributeName] !== originalValue)
                                throw new Error();
            
                            instance[attributeName] = newValue;
            
                            if (instance.currentState[attributeName] !== newValue)
                                throw new Error('instance.currentState.' + attributeName + ' not set.');
                            
                            if (instance[attributeName] !== newValue)
                                throw new Error('instance.' + attributeName + ' not set.');
                        });

                        it('Setting a number attribute to null sets the attribute on the currentState.', () => {
                            const originalValue = 2;
                            const newValue = null;
                            const attributeName = 'number';

                            const document = new AllAttributesAndRelationshipsClass.Model({
                                [attributeName]: originalValue
                            });
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            
                            if (instance.currentState[attributeName] !== originalValue || instance[attributeName] !== originalValue)
                                throw new Error();
            
                            instance[attributeName] = newValue;
            
                            if (instance.currentState[attributeName] !== newValue)
                                throw new Error('instance.currentState.' + attributeName + ' not set.');
                            
                            if (instance[attributeName] !== newValue)
                                throw new Error('instance.' + attributeName + ' not set.');
                        });

                        it('Setting a number attribute to undefined sets the attribute on the currentState.', () => {
                            const originalValue = 2;
                            const newValue = undefined;
                            const attributeName = 'number';

                            const document = new AllAttributesAndRelationshipsClass.Model({
                                [attributeName]: originalValue
                            });
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            
                            if (instance.currentState[attributeName] !== originalValue || instance[attributeName] !== originalValue)
                                throw new Error();
            
                            instance[attributeName] = newValue;
            
                            if (instance.currentState[attributeName] !== null)
                                throw new Error('instance.currentState.' + attributeName + ' not set.');
                            
                            if (instance[attributeName] !== null)
                                throw new Error('instance.' + attributeName + ' not set.');
                        });
        
                    });
        
                    describe('String Attributes', () => {

                        it('Setting a string attribute sets the attribute on the currentState.', () => {
                            const originalValue = '';
                            const newValue = 'some value';
                            const attributeName = 'string';

                            const document = new AllAttributesAndRelationshipsClass.Model({
                                [attributeName]: originalValue
                            });
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            
                            if (instance.currentState[attributeName] !== originalValue || instance[attributeName] !== originalValue)
                                throw new Error();
            
                            instance[attributeName] = newValue;
            
                            if (instance.currentState[attributeName] !== newValue)
                                throw new Error('instance.currentState.' + attributeName + ' not set.');
                            
                            if (instance[attributeName] !== newValue)
                                throw new Error('instance.' + attributeName + ' not set.');
                        });

                        it('Setting a string attribute to empty string sets the attribute on the currentState.', () => {
                            const originalValue = 'some value';
                            const newValue = '';
                            const attributeName = 'string';

                            const document = new AllAttributesAndRelationshipsClass.Model({
                                [attributeName]: originalValue
                            });
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            
                            if (instance.currentState[attributeName] !== originalValue || instance[attributeName] !== originalValue)
                                throw new Error();
            
                            instance[attributeName] = newValue;
            
                            if (instance.currentState[attributeName] !== newValue)
                                throw new Error('instance.currentState.' + attributeName + ' not set.');
                            
                            if (instance[attributeName] !== newValue)
                                throw new Error('instance.' + attributeName + ' not set.');
                        });

                        it('Setting a string attribute to null sets the attribute on the currentState.', () => {
                            const originalValue = '';
                            const newValue = null;
                            const attributeName = 'string';

                            const document = new AllAttributesAndRelationshipsClass.Model({
                                [attributeName]: originalValue
                            });
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            
                            if (instance.currentState[attributeName] !== originalValue || instance[attributeName] !== originalValue)
                                throw new Error();
            
                            instance[attributeName] = newValue;
            
                            if (instance.currentState[attributeName] !== newValue)
                                throw new Error('instance.currentState.' + attributeName + ' not set.');
                            
                            if (instance[attributeName] !== newValue)
                                throw new Error('instance.' + attributeName + ' not set.');
                        });

                        it('Setting a string attribute to undefined sets the attribute on the currentState.', () => {
                            const originalValue = 'some value';
                            const newValue = undefined;
                            const attributeName = 'string';

                            const document = new AllAttributesAndRelationshipsClass.Model({
                                [attributeName]: originalValue
                            });
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            
                            if (instance.currentState[attributeName] !== originalValue || instance[attributeName] !== originalValue)
                                throw new Error();
            
                            instance[attributeName] = newValue;
            
                            if (instance.currentState[attributeName] !== null)
                                throw new Error('instance.currentState.' + attributeName + ' not set.');
                            
                            if (instance[attributeName] !== null)
                                throw new Error('instance.' + attributeName + ' not set.');
                        });
        
                    });
        
                    describe('Date Attributes', () => {

                        it('Setting a date attribute sets the attribute on the currentState.', () => {
                            const originalValue = new Date('1999-12-31');
                            const newValue = new Date();
                            const attributeName = 'date';

                            const document = new AllAttributesAndRelationshipsClass.Model({
                                [attributeName]: originalValue
                            });
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            
                            if (instance.currentState[attributeName] !== originalValue || instance[attributeName] !== originalValue)
                                throw new Error();
            
                            instance[attributeName] = newValue;
            
                            if (!moment(instance.currentState[attributeName]).isSame(newValue))
                                throw new Error('instance.currentState.' + attributeName + ' not set.');
                            
                            if (!moment(instance[attributeName]).isSame(newValue))
                                throw new Error('instance.' + attributeName + ' not set.');
                        });

                        it('Setting a date attribute to null sets the attribute on the currentState.', () => {
                            const originalValue = new Date('1999-12-31');
                            const newValue = null;
                            const attributeName = 'date';

                            const document = new AllAttributesAndRelationshipsClass.Model({
                                [attributeName]: originalValue
                            });
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            
                            if (instance.currentState[attributeName] !== originalValue || instance[attributeName] !== originalValue)
                                throw new Error();
            
                            instance[attributeName] = newValue;
            
                            if (instance.currentState[attributeName] !== null)
                                throw new Error('instance.currentState.' + attributeName + ' not set.');
                            
                            if (instance[attributeName] !== null)
                                throw new Error('instance.' + attributeName + ' not set.');
                        });
        

                        it('Setting a date attribute to undefined sets the attribute on the currentState.', () => {
                            const originalValue = new Date('1999-12-31');
                            const newValue = undefined;
                            const attributeName = 'date';

                            const document = new AllAttributesAndRelationshipsClass.Model({
                                [attributeName]: originalValue
                            });
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                            
                            if (instance.currentState[attributeName] !== originalValue || instance[attributeName] !== originalValue)
                                throw new Error();
            
                            instance[attributeName] = newValue;
            
                            if (instance.currentState[attributeName] !== null)
                                throw new Error('instance.currentState.' + attributeName + ' not set.');
                            
                            if (instance[attributeName] !== null)
                                throw new Error('instance.' + attributeName + ' not set.');
                        });
        
                    });

                });

                describe('List Attributes', () => {

                    describe('Boolean List Attributes', () => {

                        it('Setting a boolean list attribute sets the list attribute.', () => {
                            const attributeName = 'booleans';
                            const value = [true, false];
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                            instance[attributeName] = value;
            
                            if (!arraysEqual(instance.currentState[attributeName], value))
                            throw new Error('instance.currentState' + attributeName + ' not set.');
                            
                            if (!arraysEqual(instance[attributeName], value))
                                throw new Error('instance.' + attributeName + ' not set.');
                        });

                        it('Setting a boolean list attribute to empty array sets the list attribute.', () => {
                            const attributeName = 'booleans';
                            const value = [];
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                            instance[attributeName] = value;
            
                            if (!arraysEqual(instance.currentState[attributeName], value))
                            throw new Error('instance.currentState' + attributeName + ' not set.');
                            
                            if (!arraysEqual(instance[attributeName], value))
                                throw new Error('instance.' + attributeName + ' not set.');
                        });

                        it('Setting a boolean list attribute to null sets the list attribute to empty array.', () => {
                            const attributeName = 'booleans';
                            const value = null;
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                            instance[attributeName] = value;
            
                            if (!arraysEqual(instance.currentState[attributeName], []))
                                throw new Error('instance.currentState' + attributeName + ' not set.');
                            
                            if (!arraysEqual(instance[attributeName], []))
                                throw new Error('instance.' + attributeName + ' not set.');
                        });

                        it('Setting a boolean list attribute to undefined sets the list attribute to empty array.', () => {
                            const attributeName = 'booleans';
                            const value = undefined;
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                            instance[attributeName] = value;
            
                            if (!arraysEqual(instance.currentState[attributeName], []))
                                throw new Error('instance.currentState' + attributeName + ' not set.');
                            
                            if (!arraysEqual(instance[attributeName], []))
                                throw new Error('instance.' + attributeName + ' not set.');
                        });
        
                    });
        
                    describe('Number List Attributes', () => {

                        it('Setting a number list attribute sets the list attribute.', () => {
                            const attributeName = 'numbers';
                            const value = [0, 14];
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                            instance[attributeName] = value;
            
                            if (!arraysEqual(instance.currentState[attributeName], value))
                            throw new Error('instance.currentState' + attributeName + ' not set.');
                            
                            if (!arraysEqual(instance[attributeName], value))
                                throw new Error('instance.' + attributeName + ' not set.');
                        });

                        it('Setting a number list attribute to empty array sets the list attribute.', () => {
                            const attributeName = 'numbers';
                            const value = [];
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                            instance[attributeName] = value;
            
                            if (!arraysEqual(instance.currentState[attributeName], value))
                            throw new Error('instance.currentState' + attributeName + ' not set.');
                            
                            if (!arraysEqual(instance[attributeName], value))
                                throw new Error('instance.' + attributeName + ' not set.');
                        });

                        it('Setting a number list attribute to null sets the list attribute to empty array.', () => {
                            const attributeName = 'numbers';
                            const value = null;
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                            instance[attributeName] = value;
            
                            if (!arraysEqual(instance.currentState[attributeName], []))
                                throw new Error('instance.currentState' + attributeName + ' not set.');
                            
                            if (!arraysEqual(instance[attributeName], []))
                                throw new Error('instance.' + attributeName + ' not set.');
                        });

                        it('Setting a number list attribute to undefined sets the list attribute to empty array.', () => {
                            const attributeName = 'numbers';
                            const value = undefined;
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                            instance[attributeName] = value;
            
                            if (!arraysEqual(instance.currentState[attributeName], []))
                                throw new Error('instance.currentState' + attributeName + ' not set.');
                            
                            if (!arraysEqual(instance[attributeName], []))
                                throw new Error('instance.' + attributeName + ' not set.');
                        });
        
                    });
        
                    describe('String List Attributes', () => {

                        it('Setting a string list attribute sets the list attribute.', () => {
                            const attributeName = 'strings';
                            const value = ['0', 'true', 'word', 'This is a senence.'];
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                            instance[attributeName] = value;
            
                            if (!arraysEqual(instance.currentState[attributeName], value))
                            throw new Error('instance.currentState' + attributeName + ' not set.');
                            
                            if (!arraysEqual(instance[attributeName], value))
                                throw new Error('instance.' + attributeName + ' not set.');
                        });

                        it('Setting a string list attribute to empty array sets the list attribute.', () => {
                            const attributeName = 'strings';
                            const value = [];
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                            instance[attributeName] = value;
            
                            if (!arraysEqual(instance.currentState[attributeName], value))
                            throw new Error('instance.currentState' + attributeName + ' not set.');
                            
                            if (!arraysEqual(instance[attributeName], value))
                                throw new Error('instance.' + attributeName + ' not set.');
                        });

                        it('Setting a string list attribute to null sets the list attribute to empty array.', () => {
                            const attributeName = 'strings';
                            const value = null;
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                            instance[attributeName] = value;
            
                            if (!arraysEqual(instance.currentState[attributeName], []))
                                throw new Error('instance.currentState' + attributeName + ' not set.');
                            
                            if (!arraysEqual(instance[attributeName], []))
                                throw new Error('instance.' + attributeName + ' not set.');
                        });

                        it('Setting a string list attribute to undefined sets the list attribute to empty array.', () => {
                            const attributeName = 'strings';
                            const value = undefined;
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                            instance[attributeName] = value;
            
                            if (!arraysEqual(instance.currentState[attributeName], []))
                                throw new Error('instance.currentState' + attributeName + ' not set.');
                            
                            if (!arraysEqual(instance[attributeName], []))
                                throw new Error('instance.' + attributeName + ' not set.');
                        });
        
                    });
        
                    describe('Date List Attributes', () => {

                        it('Setting a date list attribute sets the list attribute.', () => {
                            const attributeName = 'dates';
                            const value = [new Date(), new Date('2019-01-01')];
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                            instance[attributeName] = value;
            
                            if (!arraysEqual(instance.currentState[attributeName], value))
                            throw new Error('instance.currentState' + attributeName + ' not set.');
                            
                            if (!arraysEqual(instance[attributeName], value))
                                throw new Error('instance.' + attributeName + ' not set.');
                        });

                        it('Setting a date list attribute to empty array sets the list attribute.', () => {
                            const attributeName = 'dates';
                            const value = [];
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                            instance[attributeName] = value;
            
                            if (!arraysEqual(instance.currentState[attributeName], value))
                            throw new Error('instance.currentState' + attributeName + ' not set.');
                            
                            if (!arraysEqual(instance[attributeName], value))
                                throw new Error('instance.' + attributeName + ' not set.');

                        });

                        it('Setting a date list attribute to null sets the list attribute to empty array.', () => {
                            const attributeName = 'dates';
                            const value = null;
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                            instance[attributeName] = value;
            
                            if (!arraysEqual(instance.currentState[attributeName], []))
                                throw new Error('instance.currentState' + attributeName + ' not set.');
                            
                            if (!arraysEqual(instance[attributeName], []))
                                throw new Error('instance.' + attributeName + ' not set.');
                        });

                        it('Setting a date list attribute to undefined sets the list attribute to empty array.', () => {
                            const attributeName = 'dates';
                            const value = undefined;
                            const document = new AllAttributesAndRelationshipsClass.Model({});
                            const instance = new Instance(AllAttributesAndRelationshipsClass, document);
            
                            instance[attributeName] = value;
            
                            if (!arraysEqual(instance.currentState[attributeName], []))
                                throw new Error('instance.currentState' + attributeName + ' not set.');
                            
                            if (!arraysEqual(instance[attributeName], []))
                                throw new Error('instance.' + attributeName + ' not set.');
                        });
        
                    });

                })

            });

            describe('Setting Relationships', () => {

                describe('Singular Relationships', () => {

                    it('Setting a singular relationship to an Instance.', () => {
                        const relationshipName = 'class1';
                        const value = new Instance(CompareClass1);
                        const document = new AllAttributesAndRelationshipsClass.Model({});
                        const instance = new Instance(AllAttributesAndRelationshipsClass, document);
        
                        instance[relationshipName] = value;
        
                        if (!instance.currentState[relationshipName].equals(value))
                            throw new Error('instance.currentState' + relationshipName + ' not set.');

                        if (!instance[relationshipName].equals(value))
                            throw new Error('instance.' + relationshipName + ' not set.');
                    });

                    it('Setting a singular relationship to null.', () => {
                        const relationshipName = 'class1';
                        const value = null;
                        const document = new AllAttributesAndRelationshipsClass.Model({});
                        const instance = new Instance(AllAttributesAndRelationshipsClass, document);
        
                        instance[relationshipName] = value;
        
                        if (instance.currentState[relationshipName] !== null)
                            throw new Error('instance.currentState' + relationshipName + ' not set.');

                        if (instance[relationshipName] !== null)
                        throw new Error('instance.' + relationshipName + ' not set.');

                    });

                    it('Setting a singular relationship to undefined.', () => {
                        const relationshipName = 'class1';
                        const value = undefined;
                        const document = new AllAttributesAndRelationshipsClass.Model({});
                        const instance = new Instance(AllAttributesAndRelationshipsClass, document);
        
                        instance[relationshipName] = value;
        
                        if (instance.currentState[relationshipName] !== null)
                            throw new Error('instance.currentState' + relationshipName + ' not set.');

                        if (instance[relationshipName] !== null)
                            throw new Error('instance.' + relationshipName + ' not set.');
                    });

                });

                describe('Non-Singular Relationships', () => {

                    it('Setting a non-singular relationship to an InstanceSet.', () => {
                        const relationshipName = 'class2s';
                        const value = new InstanceSet(CompareClass2, [new Instance(CompareClass2)]);
                        const document = new AllAttributesAndRelationshipsClass.Model({});
                        const instance = new Instance(AllAttributesAndRelationshipsClass, document);
        
                        instance[relationshipName] = value;
        
                        if (!instance.currentState[relationshipName].equals(value))
                            throw new Error('instance.currentState' + relationshipName + ' not set.');

                        if (!instance[relationshipName].equals(value))
                            throw new Error('instance.' + relationshipName + ' not set.');
                    });

                    it('Setting a non-singular relationship to null.', () => {
                        const relationshipName = 'class2s';
                        const value = null;
                        const document = new AllAttributesAndRelationshipsClass.Model({});
                        const instance = new Instance(AllAttributesAndRelationshipsClass, document);
        
                        instance[relationshipName] = value;
        
                        if (!arraysEqual(instance.currentState[relationshipName], []))
                            throw new Error('instance.currentState' + relationshipName + ' not set.');

                        if (!arraysEqual(instance[relationshipName], []))
                            throw new Error('instance.' + relationshipName + ' not set.');
                    });

                    it('Setting a non-singular relationship to undefined.', () => {
                        const relationshipName = 'class2s';
                        const value = undefined;
                        const document = new AllAttributesAndRelationshipsClass.Model({});
                        const instance = new Instance(AllAttributesAndRelationshipsClass, document);
        
                        instance[relationshipName] = value;
        
                        if (!arraysEqual(instance.currentState[relationshipName], []))
                            throw new Error('instance.currentState' + relationshipName + ' not set.');

                        if (!arraysEqual(instance[relationshipName], []))
                            throw new Error('instance.' + relationshipName + ' not set.');
                    });

                });

            });


        });

        describe('Get Trap', () => {

            describe('Getting Attributes', () => {

                describe('Non-List Attributes', () => {
                    
                    it('Can get attributes of each type from an Instance.', () => {
                        const date = new Date();
                        const document = new AllAttributesAndRelationshipsClass.Model({
                            boolean: false,
                            string: '',
                            number: 0,
                            date: date,
                        });
                        const instance = new Instance(AllAttributesAndRelationshipsClass, document);

                        if (instance.boolean !== document.boolean)
                            throw new Error('instance.boolean does not equal boolean on document.');

                        if (instance.string !== document.string)
                            throw new Error('instance.string does not equal string on document.');

                        if (instance.number !== document.number)
                            throw new Error('instance.number does not equal number on document.');

                        if (instance.date !== document.date)
                            throw new Error('instance.date does not equal date on document.');
                    });
                    
                    it('Can get attributes of each type from an Instance when they are null.', () => {
                        const document = new AllAttributesAndRelationshipsClass.Model({
                            boolean: null,
                            number: null,
                            string: null,
                            date: null,
                        });
                        const instance = new Instance(AllAttributesAndRelationshipsClass, document);

                        if (instance.boolean !== null)
                            throw new Error('instance.boolean does not equal null.');

                        if (instance.string !== null)
                            throw new Error('instance.string does not equal null.');

                        if (instance.number !== null)
                            throw new Error('instance.number does not equal null.');

                        if (instance.date !== null)
                            throw new Error('instance.date does not equal null.');

                    });
                    
                    it('Can get attributes of each type from an Instance when they are not set.', () => {
                        const document = new AllAttributesAndRelationshipsClass.Model({});
                        const instance = new Instance(AllAttributesAndRelationshipsClass, document);

                        if (instance.boolean !== null)
                            throw new Error('instance.boolean does not equal null.');

                        if (instance.string !== null)
                            throw new Error('instance.string does not equal null.');

                        if (instance.number !== null)
                            throw new Error('instance.number does not equal null.');

                        if (instance.date !== null)
                            throw new Error('instance.date does not equal null.');
                    });

                });

                describe('List Attributes', () => {
                    
                    it('Can get list attributes of each type from an Instance.', () => {
                        const dates = [new Date(), new Date()]
                        const document = new AllAttributesAndRelationshipsClass.Model({
                            booleans: [false, true],
                            strings: ['', 'string'],
                            numbers: [0, 1, 2],
                            dates: dates,
                        });
                        const instance = new Instance(AllAttributesAndRelationshipsClass, document);

                        for (const item of document.booleans) 
                            if (!instance.booleans.includes(item))
                                throw new Error('instance.booleans does not equal booleans on document.');

                        for (const item of document.strings) 
                            if (!instance.strings.includes(item))
                                throw new Error('instance.strings does not equal strings on document.');

                        for (const item of document.numbers) 
                            if (!instance.numbers.includes(item))
                                throw new Error('instance.numbers does not equal numbers on document.');

                        for (const item of document.dates) 
                            if (!instance.dates.includes(item))
                                throw new Error('instance.dates does not equal dates on document.');
                    });
                    
                    it('Can get list attributes of each type from an Instance when they are null. Returns empty array.', () => {
                        const document = new AllAttributesAndRelationshipsClass.Model({
                            booleans: null,
                            strings: null,
                            numbers: null,
                            dates: null,
                        });
                        const instance = new Instance(AllAttributesAndRelationshipsClass, document);

                        if (!Array.isArray(instance.booleans) || instance.booleans.length)
                            throw new Error('instance.booleans array is not empty.');

                        if (!Array.isArray(instance.numbers) || instance.numbers.length)
                            throw new Error('instance.numbers array is not empty.');

                        if (!Array.isArray(instance.strings) || instance.booleans.strings)
                            throw new Error('instance.strings array is not empty.');

                        if (!Array.isArray(instance.dates) || instance.dates.length)
                            throw new Error('instance.dates array is not empty.');
                    });
                    
                    it('Can get attributes of each type from an Instance when they are not set. Returns empty array', () => {
                        const document = new AllAttributesAndRelationshipsClass.Model({});
                        const instance = new Instance(AllAttributesAndRelationshipsClass, document);

                        if (!Array.isArray(instance.booleans) || instance.booleans.length)
                            throw new Error('instance.booleans array is not empty.');

                        if (!Array.isArray(instance.numbers) || instance.numbers.length)
                            throw new Error('instance.numbers array is not empty.');

                        if (!Array.isArray(instance.strings) || instance.booleans.strings)
                            throw new Error('instance.strings array is not empty.');

                        if (!Array.isArray(instance.dates) || instance.dates.length)
                            throw new Error('instance.dates array is not empty.');

                    });
                    
                });

            });

            describe('Getting Relationships', () => {
                
                describe('Singular Relationships', () => {

                    it('Instance returned for singular relationship when set to an Instance.', () => {
                        const relationshipName = 'class1';
                        const value = new Instance(CompareClass1);
                        const document = new AllAttributesAndRelationshipsClass.Model({});
                        const instance = new Instance(AllAttributesAndRelationshipsClass, document);
        
                        instance[relationshipName] = value;

                        if (!instance[relationshipName].equals(value))
                            throw new Error('instance.' + relationshipName + ' did not return the instance.');
                    });

                    it('Id returned for singular relationship when set to an id but not an Instance.', () => {
                        const relationshipName = 'class1';
                        const value = new Instance(CompareClass1);
                        const document = new AllAttributesAndRelationshipsClass.Model({
                            class1: value._id,
                        });
                        const instance = new Instance(AllAttributesAndRelationshipsClass, document);

                        if (instance[relationshipName] !== value._id)
                            throw new Error('instance.' + relationshipName + ' did not return the id.');
                    });

                    it('Null returned for singular relationship when not set.', () => {
                        const relationshipName = 'class1';
                        const value = new Instance(CompareClass1);
                        const document = new AllAttributesAndRelationshipsClass.Model({});
                        const instance = new Instance(AllAttributesAndRelationshipsClass, document);

                        if (instance[relationshipName] !== null)
                            throw new Error('instance.' + relationshipName + ' did not return null.');
                    });

                });
                
                describe('Non-Singular Relationships', () => {

                    it('InstanceSet returned for non-singular relationship when set to an InstanceSet.', () => {
                        const relationshipName = 'class2s';
                        const value = new InstanceSet(CompareClass2, [new Instance(CompareClass2)]);
                        const document = new AllAttributesAndRelationshipsClass.Model({});
                        const instance = new Instance(AllAttributesAndRelationshipsClass, document);
        
                        instance[relationshipName] = value;

                        if (!instance[relationshipName].equals(value))
                            throw new Error('instance.' + relationshipName + ' did not return InstanceSet.');
                    });

                    it('Ids array returned for non-singular relationship when set to an array of ids but not an InstanceSet.', () => {
                        const relationshipName = 'class2s';
                        const value = new InstanceSet(CompareClass2, [new Instance(CompareClass2)]);
                        const document = new AllAttributesAndRelationshipsClass.Model({
                            [relationshipName]: value.map(instance => instance._id),
                        });
                        const instance = new Instance(AllAttributesAndRelationshipsClass, document);

                        if (!arraysEqual(instance[relationshipName].map(id => id.toHexString()), value.map(instance => instance.id)))
                            throw new Error('instance.' + relationshipName + ' did not return Ids array.');
                    });

                    it('Empty array returned for non-singular relationship when not set.', () => {
                        const relationshipName = 'class2s';
                        const document = new AllAttributesAndRelationshipsClass.Model({});
                        const instance = new Instance(AllAttributesAndRelationshipsClass, document);

                        if (!arraysEqual(instance[relationshipName].map(id => id), []))
                            throw new Error('instance.' + relationshipName + ' did not return empty array.');
                    });

                });

            });

        });

        describe('Has Trap', () => {

            it('Checking for attributes of the ClassModel returns true.', () => {
                const instance = new Instance(AllAttributesAndRelationshipsClass);
                const expectedProperties = ['string', 'strings', 'number', 'numbers', 'boolean', 'booleans'];
                for (const property of expectedProperties) {
                    if (!(property in instance)) {
                        throw new Error('Has did not return true for property ' + property + '.');
                    }
                }
            });

            it('Checking for relationsihps of the ClassModel returns true.', () => {
                const instance = new Instance(AllAttributesAndRelationshipsClass);
                const expectedProperties = ['class1', 'class2s'];
                for (const property of expectedProperties) {
                    if (!(property in instance)) {
                        throw new Error('Has did not return true for property ' + property + '.');
                    }
                }
            });

        });

        describe('Delete Trap', () => {

            it('Deleting an attribute sets it to null.', () => {
                const instance = new Instance(AllAttributesAndRelationshipsClass);
                instance.boolean = true;
                delete instance.boolean;

                if (instance.boolean !== null)
                    throw new Error('Attribute not set to null.');
            });

            it('Deleting a list attribute sets it to empty array.', () => {
                const instance = new Instance(AllAttributesAndRelationshipsClass);
                instance.booleans = [true, false];
                delete instance.booleans;
                
                if (!Array.isArray(instance.booleans) || instance.booleans.length !== 0)
                    throw new Error('List attribute not set to empty array.');
            });

            it('Deleting a singular relationship (set by document) sets instanceReference.instance and instanceReference._id to null.', () => {
                const document = new AllAttributesAndRelationshipsClass.Model({
                    class1: new mongoose.Types.ObjectId, 
                });
                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                delete instance.class1;
                
                if (instance['class1'] !== null)
                    throw new Error('Delete did not set the relationship to null.');

            });

            it('Deleting a singular relationship (set to instance) sets instanceReference.instance and instanceReference._id to null.', () => {
                const instance = new Instance(AllAttributesAndRelationshipsClass);
                instance.class1 = new Instance(CompareClass1);
                delete instance.class1;
                
                if (instance['class1'] !== null)
                    throw new Error('Delete did not set the relationship to null.');

            });

            it('Deleting a non-singular relationship (set by document) sets instanceSetReference.instanceSet to null and instanceSetReference._ids to empty string.', () => {
                const document = new AllAttributesAndRelationshipsClass.Model({
                    class2s: [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId], 
                });
                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                delete instance.class2s;
                
                if (!Array.isArray(instance['class2s']) || instance['class2s'].length !== 0)
                    throw new Error('Non-singular relationship did delete properly.');
            });

            it('Deleting a non-singular relationship (set to InstanceSet) sets instanceSetReference.instanceSet to null and instanceSetReference._ids to empty string.', () => {
                const instance = new Instance(AllAttributesAndRelationshipsClass);
                instance.class2s = new InstanceSet(CompareClass2, [new Instance(CompareClass2), new Instance(CompareClass2)]);
                delete instance.class2s;
                
                if (!Array.isArray(instance['class2s']) || instance['class2s'].length !== 0)
                    throw new Error('Non-singular relationship did delete properly.');
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

        it('instance.assign assigns all attributes.', () => {
            const instance = new Instance(AllAttributesAndRelationshipsClass);
            const objectToAssign = {
                string: 'String',
                strings: ['String', 'String'],
                date: new Date(),
                dates: [new Date(), new Date()],
                boolean: true,
                booleans: [true, false],
                number: 17,
                numbers: [1, 2, 3],
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

        it('instance.assign assigns singular relationships.', () => {
            const instance = new Instance(AllAttributesAndRelationshipsClass);
            const objectToAssign = {
                class1: new Instance(CompareClass1),
            }
            instance.assign(objectToAssign);

            if (instance.class1 !== objectToAssign.class1)
                throw new Error('Assign did not assign the relationship correclty.');
        });

        it('instance.assign assigns non-singular relationships.', () => {
            const instance = new Instance(AllAttributesAndRelationshipsClass);
            const objectToAssign = {
                class2s: new InstanceSet(CompareClass2, [new Instance(CompareClass2), new Instance(CompareClass2)]),
            }
            instance.assign(objectToAssign);

            if (instance.class2s !== objectToAssign.class2s)
                throw new Error('Assign did not assign the relationship correclty.');
        });

        it('instance.assign throws errors when assigning wrong attribute types.', () => {
            const instance = new Instance(AllAttributesAndRelationshipsClass);
            const objectToAssign = {
                boolean: 0,
            }
            const expectedErrorMessage = 'Illegal attempt to set a Boolean Attribute to something other than a Boolean.';
            testForError('instance.assign()', expectedErrorMessage, () => {
                instance.assign(objectToAssign);
            });
        });

        it('instance.assign throws errors when assigning an objectID to a singular relationship.', () => {
            const instance = new Instance(AllAttributesAndRelationshipsClass);
            const objectToAssign = {
                class1: new mongoose.Types.ObjectId,
            }
            const expectedErrorMessage = 'Illegal attempt to set a singular relationship to a value which is not an Instance of the correct ClassModel.';
            testForError('instance.assign()', expectedErrorMessage, () => {
                instance.assign(objectToAssign);
            });
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
                    class1: new Instance(CompareClass1),
                    class2s: new InstanceSet(CompareClass2, [new Instance(CompareClass2)]),
                });
                    
                instance.validate();
            });

            it('All fields are required. All are set from document. No error thrown.', () => {
                const document = new AllFieldsRequiredClass.Model({
                    string: 'String',
                    strings: ['String'],
                    date: new Date(),
                    boolean: true,
                    booleans: [true],
                    number: 1,
                    numbers: [1],
                    class1: new mongoose.Types.ObjectId,
                    class2s: [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId],
                });
                const instance = new Instance(AllFieldsRequiredClass, document);
                    
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
                    class1: new Instance(CompareClass1),
                    class2s: new InstanceSet(CompareClass2, [new Instance(CompareClass2)]),
                });

                testForError('instance.validate()', expectedErrorMessage, () => {
                    instance.validate();
                });

            });

            it('All fields are required. String is set to empty string. No error thrown.', () => {
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
                    class1: new Instance(CompareClass1),
                    class2s: new InstanceSet(CompareClass2, [new Instance(CompareClass2)]),
                });

                instance.validate();
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
                    class1: new Instance(CompareClass1),
                    class2s: new InstanceSet(CompareClass2, [new Instance(CompareClass2)]),
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
                    class1: new Instance(CompareClass1),
                    class2s: new InstanceSet(CompareClass2, [new Instance(CompareClass2)]),
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
                    class1: new Instance(CompareClass1),
                    class2s: new InstanceSet(CompareClass2, [new Instance(CompareClass2)]),
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
                    class1: new Instance(CompareClass1),
                    class2s: new InstanceSet(CompareClass2, [new Instance(CompareClass2)]),
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
                    class1: new Instance(CompareClass1),
                    class2s: new InstanceSet(CompareClass2, [new Instance(CompareClass2)]),
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
                    class1: new Instance(CompareClass1),
                    class2s: new InstanceSet(CompareClass2, [new Instance(CompareClass2)]),
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
                    class1: new Instance(CompareClass1),
                    class2s: new InstanceSet(CompareClass2, [new Instance(CompareClass2)]),
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
                    class1: new Instance(CompareClass1),
                    class2s: new InstanceSet(CompareClass2, [new Instance(CompareClass2)]),
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
                    class1: new Instance(CompareClass1),
                    class2s: new InstanceSet(CompareClass2, [new Instance(CompareClass2)]),
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
                    class2s: new InstanceSet(CompareClass2, [new Instance(CompareClass2)]),
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
                    class1: new Instance(CompareClass1),
                });

                testForError('instance.validate()', expectedErrorMessage, () => {
                    instance.validate();
                });

            });

            it('All fields are required. All but class2s are set. Class2s set to empty instance set. Error thrown.', () => {
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
                    class1: new Instance(CompareClass1),
                    class2: new InstanceSet(CompareClass2),
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
                
            it('Multiple fields (one of each type) share a required group boolean is set to false. No error thrown.', () => {
                const instance = new Instance(AllFieldsInRequiredGroupClass);
                instance.boolean = false;
                instance.validate();
            });
                
            it('Multiple fields (one of each type) share a required group string is set to "". No error thrown.', () => {
                const instance = new Instance(AllFieldsInRequiredGroupClass);
                instance.string = '';
                instance.validate();
            });
                
            it('Multiple fields (one of each type) share a required group class2s is set to empty instance set. Error thrown.', () => {
                const expectedErrorMessage = 'Required Group violations found for requirement group(s):  a';
                const instance = new Instance(AllFieldsInRequiredGroupClass);
                instance.class2s = new InstanceSet(CompareClass2);
    
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
                instance.class1 = new Instance(CompareClass1);

                instance.validate();
            });
            
            it('Multiple fields (one of each type) share a required group and class2s is set. No error thrown.', () => {
                const instance = new Instance(AllFieldsInRequiredGroupClass);
                instance.class2s = new InstanceSet(CompareClass2, [new Instance(CompareClass2)]);

                instance.validate();
            });
            
        });

        describe('Mutex Validation', () => {
            
            it('2 attributes (boolean, date) have a mutex and both are set. Error thrown.', () => {
                const expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field boolean with mutex \'a\'. Field date with mutex \'a\'.';
                const expectedErrorRegex = /^Mutex violations found for instance .* Field boolean with mutex \'a\'. Field date with mutex \'a\'.$/;
                const instance = new Instance(MutexClassA);
                instance.boolean = true;
                instance.date = new Date();

                testForErrorRegex('instance.validate()', expectedErrorMessage, expectedErrorRegex, () => {
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
                const expectedErrorRegex = /^Mutex violations found for instance .* Field class1 with mutex \'a\'. Field class2 with mutex \'a\'.$/;
                const instance = new Instance(MutexClassB);

                instance.class1 = new Instance(CompareClass1);
                instance.class2 = new Instance(CompareClass2);

                testForErrorRegex('instance.validate()', expectedErrorMessage, expectedErrorRegex, () => {
                    instance.validate();
                });
            });
            
            it('2 singular relationship fields have a mutex and one is set. No error thrown.', () => {
                const instance = new Instance(MutexClassB);
                instance.class1 = new Instance(CompareClass1);

                instance.validate();
            });
            
            it('2 non-singular relationship fields have a mutex and both are set. Error thrown.', () => {
                const expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field class1s with mutex \'a\'. Field class2s with mutex \'a\'.';
                const expectedErrorRegex = /^Mutex violations found for instance .* Field class1s with mutex \'a\'. Field class2s with mutex \'a\'.$/;
                const instance = new Instance(MutexClassC);

                instance.class1s = new InstanceSet(CompareClass1, [new Instance(CompareClass1), new Instance(CompareClass1)]);
                instance.class2s = new InstanceSet(CompareClass2, [new Instance(CompareClass2), new Instance(CompareClass2)]);

                testForErrorRegex('instance.validate()', expectedErrorMessage, expectedErrorRegex, () => {
                    instance.validate();
                });
            });
            
            it('2 non-singular relationship fields have a mutex and one is set. No error thrown.', () => {
                const instance = new Instance(MutexClassC);
                instance.class1s = new InstanceSet(CompareClass1, [new Instance(CompareClass1), new Instance(CompareClass1)]);

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
            
            it('Multiple fields (one of each type) have a mutex and number is set to 0. Error thrown.', () => {
                const instance = new Instance(AllFieldsMutexClass);
                instance.number = 0;
                instance.validate();
            });
            
            it('Multiple fields (one of each type) have a mutex and number is set to 1. No error thrown.', () => {
                const instance = new Instance(AllFieldsMutexClass);
                instance.number = 1;

                instance.validate();
            });
            
            it('Multiple fields (one of each type) have a mutex and numbers is set to empty array. Error thrown.', () => {
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
                instance.class1 = new Instance(CompareClass1);

                instance.validate();
            });
            
            it('Multiple fields (one of each type) have a mutex and class2s are set to a single instance. No error thrown.', () => {
                const instance = new Instance(AllFieldsMutexClass);
                instance.class2s = new InstanceSet(CompareClass2, [new Instance(CompareClass2)]);

                instance.validate();
            });
            
            it('Multiple fields (one of each type) have a mutex and class2s are set to multiple instances. No error thrown.', () => {
                const instance = new Instance(AllFieldsMutexClass);
                instance.class2s = new InstanceSet(CompareClass2, [new Instance(CompareClass2), new Instance(CompareClass2)]);

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

                instance.validate();
            });
            
            it('Multiple fields (one of each type) have a mutex and number is set to 0 and numbers are set to an array of 0s. Error thrown.', () => {
                const expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field number with mutex \'a\'. Field numbers with mutex \'a\'.';
                const expectedErrorRegex = /^Mutex violations found for instance .* Field number with mutex \'a\'. Field numbers with mutex \'a\'.$/;
                const instance = new Instance(AllFieldsMutexClass);
                instance.number = 0;
                instance.numbers = [0, 0, 0];

                testForErrorRegex('instance.validate()', expectedErrorMessage, expectedErrorRegex, () => {
                    instance.validate();
                });
            });
                
            it('Multiple fields (one of each type) have a mutex and number is set to 1 and booleans is set to [false]. Error thrown.', () => {
                const expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field booleans with mutex \'a\'. Field number with mutex \'a\'.';
                const expectedErrorRegex = /^Mutex violations found for instance .* Field booleans with mutex \'a\'. Field number with mutex \'a\'.$/;
                const instance = new Instance(AllFieldsMutexClass);
                instance.number = 1;
                instance.booleans = [false];

                testForErrorRegex('instance.validate()', expectedErrorMessage, expectedErrorRegex, () => {
                    instance.validate();
                });
            });
                
            it('Multiple fields (one of each type) have a mutex and number is set to 1 and strings is set to [\"\"]. Error thrown.', () => {
                const expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field strings with mutex \'a\'. Field number with mutex \'a\'.';
                const expectedErrorRegex = /^Mutex violations found for instance .* Field strings with mutex \'a\'. Field number with mutex \'a\'.$/;
                const instance = new Instance(AllFieldsMutexClass);
                instance.number = 1;
                instance.strings = [''];

                testForErrorRegex('instance.validate()', expectedErrorMessage, expectedErrorRegex, () => {
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
                class1: new Instance(CompareClass1),
                class2s: new InstanceSet(CompareClass2, [new Instance(CompareClass2)]),
            });
            await instance.save();
            const found = await AllFieldsRequiredClass.findById(instance._id);

            if (!found) 
                throw new Error('instance.save() did not throw an error, but was not saved.');

            if (instance.id !== found.id)
                throw new Error('instance.save() did not throw an error, but the instance found is different than the instance saved.');

            if (!instance.saved()) 
                throw new Error('instance.save() did not set the saved property to true.');

            if (!found.equals(instance))
                throw new Error('instance.save() did not save all the properties of the instance.');
            
            if (!instance.currentState.equals(instance.previousState))
                throw new Error('instance.previousState was not updated to match current state.');
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
                class1: new Instance(CompareClass1),
                class2s: new InstanceSet(CompareClass2, [new Instance(CompareClass2)]),
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
                class1: new Instance(CompareClass1),
                class2s: new InstanceSet(CompareClass2, [new Instance(CompareClass2)]),
            });

            await instance.save();
            await instance.delete();

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
                class1: new Instance(CompareClass1),
                class2s: new InstanceSet(CompareClass2, [new Instance(CompareClass2)]),
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
                class1: new Instance(CompareClass1),
                class2s: new InstanceSet(CompareClass2, [new Instance(CompareClass2)]),
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
    
            instanceOfSingularRelationshipClassA.singularRelationship = instanceOfNonSingularRelationshipClass;
            instanceOfSingularRelationshipClassA.boolean = true;
            instanceOfSingularRelationshipClassB.singularRelationship = instanceOfNonSingularRelationshipClass;
            instanceOfSingularRelationshipClassB.boolean = false;
            instanceOfNonSingularRelationshipClass.nonSingularRelationship = new InstanceSet(SingularRelationshipClass, [instanceOfSingularRelationshipClassA, instanceOfSingularRelationshipClassB]);
    
            instanceOfSubClassOfSingularRelationshipClassA.singularRelationship = instanceOfSubClassOfNonSingularRelationshipClass;
            instanceOfSubClassOfSingularRelationshipClassA.boolean = true;
            instanceOfSubClassOfSingularRelationshipClassB.singularRelationship = instanceOfSubClassOfNonSingularRelationshipClass;
            instanceOfSubClassOfSingularRelationshipClassB.boolean = false;
            instanceOfSubClassOfNonSingularRelationshipClass.nonSingularRelationship = new InstanceSet(SubClassOfSingularRelationshipClass, [instanceOfSubClassOfSingularRelationshipClassA, instanceOfSubClassOfSingularRelationshipClassB]);

            var documentOfSingularRelationshipClassA = new SingularRelationshipClass.Model({
                singularRelationship: instanceOfNonSingularRelationshipClass._id,
                boolean: true
            });
            var documentOfSingularRelationshipClassB = new SingularRelationshipClass.Model({
                singularRelationship: instanceOfNonSingularRelationshipClass._id,
                boolean: false
            });
            var documentOfNonSingularRelationshipClass = new NonSingularRelationshipClass.Model({
                nonSingularRelationship: [instanceOfSingularRelationshipClassA._id, instanceOfSingularRelationshipClassB._id],
            });
            var documentOfSubClassOfSingularRelationshipClassA = new SubClassOfSingularRelationshipClass.Model({
                singularRelationship: instanceOfSubClassOfNonSingularRelationshipClass._id,
                boolean: true
            });
            var documentOfSubClassOfSingularRelationshipClassB = new SubClassOfSingularRelationshipClass.Model({
                singularRelationship: instanceOfSubClassOfNonSingularRelationshipClass._id,
                boolean: false
            });
            var documentOfSubClassOfNonSingularRelationshipClass = new SubClassOfNonSingularRelationshipClass.Model({
                nonSingularRelationship: [instanceOfSubClassOfSingularRelationshipClassA._id, instanceOfSubClassOfSingularRelationshipClassB._id],
            });
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
                const expectedErrorMessage = 'instance.walk() called with insufficient arguments. Should be walk(relationshipName, <optional>filter).';
                
                await testForErrorAsync('instnace.walk()', expectedErrorMessage, async() => {
                    return instance.walk(null);
                })
            });

            it('instance.walk() throws an error when relationship is undefined.', async () => {
                const instance = new Instance(SingularRelationshipClass);
                const expectedErrorMessage = 'instance.walk() called with insufficient arguments. Should be walk(relationshipName, <optional>filter).';
                
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

            describe('Relationships already set to Instance or InstanceSet.', () => {

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

            describe('Walking Relationships which are set only to Id(s).', () => {

                it('Walking a singular relationship.', async () => {
                    const expectedInstance = instanceOfNonSingularRelationshipClass;
                    const instance = new Instance(SingularRelationshipClass, documentOfSingularRelationshipClassA);
                    const foundInstance = await instance.walk('singularRelationship');
    
                    if (!foundInstance)
                        throw new Error('walk() did not return anything.');
    
                    if (!expectedInstance.equals(foundInstance))
                        throw new Error('walk() did not return the correct instance.');

                    if (instance['singularRelationship'] !== foundInstance)
                        throw new Error('walk() did not set the relationship on the original instance.');
                });
    
                it('Walking a nonsingular relationship.', async () => {
                    const expectedInstanceSet = new InstanceSet(SingularRelationshipClass, [
                        instanceOfSingularRelationshipClassA,
                        instanceOfSingularRelationshipClassB
                    ]);
                    const instance = new Instance(NonSingularRelationshipClass, documentOfNonSingularRelationshipClass);
                    const foundInstanceSet = await instance.walk('nonSingularRelationship');
    
                    if (!expectedInstanceSet.equals(foundInstanceSet))
                        throw new Error('walk() did not return the correct instances.');

                    if (instance['nonSingularRelationship'] !== foundInstanceSet)
                        throw new Error('walk() did not set the relationship on the original instance.');
                });
    
                it('Walking a singular relationship by calling walk() from the super class.', async () => {
                    const expectedInstance = instanceOfSubClassOfNonSingularRelationshipClass;
                    const instance = new Instance(SubClassOfSingularRelationshipClass, documentOfSubClassOfSingularRelationshipClassA);
                    const foundInstance = await instance.walk('singularRelationship');
    
                    if (!foundInstance)
                        throw new Error('walk() did not return anything.');
    
                    if (!expectedInstance.equals(foundInstance))
                        throw new Error('walk() did not return the correct instance.');

                        if (instance['singularRelationship'] !== foundInstance)
                            throw new Error('walk() did not set the relationship on the original instance.');
                });
    
                it('Walking a nonsingular relationship by calling walk() from the super class.', async () => {
                    const expectedInstanceSet = new InstanceSet(SingularRelationshipClass, [
                        instanceOfSubClassOfSingularRelationshipClassA,
                        instanceOfSubClassOfSingularRelationshipClassB
                    ]);
                    const instance = new Instance(SubClassOfNonSingularRelationshipClass, documentOfSubClassOfNonSingularRelationshipClass);
                    const foundInstanceSet = await instance.walk('nonSingularRelationship');
    
                    if (!expectedInstanceSet.equals(foundInstanceSet))
                        throw new Error('walk() did not return the correct instances.');

                    if (instance['nonSingularRelationship'] !== foundInstanceSet)
                        throw new Error('walk() did not set the relationship on the original instance.');
                });
    
                it('Walking a nonsingular relationship by calling walk() from the super class with a filter.', async () => {
                    const expectedInstanceSet = new InstanceSet(SingularRelationshipClass, [
                        instanceOfSubClassOfSingularRelationshipClassA,
                    ]);
                    const instance = new Instance(SubClassOfNonSingularRelationshipClass, documentOfSubClassOfNonSingularRelationshipClass);
                    const filter = { boolean: true };
    
                    const foundInstanceSet = await instanceOfSubClassOfNonSingularRelationshipClass.walk('nonSingularRelationship', filter);
    
                    if (!expectedInstanceSet.equals(foundInstanceSet))
                        throw new Error('walk() did not return the correct instances.');

                    if (instance['nonSingularRelationship'] === foundInstanceSet)
                        throw new Error('walk() did set the relationship on the original instance.');
                });

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