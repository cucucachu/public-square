require("@babel/polyfill");

const InstanceState = require('../../dist/noomman/InstanceState');
const TestClassModels = require('./helpers/TestClassModels');
const TestingFunctions = require('./helpers/TestingFunctions');
const testForError = TestingFunctions.testForError;
const testForErrorMutex = TestingFunctions.testForErrorMutex;
const testForErrorAsync = TestingFunctions.testForErrorAsync;

var AllFieldsRequiredClass = TestClassModels.AllFieldsRequiredClass;

describe('Instance State Tests', () => {

    describe('InstanceState.constructor() Tests', () => {

        it('Constructor throws an error if not given a ClassModel.', () => {
            const expectedErrorMessage = 'new InstanceState(): First argument \'classModel\' is required.';
            testForError('new InstanceState()', expectedErrorMessage, () => {
                new InstanceState();
            });
        });

        describe('InstanceState.contructor() Called With a ClassModel Only', () => {
            
            it('Constructor works when called with a ClassModel and no document.', () => {
                const instanceState = new InstanceState(AllFieldsRequiredClass);
            });
    
            it('Constructor works when called with a ClassModel and no document. Attributes set correctly.', () => {
                const instanceState = new InstanceState(AllFieldsRequiredClass);
                const attributes = instanceState.attributes;
                const expectedAttributes = ['string', 'strings', 'date', 'boolean', 'booleans', 'number', 'numbers'];
                const expectedListAttributes = ['strings', 'booleans', 'numbers'];
    
                if (Object.keys(attributes).length != expectedAttributes.length)
                    throw new Error('instanceState.attributes returned the wrong number of attributes.');
    
                for (const attribute of expectedAttributes) {
                    if (!attribute in attributes) 
                        throw new Error('instanceState.attributes is missing ' + attribute);
                    if (expectedListAttributes.includes(attribute)) {
                        if (!Array.isArray(attributes[attribute]) || attributes[attribute].lenth)
                            throw new Error('attribute ' + attribute + ' should be set to [], but isn\'t.');
                    }
                    else {
                        if (attributes[attribute] != null)
                            throw new Error('attribute ' + attribute + ' should be set to null, but isn\'t.');

                    }
                }
            });
    
            it('Constructor works when called with a ClassModel and no document. InstanceReferences set correclty.', () => {
                const instanceState = new InstanceState(AllFieldsRequiredClass);
                const instanceReferences = instanceState.instanceReferences;
                const expectedSingularRelationships = ['class1'];
    
                for (const relationship of expectedSingularRelationships) {
                    if (!relationship in instanceReferences) 
                        throw new Error('instanceState.instanceReferences is missing ' + relationship);
                    if (instanceReferences[relationship].instance != null)
                        throw new Error('instanceReference ' + relationship + '.instance should be set to null, but isn\'t.');
                    if (instanceReferences[relationship].id != null)
                        throw new Error('instanceReference ' + relationship + '.id should be set to null, but isn\'t.');
                }
            });
    
            it('Constructor works when called with a ClassModel and no document. InstanceSetReferences set correctly.', () => {
                const instanceState = new InstanceState(AllFieldsRequiredClass);
                const instanceSetReferences = instanceState.instanceSetReferences;
                const expectedNonSingularRelationships = ['class2s'];
    
                for (const relationship of expectedNonSingularRelationships) {
                    if (!relationship in instanceSetReferences) 
                        throw new Error('instanceState.instanceSetReferences is missing ' + relationship);
                    if (instanceSetReferences[relationship].instanceSet != null)
                        throw new Error('instanceSetReference ' + relationship + '.instance should be set to null, but isn\'t.');
                    if (instanceSetReferences[relationship].ids.length != 0)
                        throw new Error('instanceSetReference ' + relationship + '.ids should be set to empty array, but isn\'t.');
                }
            });
           
        });

        describe('InstanceState.contructor() Called With a ClassModel and a Document', () => {

            const exampleDocument = {
                string: 'string', 
                strings: ['red', 'blue'],
                date: new Date(),
                boolean: true,
                booleans: [false, true],
                number: 17,
                numbers: [1, 2],
                class1: 'asdf1234fda4321',
                class2s: ['asdf1234fda4321', 'fdas0987asdf7890']
            };
            
            it('Constructor does not throw an error when called with a ClassModel a Document.', () => {
                new InstanceState(AllFieldsRequiredClass, exampleDocument);
            });
    
            it('Constructor works when called with a ClassModel and a document. Attributes set correctly.', () => {
                const instanceState = new InstanceState(AllFieldsRequiredClass, exampleDocument);
                const attributes = instanceState.attributes;
                const expectedAttributes = ['string', 'strings', 'date', 'boolean', 'booleans', 'number', 'numbers'];
    
                for (const attribute in exampleDocument) {
                    if (expectedAttributes.includes(attribute) && attributes[attribute] !== exampleDocument[attribute])
                        throw new Error('Attributes were not set correctly.');
                }
            });
    
            it('Constructor works when called with a ClassModel and a document. InstanceReferences set correclty.', () => {
                const instanceState = new InstanceState(AllFieldsRequiredClass, exampleDocument);
                const instanceReferences = instanceState.instanceReferences;
    
                if (instanceReferences['class1'].id !== exampleDocument.class1)
                    throw new Error('Singular relationship was not set correctly.');
            });
    
            it('Constructor works when called with a ClassModel and a document. InstanceSetReferences set correctly.', () => {
                const instanceState = new InstanceState(AllFieldsRequiredClass, exampleDocument);
                const instanceSetReferences = instanceState.instanceSetReferences;
    
                if (!Array.isArray(instanceSetReferences['class2s'].ids) 
                    || instanceSetReferences['class2s'].ids[0] != exampleDocument['class2s'][0]
                    || instanceSetReferences['class2s'].ids[1] != exampleDocument['class2s'][1])
                    throw new Error('Noningular relationship was not set correctly.');
                
            });

            it('If an singular attribute is undefined on the given document, then it is set to null.', () => {
                const exampleDocument = {
                    strings: ['red', 'blue'],
                    date: new Date(),
                    boolean: true,
                    booleans: [false, true],
                    number: 17,
                    numbers: [1, 2],
                    class1: 'asdf1234fda4321',
                    class2s: ['asdf1234fda4321', 'fdas0987asdf7890']
                };
                const instanceState = new InstanceState(AllFieldsRequiredClass, exampleDocument);

                if (instanceState.attributes['string'] === undefined || instanceState.attributes['string'] !== null)
                    throw new Error('The \'string\' attribute should be set to null, but isn\'t.');
                

            });

            it('If an singular boolean attribute is set to false on the given document, then it is set to false on the InstanceState.', () => {
                const exampleDocument = {
                    string: 'string',
                    strings: ['red', 'blue'],
                    date: new Date(),
                    boolean: false,
                    booleans: [false, true],
                    number: 17,
                    numbers: [1, 2],
                    class1: 'asdf1234fda4321',
                    class2s: ['asdf1234fda4321', 'fdas0987asdf7890']
                };
                const instanceState = new InstanceState(AllFieldsRequiredClass, exampleDocument);

                if (instanceState.attributes['boolean'] === undefined || instanceState.attributes['boolean'] === null || instanceState.attributes['boolean'] !== false)
                    throw new Error('The \'boolean\' attribute should be set to false, but isn\'t.');
            });

            it('If an singular number attribute is set to 0 on the given document, then it is set to 0 on the InstanceState.', () => {
                const exampleDocument = {
                    string: 'string',
                    strings: ['red', 'blue'],
                    date: new Date(),
                    boolean: true,
                    booleans: [false, true],
                    number: 0,
                    numbers: [1, 2],
                    class1: 'asdf1234fda4321',
                    class2s: ['asdf1234fda4321', 'fdas0987asdf7890']
                };
                const instanceState = new InstanceState(AllFieldsRequiredClass, exampleDocument);

                if (instanceState.attributes['number'] === undefined || instanceState.attributes['number'] === null || instanceState.attributes['number'] !== 0)
                    throw new Error('The \'number\' attribute should be set to 0, but isn\'t.');
            });

            it('If an singular string attribute is set to empty string on the given document, then it is set to empty string on the InstanceState.', () => {
                const exampleDocument = {
                    string: '',
                    strings: ['red', 'blue'],
                    date: new Date(),
                    boolean: true,
                    booleans: [false, true],
                    number: 0,
                    numbers: [1, 2],
                    class1: 'asdf1234fda4321',
                    class2s: ['asdf1234fda4321', 'fdas0987asdf7890']
                };
                const instanceState = new InstanceState(AllFieldsRequiredClass, exampleDocument);

                if (instanceState.attributes['string'] === undefined || instanceState.attributes['string'] === null || instanceState.attributes['string'] !== '')
                    throw new Error('The \'string\' attribute should be set to "", but isn\'t.');
            });

            it('If a singular relationship is undefined on the document, then it is set to an InstanceReference with a null id.', () => {
                const exampleDocument = {
                    string: 'string',
                    strings: ['red', 'blue'],
                    date: new Date(),
                    boolean: true,
                    booleans: [false, true],
                    number: 0,
                    numbers: [1, 2],
                    class2s: ['asdf1234fda4321', 'fdas0987asdf7890']
                };
                const instanceState = new InstanceState(AllFieldsRequiredClass, exampleDocument);

                if (instanceState.instanceReferences['class1'] === undefined || !instanceState.instanceReferences['class1'].isEmpty())
                    throw new Error('The \'class1\' Instance Reference should be set to an empty Isntance Reference, but isn\'t.');
            });

            it('if a non-singular relationships is undefined on the document, then it is set to an InstanceSetReference with an empty ids array.', () => {
                const exampleDocument = {
                    string: 'string',
                    strings: ['red', 'blue'],
                    date: new Date(),
                    boolean: true,
                    booleans: [false, true],
                    number: 0,
                    numbers: [1, 2],
                    class1: 'asdf1234fda4321',
                };
                const instanceState = new InstanceState(AllFieldsRequiredClass, exampleDocument);

                if (instanceState.instanceSetReferences['class2s'] === undefined || !instanceState.instanceSetReferences['class2s'].isEmpty())
                    throw new Error('The \'class2s\' Instance Reference should be set to an empty IsntanceSetReference, but isn\'t.');

            });
           
        });

    });

});