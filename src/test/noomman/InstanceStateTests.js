require("@babel/polyfill");
const mongoose = require('mongoose');

const InstanceState = require('../../dist/noomman/InstanceState');
const Instance = require('../../dist/noomman/Instance');
const InstanceSet = require('../../dist/noomman/InstanceSet');
const TestClassModels = require('./helpers/TestClassModels');
const TestingFunctions = require('./helpers/TestingFunctions');
const testForError = TestingFunctions.testForError;
const arraysEqual = TestingFunctions.arraysEqual;
const objectsEqual = TestingFunctions.objectsEqual;

var AllAttributesAndRelationshipsClass = TestClassModels.AllAttributesAndRelationshipsClass;
var CompareClass1 = TestClassModels.CompareClass1;
var CompareClass2 = TestClassModels.CompareClass2;

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
                const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
            });
    
            it('Constructor works when called with a ClassModel and no document. Attributes set correctly.', () => {
                const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
                const attributes = instanceState.attributes;
                const expectedAttributes = ['string', 'strings', 'date', 'dates', 'boolean', 'booleans', 'number', 'numbers'];
                const expectedListAttributes = ['strings', 'dates', 'booleans', 'numbers'];
    
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
                const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
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
                const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
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
                dates: [new Date(), new Date()],
                boolean: true,
                booleans: [false, true],
                number: 17,
                numbers: [1, 2],
                class1: new mongoose.Types.ObjectId,
                class2s: [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId]
            };
            
            it('Constructor does not throw an error when called with a ClassModel a Document.', () => {
                new InstanceState(AllAttributesAndRelationshipsClass, exampleDocument);
            });
    
            it('Constructor works when called with a ClassModel and a document. Attributes set correctly.', () => {
                const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, exampleDocument);
                const attributes = instanceState.attributes;
                const expectedAttributes = ['string', 'strings', 'date', 'boolean', 'booleans', 'number', 'numbers'];
    
                for (const attribute in exampleDocument) {
                    if (expectedAttributes.includes(attribute) && attributes[attribute] !== exampleDocument[attribute])
                        throw new Error('Attributes were not set correctly.');
                }
            });
    
            it('Constructor works when called with a ClassModel and a document. InstanceReferences set correclty.', () => {
                const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, exampleDocument);
                const instanceReferences = instanceState.instanceReferences;
    
                if (instanceReferences['class1'].id !== exampleDocument.class1.toHexString())
                    throw new Error('Singular relationship was not set correctly.');
            });
    
            it('Constructor works when called with a ClassModel and a document. InstanceSetReferences set correctly.', () => {
                const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, exampleDocument);
                const instanceSetReferences = instanceState.instanceSetReferences;
    
                if (!Array.isArray(instanceSetReferences['class2s'].ids) 
                    || instanceSetReferences['class2s'].ids[0] != exampleDocument['class2s'][0].toHexString()
                    || instanceSetReferences['class2s'].ids[1] != exampleDocument['class2s'][1].toHexString())
                    throw new Error('Noningular relationship was not set correctly.');
                
            });

            it('If an singular attribute is undefined on the given document, then it is set to null.', () => {
                const exampleDocument = {
                    strings: ['red', 'blue'],
                    date: new Date(),
                    dates: [new Date(), new Date()],
                    boolean: true,
                    booleans: [false, true],
                    number: 17,
                    numbers: [1, 2],
                    class1: new mongoose.Types.ObjectId,
                    class2s: [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId]
                };
                const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, exampleDocument);

                if (instanceState.attributes['string'] === undefined || instanceState.attributes['string'] !== null)
                    throw new Error('The \'string\' attribute should be set to null, but isn\'t.');
            });

            it('If an list attribute is undefined on the given document, then it is set to an empty array.', () => {
                const exampleDocument = {
                    string: 'string',
                    date: new Date(),
                    dates: [new Date(), new Date()],
                    boolean: true,
                    booleans: [false, true],
                    number: 17,
                    numbers: [1, 2],
                    class1: new mongoose.Types.ObjectId,
                    class2s: [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId]
                };
                const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, exampleDocument);

                if (!arraysEqual(instanceState.attributes['strings'], []))
                    throw new Error('The \'strings\' attribute should be set to [], but isn\'t.');
            });

            it('If an singular boolean attribute is set to false on the given document, then it is set to false on the InstanceState.', () => {
                const exampleDocument = {
                    string: 'string',
                    strings: ['red', 'blue'],
                    date: new Date(),
                    dates: [new Date(), new Date()],
                    boolean: false,
                    booleans: [false, true],
                    number: 17,
                    numbers: [1, 2],
                    class1: new mongoose.Types.ObjectId,
                    class2s: [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId]
                };
                const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, exampleDocument);

                if (instanceState.attributes['boolean'] === undefined || instanceState.attributes['boolean'] === null || instanceState.attributes['boolean'] !== false)
                    throw new Error('The \'boolean\' attribute should be set to false, but isn\'t.');
            });

            it('If an singular number attribute is set to 0 on the given document, then it is set to 0 on the InstanceState.', () => {
                const exampleDocument = {
                    string: 'string',
                    strings: ['red', 'blue'],
                    date: new Date(),
                    dates: [new Date(), new Date()],
                    boolean: true,
                    booleans: [false, true],
                    number: 0,
                    numbers: [1, 2],
                    class1: new mongoose.Types.ObjectId,
                    class2s: [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId]
                };
                const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, exampleDocument);

                if (instanceState.attributes['number'] === undefined || instanceState.attributes['number'] === null || instanceState.attributes['number'] !== 0)
                    throw new Error('The \'number\' attribute should be set to 0, but isn\'t.');
            });

            it('If an singular string attribute is set to empty string on the given document, then it is set to empty string on the InstanceState.', () => {
                const exampleDocument = {
                    string: '',
                    strings: ['red', 'blue'],
                    date: new Date(),
                    dates: [new Date(), new Date()],
                    boolean: true,
                    booleans: [false, true],
                    number: 0,
                    numbers: [1, 2],
                    class1: new mongoose.Types.ObjectId,
                    class2s: [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId]
                };
                const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, exampleDocument);

                if (instanceState.attributes['string'] === undefined || instanceState.attributes['string'] === null || instanceState.attributes['string'] !== '')
                    throw new Error('The \'string\' attribute should be set to "", but isn\'t.');
            });

            it('If a singular relationship is undefined on the document, then it is set to an InstanceReference with a null id.', () => {
                const exampleDocument = {
                    string: 'string',
                    strings: ['red', 'blue'],
                    date: new Date(),
                    dates: [new Date(), new Date()],
                    boolean: true,
                    booleans: [false, true],
                    number: 0,
                    numbers: [1, 2],
                    class2s: [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId]
                };
                const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, exampleDocument);

                if (instanceState.instanceReferences['class1'] === undefined || !instanceState.instanceReferences['class1'].isEmpty())
                    throw new Error('The \'class1\' Instance Reference should be set to an empty Isntance Reference, but isn\'t.');
            });

            it('if a non-singular relationships is undefined on the document, then it is set to an InstanceSetReference with an empty ids array.', () => {
                const exampleDocument = {
                    string: 'string',
                    strings: ['red', 'blue'],
                    date: new Date(),
                    dates: [new Date(), new Date()],
                    boolean: true,
                    booleans: [false, true],
                    number: 0,
                    numbers: [1, 2],
                    class1: new mongoose.Types.ObjectId,
                };
                const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, exampleDocument);

                if (instanceState.instanceSetReferences['class2s'] === undefined || !instanceState.instanceSetReferences['class2s'].isEmpty())
                    throw new Error('The \'class2s\' Instance Reference should be set to an empty IsntanceSetReference, but isn\'t.');

            });
           
        });

    });

    describe('InstanceState Traps', () => {

        describe('Get Trap', () => {

            describe('Attributes', () => {

                describe('Non List Attributes', () => {
                    
                    it('Getting an attribute', () => {
                        const date = new Date();
                        const exampleDocument = {
                            boolean: true,
                            number: 1,
                            string: 'string',
                            date: date,
                        };
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, exampleDocument);

                        if (instanceState.boolean !== true || instanceState.number !== 1 || instanceState.string !== 'string' || instanceState.date !== date)
                            throw new Error('At least one of the attributes was not returned properly.');
                    });
                    
                    it('Getting an attribute which is null.', () => {
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);

                        if (instanceState.boolean !== null || instanceState.number !== null || instanceState.string !== null || instanceState.date !== null)
                            throw new Error('At least one of the attributes is not null.');

                    });
                    
                });

                describe('List Attributes', () => {
                    
                    it('Getting a list attribute.', () => {
                        const dates = [new Date(), new Date()];
                        const exampleDocument = {
                            booleans: [true, false],
                            numbers: [1, 2, 0],
                            strings: ['string', 'string2'],
                            dates: dates,
                        };
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, exampleDocument);

                        if (!arraysEqual(exampleDocument.booleans, instanceState.booleans))
                            throw new Error('booleans list attribute not returned properly.');

                        if (!arraysEqual(exampleDocument.numbers, instanceState.numbers))
                            throw new Error('numbers list attribute not returned properly.');

                        if (!arraysEqual(exampleDocument.strings, instanceState.strings))
                            throw new Error('strings list attribute not returned properly.');

                        if (!arraysEqual(exampleDocument.dates, instanceState.dates))
                            throw new Error('dates list attribute not returned properly.');

                    });
                    
                    it('Getting a list attribute which is an empty array.', () => {
                        const exampleDocument = {
                            booleans: [],
                            numbers: [],
                            strings: [],
                            dates: [],
                        };
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, exampleDocument);

                        if (!arraysEqual(exampleDocument.booleans, instanceState.booleans))
                            throw new Error('booleans list attribute not returned properly.');

                        if (!arraysEqual(exampleDocument.numbers, instanceState.numbers))
                            throw new Error('numbers list attribute not returned properly.');

                        if (!arraysEqual(exampleDocument.strings, instanceState.strings))
                            throw new Error('strings list attribute not returned properly.');

                        if (!arraysEqual(exampleDocument.dates, instanceState.dates))
                            throw new Error('dates list attribute not returned properly.');
                    });

                });

            });

            describe('Relationships', () => {

                describe('Singular Relationships', () => {
                    
                    it('Getting a singular relationship with Instance set returns Instance.', () => {
                        const instance = new Instance(CompareClass1);
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
                        instanceState.class1 = instance;

                        if (!instanceState.class1.equals(instance))
                            throw new Error('Instance not returned by getter.');
                    });
                    
                    it('Getting a singular relationship without an Instance set returns Id.', () => {
                        const id = new mongoose.Types.ObjectId;
                        const document = new AllAttributesAndRelationshipsClass.Model({
                            class1: id,
                        });
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, document);

                        if (id !== instanceState.class1)
                            throw new Error('Id not returned by getter.');
                    });
                    
                    it('Getting a singular relationship with no Id returns null.', () => {
                        const id = new mongoose.Types.ObjectId;
                        const document = new AllAttributesAndRelationshipsClass.Model({
                            class1: null,
                        });
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, document);

                        if (instanceState.class1 !== null)
                            throw new Error('Getter should have returned null.');

                    });

                });

                describe('Non-Singular Relationships', () => {
                    
                    it('Getting a non-singular relationship with InstanceSet set returns InstanceSet.', () => {
                        const instance = new Instance(CompareClass2);
                        const instanceSet = new InstanceSet(CompareClass2, [instance]);
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
                        instanceState.class2s = instanceSet;

                        if (!instanceState.class2s.equals(instanceSet))
                            throw new Error('InstanceSet not returned by getter.');
                    });
                    
                    it('Getting a non-singular relationship without an InstanceSet set returns Ids.', () => {
                        const ids = [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId]
                        const document = {
                            class2s: ids,
                        }
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, document);

                        if (!arraysEqual(ids, instanceState.class2s))
                            throw new Error('Ids not returned by getter.');
                    });
                    
                    it('Getting a non-singular relationship with no Ids returns empty array.', () => {
                        const ids = [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId]
                        const document = {
                            class2s: ids,
                        }
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
                        instanceState.class2s = null;

                        if (!arraysEqual([], instanceState.class2s))
                            throw new Error('Getter should have returned an empty array.');
                    });
                    
                });

            });

        });

        describe('Set Trap', () => {

            describe('Attributes', () => {

                describe('Non List Attributes', () => {
                    
                    it('Setting a boolean attribute to false.', () => {
                        const attribute = 'boolean';
                        const value = false;
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
                        instanceState[attribute] = value;

                        if (instanceState[attribute] !== value) 
                            throw new Error('Attribute not set.');
                    });
                    
                    it('Setting a boolean attribute to true.', () => {
                        const attribute = 'boolean';
                        const value = true;
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
                        instanceState[attribute] = value;

                        if (instanceState[attribute] !== value) 
                            throw new Error('Attribute not set.');

                    });
                    
                    it('Setting a boolean attribute to null.', () => {
                        const attribute = 'boolean';
                        const value = null;
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
                        instanceState[attribute] = value;

                        if (instanceState[attribute] !== value) 
                            throw new Error('Attribute not set.');

                    });
                    
                    it('Setting a number attribute.', () => {
                        const attribute = 'number';
                        const value = 0;
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
                        instanceState[attribute] = value;

                        if (instanceState[attribute] !== value) 
                            throw new Error('Attribute not set.');

                    });
                    
                    it('Setting a number attribute to null.', () => {
                        const attribute = 'number';
                        const value = null;
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
                        instanceState[attribute] = value;

                        if (instanceState[attribute] !== value) 
                            throw new Error('Attribute not set.');

                    });
                    
                    it('Setting a string attribute.', () => {
                        const attribute = 'string';
                        const value = 'null';
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
                        instanceState[attribute] = value;

                        if (instanceState[attribute] !== value) 
                            throw new Error('Attribute not set.');

                    });
                    
                    it('Setting a string attribute to empty string.', () => {
                        const attribute = 'string';
                        const value = '';
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
                        instanceState[attribute] = value;

                        if (instanceState[attribute] !== value) 
                            throw new Error('Attribute not set.');

                    });
                    
                    it('Setting a string attribute to null.', () => {
                        const attribute = 'string';
                        const value = null;
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
                        instanceState[attribute] = value;

                        if (instanceState[attribute] !== value) 
                            throw new Error('Attribute not set.');

                    });
                    
                    it('Setting a date attribute.', () => {
                        const attribute = 'date';
                        const value = new Date();
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
                        instanceState[attribute] = value;

                        if (instanceState[attribute] !== value) 
                            throw new Error('Attribute not set.');

                    });
                    
                    it('Setting a date attribute to null.', () => {
                        const attribute = 'date';
                        const value = null;
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
                        instanceState[attribute] = value;

                        if (instanceState[attribute] !== value) 
                            throw new Error('Attribute not set.');

                    });
                    
                });

                describe('List Attributes', () => {
                    
                    it('Setting a list attribute.', () => {
                        const attribute = 'booleans';
                        const value = [true, false];
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
                        instanceState[attribute] = value;

                        if (!arraysEqual(instanceState[attribute], value)) 
                            throw new Error('Attribute not set.');
                    });
                    
                    it('Setting a list attribute to empty array.', () => {
                        const attribute = 'booleans';
                        const value = [];
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
                        instanceState[attribute] = value;

                        if (!arraysEqual(instanceState[attribute], value)) 
                            throw new Error('Attribute not set.');
                    });
                    
                    it('Setting a list attribute to null sets to empty array.', () => {
                        const attribute = 'booleans';
                        const value = null;
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
                        instanceState[attribute] = value;

                        if (!arraysEqual(instanceState.attributes[attribute], [])) 
                            throw new Error('Attribute not set.');
                    });

                });

            });

            describe('Relationships', () => {

                describe('Singular Relationships', () => {
                    
                    it('Setting a singular relationship to an instance.', () => {
                        const instance = new Instance(CompareClass1);
                        const id = instance._id;
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
                        instanceState.class1 = instance;

                        if (!instanceState.instanceReferences.class1.instance.equals(instance))
                            throw new Error('Related instance not set.');

                        if (instanceState.instanceReferences.class1._id !== id)
                            throw new Error('Related instance id not set.');
                    });
                    
                    it('Setting a singular relationship to null.', () => {
                        const instance = new Instance(CompareClass1);
                        const id = instance._id;
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
                        instanceState.class1 = instance;
                        instanceState.class1 = null;

                        if (instanceState.instanceReferences.class1.instance !== null)
                            throw new Error('Related instance not set.');

                        if (instanceState.instanceReferences.class1._id !== null)
                            throw new Error('Related instance id not set.');

                    });

                });

                describe('Non-Singular Relationships', () => {
                    
                    it('Setting a non-singular relationship to an instance.', () => {
                        const instance1 = new Instance(CompareClass2);
                        const instance2 = new Instance(CompareClass2);
                        const instances = [instance1, instance2];
                        const instanceSet = new InstanceSet(CompareClass2, instances);
                        const ids = instances.map(instance => instance._id);
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
                        instanceState.class2s = instanceSet;

                        if (!instanceState.instanceSetReferences.class2s.instanceSet.equals(instanceSet))
                            throw new Error('Related InstanceSet not set.');

                        if (!arraysEqual(instanceState.instanceSetReferences.class2s._ids, ids))
                            throw new Error('Related instance ids not set.');
                    });
                    
                    it('Setting a non-singular relationship to null.', () => {
                        const instance1 = new Instance(CompareClass2);
                        const instance2 = new Instance(CompareClass2);
                        const instances = [instance1, instance2];
                        const instanceSet = new InstanceSet(CompareClass2, instances);
                        const ids = instances.map(instance => instance._id);
                        const instanceState = new InstanceState(AllAttributesAndRelationshipsClass);
                        instanceState.class2s = instanceSet;
                        instanceState.class2s = null;

                        if (instanceState.instanceSetReferences.class2s.instanceSet !== null)
                            throw new Error('Related InstanceSet not set.');

                        if (!arraysEqual(instanceState.instanceSetReferences.class2s._ids, []))
                            throw new Error('Related instance ids not set.');
                    });
                    
                });

            });

        });
    });

    describe('InstanceState.toDocument()', () => {

        describe('Attributes Set In Document', () => {

            describe('Attributes Set', () => {

                it('All attributes are set to non-falsey values.', () => {
                    const originalDocument = {
                        string: 'string',
                        strings: ['string1', 'string2'],
                        date: new Date('1997-06-07'),
                        boolean: true,
                        booleans: [true, false],
                        number: 1212,
                        numbers: [0, 1, 2],
                    }
                    const expectedDocument = {
                        string: 'string',
                        strings: ['string1', 'string2'],
                        date: new Date('1997-06-07'),
                        boolean: true,
                        booleans: [true, false],
                        number: 1212,
                        numbers: [0, 1, 2],
                    }
                    const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, originalDocument);
                    const document = instanceState.toDocument();
    
                    if (!objectsEqual(document, expectedDocument))
                        throw new Error('instanceState.toDocument() did not return the expected document.');

                });

            });

            describe('Empty Attributes Are Not Set', () => {

                it('String is empty in original document and instance state document.', () => {
                    const originalDocument = {
                        strings: ['string1', 'string2'],
                        date: new Date('1997-06-07'),
                        boolean: true,
                        booleans: [true, false],
                        number: 1212,
                        numbers: [0, 1, 2],
                    }
                    const expectedDocument = {
                        strings: ['string1', 'string2'],
                        date: new Date('1997-06-07'),
                        boolean: true,
                        booleans: [true, false],
                        number: 1212,
                        numbers: [0, 1, 2],
                    }
                    const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, originalDocument);
                    const document = instanceState.toDocument();
    
                    if (!objectsEqual(document, expectedDocument))
                        throw new Error('instanceState.toDocument() did not return the expected document.');

                });

                it('Strings is an empty array in original document and not set on instanceState document.', () => {
                    const originalDocument = {
                        string: 'string',
                        strings: [],
                        date: new Date('1997-06-07'),
                        boolean: true,
                        booleans: [true, false],
                        number: 1212,
                        numbers: [0, 1, 2],
                    }
                    const expectedDocument = {
                        string: 'string',
                        date: new Date('1997-06-07'),
                        boolean: true,
                        booleans: [true, false],
                        number: 1212,
                        numbers: [0, 1, 2],
                    }
                    const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, originalDocument);
                    const document = instanceState.toDocument();
    
                    if (!objectsEqual(document, expectedDocument))
                        throw new Error('instanceState.toDocument() did not return the expected document.');

                });

            });

            describe('Falsey Attributes Are Set', () => {

                it('Attributes that can be falsey are set to falsey.', () => {
                    const originalDocument = {
                        string: '',
                        strings: ['', ''],
                        date: new Date('1997-06-07'),
                        boolean: false,
                        booleans: [false, false],
                        number: 0,
                        numbers: [0, 0, 0],
                    }
                    const expectedDocument = {
                        string: '',
                        strings: ['', ''],
                        date: new Date('1997-06-07'),
                        boolean: false,
                        booleans: [false, false],
                        number: 0,
                        numbers: [0, 0, 0],
                    }
                    const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, originalDocument);
                    const document = instanceState.toDocument();
    
                    if (!objectsEqual(document, expectedDocument))
                        throw new Error('instanceState.toDocument() did not return the expected document.');

                });

            });

        });

        describe('Relationships Set In Document', () => {

            describe('Relationships', () => {

                it('Singular relationships is set.', () => {
                    const id = new mongoose.Types.ObjectId;
                    const originalDocument = {
                        class1: id,
                    }
                    const expectedDocument = {
                        class1: id,
                    }
                    const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, originalDocument);
                    const document = instanceState.toDocument();
    
                    if (!objectsEqual(document, expectedDocument))
                        throw new Error('instanceState.toDocument() did not return the expected document.');

                });

                it('Nonsingular relationship is set.', () => {
                    const id1 = new mongoose.Types.ObjectId;
                    const id2 = new mongoose.Types.ObjectId;
                    const originalDocument = {
                        class2s: [id1, id2],
                    }
                    const expectedDocument = {
                        class2s: [id1, id2],
                    }
                    const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, originalDocument);
                    const document = instanceState.toDocument();
    
                    if (!objectsEqual(document, expectedDocument))
                        throw new Error('instanceState.toDocument() did not return the expected document.');

                });

            });

            describe('Empty Relationships Are Not Set', () => {

                it('Null singular relationship not set.', () => {
                    const originalDocument = {
                        class1: null,
                    }
                    const expectedDocument = {
                    }
                    const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, originalDocument);
                    const document = instanceState.toDocument();
    
                    if (!objectsEqual(document, expectedDocument))
                        throw new Error('instanceState.toDocument() did not return the expected document.');

                });

                it('Undefined singular relationship not set.', () => {
                    const originalDocument = {
                    }
                    const expectedDocument = {
                    }
                    const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, originalDocument);
                    const document = instanceState.toDocument();
    
                    if (!objectsEqual(document, expectedDocument))
                        throw new Error('instanceState.toDocument() did not return the expected document.');

                });

                it('Empty array nonsingular relationship is not set.', () => {
                    const originalDocument = {
                        class2s: [],
                    }
                    const expectedDocument = {
                    }
                    const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, originalDocument);
                    const document = instanceState.toDocument();
    
                    if (!objectsEqual(document, expectedDocument))
                        throw new Error('instanceState.toDocument() did not return the expected document.');

                });

                it('Null nonsingular relationship is not set.', () => {
                    const originalDocument = {
                        class2s: null,
                    }
                    const expectedDocument = {
                    }
                    const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, originalDocument);
                    const document = instanceState.toDocument();
    
                    if (!objectsEqual(document, expectedDocument))
                        throw new Error('instanceState.toDocument() did not return the expected document.');

                });

                it('Undefined nonsingular relationship is not set.', () => {
                    const originalDocument = {
                    }
                    const expectedDocument = {
                    }
                    const instanceState = new InstanceState(AllAttributesAndRelationshipsClass, originalDocument);
                    const document = instanceState.toDocument();
    
                    if (!objectsEqual(document, expectedDocument))
                        throw new Error('instanceState.toDocument() did not return the expected document.');

                });

            });

        })

    });

    describe('InstanceState.diff() Tests', () => {
        
        describe('Attribute Diffs', () => {

            describe('Singular Attribute Diffs', () => {

                describe('Adding Attributes', () => {
    
                    it('Current document has \'string\' set and previous document does not contain \'string\'.', () => {
                        const attributeName = 'string';
                        const attributeValue = 'something';
                        const previousDocument = {};
                        const currentDocument = { 
                            [attributeName]: attributeValue,
                        }
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);
    
                        if (!diff.add || diff.add[attributeName] === undefined || diff.add[attributeName] !== attributeValue)
                            throw new Error('diff did not include the expected change to the attribute.')
    
                    });
    
                    it('Current document has \'string\' set to empty string and previous document does not contain \'string\'.', () => {
                        const attributeName = 'string';
                        const attributeValue = '';
                        const previousDocument = {};
                        const currentDocument = { 
                            [attributeName]: attributeValue,
                        }
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);
    
                        if (!diff.add || diff.add[attributeName] === undefined || diff.add[attributeName] !== attributeValue)
                            throw new Error('diff did not include the expected change to the attribute.')
    
                    });
    
                    it('Current document has \'date\' set and previous document does not contain \'date\'.', () => {
                        const attributeName = 'date';
                        const attributeValue = new Date();
                        const previousDocument = {};
                        const currentDocument = { 
                            [attributeName]: attributeValue,
                        }
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);
    
                        if (!diff.add || diff.add[attributeName] === undefined || diff.add[attributeName] !== attributeValue)
                            throw new Error('diff did not include the expected change to the attribute.')
                    });
    
                    it('Current document has \'number\' set and previous document does not contain \'number\'.', () => {
                        const attributeName = 'number';
                        const attributeValue = 17;
                        const previousDocument = {};
                        const currentDocument = { 
                            [attributeName]: attributeValue,
                        }
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);
    
                        if (!diff.add || diff.add[attributeName] === undefined || diff.add[attributeName] !== attributeValue)
                            throw new Error('diff did not include the expected change to the attribute.')
                    });
    
                    it('Current document has \'number\' set to 0 and previous document does not contain \'number\'.', () => {
                        const attributeName = 'number';
                        const attributeValue = 0;
                        const previousDocument = {};
                        const currentDocument = { 
                            [attributeName]: attributeValue,
                        }
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);
    
                        if (!diff.add || diff.add[attributeName] === undefined || diff.add[attributeName] !== attributeValue)
                            throw new Error('diff did not include the expected change to the attribute.')
                    });
    
                    it('Current document has \'boolean\' set and previous document does not contain \'boolean\'.', () => {
                        const attributeName = 'boolean';
                        const attributeValue = true;
                        const previousDocument = {};
                        const currentDocument = { 
                            [attributeName]: attributeValue,
                        }
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);
    
                        if (!diff.add || diff.add[attributeName] === undefined || diff.add[attributeName] !== attributeValue)
                            throw new Error('diff did not include the expected change to the attribute.')
                    });
    
                    it('Current document has \'boolean\' set and previous document does not contain \'boolean\'.', () => {
                        const attributeName = 'boolean';
                        const attributeValue = false;
                        const previousDocument = {};
                        const currentDocument = { 
                            [attributeName]: attributeValue,
                        }
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);
    
                        if (!diff.add || diff.add[attributeName] === undefined || diff.add[attributeName] !== attributeValue)
                            throw new Error('diff did not include the expected change to the attribute.')
                    });
    
                });

                describe('Removing Attributes', () => {
    
                    it('Previous document has \'string\' set and current document does not contain \'string\'.', () => {
                        const attributeName = 'string';
                        const attributeValue = 'something';
                        const previousDocument = { 
                            [attributeName]: attributeValue,
                        };
                        const currentDocument = {};
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);
    
                        if (!diff.remove || diff.remove[attributeName] === undefined || diff.remove[attributeName] !== attributeValue)
                            throw new Error('diff did not include the expected change to the attribute.')
                    });
    
                    it('Previous document has \'string\' set to empty string and current document does not contain \'string\'.', () => {
                        const attributeName = 'string';
                        const attributeValue = '';
                        const previousDocument = { 
                            [attributeName]: attributeValue,
                        };
                        const currentDocument = {};
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);
    
                        if (!diff.remove || diff.remove[attributeName] === undefined || diff.remove[attributeName] !== attributeValue)
                            throw new Error('diff did not include the expected change to the attribute.')
                    });
    
                    it('Previous document has \'date\' set and current document does not contain \'date\'.', () => {
                        const attributeName = 'date';
                        const attributeValue = new Date();
                        const previousDocument = { 
                            [attributeName]: attributeValue,
                        };
                        const currentDocument = {};
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);
    
                        if (!diff.remove || diff.remove[attributeName] === undefined || diff.remove[attributeName] !== attributeValue)
                            throw new Error('diff did not include the expected change to the attribute.')
                    });
    
                    it('Previous document has \'boolean\' set and current document does not contain \'boolean\'.', () => {
                        const attributeName = 'boolean';
                        const attributeValue = true;
                        const previousDocument = { 
                            [attributeName]: attributeValue,
                        };
                        const currentDocument = {};
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);
    
                        if (!diff.remove || diff.remove[attributeName] === undefined || diff.remove[attributeName] !== attributeValue)
                            throw new Error('diff did not include the expected change to the attribute.')
                    });
    
                    it('Previous document has \'boolean\' set to false and current document does not contain \'boolean\'.', () => {
                        const attributeName = 'boolean';
                        const attributeValue = false;
                        const previousDocument = { 
                            [attributeName]: attributeValue,
                        };
                        const currentDocument = {};
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);
    
                        if (!diff.remove || diff.remove[attributeName] === undefined || diff.remove[attributeName] !== attributeValue)
                            throw new Error('diff did not include the expected change to the attribute.')
                    });
    
                    it('Previous document has \'number\' set and current document does not contain \'number\'.', () => {
                        const attributeName = 'number';
                        const attributeValue = 1;
                        const previousDocument = { 
                            [attributeName]: attributeValue,
                        };
                        const currentDocument = {};
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);
    
                        if (!diff.remove || diff.remove[attributeName] === undefined || diff.remove[attributeName] !== attributeValue)
                            throw new Error('diff did not include the expected change to the attribute.')
                    });
    
                    it('Previous document has \'number\' set to 0 and current document does not contain \'number\'.', () => {
                        const attributeName = 'number';
                        const attributeValue = 0;
                        const previousDocument = { 
                            [attributeName]: attributeValue,
                        };
                        const currentDocument = {};
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);

                        if (!diff.remove || diff.remove[attributeName] === undefined || diff.remove[attributeName] !== attributeValue)
                            throw new Error('diff did not include the expected change to the attribute.')
                    });

                });

                describe('Updating Attributes', () => {
    
                    describe('Updating Attributes to New Values', () => {

                        it('\'string\' attribute updated.', () => {
                            const attributeName = 'string';
                            const previousValue = 'something';
                            const currentValue = 'something else';
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            };
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            };
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
        
                            if (!diff.update || diff.update[attributeName] === undefined)
                                throw new Error('diff did not include an update for the attribute.')
     
                            if (diff.update[attributeName].insert !== currentValue || diff.update[attributeName].remove !== previousValue || diff.update[attributeName].value !== currentValue)
                                throw new Error('The attribute update was not set as expected.');
                        });
        
                        it('\'string\' attribute updated from empty string to something.', () => {
                            const attributeName = 'string';
                            const previousValue = '';
                            const currentValue = 'something';
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            };
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            };
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
    
                            if (!diff.update || diff.update[attributeName] === undefined)
                                throw new Error('diff did not include an update for the attribute.')
     
                            if (diff.update[attributeName].insert !== currentValue || diff.update[attributeName].remove !== previousValue || diff.update[attributeName].value !== currentValue)
                                throw new Error('The attribute update was not set as expected.');
                        });
        
                        it('\'string\' attribute updated from something to empty string.', () => {
                            const attributeName = 'string';
                            const previousValue = 'something';
                            const currentValue = '';
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            };
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            };
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
        
                            if (!diff.update || diff.update[attributeName] === undefined)
                                throw new Error('diff did not include an update for the attribute.')
     
                            if (diff.update[attributeName].insert !== currentValue || diff.update[attributeName].remove !== previousValue || diff.update[attributeName].value !== currentValue)
                                throw new Error('The attribute update was not set as expected.');
                        });
        
                        it('\'date\' attribute updated.', () => {
                            const attributeName = 'date';
                            const previousValue = new Date('2019-01-01');
                            const currentValue = new Date();
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            };
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            };
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
        
                            if (!diff.update || diff.update[attributeName] === undefined)
                                throw new Error('diff did not include an update for the attribute.')
     
                            if (diff.update[attributeName].insert !== currentValue || diff.update[attributeName].remove !== previousValue || diff.update[attributeName].value !== currentValue)
                                throw new Error('The attribute update was not set as expected.');
                        });
        
                        it('\'number\' attribute updated.', () => {
                            const attributeName = 'number';
                            const previousValue = 0;
                            const currentValue = 17;
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            };
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            };
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
        
                            if (!diff.update || diff.update[attributeName] === undefined)
                                throw new Error('diff did not include an update for the attribute.')
     
                            if (diff.update[attributeName].insert !== currentValue || diff.update[attributeName].remove !== previousValue || diff.update[attributeName].value !== currentValue)
                                throw new Error('The attribute update was not set as expected.');
                        });
        
                        it('\'number\' attribute updated.', () => {
                            const attributeName = 'number';
                            const previousValue =  17;
                            const currentValue = 0;
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            };
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            };
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
        
                            if (!diff.update || diff.update[attributeName] === undefined)
                                throw new Error('diff did not include an update for the attribute.')
     
                            if (diff.update[attributeName].insert !== currentValue || diff.update[attributeName].remove !== previousValue || diff.update[attributeName].value !== currentValue)
                                throw new Error('The attribute update was not set as expected.');
                        });
        
                        it('\'boolean\' attribute updated.', () => {
                            const attributeName = 'boolean';
                            const previousValue =  false;
                            const currentValue = true;
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            };
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            };
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
        
                            if (!diff.update || diff.update[attributeName] === undefined)
                                throw new Error('diff did not include an update for the attribute.')
     
                            if (diff.update[attributeName].insert !== currentValue || diff.update[attributeName].remove !== previousValue || diff.update[attributeName].value !== currentValue)
                                throw new Error('The attribute update was not set as expected.');
                        });
        
                        it('\'boolean\' attribute updated.', () => {
                            const attributeName = 'boolean';
                            const previousValue =  true;
                            const currentValue = false;
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            };
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            };
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
        
                            if (!diff.update || diff.update[attributeName] === undefined)
                                throw new Error('diff did not include an update for the attribute.')
     
                            if (diff.update[attributeName].insert !== currentValue || diff.update[attributeName].remove !== previousValue || diff.update[attributeName].value !== currentValue)
                                throw new Error('The attribute update was not set as expected.');
                        });

                    });

                    describe('Setting an Attribute to the Same Value (Should Not Update)', () => {

                        it('\'string\' attribute not updated.', () => {
                            const attributeName = 'string';
                            const previousValue = 'something';
                            const currentValue = 'something';
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            };
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            };
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
        
                            if (!diff.update && diff.update[attributeName] !== undefined)
                                throw new Error('diff included the update when it shouldn\'t have.');
                        });

                        it('\'string\' attribute not updated.', () => {
                            const attributeName = 'string';
                            const previousValue = '';
                            const currentValue = '';
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            };
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            };
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
        
                            if (!diff.update && diff.update[attributeName] !== undefined)
                                throw new Error('diff included the update when it shouldn\'t have.');
                        });

                        it('\'boolean\' attribute not updated.', () => {
                            const attributeName = 'boolean';
                            const previousValue = false;
                            const currentValue = false;
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            };
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            };
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
        
                            if (!diff.update && diff.update[attributeName] !== undefined)
                                throw new Error('diff included the update when it shouldn\'t have.');
                        });

                        it('\'boolean\' attribute not updated.', () => {
                            const attributeName = 'boolean';
                            const previousValue = true;
                            const currentValue = true;
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            };
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            };
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
        
                            if (!diff.update && diff.update[attributeName] !== undefined)
                                throw new Error('diff included the update when it shouldn\'t have.');
                        });

                        it('\'number\' attribute not updated.', () => {
                            const attributeName = 'number';
                            const previousValue = 0;
                            const currentValue = 0;
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            };
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            };
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
        
                            if (!diff.update && diff.update[attributeName] !== undefined)
                                throw new Error('diff included the update when it shouldn\'t have.');
                        });

                        it('\'number\' attribute not updated.', () => {
                            const attributeName = 'number';
                            const previousValue = -10;
                            const currentValue = -10;
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            };
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            };
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
        
                            if (!diff.update && diff.update[attributeName] !== undefined)
                                throw new Error('diff included the update when it shouldn\'t have.');
                        });

                        it('\'date\' attribute not updated.', () => {
                            const attributeName = 'date';
                            const previousValue = new Date('1992-03-06');
                            const currentValue = new Date('1992-03-06');
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            };
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            };
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
        
                            if (!diff.update && diff.update[attributeName] !== undefined)
                                throw new Error('diff included the update when it shouldn\'t have.');
                        });

                    })

                });

            });

            describe('List Attribute Diffs', () => {

                describe('Adding Attributes', () => {
    
                    it('Current document has \'strings\' set and previous document does not contain \'strings\'.', () => {
                        const attributeName = 'strings';
                        const attributeValue = ['something'];
                        const previousDocument = {};
                        const currentDocument = { 
                            [attributeName]: attributeValue,
                        }
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);

                        if (!arraysEqual(diff.add[attributeName], attributeValue))
                            throw new Error('diff does not contain the expected attribute value.')
    
                    });
    
                    it('Current document has \'numbers\' set and previous document does not contain \'numbers\'.', () => {
                        const attributeName = 'numbers';
                        const attributeValue = [0, 17];
                        const previousDocument = {};
                        const currentDocument = { 
                            [attributeName]: attributeValue,
                        }
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);


                        if (!arraysEqual(diff.add[attributeName], attributeValue))
                            throw new Error('diff does not contain the expected attribute value.')
                    });

                    it('Current document has \'booleans\' set and previous document does not contain \'booleans\'.', () => {
                        const attributeName = 'booleans';
                        const attributeValue = [false, true];
                        const previousDocument = {};
                        const currentDocument = { 
                            [attributeName]: attributeValue,
                        }
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);

                        if (!arraysEqual(diff.add[attributeName], attributeValue))
                            throw new Error('diff does not contain the expected attribute value.')
                    });
    
                });

                describe('Removing Attributes', () => {
    
                    it('Previous document has \'strings\' set and current document does not contain \'strings\'.', () => {
                        const attributeName = 'strings';
                        const attributeValue = ['something'];
                        const previousDocument = { 
                            [attributeName]: attributeValue,
                        };
                        const currentDocument = {};
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);

                        if (!arraysEqual(diff.remove[attributeName], attributeValue))
                            throw new Error('diff does not contain the expected attribute value.')
                    });
    
                    it('Previous document has \'booleans\' set and current document does not contain \'booleans\'.', () => {
                        const attributeName = 'booleans';
                        const attributeValue = [false, true];
                        const previousDocument = { 
                            [attributeName]: attributeValue,
                        };
                        const currentDocument = {};
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);


                        if (!arraysEqual(diff.remove[attributeName], attributeValue))
                            throw new Error('diff does not contain the expected attribute value.')
                    });
    
                    it('Previous document has \'numbers\' set and current document does not contain \'numbers\'.', () => {
                        const attributeName = 'numbers';
                        const attributeValue = [1, 2];
                        const previousDocument = { 
                            [attributeName]: attributeValue,
                        };
                        const currentDocument = {};
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);


                        if (!arraysEqual(diff.remove[attributeName], attributeValue))
                            throw new Error('diff does not contain the expected attribute value.')
                    });

                });

                describe('Updating Attributes', () => {

                    describe('Adding Elements to List Attributes', () => {

                        it('Adding an element to list Element \'strings\'.', () => {
                            const attributeName = 'strings';
                            const previousValue = ['string1'];
                            const valuesAdded = ['string2'];
                            const valuesRemoved = [];
                            const currentValue = previousValue.concat(valuesAdded);
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            }
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            }
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
    
                            if (!diff.update || !diff.update[attributeName])
                                throw new Error('Diff does not contain the update for the attibute.');
        
                            if (!arraysEqual(currentValue, diff.update[attributeName].value))
                                throw new Error('diff.update.value is not set correctly.');
        
                            if (!arraysEqual(previousValue, diff.update[attributeName].previous))
                                throw new Error('diff.update.previous is not set correctly.');
                            
                            if (!arraysEqual(valuesAdded, diff.update[attributeName].insert))
                                throw new Error('diff.update.insert is not set correctly.');

                            if (!arraysEqual(valuesRemoved, diff.update[attributeName].remove))
                                throw new Error('diff.update.remove is not set correctly.');
                        });

                        it('Adding an element to list Element \'booleans\'.', () => {
                            const attributeName = 'booleans';
                            const previousValue = [true];
                            const valuesAdded = [false];
                            const valuesRemoved = [];
                            const currentValue = previousValue.concat(valuesAdded);
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            }
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            }
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
        
                            if (!arraysEqual(currentValue, diff.update[attributeName].value))
                                throw new Error('diff.update.value is not set correctly.');
        
                            if (!arraysEqual(previousValue, diff.update[attributeName].previous))
                                throw new Error('diff.update.previous is not set correctly.');
                            
                            if (!arraysEqual(valuesAdded, diff.update[attributeName].insert))
                                throw new Error('diff.update.insert is not set correctly.');

                            if (!arraysEqual(valuesRemoved, diff.update[attributeName].remove))
                                throw new Error('diff.update.remove is not set correctly.');
                        });

                        it('Adding an element to list Element \'numbers\'.', () => {
                            const attributeName = 'numbers';
                            const previousValue = [0, 1];
                            const valuesAdded = [2];
                            const valuesRemoved = [];
                            const currentValue = previousValue.concat(valuesAdded);
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            }
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            }
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
        
                            if (!arraysEqual(currentValue, diff.update[attributeName].value))
                                throw new Error('diff.update.value is not set correctly.');
        
                            if (!arraysEqual(previousValue, diff.update[attributeName].previous))
                                throw new Error('diff.update.previous is not set correctly.');
                            
                            if (!arraysEqual(valuesAdded, diff.update[attributeName].insert))
                                throw new Error('diff.update.insert is not set correctly.');

                            if (!arraysEqual(valuesRemoved, diff.update[attributeName].remove))
                                throw new Error('diff.update.remove is not set correctly.');
                        });

                    });

                    describe('Removing Elements from List Attributes.', () => {

                        it('Adding an element to list Element \'strings\'.', () => {
                            const attributeName = 'strings';
                            const previousValue = ['string1', 'string2'];
                            const valuesAdded = [];
                            const valuesRemoved = ['string2'];
                            const currentValue = ['string1'];
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            }
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            }
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
    
                            if (!diff.update || !diff.update[attributeName])
                                throw new Error('Diff does not contain the update for the attibute.');
        
                            if (!arraysEqual(currentValue, diff.update[attributeName].value))
                                throw new Error('diff.update.value is not set correctly.');
        
                            if (!arraysEqual(previousValue, diff.update[attributeName].previous))
                                throw new Error('diff.update.previous is not set correctly.');
                            
                            if (!arraysEqual(valuesAdded, diff.update[attributeName].insert))
                                throw new Error('diff.update.insert is not set correctly.');

                            if (!arraysEqual(valuesRemoved, diff.update[attributeName].remove))
                                throw new Error('diff.update.remove is not set correctly.');
                        });

                        it('Adding an element to list Element \'booleans\'.', () => {
                            const attributeName = 'booleans';
                            const previousValue = [true, false];
                            const valuesAdded = [];
                            const valuesRemoved = [false];
                            const currentValue = [true];
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            }
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            }
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
    
                            if (!diff.update || !diff.update[attributeName])
                                throw new Error('Diff does not contain the update for the attibute.');
        
                            if (!arraysEqual(currentValue, diff.update[attributeName].value))
                                throw new Error('diff.update.value is not set correctly.');
        
                            if (!arraysEqual(previousValue, diff.update[attributeName].previous))
                                throw new Error('diff.update.previous is not set correctly.');
                            
                            if (!arraysEqual(valuesAdded, diff.update[attributeName].insert))
                                throw new Error('diff.update.insert is not set correctly.');

                            if (!arraysEqual(valuesRemoved, diff.update[attributeName].remove))
                                throw new Error('diff.update.remove is not set correctly.');
                        });

                        it('Adding an element to list Element \'numbers\'.', () => {
                            const attributeName = 'numbers';
                            const previousValue = [0, 1, 2];
                            const valuesAdded = [];
                            const valuesRemoved = [2];
                            const currentValue = [0, 1];
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            }
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            }
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
    
                            if (!diff.update || !diff.update[attributeName])
                                throw new Error('Diff does not contain the update for the attibute.');
        
                            if (!arraysEqual(currentValue, diff.update[attributeName].value))
                                throw new Error('diff.update.value is not set correctly.');
        
                            if (!arraysEqual(previousValue, diff.update[attributeName].previous))
                                throw new Error('diff.update.previous is not set correctly.');
                            
                            if (!arraysEqual(valuesAdded, diff.update[attributeName].insert))
                                throw new Error('diff.update.insert is not set correctly.');

                            if (!arraysEqual(valuesRemoved, diff.update[attributeName].remove))
                                throw new Error('diff.update.remove is not set correctly.');
                        });

                    });

                    describe('Adding and Removing Elements to/from List Attributes.', () => {

                        it('Adding one string and removing another form List Attribute \'strings\'.', () => {
                            const attributeName = 'strings';
                            const previousValue = ['string1', 'string2'];
                            const valuesAdded = ['string3'];
                            const valuesRemoved = ['string2'];
                            const currentValue = ['string1', 'string3'];
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            }
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            }
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
    
                            if (!diff.update || !diff.update[attributeName])
                                throw new Error('Diff does not contain the update for the attibute.');
        
                            if (!arraysEqual(currentValue, diff.update[attributeName].value))
                                throw new Error('diff.update.value is not set correctly.');
        
                            if (!arraysEqual(previousValue, diff.update[attributeName].previous))
                                throw new Error('diff.update.previous is not set correctly.');
                            
                            if (!arraysEqual(valuesAdded, diff.update[attributeName].insert))
                                throw new Error('diff.update.insert is not set correctly.');

                            if (!arraysEqual(valuesRemoved, diff.update[attributeName].remove))
                                throw new Error('diff.update.remove is not set correctly.');
                        });

                        it('Switching the order of attributes in List Attribute \'booleans\'.', () => {
                            const attributeName = 'booleans';
                            const previousValue = [true, false, true, false];
                            const valuesAdded = [];
                            const valuesRemoved = [];
                            const currentValue = [false, true, false, true];
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            }
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            }
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
    
                            if (!diff.update || !diff.update[attributeName])
                                throw new Error('Diff does not contain the update for the attibute.');
        
                            if (!arraysEqual(currentValue, diff.update[attributeName].value))
                                throw new Error('diff.update.value is not set correctly.');
        
                            if (!arraysEqual(previousValue, diff.update[attributeName].previous))
                                throw new Error('diff.update.previous is not set correctly.');
                            
                            if (!arraysEqual(valuesAdded, diff.update[attributeName].insert))
                                throw new Error('diff.update.insert is not set correctly.');

                            if (!arraysEqual(valuesRemoved, diff.update[attributeName].remove))
                                throw new Error('diff.update.remove is not set correctly.');
                        });

                        it('Completely replacing the values in List Attribute \'numbers\'.', () => {
                            const attributeName = 'numbers';
                            const previousValue = [1, 2, 3];
                            const valuesAdded = [4, 5, 6, 7];
                            const valuesRemoved = [1, 2, 3];
                            const currentValue = [4, 5, 6, 7];
                            const previousDocument = { 
                                [attributeName]: previousValue,
                            }
                            const currentDocument = { 
                                [attributeName]: currentValue,
                            }
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
    
                            if (!diff.update || !diff.update[attributeName])
                                throw new Error('Diff does not contain the update for the attibute.');
        
                            if (!arraysEqual(currentValue, diff.update[attributeName].value))
                                throw new Error('diff.update.value is not set correctly.');
        
                            if (!arraysEqual(previousValue, diff.update[attributeName].previous))
                                throw new Error('diff.update.previous is not set correctly.');
                            
                            if (!arraysEqual(valuesAdded, diff.update[attributeName].insert))
                                throw new Error('diff.update.insert is not set correctly.');

                            if (!arraysEqual(valuesRemoved, diff.update[attributeName].remove))
                                throw new Error('diff.update.remove is not set correctly.');
                        });

                    });

                });

            });

        });

        describe('Relationship Diffs', () => {

            describe('Singular Relationship Diffs', () => {

                describe('Adding Relationship', () => {

                    it('Setting a relationship that was empty.', () => {
                        const relationshipName = 'class1';
                        const relatedId = new mongoose.Types.ObjectId;
                        const previousDocument = {};
                        const currentDocument = {
                            [relationshipName] : relatedId
                        }
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);

                        if (!diff.add || !diff.add[relationshipName])
                            throw new Error('diff.add is missing the relationship change.');

                        if (diff.add[relationshipName] != relatedId.toHexString())
                            throw new Error('diff is missing the added instance Id.');
                    });

                });

                describe('Removing Relationship', () => {

                    it('Removing a relationship that was empty.', () => {
                        const relationshipName = 'class1';
                        const relatedId = new mongoose.Types.ObjectId;
                        const previousDocument = {
                            [relationshipName] : relatedId
                        }
                        const currentDocument = {};
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);

                        if (!diff.remove || !diff.remove[relationshipName])
                            throw new Error('diff.remove is missing the relationship change.');

                        if (diff.remove[relationshipName] != relatedId.toHexString())
                            throw new Error('diff is missing the added instance Id.');
                    });

                });

                describe('Updating Relationship', () => {

                    it('Changing a relationship to a new id.', () => {
                        const relationshipName = 'class1';
                        const previousId = new mongoose.Types.ObjectId;
                        const currentId = new mongoose.Types.ObjectId;
                        const previousDocument = {
                            [relationshipName] : previousId
                        }
                        const currentDocument = {
                            [relationshipName] : currentId
                        };
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);

                        if (!diff.update || !diff.update[relationshipName])
                            throw new Error('diff.update is missing the relationship change.');

                        if (diff.update[relationshipName].previous != previousId.toHexString())
                            throw new Error('diff previous value is incorect.');

                        if (diff.update[relationshipName].value != currentId.toHexString())
                            throw new Error('diff is current value is incorrect.');

                        if (diff.update[relationshipName].remove != previousId.toHexString())
                            throw new Error('diff remove value is incorect.');

                        if (diff.update[relationshipName].insert != currentId.toHexString())
                            throw new Error('diff is insert value is incorrect.');
                    });

                });

            });

            describe('NonSingular Relationship Diffs', () => {

                describe('Adding Relationship', () => {

                    it('Adding ids to a nonsingular relationship that was empty.', () => {
                        const relationshipName = 'class2s';
                        const previousIds = [];
                        const currentIds = [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId];
                        const previousDocument = {
                            [relationshipName] : previousIds
                        }
                        const currentDocument = {
                            [relationshipName] : currentIds
                        };
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);

                        if (!diff || !diff.add[relationshipName])
                            throw new Error('Diff did not return with an add.');

                        if (!arraysEqual(currentIds, diff.add[relationshipName]))
                            throw new Error('Diff did not return the add with the correct ids.');
                    });
                    

                });

                describe('Removing Relationship', () => {

                    it('Adding ids to a nonsingular relationship that was empty.', () => {
                        const relationshipName = 'class2s';
                        const previousIds = [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId];
                        const currentIds = [];
                        const previousDocument = {
                            [relationshipName] : previousIds
                        }
                        const currentDocument = {
                            [relationshipName] : currentIds
                        };
                        const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);

                        if (!diff || !diff.remove[relationshipName])
                            throw new Error('Diff did not return with an remove.');

                        if (!arraysEqual(previousIds, diff.remove[relationshipName]))
                            throw new Error('Diff did not return the remove with the correct ids.');
                    });

                });

                describe('Updating Relationship', () => {

                    describe('Adding New IDs to the Relationship', () => {

                        it('Relationship has two ids and we add two more.', () => {
                            const relationshipName = 'class2s';
                            const ids = [
                                new mongoose.Types.ObjectId,
                                new mongoose.Types.ObjectId,
                                new mongoose.Types.ObjectId,
                                new mongoose.Types.ObjectId,
                            ]
                            const previousIds = [ids[0], ids[1]];
                            const currentIds = [ids[0], ids[1], ids[2], ids[3]];
                            const insertIds = [ids[2], ids[3]];
                            const removeIds = [];
                            const previousDocument = {
                                [relationshipName] : previousIds
                            }
                            const currentDocument = {
                                [relationshipName] : currentIds
                            };
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
    
                            if (!diff || !diff.update[relationshipName])
                                throw new Error('Diff did not return with an update.');
    
                            if (!arraysEqual(currentIds, diff.update[relationshipName].value))
                                throw new Error('Diff did not return the value with the correct ids.');
    
                            if (!arraysEqual(previousIds, diff.update[relationshipName].previous))
                                throw new Error('Diff did not return the previous with the correct ids.');
    
                            if (!arraysEqual(insertIds, diff.update[relationshipName].insert))
                                throw new Error('Diff did not return the insert with the correct ids.');
    
                            if (!arraysEqual(removeIds, diff.update[relationshipName].remove))
                                throw new Error('Diff did not return the remove with the correct ids.');

                        });

                    });

                    describe('Removing IDs from the Relationship', () => {

                        it('Relationship has 4 ids and we remove two.', () => {
                            const relationshipName = 'class2s';
                            const ids = [
                                new mongoose.Types.ObjectId,
                                new mongoose.Types.ObjectId,
                                new mongoose.Types.ObjectId,
                                new mongoose.Types.ObjectId,
                            ]
                            const previousIds = [ids[0], ids[1], ids[2], ids[3]];
                            const currentIds = [ids[0], ids[1]];
                            const insertIds = [];
                            const removeIds = [ids[2], ids[3]];
                            const previousDocument = {
                                [relationshipName] : previousIds
                            }
                            const currentDocument = {
                                [relationshipName] : currentIds
                            };
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
    
                            if (!diff || !diff.update[relationshipName])
                                throw new Error('Diff did not return with an update.');
    
                            if (!arraysEqual(currentIds, diff.update[relationshipName].value))
                                throw new Error('Diff did not return the value with the correct ids.');
    
                            if (!arraysEqual(previousIds, diff.update[relationshipName].previous))
                                throw new Error('Diff did not return the previous with the correct ids.');
    
                            if (!arraysEqual(insertIds, diff.update[relationshipName].insert))
                                throw new Error('Diff did not return the insert with the correct ids.');
    
                            if (!arraysEqual(removeIds, diff.update[relationshipName].remove))
                                throw new Error('Diff did not return the remove with the correct ids.');
                        });

                    });

                    describe('Adding New IDs to and Removing IDs from the Relationship', () => {

                        it('Relationship has 4 ids, we remove two and add two more.', () => {
                            const relationshipName = 'class2s';
                            const ids = [
                                new mongoose.Types.ObjectId,
                                new mongoose.Types.ObjectId,
                                new mongoose.Types.ObjectId,
                                new mongoose.Types.ObjectId,
                                new mongoose.Types.ObjectId,
                                new mongoose.Types.ObjectId,
                            ]
                            const previousIds = [ids[0], ids[1], ids[2], ids[3]];
                            const currentIds = [ids[0], ids[1], ids[4], ids[5]];
                            const insertIds = [ids[4], ids[5]];
                            const removeIds = [ids[2], ids[3]];
                            const previousDocument = {
                                [relationshipName] : previousIds
                            }
                            const currentDocument = {
                                [relationshipName] : currentIds
                            };
                            const previousInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllAttributesAndRelationshipsClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
    
                            if (!diff || !diff.update[relationshipName])
                                throw new Error('Diff did not return with an update.');
    
                            if (!arraysEqual(currentIds, diff.update[relationshipName].value))
                                throw new Error('Diff did not return the value with the correct ids.');
    
                            if (!arraysEqual(previousIds, diff.update[relationshipName].previous))
                                throw new Error('Diff did not return the previous with the correct ids.');
    
                            if (!arraysEqual(insertIds, diff.update[relationshipName].insert))
                                throw new Error('Diff did not return the insert with the correct ids.');
    
                            if (!arraysEqual(removeIds, diff.update[relationshipName].remove))
                                throw new Error('Diff did not return the remove with the correct ids.');
                        });

                    });

                });

            });

        });

    });

});