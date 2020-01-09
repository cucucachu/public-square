/*
    Unit tests for the controller functions in miraController.
 */ 
const moment = require('moment');

const database = require('../helpers/database');
const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const Instance = noomman.Instance;
const InstanceSet = noomman.InstanceSet;
const TestingFunctions = require('../helpers/TestingFunctions');
const testForError = TestingFunctions.testForError;
const testForErrorAsync = TestingFunctions.testForErrorAsync;
const MiraClassModels = require('../helpers/MiraClassModels');
const AllAttributesClass = MiraClassModels.AllAttributesClass;
const TreeClass = MiraClassModels.TreeClass;

const miraController = require('../../src/controllers/miraController');
require('../../src/models/index');

describe('Controller - miraController', () => {

    before(async () => {
        await database.connect();
        AllAttributesClass.clear();
        TreeClass.clear();
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

    describe('miraController.put()', () => {

        describe('validations', () => {

            it('No data given.', async () => {
                const expectedErrorMessage = 'No data given.';

                await testForErrorAsync('miraController.put()', expectedErrorMessage, async () => {
                    return miraController.put();
                });
            });

            it('No className given.', async () => {
                const expectedErrorMessage = 'Given data has no className property.';

                await testForErrorAsync('miraController.put()', expectedErrorMessage, async () => {
                    return miraController.put({});
                });

            });

            it('Invalid className given', async () => {
                const expectedErrorMessage = 'No ClassModel found with name NotARealClass.';

                await testForErrorAsync('miraController.put()', expectedErrorMessage, async () => {
                    return miraController.put({
                        className: 'NotARealClass',
                    });
                });

            });

        });

        describe('Creating A Single New Instance', () => {

            it('Can create an instance with just attributes.', async () => {
                const data = {
                    className: 'AllAttributesClass',
                    string: 'hello',
                    boolean: true,
                    number: 0,
                    date: new Date('2000-01-01'),
                };

                await miraController.put(data);

                const instance = await AllAttributesClass.findOne({
                    number: 0,
                });

                if (instance === null) {
                    throw new Error('Instance was not saved correctly.');
                }
                if (instance.string !== 'hello') {
                    throw new Error('String was not saved correctly.');
                }
                if (instance.boolean !== true) {
                    throw new Error('Boolean was not saved correctly.');
                }
                if (instance.number !== 0) {
                    throw new Error('String was not saved correctly.');
                }
                if (instance.date === undefined || !moment(new Date('2000-01-01')).isSame(instance.date)) {
                    throw new Error('Date was not saved correctly.');
                }
            });

            it('Creating a new Instance and setting singular relationship to existing instance.', async () => {
                let parent = new Instance(TreeClass);

                parent.name = 'Parent';
                await parent.save();

                data = {
                    className: 'TreeClass',
                    name: 'Child',
                    parent: parent.id,
                }

                const putResult = await miraController.put(data);

                const child = await TreeClass.findById(putResult[0]._id);

                if (!child || child.name !== 'Child') {
                    throw new Error('Instance was not created.');
                }

                if ((await child.parent).id !== parent.id) {
                    throw new Error('Relationship not set correctly.');
                }

                parent = await TreeClass.findById(parent._id);

                const children = await parent.children;

                if (children.size !== 1 || !children.hasInstanceWithId(child._id)) {
                    throw new Error('Reverse relationship not set correctly.');
                }
            });

            it('Creating a new Instance and setting non-singular relationship to existing instances.', async () => {
                let child1 = new Instance(TreeClass)
                let child2 = new Instance(TreeClass);

                child1.name = 'Child1';
                child2.name = 'Child2';
                let children = new InstanceSet(TreeClass, [child1, child2]);

                await children.save();

                data = {
                    className: 'TreeClass',
                    name: 'Parent',
                    children: children.getInstanceIds(),
                }

                const putResult = await miraController.put(data);

                const parent = await TreeClass.findById(putResult[0]._id);

                if (!parent || parent.name !== 'Parent') {
                    throw new Error('Instance was not created.');
                }

                children = await parent.children;

                if (children.size !== 2) {
                    throw new Error('Relationship set incorrectly.');
                }

                for (const child of children) {
                    if (!(await child.parent).equals(parent)) {
                        throw new Error('Reverse relationship set incorrectly.');
                    }
                }
            });

        });

    });

});