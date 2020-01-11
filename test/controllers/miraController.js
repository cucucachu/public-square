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

        before(async () => {
            AllAttributesClass.clear();
            TreeClass.clear();
        });

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

        describe('Editing a Single Instance', () => {
            
            it('Editing an instance with just attributes.', async () => {
                let instance = new Instance(AllAttributesClass);
                instance.assign({
                    string: 'string',
                    boolean: false,
                    number: 1,
                    date : new Date('2000-01-01'),
                });

                await instance.save();

                data = {
                    className: 'AllAttributesClass',
                    id: instance.id,
                    string: 'string2',
                    boolean: true,
                    number: 2,
                    date : new Date('2000-01-02'),
                }

                await miraController.put(data);

                instance = await AllAttributesClass.findById(instance._id);

                if (instance.string !== 'string2') {
                    throw new Error('String attribute not set properly.');
                }
                if (instance.boolean !== true) {
                    throw new Error('Boolean attribute not set properly.');
                }
                if (instance.number !== 2) {
                    throw new Error('String attribute not set properly.');
                }
                if (!moment(instance.date).isSame(new Date('2000-01-02'))) {
                    throw new Error('String attribute not set properly.');
                }
            });

            it('Editing an instance to change a singular relationship to another existing instance.', async() => {
                let parent1 = new Instance(TreeClass);
                let parent2 = new Instance(TreeClass);
                let child = new Instance(TreeClass);

                parent1.name = 'Editing Child: Parent1';
                parent1.children = new InstanceSet(TreeClass, [child]);
                parent2.name = 'Editing Child: Parent2';
                child.name = 'Editing Child';

                await parent1.save();
                await parent2.save();

                const data = {
                    className: 'TreeClass',
                    id: child.id,
                    parent: parent2.id,
                }

                await miraController.put(data);
                
                child = await TreeClass.findById(child._id);
                parent1 = await TreeClass.findById(parent1._id);
                parent2 = await TreeClass.findById(parent2._id);
                const newParent = await child.parent;
                
                if (newParent.id !== parent2.id) {
                    throw new Error('Relationship was not updated.');
                }

                if (!(await newParent.children).hasInstance(child)) {
                    throw new Error('New reverse relationship was not updated.');
                }

                if ((await parent1.children).hasInstance(child)) {
                    throw new Error('Old reverse relationship was not updated.');
                }


            });

            it('Editing an instance to set a non-singular relationship.', async() => {
                let parent = new Instance(TreeClass);
                let child1 = new Instance(TreeClass);
                let child2 = new Instance(TreeClass);

                parent.name = 'Editing Parent Adding Children';
                child1.name = 'Editing Parent Adding Children: Child1';
                child2.name = 'Editing Parent Adding Children: Child2';

                await parent.save();
                await child1.save();
                await child2.save();

                const data = {
                    className: 'TreeClass',
                    id: parent.id,
                    children: [child1.id, child2.id],
                }

                await miraController.put(data);
                
                parent = await TreeClass.findById(parent._id);
                child1 = await TreeClass.findById(child1._id);
                child2 = await TreeClass.findById(child2._id);

                if ((await parent.children).size !== 2) {
                    throw new Error('Relationship not updated corerctly.');
                }

                if ((await child1.parent) === null || !(await child1.parent).equals(parent)) {
                    throw new Error('Original reverse relationship 1 removed.');
                }

                if ((await child2.parent) === null || !(await child2.parent).equals(parent)) {
                    throw new Error('Original reverse relationship 2 removed.');
                }                
            });

            it('Editing an instance to change a non-singular relationship to add another existing instance.', async() => {
                let parent = new Instance(TreeClass);
                let child1 = new Instance(TreeClass);
                let child2 = new Instance(TreeClass);
                let child3 = new Instance(TreeClass);

                parent.name = 'Editing Parent Adding Child';
                parent.children = new InstanceSet(TreeClass, [child1, child2]);
                child1.name = 'Editing Parent Adding Child: Child1';
                child2.name = 'Editing Parent Adding Child: Child2';
                child3.name = 'Editing Parent Adding Child: Child3';

                await parent.save();
                await child3.save();

                const data = {
                    className: 'TreeClass',
                    id: parent.id,
                    children: [child1.id, child2.id, child3.id],
                }

                await miraController.put(data);
                
                parent = await TreeClass.findById(parent._id);
                child1 = await TreeClass.findById(child1._id);
                child2 = await TreeClass.findById(child2._id);
                child3 = await TreeClass.findById(child3._id);

                if ((await parent.children).size !== 3) {
                    throw new Error('Relationship not updated corerctly.');
                }

                if ((await child1.parent) === null || !(await child1.parent).equals(parent)) {
                    throw new Error('Original reverse relationship 1 removed.');
                }

                if ((await child2.parent) === null || !(await child2.parent).equals(parent)) {
                    throw new Error('Original reverse relationship 2 removed.');
                }

                if ((await child3.parent) === null || !(await child3.parent).equals(parent)) {
                    throw new Error('New reverse relationship not set correctly.');
                }
                
            });

            it('Editing an instance to change a non-singular relationship to remove an existing instance.', async() => {
                let parent = new Instance(TreeClass);
                let child1 = new Instance(TreeClass);
                let child2 = new Instance(TreeClass);
                let child3 = new Instance(TreeClass);

                parent.name = 'Editing Parent Removing Child';
                parent.children = new InstanceSet(TreeClass, [child1, child2, child3]);
                child1.name = 'Editing Parent Removing Child: Child1';
                child2.name = 'Editing Parent Removing Child: Child2';
                child3.name = 'Editing Parent Removing Child: Child3';

                await parent.save();

                const data = {
                    className: 'TreeClass',
                    id: parent.id,
                    children: [child1.id, child2.id],
                }

                await miraController.put(data);
                
                parent = await TreeClass.findById(parent._id);
                child1 = await TreeClass.findById(child1._id);
                child2 = await TreeClass.findById(child2._id);
                child3 = await TreeClass.findById(child3._id);

                if ((await parent.children).size !== 2) {
                    throw new Error('Relationship not updated corerctly.');
                }

                if ((await child1.parent) === null || !(await child1.parent).equals(parent)) {
                    throw new Error('Original reverse relationship 1 removed.');
                }

                if ((await child2.parent) === null || !(await child2.parent).equals(parent)) {
                    throw new Error('Original reverse relationship 2 removed.');
                }

                if ((await child3.parent) !== null) {
                    throw new Error('Original reverse relationship 3 not removed.');
                }
            });

            it('Editing an instance to change a non-singular relationship to remove all existing instances.', async() => {
                let parent = new Instance(TreeClass);
                let child1 = new Instance(TreeClass);
                let child2 = new Instance(TreeClass);

                parent.name = 'Editing Parent Removing All Children';
                parent.children = new InstanceSet(TreeClass, [child1, child2]);
                child1.name = 'Editing Parent Removing All Children: Child1';
                child2.name = 'Editing Parent Removing All Children: Child2';

                await parent.save();

                const data = {
                    className: 'TreeClass',
                    id: parent.id,
                    children: [],
                }

                await miraController.put(data);
                
                parent = await TreeClass.findById(parent._id);
                child1 = await TreeClass.findById(child1._id);
                child2 = await TreeClass.findById(child2._id);

                if (!(await parent.children).isEmpty()) {
                    throw new Error('Relationship not updated corerctly.');
                }

                if ((await child1.parent) !== null) {
                    throw new Error('Original reverse relationship 1 not removed.');
                }

                if ((await child2.parent) !== null) {
                    throw new Error('Original reverse relationship 2 not removed.');
                }
            });
            

        });

    });

});