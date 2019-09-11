
require("@babel/polyfill");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const database = require('../dist/models/database');
const ClassModel = require('../dist/models/ClassModel');
const Instance = require('../dist/models/Instance');
const InstanceSet = require('../dist/models/InstanceSet');
const TestClassModels = require('./TestClassModels');
const TestingFunctions = require('./TestingFunctions');
const testForError = TestingFunctions.testForError;
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
    var AbstractClass = TestClassModels.AbstractClass;    var SuperClass = TestClassModels.SuperClass;

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
}

describe('InstanceSet Tests', () => {

    before(async () => {
        await database.connect();
    });

    after(() => {
        database.close();
    });

    describe('InstanceSet Constructor Tests', () => {

        describe('InstanceSet Constructor Validations', () => {
        
            it('Constructor throws an error first argument is not a ClassModel.', () => {
                const expectedErrorMessage = 'InstanceSet.constructor() first argument must be an instance of ClassModel.'
                testForError('new InstanceSet()', expectedErrorMessage, () => {
                    const instanceSet = new InstanceSet(1);
                });
            });
            
            it('Constructor throws an error if instances argument is not iterable.', () => {
                const expectedErrorMessage = 'instances argument must be iterable.';
                const instances = 1;
                testForError('new InstanceSet()', expectedErrorMessage, () => {
                    const instanceSet = new InstanceSet(TestClassWithNumber, instances);
                });
            });
            
            it('Constructor throws an error if instances argument is not an iterable of instances.', () => {
                const expectedErrorMessage = 'Illegal attempt to add something other than Instances to an InstanceSet.'
                const instances = ['1', 2];
                testForError('new InstanceSet()', expectedErrorMessage, () => {
                    const instanceSet = new InstanceSet(TestClassWithNumber, instances);
                });
            });
            
            it('Constructor throws an error any instance is not an instance of the given ClassModel.', () => {
                const expectedErrorMessage = 'Illegal attempt to add instances of a different class to an InstanceSet.'
                const instance1 = new Instance(TestClassWithNumber);
                const instance2 = new Instance(TestClassWithBoolean);
                const instances = [instance1, instance2];
                testForError('new InstanceSet()', expectedErrorMessage, () => {
                    const instanceSet = new InstanceSet(TestClassWithNumber, instances);
                });
            });

        });

        describe('InstanceSet Constructor Creates an InstanceSet', () => {

            it('new InstanceSet() works on direct instances of the ClassModel', () => {
                const instance1 = new Instance(TestClassWithNumber);
                const instance2 = new Instance(TestClassWithNumber);
                const instances = [instance1, instance2];
                const instanceSet = new InstanceSet(TestClassWithNumber, instances);
            });

            it('new InstanceSet() works on with instances of a subclass of the ClassModel', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfDiscriminatedSubClassOfSuperClass);
                const instances = [instance1, instance2];
                const instanceSet = new InstanceSet(SuperClass, instances);
            });

            it('new InstanceSet() is created an has the given instances.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfDiscriminatedSubClassOfSuperClass);
                const instances = [instance1, instance2];
                const instanceSet = new InstanceSet(SuperClass, instances);

                if (!instanceSet.has(instance1) || !instanceSet.has(instance2) || !instanceSet.size == 2)
                    throw new Error('InstanceSet was created, but it does not contain the instances.');
            });

        });

    });

});