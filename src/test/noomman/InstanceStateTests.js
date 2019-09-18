require("@babel/polyfill");

const InstanceState = require('../../dist/noomman/InstanceState');
const TestClassModels = require('./helpers/TestClassModels');
const TestingFunctions = require('./helpers/TestingFunctions');
const testForError = TestingFunctions.testForError;
const testForErrorMutex = TestingFunctions.testForErrorMutex;
const testForErrorAsync = TestingFunctions.testForErrorAsync;
const arrayEquals = TestingFunctions.arrayEquals;

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
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
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
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);

                        if (!arrayEquals(diff.add[attributeName], attributeValue))
                            throw new Error('diff does not contain the expected attribute value.')
    
                    });
    
                    it('Current document has \'numbers\' set and previous document does not contain \'numbers\'.', () => {
                        const attributeName = 'numbers';
                        const attributeValue = [0, 17];
                        const previousDocument = {};
                        const currentDocument = { 
                            [attributeName]: attributeValue,
                        }
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);


                        if (!arrayEquals(diff.add[attributeName], attributeValue))
                            throw new Error('diff does not contain the expected attribute value.')
                    });

                    it('Current document has \'booleans\' set and previous document does not contain \'booleans\'.', () => {
                        const attributeName = 'booleans';
                        const attributeValue = [false, true];
                        const previousDocument = {};
                        const currentDocument = { 
                            [attributeName]: attributeValue,
                        }
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);

                        if (!arrayEquals(diff.add[attributeName], attributeValue))
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
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);

                        if (!arrayEquals(diff.remove[attributeName], attributeValue))
                            throw new Error('diff does not contain the expected attribute value.')
                    });
    
                    it('Previous document has \'booleans\' set and current document does not contain \'booleans\'.', () => {
                        const attributeName = 'booleans';
                        const attributeValue = [false, true];
                        const previousDocument = { 
                            [attributeName]: attributeValue,
                        };
                        const currentDocument = {};
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);


                        if (!arrayEquals(diff.remove[attributeName], attributeValue))
                            throw new Error('diff does not contain the expected attribute value.')
                    });
    
                    it('Previous document has \'numbers\' set and current document does not contain \'numbers\'.', () => {
                        const attributeName = 'numbers';
                        const attributeValue = [1, 2];
                        const previousDocument = { 
                            [attributeName]: attributeValue,
                        };
                        const currentDocument = {};
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);


                        if (!arrayEquals(diff.remove[attributeName], attributeValue))
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
    
                            if (!diff.update || !diff.update[attributeName])
                                throw new Error('Diff does not contain the update for the attibute.');
        
                            if (!arrayEquals(currentValue, diff.update[attributeName].value))
                                throw new Error('diff.update.value is not set correctly.');
        
                            if (!arrayEquals(previousValue, diff.update[attributeName].previous))
                                throw new Error('diff.update.previous is not set correctly.');
                            
                            if (!arrayEquals(valuesAdded, diff.update[attributeName].insert))
                                throw new Error('diff.update.insert is not set correctly.');

                            if (!arrayEquals(valuesRemoved, diff.update[attributeName].remove))
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
        
                            if (!arrayEquals(currentValue, diff.update[attributeName].value))
                                throw new Error('diff.update.value is not set correctly.');
        
                            if (!arrayEquals(previousValue, diff.update[attributeName].previous))
                                throw new Error('diff.update.previous is not set correctly.');
                            
                            if (!arrayEquals(valuesAdded, diff.update[attributeName].insert))
                                throw new Error('diff.update.insert is not set correctly.');

                            if (!arrayEquals(valuesRemoved, diff.update[attributeName].remove))
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
        
                            if (!arrayEquals(currentValue, diff.update[attributeName].value))
                                throw new Error('diff.update.value is not set correctly.');
        
                            if (!arrayEquals(previousValue, diff.update[attributeName].previous))
                                throw new Error('diff.update.previous is not set correctly.');
                            
                            if (!arrayEquals(valuesAdded, diff.update[attributeName].insert))
                                throw new Error('diff.update.insert is not set correctly.');

                            if (!arrayEquals(valuesRemoved, diff.update[attributeName].remove))
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
    
                            if (!diff.update || !diff.update[attributeName])
                                throw new Error('Diff does not contain the update for the attibute.');
        
                            if (!arrayEquals(currentValue, diff.update[attributeName].value))
                                throw new Error('diff.update.value is not set correctly.');
        
                            if (!arrayEquals(previousValue, diff.update[attributeName].previous))
                                throw new Error('diff.update.previous is not set correctly.');
                            
                            if (!arrayEquals(valuesAdded, diff.update[attributeName].insert))
                                throw new Error('diff.update.insert is not set correctly.');

                            if (!arrayEquals(valuesRemoved, diff.update[attributeName].remove))
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
    
                            if (!diff.update || !diff.update[attributeName])
                                throw new Error('Diff does not contain the update for the attibute.');
        
                            if (!arrayEquals(currentValue, diff.update[attributeName].value))
                                throw new Error('diff.update.value is not set correctly.');
        
                            if (!arrayEquals(previousValue, diff.update[attributeName].previous))
                                throw new Error('diff.update.previous is not set correctly.');
                            
                            if (!arrayEquals(valuesAdded, diff.update[attributeName].insert))
                                throw new Error('diff.update.insert is not set correctly.');

                            if (!arrayEquals(valuesRemoved, diff.update[attributeName].remove))
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
    
                            if (!diff.update || !diff.update[attributeName])
                                throw new Error('Diff does not contain the update for the attibute.');
        
                            if (!arrayEquals(currentValue, diff.update[attributeName].value))
                                throw new Error('diff.update.value is not set correctly.');
        
                            if (!arrayEquals(previousValue, diff.update[attributeName].previous))
                                throw new Error('diff.update.previous is not set correctly.');
                            
                            if (!arrayEquals(valuesAdded, diff.update[attributeName].insert))
                                throw new Error('diff.update.insert is not set correctly.');

                            if (!arrayEquals(valuesRemoved, diff.update[attributeName].remove))
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
    
                            if (!diff.update || !diff.update[attributeName])
                                throw new Error('Diff does not contain the update for the attibute.');
        
                            if (!arrayEquals(currentValue, diff.update[attributeName].value))
                                throw new Error('diff.update.value is not set correctly.');
        
                            if (!arrayEquals(previousValue, diff.update[attributeName].previous))
                                throw new Error('diff.update.previous is not set correctly.');
                            
                            if (!arrayEquals(valuesAdded, diff.update[attributeName].insert))
                                throw new Error('diff.update.insert is not set correctly.');

                            if (!arrayEquals(valuesRemoved, diff.update[attributeName].remove))
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
    
                            if (!diff.update || !diff.update[attributeName])
                                throw new Error('Diff does not contain the update for the attibute.');
        
                            if (!arrayEquals(currentValue, diff.update[attributeName].value))
                                throw new Error('diff.update.value is not set correctly.');
        
                            if (!arrayEquals(previousValue, diff.update[attributeName].previous))
                                throw new Error('diff.update.previous is not set correctly.');
                            
                            if (!arrayEquals(valuesAdded, diff.update[attributeName].insert))
                                throw new Error('diff.update.insert is not set correctly.');

                            if (!arrayEquals(valuesRemoved, diff.update[attributeName].remove))
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
                            const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                            const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
                            const diff = currentInstanceState.diff(previousInstanceState);
    
                            if (!diff.update || !diff.update[attributeName])
                                throw new Error('Diff does not contain the update for the attibute.');
        
                            if (!arrayEquals(currentValue, diff.update[attributeName].value))
                                throw new Error('diff.update.value is not set correctly.');
        
                            if (!arrayEquals(previousValue, diff.update[attributeName].previous))
                                throw new Error('diff.update.previous is not set correctly.');
                            
                            if (!arrayEquals(valuesAdded, diff.update[attributeName].insert))
                                throw new Error('diff.update.insert is not set correctly.');

                            if (!arrayEquals(valuesRemoved, diff.update[attributeName].remove))
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
                        const relatedId = '1234asdf2134asdf';
                        const previousDocument = {};
                        const currentDocument = {
                            [relationshipName] : relatedId
                        }
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);

                        if (!diff.add || !diff.add[relationshipName])
                            throw new Error('diff.add is missing the relationship change.');

                        if (diff.add[relationshipName] != relatedId)
                            throw new Error('diff is missing the added instance Id.');
                    });

                });

                describe('Removing Relationship', () => {

                    it('Removing a relationship that was empty.', () => {
                        const relationshipName = 'class1';
                        const relatedId = '1234asdf2134asdf';
                        const previousDocument = {
                            [relationshipName] : relatedId
                        }
                        const currentDocument = {};
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);

                        if (!diff.remove || !diff.remove[relationshipName])
                            throw new Error('diff.remove is missing the relationship change.');

                        if (diff.remove[relationshipName] != relatedId)
                            throw new Error('diff is missing the added instance Id.');
                    });

                });

                describe('Updating Relationship', () => {

                    it('Changing a relationship to a new id.', () => {
                        const relationshipName = 'class1';
                        const previousId = '1234asdf2134asdf';
                        const currentId = '9876asdf6543fdas';
                        const previousDocument = {
                            [relationshipName] : previousId
                        }
                        const currentDocument = {
                            [relationshipName] : currentId
                        };
                        const previousInstanceState = new InstanceState(AllFieldsRequiredClass, previousDocument);
                        const currentInstanceState = new InstanceState(AllFieldsRequiredClass, currentDocument);
                        const diff = currentInstanceState.diff(previousInstanceState);

                        console.log(JSON.stringify(diff));

                        if (!diff.update || !diff.update[relationshipName])
                            throw new Error('diff.update is missing the relationship change.');

                        if (diff.update[relationshipName].previous != previousId)
                            throw new Error('diff previous value is incorect.');

                        if (diff.update[relationshipName].value != currentId)
                            throw new Error('diff is current value is incorrect.');

                        if (diff.update[relationshipName].remove != previousId)
                            throw new Error('diff remove value is incorect.');

                        if (diff.update[relationshipName].insert != currentId)
                            throw new Error('diff is insert value is incorrect.');
                    });

                });

            });

            describe('NonSingular Relationship Diffs', () => {

                describe('Adding Relationship', () => {

                });

                describe('Removing Relationship', () => {

                });

                describe('Updating Relationship', () => {

                    describe('Adding New IDs to the Relationship', () => {

                    });

                    describe('Removing IDs from the Relationship', () => {

                    });

                    describe('Adding New IDs to and Removing IDs from the Relationship', () => {

                    });

                });

            });

        });

    });

});