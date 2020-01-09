/*
    Unit tests for the controller functions in miraController.
 */ 
const database = require('../helpers/database');
const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const TestingFunctions = require('../helpers/TestingFunctions');
const testForError = TestingFunctions.testForError;

const miraController = require('../../src/controllers/miraController');

describe('Controller - miraController', () => {

    before(async () => {
        await database.connect();
    });

    after(async () => {
        await database.close();
    });

    describe('miraController.getClassModels()', () => {

        it ('Class model names returned', () => {
            new ClassModel({className: 'hello'});
            new ClassModel({className: 'world'});
    
            const classNames = miraController.getClassModels();
    
            if (classNames.length == 0) {
                throw new Error('No Class Models returned.');
            }
    
            if (!classNames.includes('hello') || !classNames.includes('world')) {
                throw new Error('A className is missing.');
            }

        });
    });

    describe('miraController.schemaForClassModel()', () => {

        const MiraTestClassModel = new ClassModel({
            className: 'MiraTestClassModel',
            attributes: [
                {
                    name: 'boolean',
                    type: Boolean,
                },
                {
                    name: 'string',
                    type: String,
                },
                {
                    name: 'number',
                    type: Number,
                },
                {
                    name: 'date',
                    type: Date,
                },
            ],
            relationships: [
                {
                    name: 'oneToOne',
                    toClass: 'MiraTestClassModel',
                    mirrorRelationship: 'oneToOne',
                    singular: true,
                },
                {
                    name: 'oneToMany',
                    toClass: 'MiraTestClassModel',
                    mirrorRelationship: 'manyToOne',
                    singular: false,
                },
                {
                    name: 'manyToOne',
                    toClass: 'MiraTestClassModel',
                    mirrorRelationship: 'oneToMany',
                    singular: true,
                },
                {
                    name: 'manyToMany',
                    toClass: 'MiraTestClassModel',
                    mirrorRelationship: 'manyToMany',
                    singular: false,
                },
            ],
        });

        it('Error thrown if className does not match a Class Model', () => {
            const expectedErrorMessage = 'No ClassModel found with name "notAClassModel".';
            testForError('miraController.schemaForClassModel()', expectedErrorMessage, () => {
                miraController.schemaForClassModel('notAClassModel');
            });
        });

        it('Attributes returned correctly.', () => {
            const attributes = miraController.schemaForClassModel('MiraTestClassModel').attributes;

            if (attributes.length !== 4) {
                throw new Error('Incorrect number of attributes returned.');
            }

            if (attributes[0].name !== 'boolean' || attributes[0].type !== 'Boolean') {
                throw new Error('Boolean attribute was not returned correctly.');
            }

            if (attributes[1].name !== 'string' || attributes[1].type !== 'String') {
                throw new Error('String attribute was not returned correctly.');
            }

            if (attributes[2].name !== 'number' || attributes[2].type !== 'Number') {
                throw new Error('Number attribute was not returned correctly.');
            }

            if (attributes[3].name !== 'date' || attributes[3].type !== 'Date') {
                throw new Error('Date attribute was not returned correctly.');
            }
        });

        it('Relationships returned correctly.', () => {
            const relationships = miraController.schemaForClassModel('MiraTestClassModel').relationships;

            if (relationships.length !== 4) {
                throw new Error('Incorrect number of relationships returned.');
            }

            if (
                    relationships[0].name !== 'oneToOne' || 
                    relationships[0].toClass !== 'MiraTestClassModel' ||
                    relationships[0].mirrorRelationship !== 'oneToOne' || 
                    relationships[0].singular !== true
                ) 
                {
                    throw new Error('One to One relationship not returned correctly.');
                }
        });


    });

});