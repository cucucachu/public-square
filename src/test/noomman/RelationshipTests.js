require("@babel/polyfill");

const Relationship = require('../../dist/noomman/Relationship');

const TestingFunctions = require('./helpers/TestingFunctions');
const testForError = TestingFunctions.testForError;

describe('Relationship Tests', () => {

    describe('Relationship.constructor()', () => {

        describe('Constructor Validations', () => {

            it('Name is required.', () => {
                const expectedErrorMessage = 'Attempt to create an relationship without a name.';
                const schema = {};

                testForError('new Relationship()', expectedErrorMessage, () => {
                    new Relationship(schema);
                });
            });

            it('Name must be a String.', () => {
                const expectedErrorMessage = 'Attempt to create an relationship with name set to something other than a string.';
                const schema = {
                    name: true
                };

                testForError('new Relationship()', expectedErrorMessage, () => {
                    new Relationship(schema);
                });
            });

            it('ToClass is required.', () => {
                const expectedErrorMessage = 'Attempt to create an relationship without a toClass.';
                const schema = {
                    name: 'name',
                };

                testForError('new Relationship()', expectedErrorMessage, () => {
                    new Relationship(schema);
                });
            });

            it('ToClass must be a String.', () => {
                const expectedErrorMessage = 'Attempt to create an relationship with toClass set to something other than a string.';
                const schema = {
                    name: 'name',
                    toClass: true,
                };

                testForError('new Relationship()', expectedErrorMessage, () => {
                    new Relationship(schema);
                });
            });

            it('Singular is required.', () => {
                const expectedErrorMessage = 'Attempt to create an relationship with singular undefined.';
                const schema = {
                    name: 'name',
                    toClass: 'toClass',
                };

                testForError('new Relationship()', expectedErrorMessage, () => {
                    new Relationship(schema);
                });
            });

            it('Singular must be a boolean.', () => {
                const expectedErrorMessage = 'Attempt to create an relationship with singular set to something other than a boolean.';
                const schema = {
                    name: 'name',
                    toClass: 'toClass',
                    singular: 1,
                };

                testForError('new Relationship()', expectedErrorMessage, () => {
                    new Relationship(schema);
                });
            });

            it('Required must be a boolean.', () => {
                const expectedErrorMessage = 'Attempt to create an relationship with required set to something other than a boolean.';
                const schema = {
                    name: 'name',
                    toClass: 'toClass',
                    singular: true,
                    required: 0,
                };

                testForError('new Relationship()', expectedErrorMessage, () => {
                    new Relationship(schema);
                });
            });

            it('Owns must be a boolean.', () => {
                const expectedErrorMessage = 'Attempt to create an relationship with owns set to something other than a boolean.';
                const schema = {
                    name: 'name',
                    toClass: 'toClass',
                    singular: false,
                    owns: 0,
                };

                testForError('new Relationship()', expectedErrorMessage, () => {
                    new Relationship(schema);
                });
            });

            it('MirrorRelationship must be a String.', () => {
                const expectedErrorMessage = 'Attempt to create an relationship with mirrorRelationship set to something other than a string.';
                const schema = {
                    name: 'name',
                    toClass: 'toClass',
                    singular: false,
                    mirrorRelationship: true,
                };

                testForError('new Relationship()', expectedErrorMessage, () => {
                    new Relationship(schema);
                });
            });

            it('Mutex must be a String.', () => {
                const expectedErrorMessage = 'Attempt to create an relationship with mutex set to something other than a string.';
                const schema = {
                    name: 'name',
                    toClass: 'toClass',
                    singular: false,
                    mutex: true,
                };

                testForError('new Relationship()', expectedErrorMessage, () => {
                    new Relationship(schema);
                });
            });

            it('RequiredGroup must be a String.', () => {
                const expectedErrorMessage = 'Attempt to create an relationship with requiredGroup set to something other than a string.';
                const schema = {
                    name: 'name',
                    toClass: 'toClass',
                    singular: false,
                    requiredGroup: 8,
                };

                testForError('new Relationship()', expectedErrorMessage, () => {
                    new Relationship(schema);
                });
            });

        });

        describe('Constructor Creates an Relationship', () => {

            it('Constructor sets all properties correctly.', () => {
                const schema = {
                    name: 'relationship',
                    toClass: 'toClass',
                    singular: true,
                    owns: true,
                    mirrorRelationship: 'thisClass',
                    required: true,
                    mutex: 'a',
                    requiredGroup: 'a',
                }
                const relationship = new Relationship(schema);

                for (const key of Object.keys(schema)) {
                    if (schema[key] !== relationship[key]) 
                        throw new Error('Property ' + key + ' not set on relationship.');
                }

            });

        });

    });

});
