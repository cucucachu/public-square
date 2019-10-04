require("@babel/polyfill");

const Attribute = require('../../dist/noomman/Attribute');

const TestingFunctions = require('./helpers/TestingFunctions');
const testForError = TestingFunctions.testForError;

describe('Attribute Tests', () => {

    describe('Attribute.constructor()', () => {

        describe('Constructor Validations', () => {

            it('Name is required.', () => {
                const expectedErrorMessage = 'Attempt to create an attribute without a name.';
                const schema = {};

                testForError('new Attribute()', expectedErrorMessage, () => {
                    new Attribute(schema);
                });
            });

            it('Name must be a String.', () => {
                const expectedErrorMessage = 'Attempt to create an attribute with name set to something other than a string.';
                const schema = {
                    name: true
                };

                testForError('new Attribute()', expectedErrorMessage, () => {
                    new Attribute(schema);
                });
            });

            it('Type is required.', () => {
                const expectedErrorMessage = 'Attempt to create an attribute without a type.';
                const schema = {
                    name: 'name',
                };

                testForError('new Attribute()', expectedErrorMessage, () => {
                    new Attribute(schema);
                });
            });

            it('Type must be a valid type.', () => {
                const expectedErrorMessage = 'Attempt to create an attribute with an invalid type. Type must be one of the following: Number,String,Boolean,Date.';
                const schema = {
                    name: 'name',
                    type: true,
                };

                testForError('new Attribute()', expectedErrorMessage, () => {
                    new Attribute(schema);
                });
            });

            it('List must be a boolean.', () => {
                const expectedErrorMessage = 'Attempt to create an attribute with list set to something other than a boolean.';
                const schema = {
                    name: 'name',
                    type: String,
                    list: 10,
                };

                testForError('new Attribute()', expectedErrorMessage, () => {
                    new Attribute(schema);
                });
            });

            it('Required must be a boolean.', () => {
                const expectedErrorMessage = 'Attempt to create an attribute with required set to something other than a boolean.';
                const schema = {
                    name: 'name',
                    type: String,
                    required: 10,
                };

                testForError('new Attribute()', expectedErrorMessage, () => {
                    new Attribute(schema);
                });
            });

            it('Unique must be a boolean.', () => {
                const expectedErrorMessage = 'Attempt to create an attribute with unique set to something other than a boolean.';
                const schema = {
                    name: 'name',
                    type: String,
                    unique: 0,
                };

                testForError('new Attribute()', expectedErrorMessage, () => {
                    new Attribute(schema);
                });
            });

            it('Sensitive must be a boolean.', () => {
                const expectedErrorMessage = 'Attempt to create an attribute with sensitive set to something other than a boolean.';
                const schema = {
                    name: 'name',
                    type: String,
                    sensitive: 1,
                };

                testForError('new Attribute()', expectedErrorMessage, () => {
                    new Attribute(schema);
                });
            });

            it('Mutex must be a String.', () => {
                const expectedErrorMessage = 'Attempt to create an attribute with mutex set to something other than a string.';
                const schema = {
                    name: 'name',
                    type: String,
                    mutex: true,
                };

                testForError('new Attribute()', expectedErrorMessage, () => {
                    new Attribute(schema);
                });
            });

            it('RequiredGroup must be a String.', () => {
                const expectedErrorMessage = 'Attempt to create an attribute with requiredGroup set to something other than a string.';
                const schema = {
                    name: 'name',
                    type: String,
                    requiredGroup: 8,
                };

                testForError('new Attribute()', expectedErrorMessage, () => {
                    new Attribute(schema);
                });
            });

        });

        describe('Constructor Creates an Attribute', () => {

            it('Constructor sets all properties correctly.', () => {
                const schema = {
                    name: 'attribute',
                    type: String,
                    list: true,
                    required: true,
                    unique: true,
                    sensitive: true,
                    mutex: 'a',
                    requiredGroup: 'a',
                }
                const attribute = new Attribute(schema);

                for (const key of Object.keys(schema)) {
                    if (schema[key] !== attribute[key]) 
                        throw new Error('Property ' + key + ' not set on attribute.');
                }

            });

        });

    });

});
