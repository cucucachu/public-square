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
const arraysEqual = TestingFunctions.arraysEqual;
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

        describe('Validations', () => {

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

        describe('Single Layer of Edit/Create', () => {

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
    
                    const child = await TreeClass.findById(noomman.ObjectId(putResult[0].id));
    
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
    
                    const parent = await TreeClass.findById(noomman.ObjectId(putResult[0].id));
    
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
                        throw new Error('Date attribute not set properly.');
                    }
                });
                
                it('Deleting attributes.', async () => {
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
                        string: 'MiraDelete',
                        boolean: 'MiraDelete',
                        number: 'MiraDelete',
                        date : 'MiraDelete',
                    }
    
                    await miraController.put(data);
    
                    instance = await AllAttributesClass.findById(instance._id);
    
                    if (instance.string !== null) {
                        throw new Error('String attribute not deleted properly.');
                    }
                    if (instance.boolean !== null) {
                        throw new Error('Boolean attribute not deleted properly.');
                    }
                    if (instance.number !== null) {
                        throw new Error('String attribute not deleted properly.');
                    }
                    if (instance.date !== null) {
                        throw new Error('Date attribute not deleted properly.');
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

        describe('Multiple Layers of Edit/Create', () => {

            describe('Creating All New Instances', () => {

                it('Creating a new instance and two related instances (Top Down).', async () => {
                    const data = {
                        className: 'TreeClass',
                        name: 'Creating Parent and Children: Parent',
                        children: [
                            {
                                className: 'TreeClass',
                                name: 'Creating parent and Children: Child1',
                            },
                            {
                                className: 'TreeClass',
                                name: 'Creating parent and Children: Child2',
                            },
                        ],
                    }

                    const putResult = await miraController.put(data);

                    const parent = await TreeClass.findById(noomman.ObjectId(putResult[0].id));

                    if (parent === null) {
                        throw new Error('Top level instance not created.');
                    }

                    const children = await parent.children;
                    const child1 = [...children][0];
                    const child2 = [...children][1];

                    if (!(await child1.parent).equals(parent)) {
                        throw new Error('Child is missing parent.');
                    }

                    if (!(await child2.parent).equals(parent)) {
                        throw new Error('Child is missing parent.');
                    }
                });

                it('Creating three laysers of instances (Top Down).', async () => {
                    const data = {
                        className: 'TreeClass',
                        name: 'Creating Parent and Children and GrandChildren: Parent',
                        children: [
                            {
                                className: 'TreeClass',
                                name: 'Creating Parent and Children and GrandChildren: Parent.Child1',
                                children: [
                                    {
                                        className: 'TreeClass',
                                        name: 'Creating Parent and Children and GrandChildren: Parent.Child1.Child1',
                                    },
                                    {
                                        className: 'TreeClass',
                                        name: 'Creating Parent and Children and GrandChildren: Parent.Child1.Child2',
                                    },
                                ],
                            },
                            {
                                className: 'TreeClass',
                                name: 'Creating Parent and Children and GrandChildren: Parent.Child2',
                                children: [
                                    {
                                        className: 'TreeClass',
                                        name: 'Creating Parent and Children and GrandChildren: Parent.Child2.Child1',
                                    },
                                    {
                                        className: 'TreeClass',
                                        name: 'Creating Parent and Children and GrandChildren: Parent.Child2.Child2',
                                    },
                                ],
                            },
                        ],
                    }

                    const putResult = await miraController.put(data);

                    const parent = await TreeClass.findById(noomman.ObjectId(putResult[0].id));

                    if (parent === null) {
                        throw new Error('Top level instance not created.');
                    }

                    const children = await parent.children;
                    const child1 = [...children][0];
                    const child2 = [...children][1];

                    if (!(await child1.parent).equals(parent)) {
                        throw new Error('Child is missing parent.');
                    }

                    if (!(await child2.parent).equals(parent)) {
                        throw new Error('Child is missing parent.');
                    }

                    const grandChildren1 = await child1.children;
                    const grandChild1 = [...grandChildren1][0];
                    const grandChild2 = [...grandChildren1][1];

                    const grandChildren2 = await child2.children;
                    const grandChild3 = [...grandChildren2][0];
                    const grandChild4 = [...grandChildren2][1];

                    if (!(await grandChild1.parent).equals(child1)) {
                        throw new Error('Grandchild is missing parent.');
                    }

                    if (!(await grandChild2.parent).equals(child1)) {
                        throw new Error('Grandchild is missing parent.');
                    }

                    if (!(await grandChild3.parent).equals(child2)) {
                        throw new Error('Grandchild is missing parent.');
                    }

                    if (!(await grandChild4.parent).equals(child2)) {
                        throw new Error('Grandchild is missing parent.');
                    }
                });

                it('Creating a new child instance and a parent instance (Bottom Up)', async () => {
                    const data = {
                        className: 'TreeClass',
                        name: 'Creating Child Then Parent (Bottom Up): Child',
                        parent: {
                            className: 'TreeClass',
                            name: 'Creating Child Then Parent (Bottom Up): Parent',
                        },
                    };

                    const putResult = await miraController.put(data);

                    const child = await TreeClass.findById(noomman.ObjectId(putResult[0].id));
                    const parent = await child.parent;

                    if (parent === null) {
                        throw new Error('Parent Instance not created.');
                    }

                    if (!(await parent.children).hasInstance(child)) {
                        throw new Error('Parent does not have children relationship set correctly.');
                    }
                });

                it('Create 3 layers of instances (Middle Up and Down)', async () => {
                    const data = {
                        className: 'TreeClass',
                        name: 'Creating 3 Layers (Middle Up and Down): Child',
                        parent: {
                            className: 'TreeClass',
                            name: 'Creating 3 Layers (Middle Up and Down): Parent',
                        },
                        children: [
                            {
                                className: 'TreeClass',
                                name: 'Creating 3 Layers (Middle Up and Down): GrandChild1',
                            },
                            {
                                className: 'TreeClass',
                                name: 'Creating 3 Layers (Middle Up and Down): GrandChild2',
                            },
                        ],
                    }

                    const putResult = await miraController.put(data);

                    const child = await TreeClass.findById(noomman.ObjectId(putResult[0].id));
                    const parent = await child.parent;
                    const grandChildren = await child.children;
                    const grandChild1 = [...grandChildren][0];
                    const grandChild2 = [...grandChildren][1];

                    if (child === null) {
                        throw new Error('Child instance not created.');
                    }

                    if (parent === null || !(await parent.children).hasInstance(child)) {
                        throw new Error('Parent instance not created correctly.');
                    }

                    if (!(await grandChild1.parent).equals(child) || !(await grandChild2.parent).equals(child)) {
                        throw new Error('Grandchildren not created correctly.');
                    }
                });

                it('Create 3 layers of instances (Bottom Up)', async () => {
                    const data = {
                        className: 'TreeClass',
                        name: 'Create 3 Layers of Instances (Bottom Up): GrandChild',
                        parent: {
                            className: 'TreeClass',
                            name: 'Create 3 Layers of Instances (Bottom Up): Child',
                            parent: {
                                className: 'TreeClass',
                                name: 'Create 3 Layers of Instances (Bottom Up): Parent',
                            },                            
                        },
                    };

                    const putResult = await miraController.put(data);

                    const grandChild = await TreeClass.findById(noomman.ObjectId(putResult[0].id));

                    if (grandChild === null) {
                        throw new Error('Grandchild not created.');
                    }

                    const child = await grandChild.parent;

                    if (child === null || !(await child.children).hasInstance(grandChild)) {
                        throw new Error('Child not created correctly.');
                    }

                    const parent = await child.parent;

                    if (parent === null || !(await parent.children).hasInstance(child)) {
                        throw new Error('Parent not created correctly.');
                    }
                });                

            });

            describe('Adding New Related Instances to Existing Instances', () => {

                it('Creating new related instances for existing instance (Top Down).', async () => {
                    let parent = new Instance(TreeClass);
                    parent.name = 'Creating Children for Existing Parent: Parent';

                    await parent.save();

                    data = {
                        className: 'TreeClass',
                        id: parent.id,
                        children: [
                            {
                                className: 'TreeClass',
                                name: 'Creating Children for Existing Parent: Child1',
                            },
                            {
                                className: 'TreeClass',
                                name: 'Creating Children for Existing Parent: Child2',
                            },
                        ],
                    };

                    const putResult = await miraController.put(data);

                    if (putResult[0].id !== parent.id) {
                        throw new Error('Put Result contains incorrect id.');
                    }

                    if (putResult[0].created !== false || putResult[1].created !== true || putResult[1].created !== true) {
                        throw new Error('Put Result contains incorrect value for "created"');
                    }

                    parent = await TreeClass.findById(parent._id);
                    const children = (await parent.children);
                    const child1 = [...children][0];
                    const child2 = [...children][1];

                    if (!(await child1.parent).equals(parent) || !(await child2.parent).equals(parent)) {
                        throw new Error('Children parent relationships not set correctly.');
                    }


                    const childIds = children.getInstanceIds();

                    if (!childIds.includes(putResult[1].id) || ! childIds.includes(putResult[2].id)) {
                        throw new Error('Put Results contains incorrect child Ids.');
                    }
                });

                it('Creating new related instances for existing instance (Bottom Up).', async () => {
                    let child = new Instance(TreeClass);
                    child.name = 'Creating Parent for Existing Child: Child';

                    await child.save();

                    data = {
                        className: 'TreeClass',
                        id: child.id,
                        parent: {
                            className: 'TreeClass',
                            name: 'Creating Parent for Existing Child: Parent',
                        },
                    };

                    const putResult = await miraController.put(data);

                    if (putResult[0].id !== child.id) {
                        throw new Error('Put Result contains incorrect id.');
                    }

                    if (putResult[0].created !== false || putResult[1].created !== true) {
                        throw new Error('Put Result contains incorrect value for "created"');
                    }

                    child = await TreeClass.findById(child._id);
                    const parent = await child.parent;

                    if (parent === null || !(await parent.children).hasInstance(child)) {
                        throw new Error('Parent instance not created correctly.');
                    }
                });

                it('Creating new children and grandchildren for existing parent (Top Down).', async () => {
                    let parent = new Instance(TreeClass);
                    parent.name = 'New Children and Grandchildren for Existing Parent (Top Down): Parent';

                    await parent.save();

                    const data = {
                        className: 'TreeClass',
                        id: parent.id,
                        children: [
                            {
                                className: 'TreeClass',
                                name: 'New Children and Grandchildren for Existing Parent (Top Down): Child1',
                                children: [
                                    {
                                        className: 'TreeClass',
                                        name: 'New Children and Grandchildren for Existing Parent (Top Down): GrandChild1'
                                    },
                                    {
                                        className: 'TreeClass',
                                        name: 'New Children and Grandchildren for Existing Parent (Top Down): GrandChild2'
                                    },
                                ],
                            },
                            {
                                className: 'TreeClass',
                                name: 'New Children and Grandchildren for Existing Parent (Top Down): Child2',
                                children: [
                                    {
                                        className: 'TreeClass',
                                        name: 'New Children and Grandchildren for Existing Parent (Top Down): GrandChild3'
                                    },
                                    {
                                        className: 'TreeClass',
                                        name: 'New Children and Grandchildren for Existing Parent (Top Down): GrandChild4'
                                    },
                                ],
                            },
                        ],
                    };

                    const putResult = await miraController.put(data);

                    parent = await TreeClass.findById(parent._id);

                    const children = await parent.children;
                    const child1 = [...children][0];
                    const child2 = [...children][1];

                    if (child1 === null || child2 === null) {
                        throw new Error('Children not created.');
                    }

                    if (!(await child1.parent).equals(parent) || !(await child2.parent).equals(parent)) {
                        throw new Error('Children\'s parent relationship not set correctly.');
                    }

                    const grandChildren1 = await child1.children;
                    const grandChildren2 = await child2.children;
                    const grandChild1 = [...grandChildren1][0];
                    const grandChild2 = [...grandChildren1][1];
                    const grandChild3 = [...grandChildren2][0];
                    const grandChild4 = [...grandChildren2][1];

                    if (grandChild1 === null || grandChild2 === null || grandChild3 === null || grandChild4 === null) {
                        throw new Error('Grandchildren not created.');
                    }

                    if (!(await grandChild1.parent).equals(child1) || !(await grandChild2.parent).equals(child1) ||
                        !(await grandChild3.parent).equals(child2) || !(await grandChild4.parent).equals(child2)) {
                            throw new Error('Grandchildren\'s parent relationship not set correctly.');
                    }



                });

                it('Creating new parent and grandchildren for existing child (Middle Up and Down).', async () => {
                    let child = new Instance(TreeClass);
                    child.name = 'New Parent and Grandchildren for Existing Child (Middle Up and Down): Child';

                    await child.save();

                    const data = {
                        className: 'TreeClass',
                        id: child.id,
                        parent: {
                            className: 'TreeClass',
                            name: 'New Parent and Grandchildren for Existing Child (Middle Up and Down): Parent'
                        },
                        children: [
                            {
                                className: 'TreeClass',
                                name: 'New Parent and Grandchildren for Existing Child (Middle Up and Down): GrandChild1'
                            },
                            {
                                className: 'TreeClass',
                                name: 'New Parent and Grandchildren for Existing Child (Middle Up and Down): GrandChild2'
                            },
                        ],
                    }

                    await miraController.put(data);

                    child = await TreeClass.findById(child._id);
                    const parent = await child.parent;
                    const grandChildren = await child.children;
                    const grandChild1 = [...grandChildren][0];
                    const grandChild2 = [...grandChildren][1];

                    if (parent === null || !(await parent.children).hasInstance(child)) {
                        throw new Error('Parent not created correctly.');
                    }

                    if (grandChild1 === null || grandChild2 === null || 
                        !(await grandChild1.parent).equals(child) || !(await grandChild2.parent).equals(child)
                        ) {
                            throw new Error('Grandchildren not created correctly.');
                    }


                });

                it('Creating new parent and grandparent for existing grandchild (Bottom Up).', async () => {
                    let grandChild = new Instance(TreeClass);
                    grandChild.name = 'New Parent and GrandParent for GrandChild (BottomUp): GrandChild';

                    await grandChild.save();

                    const data = {
                        className: 'TreeClass',
                        id: grandChild.id,
                        parent: {
                            className: 'TreeClass',
                            name: 'New Parent and GrandParent for GrandChild (BottomUp): Child',
                            parent: {
                                className: 'TreeClass',
                                name: 'New Parent and GrandParent for GrandChild (BottomUp): Parent',
                            }
                        }
                    }

                    const putResult = await miraController.put(data);

                    grandChild = await TreeClass.findById(grandChild._id);
                    const child = await grandChild.parent;

                    if (child === null || !(await child.children).hasInstance(grandChild)) {
                        throw new Error('Child not set up correctly.');
                    }

                    const parent = await child.parent;

                    if (parent === null || !(await parent.children).hasInstance(child)) {
                        throw new Error('Parent not set up correctly.');
                    }
                });

            });

            describe('Editing Already Set Relationships Combining Edit and Create', () => {

                it('Adding new children and grandchildren to parent with existing children and grandchildren (Top Down).', async () => {
                    let parent = new Instance(TreeClass);
                    let originalChild = new Instance(TreeClass);
                    let originalGrandChild = new Instance(TreeClass);

                    parent.assign({
                        name: 'Adding Children and Grandchildren: Parent',
                        children: new InstanceSet(TreeClass, [originalChild]),
                    });
                    originalChild.assign({
                        name: 'Adding Children and Grandchildren: Original Child',
                        parent: parent,
                        children: new InstanceSet(TreeClass, [originalGrandChild]),
                    });
                    originalGrandChild.assign({
                        name: 'Adding Children and Grandchildren: Original GrandChild',
                        parent: originalChild,
                    });

                    await parent.save();
                    await originalChild.save();
                    await originalGrandChild.save();

                    const data = {
                        className: 'TreeClass',
                        id: parent.id,
                        children: [
                            {
                                className: 'TreeClass',
                                id: originalChild.id,
                                children: [
                                    {
                                        className: 'TreeClass',
                                        id: originalGrandChild.id,
                                    },
                                    {
                                        className: 'TreeClass',
                                        name: 'Adding Children and Grandchildren: New GrandChild 1',
                                    },
                                ],
                            },
                            {
                                className: 'TreeClass',
                                name: 'Adding Children and Grandchildren: New Child',
                                children: [
                                    {
                                        className: 'TreeClass',
                                        name: 'Adding Children and Grandchildren: New GrandChild 2',
                                    },
                                    {
                                        className: 'TreeClass',
                                        name: 'Adding Children and Grandchildren: New GrandChild 3',
                                    },
                                ],
                            },
                        ],
                    };

                    const putResult = await miraController.put(data);

                    parent = await TreeClass.findById(parent._id);
                    const children = await parent.children;

                    if (children.size !== 2) {
                        throw new Error('Number of children should be 2.');
                    }

                    originalChild = children.getInstanceWithId(originalChild._id);
                    const newChild = [...children][1];

                    if (originalChild.equals(newChild)) {
                        throw new Error('Parent children in wrong order.');
                    }

                    if (!(await originalChild.parent).equals(parent) || !(await newChild.parent).equals(parent)) {
                        throw new Error('Children not updated correctly.');
                    }

                    const grandChildren1 = await originalChild.children;
                    const grandChildren2 = await newChild.children;

                    if (grandChildren1.size !== 2 || grandChildren2.size !== 2) {
                        throw new Error('Missing grandchild.');
                    }

                    if (!(grandChildren1.hasInstanceWithId(originalGrandChild._id))) {
                        throw new Error('Original GrandChild missing.');
                    }

                    const grandChild1 = [...grandChildren1][0];
                    const grandChild2 = [...grandChildren1][1];
                    const grandChild3 = [...grandChildren2][0];
                    const grandChild4 = [...grandChildren2][1];

                    if (!(await grandChild1.parent).equals(originalChild) || !(await grandChild2.parent).equals(originalChild) ||
                        !(await grandChild3.parent).equals(newChild) || !(await grandChild4.parent).equals(newChild)) {
                            throw new Error('GrandChildren not updated correctly.');
                    }

                });

                it('Replacing children and grandchildren for parent with new children and grandchildren (Top Down).', async () => {
                    let parent = new Instance(TreeClass);
                    let originalChild = new Instance(TreeClass);
                    let originalGrandChild = new Instance(TreeClass);

                    parent.assign({
                        name: 'Replacing Children and Grandchildren (Top Down): Parent',
                        children: new InstanceSet(TreeClass, [originalChild]),
                    });
                    originalChild.assign({
                        name: 'Replacing Children and Grandchildren (Top Down): Original Child',
                        parent: parent,
                        children: new InstanceSet(TreeClass, [originalGrandChild]),
                    });
                    originalGrandChild.assign({
                        name: 'Replacing Children and Grandchildren (Top Down): Original GrandChild',
                        parent: originalChild,
                    });

                    await parent.save();
                    await originalChild.save();
                    await originalGrandChild.save();

                    const data = {
                        className: 'TreeClass',
                        id: parent.id,
                        children: [
                            {
                                className: 'TreeClass',
                                name: 'Replacing Children and Grandchildren (Top Down): New Child',
                                children: [
                                    {
                                        className: 'TreeClass',
                                        name: 'Replacing Children and Grandchildren (Top Down): New GrandChild',
                                    },
                                ],
                            },
                        ],
                    }

                    const putResult = await miraController.put(data);

                    parent = await TreeClass.findById(parent._id);
                    originalChild = await TreeClass.findById(originalChild._id);
                    originalGrandChild = await TreeClass.findById(originalGrandChild._id);
                    const children = await parent.children;

                    if (children.hasInstance(originalChild) || children.size !== 1) {
                        throw new Instance('Children not updated correctly.');
                    }

                    if ((await originalChild.parent) !== null) {
                        throw new Instance('Original Child not disconnected from parent.');
                    }

                    if (!(await originalChild.children).hasInstance(originalGrandChild) || !(await originalGrandChild.parent).equals(originalChild)) {
                        throw new Error('Original Child and Original GrandChild disconnected.');
                    }

                    const newChild = [...children][0];
                    const newGrandChildren = await newChild.children;
                    const newGrandChild = [...newGrandChildren][0];

                    if (!(await newChild.parent).equals(parent) || !(await newGrandChild.parent).equals(newChild)) {
                        throw new Error('New Child and Grandchild not created correctly.');
                    }
                });

                it('Replacing parent and adding grandchildren to child with existing parent and children (Middle Up and Down).', async () => {
                    let originalParent = new Instance(TreeClass);
                    let child = new Instance(TreeClass);
                    let originalGrandChild = new Instance(TreeClass);


                    originalParent.assign({
                        name: 'Replacing Parent and Adding Children: Original Parent',
                        children: new InstanceSet(TreeClass, [child]),
                    });
                    child.assign({
                        name: 'Replacing Parent and Adding Children: Child',
                        parent: originalParent,
                        children: new InstanceSet(TreeClass, [originalGrandChild]),
                    });
                    originalGrandChild.assign({
                        name: 'Replacing Parent and Adding Children: Original GrandChild',
                        parent: child,
                    });

                    await originalParent.save();
                    await child.save();
                    await originalGrandChild.save();

                    const data = {
                        className: 'TreeClass',
                        id: child.id,
                        parent: {
                            className: 'TreeClass',
                            name: 'Replacing Parent and Adding Children: New Parent'
                        },
                        children: [
                            {
                                className: 'TreeClass',
                                id: originalGrandChild.id,
                            },
                            {
                                className: 'TreeClass',
                                name: 'Replacing Parent and Adding Children: New GrandChild',
                            },
                        ],
                    };

                    const putResult = await miraController.put(data);

                    originalParent = await TreeClass.findById(originalParent._id);
                    child = await TreeClass.findById(child._id);
                    originalGrandChild = await TreeClass.findById(originalGrandChild._id);
                    const newParent = await child.parent;

                    if (!(await originalParent.children).isEmpty() || newParent.equals(originalParent)) {
                        throw new Error('Original Parent not disconnected from child.');
                    }

                    if (!(await originalGrandChild.parent).equals(child)) {
                        throw new Error('Original grand child disconnected from child.');
                    }

                    if (!(await newParent.children).hasInstance(child)) {
                        throw new Error('New parent not created correctly.');
                    }

                    const grandChildren = await child.children;
                    const newGrandChild = await TreeClass.findById(noomman.ObjectId(putResult[3].id));

                    if (newGrandChild.equals(originalGrandChild)) {
                        throw new Error('Test grabbed wrong new grandchild.');
                    }

                    if (!grandChildren.hasInstance(newGrandChild) || !grandChildren.hasInstance(originalGrandChild) ||
                        !(await newGrandChild.parent).equals(child)
                    ) {
                        throw new Error('Grandchildren not created/updated correctly.')
                    }
                });

                it('Replacing parent and grandparent for grandchild with existing parent (Bottom Up).', async () => {
                    let originalParent = new Instance(TreeClass);
                    let originalChild = new Instance(TreeClass);
                    let grandChild = new Instance(TreeClass);

                    originalParent.assign({
                        name: 'Replacing Parent and GrandParent: Original Parent',
                        children: new InstanceSet(TreeClass, [originalChild]),
                    });
                    originalChild.assign({
                        name: 'Replacing Parent and GrandParent: Original Child',
                        parent: originalParent,
                        children: new InstanceSet(TreeClass, [grandChild]),
                    });
                    grandChild.assign({
                        name: 'Replacing Parent and GrandParent: Grand Child',
                        parent: originalChild,
                    });

                    await originalParent.save();
                    await originalChild.save();
                    await grandChild.save();

                    const data = {
                        className: 'TreeClass',
                        id: grandChild.id,
                        parent: {
                            className: 'TreeClass',
                            name: 'Replacing Parent and GrandParent: New Child',
                            parent: {
                                className: 'TreeClass',
                                name: 'Replacing Parent and GrandParent: New Parent',
                            },
                        },
                    };

                    const putResult = await miraController.put(data);

                    originalParent = await TreeClass.findById(originalParent._id);
                    originalChild = await TreeClass.findById(originalChild._id);
                    grandChild = await TreeClass.findById(grandChild._id);
                    const newChild = await grandChild.parent;

                    if (!(await originalParent.children).hasInstance(originalChild) || !(await originalChild.parent).equals(originalParent)) {
                        throw new Error('Original Parent child relationship removed.');
                    }

                    if (newChild === null || newChild.equals(originalChild) || !(await newChild.children).hasInstance(grandChild)) {
                        throw new Error('New grandChild to child relationship not set correctly.');
                    }

                    const newParent = await newChild.parent;

                    if (newParent.equals(originalParent) || !(await newParent.children).hasInstance(newChild)) {
                        throw new Error('New parent child relationship not set correctly.')
                    }
                });

                it('Replacing parent and setting grandparent to same grandparent for grandchild with existing parent (Bottom Up).', async () => {
                    let originalParent = new Instance(TreeClass);
                    let originalChild = new Instance(TreeClass);
                    let grandChild = new Instance(TreeClass);

                    originalParent.assign({
                        name: 'Replacing Parent: Original Parent',
                        children: new InstanceSet(TreeClass, [originalChild]),
                    });
                    originalChild.assign({
                        name: 'Replacing Parent: Original Child',
                        parent: originalParent,
                        children: new InstanceSet(TreeClass, [grandChild]),
                    });
                    grandChild.assign({
                        name: 'Replacing Parent: Grand Child',
                        parent: originalChild,
                    });

                    await originalParent.save();
                    await originalChild.save();
                    await grandChild.save();

                    const data = {
                        className: 'TreeClass',
                        id: grandChild.id,
                        parent: {
                            className: 'TreeClass',
                            name: 'Replacing Parent: New Child',
                            parent: {
                                className: 'TreeClass',
                                id: originalParent.id,
                            }
                        }
                    };
                    
                    const putResult = await miraController.put(data);

                    originalParent = await TreeClass.findById(originalParent._id);
                    originalChild = await TreeClass.findById(originalChild._id);
                    grandChild = await TreeClass.findById(grandChild._id);

                    const newChild = await grandChild.parent;
                    const children = await originalParent.children;

                    if (!(await originalChild.children).isEmpty() || newChild === null || newChild.equals(originalChild)) {
                        throw new Error('Original grandChild to child relationship not unset.');
                    }

                    if (!(await newChild.children).hasInstance(grandChild)) {
                        throw new Error('New grandChild to child relationship not set correctly.');
                    }

                    if (!(await newChild.parent).equals(originalParent) || !children.hasInstance(newChild) || 
                        !(await originalChild.parent).equals(originalParent) || !children.hasInstance(originalChild)
                    ) {
                        throw new Error('Parent to children relationship not set correctly.');
                    }
                });

            });

        });

    });

    describe('miraController.get()', () => {

        before(async () => {
            await TreeClass.clear();
            await AllAttributesClass.clear();
        });

        describe('Validations', () => {

            it('Error thrown if no request given.', async () => {
                const expectedErrorMessage = 'No request given.';
                await testForErrorAsync('miraController.get()', expectedErrorMessage, async () => {
                    return miraController.get();
                });
            });

            it('Error thrown if request does not have a className.', async () => {
                const expectedErrorMessage = 'Given request has no className property.';
                await testForErrorAsync('miraController.get()', expectedErrorMessage, async () => {
                    return miraController.get({
                        id: noomman.ObjectId().toHexString(),
                    });
                });
            });

            it('Error thrown if request has invalid className.', async () => {
                const expectedErrorMessage = 'No ClassModel found with name ThisIsNotARealClassModel.';
                await testForErrorAsync('miraController.get()', expectedErrorMessage, async () => {
                    return miraController.get({
                        className: 'ThisIsNotARealClassModel',
                        id: noomman.ObjectId().toHexString(),
                    });
                });
            });

            it('Error thrown if request has no id.', async () => {
                const expectedErrorMessage = 'Given request has no id property.';
                await testForErrorAsync('miraController.get()', expectedErrorMessage, async () => {
                    return miraController.get({
                        className: 'ThisIsNotARealClassModel',
                    });
                });
            });

            it('Error thrown if request has no id.', async () => {
                const expectedErrorMessage = 'Given request contains invalid id: "notARealId".';
                await testForErrorAsync('miraController.get()', expectedErrorMessage, async () => {
                    return miraController.get({
                        className: 'TreeClass',
                        id: 'notARealId',
                    });
                });
            });

        });

        describe('Getting a Single Instance', () => {

            it('Get an instance with only attributes.', async () => {
                const instance = new Instance(AllAttributesClass);
                const data = {
                    string: 'string',
                    boolean: true,
                    number: 1,
                    date: new Date('2000-01-01'),
                    strings: ['string1', 'string2'],
                    booleans: [true, false],
                    numbers: [0, 1, 2],
                    dates: [
                        new Date('2000-01-01'),
                        new Date('2000-01-02'),
                        new Date('2000-01-03'),
                    ],
                };

                instance.assign(data);

                await instance.save();

                const request = {
                    className: 'AllAttributesClass',
                    id: instance.id,
                };

                const response = await miraController.get(request);

                console.log(response.displayAs);

                if (response.className !== request.className || response.id !== request.id ||
                    response.displayAs !== instance.displayAs()
                ) {
                    throw new Error('ClassName, id, or displayAs is incorrect.');
                }

                if (response.string !== data.string || response.boolean !== data.boolean ||
                    response.number !== data.number || 
                    !moment(response.date).isSame(data.date)
                ) {
                    throw new Error('Singular attribute incorrect.');
                }

                if (!arraysEqual(response.numbers, data.numbers) ||
                    !arraysEqual(response.strings, data.strings) ||
                    !arraysEqual(response.dates, data.dates) ||
                    !arraysEqual(response.booleans, data.booleans)
                ) {
                    throw new Error('List attribute incorrect.');
                }
            });

            it('Get an instance with a singular relationship.', async () => {
                const child = new Instance(TreeClass);
                const parent = new Instance(TreeClass);
                child.name = 'Child';
                parent.name = 'Parent';

                child.parent = parent;

                await child.save();

                const request = {
                    className: 'TreeClass',
                    id: child.id,
                }

                const response = await miraController.get(request);

                if (response.className !== child.classModel.className ||
                    response.id !== child.id ||
                    response.displayAs !== child.classModel.className + ': ' + child.id
                ) {
                    throw new Error('Basic root info incorrect.');
                }

                if (!response.parent ||
                    response.parent.className !== parent.classModel.className ||
                    response.parent.id !== parent.id ||
                    response.parent.displayAs !== parent.classModel.className + ': ' + parent.id
                ) {
                    throw new Error('Parent info incorrect.');
                }
            });

            it('Get an instance with a non-singular relationship.', async () => {
                const parent = new Instance(TreeClass);
                const child1 = new Instance(TreeClass);
                const child2 = new Instance(TreeClass);

                parent.name = 'Parent';
                child1.name = 'Child1';
                child2.name = 'Child2';

                parent.children = new InstanceSet(TreeClass, [child1, child2]);

                await parent.save();

                const request = {
                    className: 'TreeClass',
                    id: parent.id,
                }

                const response = await miraController.get(request);

                if (response.className !== parent.classModel.className ||
                    response.id !== parent.id ||
                    response.displayAs !== parent.classModel.className + ': ' + parent.id
                ) {
                    throw new Error('Basic root info incorrect.');
                }

                const responseChild1 = response.children[0];
                const responseChild2 = response.children[1];

                if (!responseChild1 ||
                    responseChild1.className !== child1.classModel.className ||
                    responseChild1.id !== child1.id ||
                    responseChild1.displayAs !== child1.classModel.className + ': ' + child1.id
                ) {
                    throw new Error('Children info incorrect.');
                }

                if (!responseChild2 ||
                    responseChild2.className !== child2.classModel.className ||
                    responseChild2.id !== child2.id ||
                    responseChild2.displayAs !== child2.classModel.className + ': ' + child2.id
                ) {
                    throw new Error('Children info incorrect.');
                }
            });

        });

        describe('Getting Multiple Layers of Instances', () => {

            it('Get 2 layers of instances with all attributes and relationships (Singular Relationship).', async () => {
                const child = new Instance(TreeClass);
                const parent = new Instance(TreeClass);
                child.name = 'Child';
                parent.name = 'Parent';

                child.parent = parent;

                await child.save();

                const request = {
                    className: 'TreeClass',
                    id: child.id,
                    parent: true,
                };

                const response = await miraController.get(request);

                if (!response.parent ||
                    response.parent.name !== parent.name ||
                    !response.parent.children ||
                    response.parent.children.length !== 1 ||
                    response.parent.children[0].id !== child.id
                ) {
                    throw new Error('Response does not have all expected data.');
                }
            });

            it('Get 2 layers of instances with all attributes and relationships (Non-Singular Relationship).', async () => {
                const parent = new Instance(TreeClass);
                const child1 = new Instance(TreeClass);
                const child2 = new Instance(TreeClass);

                parent.name = 'Parent';
                child1.name = 'Child1';
                child2.name = 'Child2';

                parent.children = new InstanceSet(TreeClass, [child1, child2]);

                await parent.save();

                const request = {
                    className: 'TreeClass',
                    id: parent.id,
                    children: true,
                };

                const response = await miraController.get(request);

                const responseChild1 = response.children[0];
                const responseChild2 = response.children[1];

                if (!responseChild1 ||
                    responseChild1.name !== child1.name ||
                    responseChild1.parent.id !== parent.id
                ) {
                    throw new Error('Response is missing data for child1.');
                }

                if (!responseChild2 ||
                    responseChild2.name !== child2.name ||
                    responseChild2.parent.id !== parent.id
                ) {
                    throw new Error('Response is missing data for child2.');
                }
            });

            it('Get 3 layers of instances with all attributes and relationships (Singular Relationship).', async () => {
                const parent = new Instance(TreeClass);
                const child = new Instance(TreeClass);
                const grandChild = new Instance(TreeClass);

                parent.assign({
                    name: 'Parent',
                    children: new InstanceSet(TreeClass, [child]),
                });
                child.assign({
                    name: 'Child',
                    parent: parent,
                    children: new InstanceSet(TreeClass, [grandChild]),
                });
                grandChild.assign({
                    name: 'GrandChild',
                    parent: child,
                });

                await parent.save();
                await child.save();
                await grandChild.save();

                const request = {
                    className: 'TreeClass',
                    id: grandChild.id,
                    parent: {
                        parent: true,
                    },
                };

                const response = await miraController.get(request);

                if (!response.parent ||
                    !response.parent.parent ||
                    response.parent.parent.id !== parent.id ||
                    response.parent.parent.name !== parent.name ||
                    response.parent.parent.children[0].id !== child.id
                ) {
                    throw new Error('Response does not all have data for third layer.');
                }
            });

            it('Get 3 layers of instances with all attributes and relationships (Non-Singular Relationship).', async () => {
                const parent = new Instance(TreeClass);
                const child = new Instance(TreeClass);
                const grandChild = new Instance(TreeClass);

                parent.assign({
                    name: 'Parent',
                    children: new InstanceSet(TreeClass, [child]),
                });
                child.assign({
                    name: 'Child',
                    parent: parent,
                    children: new InstanceSet(TreeClass, [grandChild]),
                });
                grandChild.assign({
                    name: 'GrandChild',
                    parent: child,
                });

                await parent.save();
                await child.save();
                await grandChild.save();

                const request = {
                    className: 'TreeClass',
                    id: parent.id,
                    children: {
                        children: true,
                    },
                }

                const response = await miraController.get(request);

                if (!response.children ||
                    !response.children[0].children ||
                    response.children[0].children[0].id !== grandChild.id ||
                    response.children[0].children[0].name !== grandChild.name ||
                    response.children[0].children[0].parent.id !== child.id
                ) {
                    throw new Error('Response third layer does not have all data.');
                }
            });

        });

    });

});