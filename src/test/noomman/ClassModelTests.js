require("@babel/polyfill");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassModel = require('../../dist/noomman/ClassModel');
const InstanceSet = require('../../dist/noomman/InstanceSet');
const Instance = require('../../dist/noomman/Instance');
const database = require('../../dist/noomman/database');
const TestClassModels = require('./helpers/TestClassModels');
const TestingFunctions = require('./helpers/TestingFunctions');
const testForError = TestingFunctions.testForError;
const testForErrorAsync = TestingFunctions.testForErrorAsync;

// Load all TestClassModels 
{
    // Compare Classes
    var CompareClass1 = TestClassModels.CompareClass1;
    var CompareClass2 = TestClassModels.CompareClass2;

    // Validation Classes
    var AllFieldsRequiredClass = TestClassModels.AllFieldsRequiredClass;
    var AllFieldsMutexClass = TestClassModels.AllFieldsMutexClass;
    var AllFieldsInRequiredGroupClass = TestClassModels.AllFieldsInRequiredGroupClass;
    var MutexClassA = TestClassModels.MutexClassA;
    var MutexClassB = TestClassModels.MutexClassB;
    var MutexClassC = TestClassModels.MutexClassC;

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

    // Relationship Classes
    var SingularRelationshipClass = TestClassModels.SingularRelationshipClass;
    var NonSingularRelationshipClass = TestClassModels.NonSingularRelationshipClass;
    var SubClassOfSingularRelationshipClass = TestClassModels.SubClassOfSingularRelationshipClass;
    var SubClassOfNonSingularRelationshipClass = TestClassModels.SubClassOfNonSingularRelationshipClass;

    // ReadControlled Classes
    var ReadControlledSuperClass = TestClassModels.ReadControlledSuperClass;
    var ReadControlledSubClassOfReadControlledSuperClass = TestClassModels.ReadControlledSubClassOfReadControlledSuperClass;
    var ReadControlledDiscriminatedSuperClass = TestClassModels.ReadControlledDiscriminatedSuperClass;
    var ReadControlledSubClassOfReadControlledDiscriminatedSuperClass = TestClassModels.ReadControlledSubClassOfReadControlledDiscriminatedSuperClass;
    var ClassControlsReadControlledSuperClass = TestClassModels.ClassControlsReadControlledSuperClass;
    var ReadControlledClassReadControlledByParameters = TestClassModels.ReadControlledClassReadControlledByParameters;
    var SingularRelationshipToReadControlledClassReadControlledByParameters = TestClassModels.SingularRelationshipToReadControlledClassReadControlledByParameters;
    var NonSingularRelationshipToReadControlledClassReadControlledByParameters = TestClassModels.NonSingularRelationshipToReadControlledClassReadControlledByParameters;

    // UpdateControlled Classes
    var UpdateControlledSuperClass = TestClassModels.UpdateControlledSuperClass;
    var UpdateControlledSubClassOfUpdateControlledSuperClass = TestClassModels.UpdateControlledSubClassOfUpdateControlledSuperClass;
    var UpdateControlledDiscriminatedSuperClass = TestClassModels.UpdateControlledDiscriminatedSuperClass;
    var UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass = TestClassModels.UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass;
    var ClassControlsUpdateControlledSuperClass = TestClassModels.ClassControlsUpdateControlledSuperClass;
    var UpdateControlledClassUpdateControlledByParameters = TestClassModels.UpdateControlledClassUpdateControlledByParameters;
}

describe('Class Model Tests', () => {

    before(async () => {
        await database.connect();
    });

    after(() => {
        database.close();
    });

    describe('Class Model Constructor', () => {

        describe('Required constructor parameters', () => {

            it('ClassName is required.', () => { 
                testForError('ClassModel.constructor()', 'className is required.', () => {
                    new ClassModel({});
                });
            });


        });

        describe('Inheritence Requirements', () => {

            it('If superClasses is set, it must be an Array.', () => {
                testForError('ClassModel.constructor()', 'If superClasses is set, it must be an Array.', () => {
                    new ClassModel({
                        className: 'SubClassModel',
                        superClasses: SuperClass
                    });
                });
            });
    
            it('If superClasses is set, it cannot be an empty Array.', () => {
                testForError('ClassModel.constructor()', 'If superClasses is set, it cannot be an empty Array.', () => {
                    new ClassModel({
                        className: 'SubClassModel',
                        superClasses: []
                    });
                });
            });
    
            it('If discriminatorSuperClass is set, it can only be a single class.', () => {
                testForError('ClassModel.constructor()', 'If discriminatorSuperClass is set, it can only be a single class.', () => {
                    new ClassModel({
                        className: 'SubClassModel',
                        discriminatorSuperClass: [SuperClass, DiscriminatedSuperClass]
                    })
                });
            });
    
            it('A ClassModel cannot have both superClasses and discriminatorSuperClass.', () => {
                testForError('ClassModel.constructor()', 'A ClassModel cannot have both superClasses and discriminatorSuperClass.', () => {
                    new ClassModel({
                        className: 'SubClassModel',
                        superClasses: [SuperClass],
                        discriminatorSuperClass: DiscriminatedSuperClass
                    });
                });
            });
    
            it('A ClassModel cannot have both superClasses and discriminatorSuperClass.', () => {
                testForError('ClassModel.constructor()', 'A ClassModel cannot have both superClasses and discriminatorSuperClass.', () => {
                    new ClassModel({
                        className: 'SubClassModel',
                        superClasses: [SuperClass],
                        discriminatorSuperClass: DiscriminatedSuperClass
                    });
                });
            });
    
            it('If a class is used as a discriminatedSuperClass, that class must have its "discriminated" field set to true.', () => {
                testForError('ClassModel.constructor()', 'If a class is used as a discriminatedSuperClass, that class must have its "discriminated" field set to true.', () => {
                    new ClassModel({
                        className: 'SubClassModel',
                        discriminatorSuperClass: SuperClass
                    });
                });
            });
    
            it('If a class is set as a superClass, that class cannot have its "discriminated" field set to true.', () => {
                testForError('ClassModel.constructor()', 'If a class is set as a superClass, that class cannot have its "discriminated" field set to true.', () => {
                    new ClassModel({
                        className: 'SubClassModel',
                        superClasses: [DiscriminatedSuperClass]
                    });
                });
            });  
    
            it('A discriminator sub class cannot be abstract.', () => {
                testForError('ClassModel.constructor()', 'A discriminator sub class cannot be abstract.', () => {
                    new ClassModel({
                        className: 'SubClassModel',
                        discriminatorSuperClass: DiscriminatedSuperClass,
                        abstract: true
                    });
                });
            });  
    
            it('A sub class of a discriminated super class cannot be discriminated.', () => {
                testForError('ClassModel.constructor()', 'A sub class of a discriminated super class cannot be discriminated.', () => {
                    new ClassModel({
                        className: 'SubClassModel',
                        discriminatorSuperClass: DiscriminatedSuperClass,
                        discriminated: true
                    });
                });
            });  
    
            it('Sub class schema cannot contain the same field names as a super class schema.', () => {
                try {
                    new ClassModel({
                        className: 'SubClassModel',
                        superClasses: [SuperClass],
                        attributes: [
                            {
                                name: 'boolean',
                                type: Boolean,
                            }
                        ],
                    });
                }
                catch(error) {
                    if (error.message == 'Sub class schema cannot contain the same attribute names as a super class schema.')
                        return true;
                    else 
                        throw new Error(error.message);
                }
    
                throw new Error('Constructor should have thrown an error: Sub class schema cannot contain the same field names as a super class schema.');
            });  
    
            it('If a sub class is created, it is pushed to the super class\'s "subClasses" array.', () => {
    
                if (SuperClass.subClasses.length == 0)
                    throw new Error('SuperClass.subClasses array has no entries in it.');
                if (!SuperClass.subClasses.includes(SubClassOfSuperClass)) 
                    throw new Error('SuperClass.subClasses does not contain sub class.');
    
                return true;
            });
    
            it('A subclass has all the same attributes as it\'s super class.', () => {
                for (const attribute of SuperClass.attributes) {
                    if (!SubClassOfSuperClass.attributes.map(attribute => attribute.name).includes(attribute.name)) {
                        throw new Error('Sub Sub Class is missing the attribute ' + attribute.name);
                    }
                }
                if (!SubClassOfSuperClass.attributes.map(attribute => attribute.name).includes('subNumber')) {
                    throw new Error('Sub Sub Class is missing it\'s own subSubNumber attribute.');
                }

                if (!SubClassOfSuperClass.attributes.map(attribute => attribute.name).includes('subBoolean')) {
                    throw new Error('Sub Sub Class is missing it\'s own subSubBoolean attribute.');
                }
            });
    
            it('A subclass schema is the combination of its direct schema with the schema the whole chain of Super Classes.', () => {
                for (const attribute of SuperClass.attributes) {
                    if (!SubClassOfSubClassOfSuperClass.attributes.map(attribute => attribute.name).includes(attribute.name)) {
                        throw new Error('Class is missing the attribute ' + attribute.name);
                    }
                }

                for (const attribute of SubClassOfSuperClass.attributes) {
                    if (!SubClassOfSubClassOfSuperClass.attributes.map(attribute => attribute.name).includes(attribute.name)) {
                        throw new Error('Class is missing the attribute ' + attribute.name);
                    }
                }

                if (!SubClassOfSubClassOfSuperClass.attributes.map(attribute => attribute.name).includes('subSubNumber')) {
                    throw new Error('Class is missing it\'s own subSubNumber attribute.');
                }

                if (!SubClassOfSubClassOfSuperClass.attributes.map(attribute => attribute.name).includes('subSubBoolean')) {
                    throw new Error('Class is missing it\'s own subSubBoolean attribute.');
                }
            });
    
            it('A subclass schema is the combination of its direct schema with the schema of each of its super classes.', () => {
                for (const attribute of SuperClass.attributes) {
                    if (!SubClassOfMultipleSuperClasses.attributes.map(attribute => attribute.name).includes(attribute.name)) {
                        throw new Error('Class is missing the attribute ' + attribute.name);
                    }
                }
                for (const attribute of AbstractSuperClass.attributes) {
                    if (!SubClassOfMultipleSuperClasses.attributes.map(attribute => attribute.name).includes(attribute.name)) {
                        throw new Error('Class is missing the attribute ' + attribute.name);
                    }
                }
                
                if (!SubClassOfMultipleSuperClasses.attributes.map(attribute => attribute.name).includes('subNumber')) {
                    throw new Error('Class is missing it\'s own subNumber attribute.');
                }

                if (!SubClassOfMultipleSuperClasses.attributes.map(attribute => attribute.name).includes('subBoolean')) {
                    throw new Error('Class is missing it\'s own subBoolean attribute.');
                }
            });
    
            it('A subclass schema is the combination of its direct schema with the schema of each of its discrimintated super classes.', () => {
                for (const attribute of SuperClass.attributes) {
                    if (!SubClassOfDiscriminatedSubClassOfSuperClass.attributes.map(attribute => attribute.name).includes(attribute.name)) {
                        throw new Error('Sub Sub Class is missing the attribute ' + attribute.name);
                    }
                }
                for (const attribute of DiscriminatedSubClassOfSuperClass.attributes) {
                    if (!SubClassOfDiscriminatedSubClassOfSuperClass.attributes.map(attribute => attribute.name).includes(attribute.name)) {
                        throw new Error('Sub Sub Class is missing the attribute ' + attribute.name);
                    }
                }
                
                if (!SubClassOfDiscriminatedSubClassOfSuperClass.attributes.map(attribute => attribute.name).includes('subDiscriminatedNumber')) {
                    throw new Error('Class is missing it\'s own subDiscriminatedNumber attribute.');
                }

                if (!SubClassOfDiscriminatedSubClassOfSuperClass.attributes.map(attribute => attribute.name).includes('subDiscriminatedBoolean')) {
                    throw new Error('Class is missing it\'s own subDiscriminatedBoolean attribute.');
                }
            });
    
            it('A class cannot be a sub class of a sub class of a discriminated class.', () => {
                try {
                    new ClassModel({
                        className: 'SubClassModel',
                        superClasses: [SubClassOfDiscriminatorSuperClass]
                    });
                }
                catch(error) {
                    if (error.message == 'A class cannot be a sub class of a sub class of a discriminated class.')
                        return true;
                    else 
                        throw new Error(error.message);
                }
    
                throw new Error('Constructor should have thrown an error: A class cannot be a sub class of a sub class of a discriminated class.');
            });
    
            it('An abstract, non-discriminated class should have no Model.', () => {
                if (AbstractSuperClass.Model)
                    throw new Error('An abstract, non-discriminated class should have no Model.');
            });

        });

        describe('Happy Path', () => {

            it('Constructor excepts and sets parameters.', () => {    
                var SimpleClassModel = new ClassModel({
                    className: 'SimpleClassModel',
                    attributes: [
                        {
                            name: 'text',
                            type: String,
                            required: true,
                        },
                    ],
                    relationships: [
                        {
                            name: 'singularRelationship',
                            toClass: 'OtherClass',
                            singular: true,
                            required: true,
                        },
                        {
                            name: 'nonSingularRelationship',
                            toClass: 'OtherClass',
                            singular: false,
                        },
                    ],
                });
    
                if (SimpleClassModel.className != 'SimpleClassModel')
                    return false;

                if (!SimpleClassModel.attributes.map(attribute => attribute.name).includes('text'))
                    throw new Error('Attribute not set.');

                if (!SimpleClassModel.relationships.map(relationship => relationship.name).includes('singularRelationship'))
                    throw new Error('Attribute not set.');

                if (!SimpleClassModel.relationships.map(relationship => relationship.name).includes('nonSingularRelationship'))
                    throw new Error('Attribute not set.');
            });

        });
        
    });

    describe('Class Model Save and Update Methods', () => {

        after(async () => {
            await SuperClass.clear();
            await DiscriminatedSuperClass.clear();
        });

        describe('ClassModel.insertOne()', () => {

            it('ClassModel.insertOne() saves an instance in the proper collection.', async () => {
                const id = database.ObjectId();
                const document = {
                    _id: id,
                    name: 'insertSuperClass',
                    number: 1,
                    boolean: false,
                }

                await SuperClass.insertOne(document);

                const found = await database.findById(SuperClass.collection, id);

                if (!found) {
                    throw new Error('Could not find the document after save.');
                }
            });

            it('ClassModel.insertOne() saves an discriminated sub class instance in the parent collection.', async () => {
                const id = database.ObjectId();
                const document = {
                    _id: id,
                    name: 'insertDiscriminatedSubClass',
                    number: 1,
                    boolean: false,
                }

                await SubClassOfDiscriminatorSuperClass.insertOne(document);

                const found = await database.findById(DiscriminatedSuperClass.collection, id);

                if (!found) {
                    throw new Error('Could not find the document after save.');
                }
            });

        });

        describe('ClassModel.insertMany()', () => {

            it('Multiple documents can be inserted', async () => {
                const id1 = database.ObjectId();
                const id2 = database.ObjectId();
                const document1 = {
                    _id: id1,
                    name: '1',
                    number: 1,
                    boolean: false,
                }
                const document2 = {
                    _id: id2,
                    name: '2',
                    number: 2,
                    boolean: false,
                }

                await SuperClass.insertMany([document1, document2]);

                const found = await database.find(SuperClass.collection, {
                    _id: {
                        $in: [id1, id2],
                    },
                });

                if (!found || found.length !== 2) {
                    throw new Error('Could not find the documents after save.');
                }

            });

            it('ClassModel.insertMany() saves an discriminated sub class instance in the parent collection.', async () => {
                const id1 = database.ObjectId();
                const id2 = database.ObjectId();
                const document1 = {
                    _id: id1,
                    name: '1',
                    number: 1,
                    boolean: false,
                }
                const document2 = {
                    _id: id2,
                    name: '2',
                    number: 2,
                    boolean: false,
                }

                await SubClassOfDiscriminatorSuperClass.insertMany([document1, document2]);

                const found = await database.find(DiscriminatedSuperClass.collection, {
                    _id: {
                        $in: [id1, id2],
                    },
                });

                if (!found || found.length !== 2) {
                    throw new Error('Could not find the documents after save.');
                }
            });


        });

        describe('ClassModel.update()', () => {

            it('Can update a document.', async () => {
                const id = database.ObjectId();
                const document = {
                    _id: id,
                    name: 'updateSuperClass',
                    number: 1,
                    boolean: false,
                }

                await SuperClass.insertOne(document);
                document.boolean = true;
                await SuperClass.update(document);

                const found = await database.findById(SuperClass.collection, id);

                if (found.boolean !== true) {
                    throw new Error('Document was not updated.');
                }
            });

            it('Can update a document of a discriminated sub class.', async () => {
                const id = database.ObjectId();
                const document = {
                    _id: id,
                    name: 'updateDiscriminatedSubClass',
                    number: 1,
                    boolean: false,
                }

                await SubClassOfDiscriminatorSuperClass.insertOne(document);
                document.boolean = true;
                await SubClassOfDiscriminatorSuperClass.update(document);

                const found = await database.findById(DiscriminatedSuperClass.collection, id);

                if (found.boolean !== true) {
                    throw new Error('Document was not updated.');
                }
            });

        });

    });

    describe('ClassModel Query Methods', () => {

        // Create Instances for tests.
        {
            var instanceOfAllFieldsMutexClass = new Instance(AllFieldsMutexClass);
            var instanceOfDiscriminatedSuperClass = new Instance(DiscriminatedSuperClass);
            var instanceOfSuperClass = new Instance(SuperClass);
            var instanceOfSubClassOfSuperClass = new Instance(SubClassOfSuperClass);
            var instanceOfSubClassOfAbstractSuperClass = new Instance(SubClassOfAbstractSuperClass);
            var instanceOfSubClassOfDiscriminatorSuperClass = new Instance(SubClassOfDiscriminatorSuperClass);
            var instanceOfSubClassOfDiscriminatedSubClassOfSuperClass = new Instance(SubClassOfDiscriminatedSubClassOfSuperClass);
            var instanceOfSubClassOfSubClassOfSuperClass = new Instance(SubClassOfSubClassOfSuperClass);
            var instanceOfSubClassOfAbstractSubClassOfSuperClass = new Instance(SubClassOfAbstractSubClassOfSuperClass);
    
            instanceOfAllFieldsMutexClass.string = 'instanceOfAllFieldsMutexClass';
            instanceOfDiscriminatedSuperClass.name = 'instanceOfDiscriminatedSuperClass';
            instanceOfSuperClass.name = 'instanceOfSuperClass';
            instanceOfSubClassOfSuperClass.name = 'instanceOfSubClassOfSuperClass';
            instanceOfSubClassOfAbstractSuperClass.name = 'instanceOfSubClassOfAbstractSuperClass';
            instanceOfSubClassOfDiscriminatorSuperClass.name = 'instanceOfSubClassOfDiscriminatorSuperClass';
            instanceOfSubClassOfDiscriminatedSubClassOfSuperClass.name = 'instanceOfSubClassOfDiscriminatedSubClassOfSuperClass';
            instanceOfSubClassOfSubClassOfSuperClass.name = 'instanceOfSubClassOfSubClassOfSuperClass';
            instanceOfSubClassOfAbstractSubClassOfSuperClass.name = 'instanceOfSubClassOfAbstractSubClassOfSuperClass';
        }

        before(async () => {
            await Promise.all([
                instanceOfAllFieldsMutexClass.save(),
                instanceOfDiscriminatedSuperClass.save(),
                instanceOfSuperClass.save(),
                instanceOfSubClassOfSuperClass.save(),
                instanceOfSubClassOfDiscriminatorSuperClass.save(),
                instanceOfSubClassOfAbstractSuperClass.save(),
                instanceOfSubClassOfDiscriminatedSubClassOfSuperClass.save(),
                instanceOfSubClassOfSubClassOfSuperClass.save(),
                instanceOfSubClassOfAbstractSubClassOfSuperClass.save(),
            ]);
        });

        after(async () => {
            await Promise.all([
                AllFieldsMutexClass.clear(),
                DiscriminatedSuperClass.clear(),
                SuperClass.clear(),
                SubClassOfSuperClass.clear(),
                SubClassOfDiscriminatorSuperClass.clear(),
                SubClassOfAbstractSuperClass.clear(),
                AllFieldsRequiredClass.clear(),
                DiscriminatedSubClassOfSuperClass.clear(),
                SubClassOfAbstractSubClassOfSuperClass.clear(),
                SubClassOfSubClassOfSuperClass.clear()
            ]);
        });

        describe('ClassModel.findOne()', () => {
    
            describe('Calling findOne on the Class of the instance you want to find. (Direct)', () => {

                it('An instance of a concrete class with no subclasses can be found.', async () => {
                    const classToCallFindOneOn = AllFieldsMutexClass;
                    const instanceToFind = instanceOfAllFieldsMutexClass;

                    const filter = {
                        string: 'instanceOfAllFieldsMutexClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOne(filter);

                    if (!instanceFound)
                        throw new Error('findOne() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findOne() returned the wrong instance.');
                });

                it('An instance of a concrete discriminated class can be found.', async () => {
                    const classToCallFindOneOn = SubClassOfDiscriminatorSuperClass;
                    const instanceToFind = instanceOfSubClassOfDiscriminatorSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfDiscriminatorSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOne(filter);

                    if (!instanceFound)
                        throw new Error('findOne() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findOne() returned the wrong instance.');
                });

                it('An instance of a concrete super class can be found.', async () => {
                    const classToCallFindOneOn = SuperClass;
                    const instanceToFind = instanceOfSuperClass;

                    const filter = {
                        name: 'instanceOfSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOne(filter);

                    if (!instanceFound)
                        throw new Error('findOne() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findOne() returned the wrong instance.');
                });

                it('An instance of a concrete discriminated sub-class can be found.', async () => {
                    const classToCallFindOneOn = DiscriminatedSuperClass;
                    const instanceToFind = instanceOfDiscriminatedSuperClass;

                    const filter = {
                        name: 'instanceOfDiscriminatedSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOne(filter);

                    if (!instanceFound)
                        throw new Error('findOne() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findOne() returned the wrong instance.');
                });
    
            });
    
            describe('Calling findOne on a super class of the class of the instance you want to find. (Indirect)', () => {

                it('An instance of a sub class of a discrimintated super class can be found from the super class.', async () => {
                    const classToCallFindOneOn = DiscriminatedSuperClass;
                    const instanceToFind = instanceOfSubClassOfDiscriminatorSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfDiscriminatorSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOne(filter);

                    if (!instanceFound) 
                        throw new Error('findOne() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findOne() returned the wrong instance.');
                });

                it('An instance of a concrete sub class of a non-discriminated super class can be found from the super class.', async () => {
                    const classToCallFindOneOn = SuperClass;
                    const instanceToFind = instanceOfSubClassOfSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfSuperClass'
                    }


                    const instanceFound = await classToCallFindOneOn.findOne(filter);

                    if (!instanceFound) 
                        throw new Error('findOne() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findOne() returned the wrong instance.');
                });

                it('An instance of a concrete sub class of a non-discriminated abstract super class can be found from the super class.', async () => {
                    const classToCallFindOneOn = AbstractSuperClass;
                    const instanceToFind = instanceOfSubClassOfAbstractSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfAbstractSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOne(filter);

                    if (!instanceFound) 
                        throw new Error('findOne() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findOne() returned the wrong instance.');
                });
    
            });
    
            describe('Calling findOne on a super class of the super class of the instance you want to find. (Recursive)', () => {

                it('SuperClass -> Discriminated Sub Class -> Sub Sub Class', async () => {
                    const classToCallFindOneOn = SuperClass;
                    const instanceToFind = instanceOfSubClassOfDiscriminatedSubClassOfSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfDiscriminatedSubClassOfSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOne(filter);

                    if (!instanceFound) 
                        throw new Error('findOne() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findOne() returned the wrong instance.');
                });

                it('SuperClass -> Sub Class -> Sub Sub Class', async () => {
                    const classToCallFindOneOn = SuperClass;
                    const instanceToFind = instanceOfSubClassOfSubClassOfSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfSubClassOfSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOne(filter);

                    if (!instanceFound) 
                        throw new Error('findOne() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findOne() returned the wrong instance.');
                });

                it('SuperClass -> Abstract Sub Class -> Sub Sub Class', async () => {
                    const classToCallFindOneOn = SuperClass;
                    const instanceToFind = instanceOfSubClassOfAbstractSubClassOfSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfAbstractSubClassOfSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOne(filter);

                    if (!instanceFound) 
                        throw new Error('findOne() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findOne() returned the wrong instance.');
                });
    
            });
    
        });

        describe('ClassModel.findById()', () => {
    
            describe('Calling findById on the Class of the instance you want to find. (Direct)', () => {

                it('An instance of a concrete class with no subclasses can be found.', async () => {
                    const classToCallFindOneOn = AllFieldsMutexClass;
                    const instanceToFind = instanceOfAllFieldsMutexClass;

                    const instanceFound = await classToCallFindOneOn.findById(instanceToFind._id);

                    if (!instanceFound)
                        throw new Error('findById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findById() returned the wrong instance.');
                });

                it('An instance of a concrete discriminated class can be found.', async () => {
                    const classToCallFindInstanceByIdOn = SubClassOfDiscriminatorSuperClass;
                    const instanceToFind = instanceOfSubClassOfDiscriminatorSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findById(instanceToFind._id);

                    if (!instanceFound)
                        throw new Error('findById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findById() returned the wrong instance.');
                });

                it('An instance of a concrete super class can be found.', async () => {
                    const classToCallFindInstanceByIdOn = SuperClass;
                    const instanceToFind = instanceOfSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findById(instanceToFind._id);

                    if (!instanceFound)
                        throw new Error('findById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findById() returned the wrong instance.');
                });

                it('An instance of a concrete discriminated sub-class can be found.', async () => {
                    const classToCallFindInstanceByIdOn = DiscriminatedSuperClass;
                    const instanceToFind = instanceOfDiscriminatedSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findById(instanceToFind._id);

                    if (!instanceFound)
                        throw new Error('findById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findById() returned the wrong instance.');
                });
    
            });
    
            describe('Calling findById on a super class of the class of the instance you want to find. (Indirect)', () => {

                it('An instance of a sub class of a discrimintated super class can be found from the super class.', async () => {
                    const classToCallFindInstanceByIdOn = DiscriminatedSuperClass;
                    const instanceToFind = instanceOfSubClassOfDiscriminatorSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findById(instanceToFind._id);

                    if (!instanceFound) 
                        throw new Error('findById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findById() returned the wrong instance.');
                });

                it('An instance of a concrete sub class of a non-discriminated super class can be found from the super class.', async () => {
                    const classToCallFindInstanceByIdOn = SuperClass;
                    const instanceToFind = instanceOfSubClassOfSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findById(instanceToFind._id);

                    if (!instanceFound) 
                        throw new Error('findById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findById() returned the wrong instance.');
                });

                it('An instance of a concrete sub class of a non-discriminated abstract super class can be found from the super class.', async () => {
                    const classToCallFindInstanceByIdOn = AbstractSuperClass;
                    const instanceToFind = instanceOfSubClassOfAbstractSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findById(instanceToFind._id);

                    if (!instanceFound) 
                        throw new Error('findById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findById() returned the wrong instance.');
                });
    
            });
    
            describe('Calling findById on a super class of the super class of the instance you want to find. (Recursive)', () => {

                it('SuperClass -> Discriminated Sub Class -> Sub Sub Class', async () => {
                    const classToCallFindInstanceByIdOn = SuperClass;
                    const instanceToFind = instanceOfSubClassOfDiscriminatedSubClassOfSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findById(instanceToFind._id);

                    if (!instanceFound) 
                        throw new Error('findById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findById() returned the wrong instance.');
                });

                it('SuperClass -> Sub Class -> Sub Sub Class', async () => {
                    const classToCallFindInstanceByIdOn = SuperClass;
                    const instanceToFind = instanceOfSubClassOfSubClassOfSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findById(instanceToFind._id);

                    if (!instanceFound) 
                        throw new Error('findById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findById() returned the wrong instance.');
                });

                it('SuperClass -> Abstract Sub Class -> Sub Sub Class', async () => {
                    const classToCallFindInstanceByIdOn = SuperClass;
                    const instanceToFind = instanceOfSubClassOfAbstractSubClassOfSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findById(instanceToFind._id);

                    if (!instanceFound) 
                        throw new Error('findById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findById() returned the wrong instance.');
                });
    
            });
    
        });

        describe('ClassModel.find()', () => {

            describe('Finding a single instance.', () => {
    
                describe('Calling find on the Class of the instance you want to find. (Direct)', () => {
        
                    it('An instance of a concrete class with no subclasses can be found.', async () => {
                        const classToCallFindOn = AllFieldsMutexClass;
                        const classOfInstance = AllFieldsMutexClass;
                        const instanceToFind = instanceOfAllFieldsMutexClass;
                        const expectedInstances = new InstanceSet(classOfInstance, [instanceToFind]);
    
                        const filter = {
                            string: 'instanceOfAllFieldsMutexClass'
                        }
    
                        const instancesFound = await classToCallFindOn.find(filter);
    
                        if (!instancesFound.equals(expectedInstances))
                            throw new Error('Returned instances are not what was expected.');
                    });
        
                    it('An instance of a concrete discriminated class can be found.', async () => {
                        const classToCallFindOn = SubClassOfDiscriminatorSuperClass;
                        const classOfInstance = SubClassOfDiscriminatorSuperClass;
                        const instanceToFind = instanceOfSubClassOfDiscriminatorSuperClass;
                        const expectedInstances = new InstanceSet(classOfInstance, [instanceToFind]);
    
                        const filter = {
                            name: 'instanceOfSubClassOfDiscriminatorSuperClass'
                        }
    
                        const instancesFound = await classToCallFindOn.find(filter);
    
                        if (!instancesFound.equals(expectedInstances))
                            throw new Error('Returned instances are not what was expected.');
                    });
        
                    it('An instance of a concrete super class can be found.', async () => {
                        const classToCallFindOn = SuperClass;
                        const classOfInstance = SuperClass;
                        const instanceToFind = instanceOfSuperClass;
                        const expectedInstances = new InstanceSet(classOfInstance, [instanceToFind]);
    
                        const filter = {
                            name: 'instanceOfSuperClass'
                        }
    
                        const instancesFound = await classToCallFindOn.find(filter);

                        if (!instancesFound.equals(expectedInstances))
                            throw new Error('Returned instances are not what was expected.');
                    });
        
                    it('An instance of a concrete discriminated sub-class can be found.', async () => {
                        const classToCallFindOn = DiscriminatedSuperClass;
                        const classOfInstance = DiscriminatedSuperClass;
                        const instanceToFind = instanceOfDiscriminatedSuperClass;
                        const expectedInstances = new InstanceSet(classOfInstance, [instanceToFind]);
    
                        const filter = {
                            name: 'instanceOfDiscriminatedSuperClass'
                        }
    
                        const instancesFound = await classToCallFindOn.find(filter);

                        if (!instancesFound.equals(expectedInstances))
                            throw new Error('Returned instances are not what was expected.');
                    });
        
                });
        
                describe('Calling find on a super class of the class of the instance you want to find. (Indirect)', () => {
        
                    it('An instance of a sub class of a discrimintated super class can be from the super class.', async () => {
                        const classToCallFindOn = DiscriminatedSuperClass;
                        const instanceToFind = instanceOfSubClassOfDiscriminatorSuperClass;
                        const expectedInstances = new InstanceSet(classToCallFindOn, [instanceToFind]);
    
                        const filter = {
                            name: 'instanceOfSubClassOfDiscriminatorSuperClass'
                        }
    
                        const instancesFound = await classToCallFindOn.find(filter);
    
                        if (!instancesFound.equals(expectedInstances))
                            throw new Error('InstanceSet returned does not match what was expected.');
                    });
        
                    it('An instance of a concrete sub class of a non-discriminated super class can be found from the super class.', async () => {
                        const classToCallFindOn = SuperClass;
                        const instanceToFind = instanceOfSubClassOfSuperClass;
                        const expectedInstances = new InstanceSet(classToCallFindOn, [instanceToFind]);
    
                        const filter = {
                            name: 'instanceOfSubClassOfSuperClass'
                        }
    
                        const instancesFound = await classToCallFindOn.find(filter);
    
                        if (!instancesFound.equals(expectedInstances))
                            throw new Error('InstanceSet returned does not match what was expected.');
                    });
        
                    it('An instance of a concrete sub class of a non-discriminated abstract super class can be found from the super class.', async () => {
                        const classToCallFindOn = AbstractSuperClass;
                        const instanceToFind = instanceOfSubClassOfAbstractSuperClass;
                        const expectedInstances = new InstanceSet(classToCallFindOn, [instanceToFind]);
    
                        const filter = {
                            name: 'instanceOfSubClassOfAbstractSuperClass'
                        }
    
                        const instancesFound = await classToCallFindOn.find(filter);
    
                        if (!instancesFound.equals(expectedInstances))
                            throw new Error('InstanceSet returned does not match what was expected.');
                    });
        
                });
        
                describe('Calling find() on a super class of the super class of the instance you want to find. (Recursive)', () => {
        
                    it('SuperClass -> Discriminated Sub Class -> Sub Sub Class', async () => {
                        const classToCallFindOn = SuperClass;
                        const instanceToFind = instanceOfSubClassOfDiscriminatedSubClassOfSuperClass;
                        const expectedInstances = new InstanceSet(classToCallFindOn, [instanceToFind]);
    
                        const filter = {
                            name: 'instanceOfSubClassOfDiscriminatedSubClassOfSuperClass'
                        }
    
                        const instancesFound = await classToCallFindOn.find(filter);
    
                        if (!instancesFound.equals(expectedInstances))
                            throw new Error('InstanceSet returned does not match what was expected.');
                    });
        
                    it('SuperClass -> Sub Class -> Sub Sub Class', async () => {
                        const classToCallFindOn = SuperClass;
                        const instanceToFind = instanceOfSubClassOfSubClassOfSuperClass;
                        const expectedInstances = new InstanceSet(classToCallFindOn, [instanceToFind]);
    
                        const filter = {
                            name: 'instanceOfSubClassOfSubClassOfSuperClass'
                        }
    
                        const instancesFound = await classToCallFindOn.find(filter);
    
                        if (!instancesFound.equals(expectedInstances))
                            throw new Error('InstanceSet returned does not match what was expected.');
                    });
        
                    it('SuperClass -> Abstract Sub Class -> Sub Sub Class', async () => {
                        const classToCallFindOn = SuperClass;
                        const instanceToFind = instanceOfSubClassOfAbstractSubClassOfSuperClass;
                        const expectedInstances = new InstanceSet(classToCallFindOn, [instanceToFind]);
    
                        const filter = {
                            name: 'instanceOfSubClassOfAbstractSubClassOfSuperClass'
                        }
    
                        const instancesFound = await classToCallFindOn.find(filter);
    
                        if (!instancesFound.equals(expectedInstances))
                            throw new Error('InstanceSet returned does not match what was expected.');
                    });
        
                });
        
            });

            describe('Finding Multiple Instances.', () => {
        
                it('Find two instances of a super class. One is an instance of the super class itself, one is 2 levels deep.', async () => {
                    const classToCallFindOn = SuperClass;
                    const instancesToFind = [instanceOfSuperClass, instanceOfSubClassOfDiscriminatedSubClassOfSuperClass];
                    const expectedInstances = new InstanceSet(classToCallFindOn, instancesToFind);

                    const filter = {
                        name: {$in: ['instanceOfSuperClass', 'instanceOfSubClassOfDiscriminatedSubClassOfSuperClass']}
                    }; 

                    const instancesFound = await classToCallFindOn.find(filter);

                    if (!instancesFound.equals(expectedInstances))
                        throw new Error('InstanceSet returned does not match what was expected.');
                });
        
                it('Find all the instances of a super class. One is an instance of the super class itself, and the others are the instances of the various sub classes.', async () => {
                    const classToCallFindOn = SuperClass;
                    const instancesToFind = [
                        instanceOfSuperClass, 
                        instanceOfSubClassOfSuperClass,
                        instanceOfSubClassOfDiscriminatedSubClassOfSuperClass,
                        instanceOfSubClassOfSubClassOfSuperClass,
                        instanceOfSubClassOfAbstractSubClassOfSuperClass
                    ];
                    const expectedInstances = new InstanceSet(classToCallFindOn, instancesToFind);

                    const filter = {
                        name: {$in: [
                            'instanceOfSuperClass', 
                            'instanceOfSubClassOfSuperClass',
                            'instanceOfSubClassOfDiscriminatedSubClassOfSuperClass',
                            'instanceOfSubClassOfSubClassOfSuperClass',
                            'instanceOfSubClassOfAbstractSubClassOfSuperClass'
                        ]}
                    }; 

                    const instancesFound = await classToCallFindOn.find(filter);

                    if (!instancesFound.equals(expectedInstances))
                        throw new Error('InstanceSet returned does not match what was expected.');
                });

            });

        });

    });

    describe('ClassModel.readControlFilter()', () => {

        // Set up readControlled Instances
        // For each class, create on instance which will pass all access control filters, and one each that will fail due to one of the access control methods
        {
            // ClassControlsReadControlledSuperClass Instances
            var instanceOfClassControlsReadControlledSuperClassAllowed = new Instance(ClassControlsReadControlledSuperClass);
            instanceOfClassControlsReadControlledSuperClassAllowed.allowed = true;
            
            var instanceOfClassControlsReadControlledSuperClassNotAllowed = new Instance(ClassControlsReadControlledSuperClass);
            instanceOfClassControlsReadControlledSuperClassNotAllowed.allowed = false;

            // ReadControlledSuperClass Instances
            var instanceOfReadControlledSuperClassPasses = new Instance(ReadControlledSuperClass);
            instanceOfReadControlledSuperClassPasses.name = 'instanceOfReadControlledSuperClassPasses';
            instanceOfReadControlledSuperClassPasses.readControlledBy = instanceOfClassControlsReadControlledSuperClassAllowed;

            var instanceOfReadControlledSuperClassFailsRelationship = new Instance(ReadControlledSuperClass);
            instanceOfReadControlledSuperClassFailsRelationship.name = 'instanceOfReadControlledSuperClassFailsRelationship';
            instanceOfReadControlledSuperClassFailsRelationship.readControlledBy = instanceOfClassControlsReadControlledSuperClassNotAllowed;

            // ReadControlledSubClassOfReadControlledSuperClass Instances
            var instanceOfReadControlledSubClassOfReadControlledSuperClassPasses = new Instance(ReadControlledSubClassOfReadControlledSuperClass);
            instanceOfReadControlledSubClassOfReadControlledSuperClassPasses.name = 'instanceOfReadControlledSubClassOfReadControlledSuperClassPasses';
            instanceOfReadControlledSubClassOfReadControlledSuperClassPasses.readControlledBy = instanceOfClassControlsReadControlledSuperClassAllowed;
            instanceOfReadControlledSubClassOfReadControlledSuperClassPasses.boolean = true;

            var instanceOfReadControlledSubClassOfReadControlledSuperClassFailsRelationship = new Instance(ReadControlledSubClassOfReadControlledSuperClass);
            instanceOfReadControlledSubClassOfReadControlledSuperClassFailsRelationship.name = 'instanceOfReadControlledSubClassOfReadControlledSuperClassFailsRelationship';
            instanceOfReadControlledSubClassOfReadControlledSuperClassFailsRelationship.readControlledBy = instanceOfClassControlsReadControlledSuperClassNotAllowed;
            instanceOfReadControlledSubClassOfReadControlledSuperClassFailsRelationship.boolean = true;

            var instanceOfReadControlledSubClassOfReadControlledSuperClassFailsBoolean = new Instance(ReadControlledSubClassOfReadControlledSuperClass);
            instanceOfReadControlledSubClassOfReadControlledSuperClassFailsBoolean.name = 'instanceOfReadControlledSubClassOfReadControlledSuperClassFailsBoolean'
            instanceOfReadControlledSubClassOfReadControlledSuperClassFailsBoolean.readControlledBy = instanceOfClassControlsReadControlledSuperClassAllowed;
            instanceOfReadControlledSubClassOfReadControlledSuperClassFailsBoolean.boolean = false;

            // ReadControlledDiscriminatedSuperClass Instances
            var instanceOfReadControlledDiscriminatedSuperClassPasses = new Instance(ReadControlledDiscriminatedSuperClass);
            instanceOfReadControlledDiscriminatedSuperClassPasses.name = 'instanceOfReadControlledDiscriminatedSuperClassPasses';
            instanceOfReadControlledDiscriminatedSuperClassPasses.readControlledBy = instanceOfClassControlsReadControlledSuperClassAllowed;
            instanceOfReadControlledDiscriminatedSuperClassPasses.boolean = true;
            instanceOfReadControlledDiscriminatedSuperClassPasses.string = 'readControlled';

            var instanceOfReadControlledDiscriminatedSuperClassFailsRelationship = new Instance(ReadControlledDiscriminatedSuperClass);
            instanceOfReadControlledDiscriminatedSuperClassFailsRelationship.name = 'instanceOfReadControlledDiscriminatedSuperClassFailsRelationship';
            instanceOfReadControlledDiscriminatedSuperClassFailsRelationship.readControlledBy = instanceOfClassControlsReadControlledSuperClassNotAllowed;
            instanceOfReadControlledDiscriminatedSuperClassFailsRelationship.boolean = true;
            instanceOfReadControlledDiscriminatedSuperClassFailsRelationship.string = 'readControlled';

            var instanceOfReadControlledDiscriminatedSuperClassFailsString = new Instance(ReadControlledDiscriminatedSuperClass);
            instanceOfReadControlledDiscriminatedSuperClassFailsString.name = 'instanceOfReadControlledDiscriminatedSuperClassFailsString';
            instanceOfReadControlledDiscriminatedSuperClassFailsString.readControlledBy = instanceOfClassControlsReadControlledSuperClassAllowed;
            instanceOfReadControlledDiscriminatedSuperClassFailsString.boolean = true;
            instanceOfReadControlledDiscriminatedSuperClassFailsString.string = 'not readControlled';

            var instanceOfReadControlledDiscriminatedSuperClassFailsBoolean = new Instance(ReadControlledDiscriminatedSuperClass);
            instanceOfReadControlledDiscriminatedSuperClassFailsBoolean.name = 'instanceOfReadControlledDiscriminatedSuperClassFailsBoolean';
            instanceOfReadControlledDiscriminatedSuperClassFailsBoolean.readControlledBy = instanceOfClassControlsReadControlledSuperClassAllowed;
            instanceOfReadControlledDiscriminatedSuperClassFailsBoolean.boolean = false;
            instanceOfReadControlledDiscriminatedSuperClassFailsBoolean.string = 'readControlled';

            // ReadControlledSubClassOfReadControlledDiscriminatedSuperClass Instances
            var instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassPasses = new Instance(ReadControlledSubClassOfReadControlledDiscriminatedSuperClass);
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassPasses.name = 'instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassPasses';
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassPasses.readControlledBy = instanceOfClassControlsReadControlledSuperClassAllowed;  
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassPasses.boolean = true;
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassPasses.string = 'readControlled';         
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassPasses.number = 1;

            var instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsRelationship = new Instance(ReadControlledSubClassOfReadControlledDiscriminatedSuperClass);
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsRelationship.name = 'instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsRelationship';
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsRelationship.readControlledBy = instanceOfClassControlsReadControlledSuperClassNotAllowed;             
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsRelationship.number = 1;
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsRelationship.boolean = true;
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsRelationship.string = 'readControlled';

            var instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsBoolean = new Instance(ReadControlledSubClassOfReadControlledDiscriminatedSuperClass);
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsBoolean.name = 'instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsBoolean';
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsBoolean.readControlledBy = instanceOfClassControlsReadControlledSuperClassAllowed;     
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsBoolean.boolean = false;
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsBoolean.string = 'readControlled';
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsBoolean.number = 1;

            var instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsString = new Instance(ReadControlledSubClassOfReadControlledDiscriminatedSuperClass);
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsString.name = 'instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsString';
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsString.readControlledBy = instanceOfClassControlsReadControlledSuperClassAllowed;     
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsString.boolean = true;
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsString.string = 'not readControlled';            
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsString.number = 1;

            var instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsNumber = new Instance(ReadControlledSubClassOfReadControlledDiscriminatedSuperClass);
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsNumber.name = 'instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsNumber';
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsNumber.readControlledBy = instanceOfClassControlsReadControlledSuperClassAllowed;
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsNumber.boolean = true;
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsNumber.string = 'readControlled';      
            instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsNumber.number = -1;

            // ReadControlledClassReadControlledByParameters Instances
            var instanceOfReadControlledClassReadControlledByParameters = new Instance(ReadControlledClassReadControlledByParameters);

        }

        // Save all SecurityFilter Test Instances
        before(async () => {
            await Promise.all([
                instanceOfClassControlsReadControlledSuperClassAllowed.save(),
                instanceOfClassControlsReadControlledSuperClassNotAllowed.save(),
                instanceOfReadControlledSuperClassPasses.save(),
                instanceOfReadControlledSuperClassFailsRelationship.save(),
                instanceOfReadControlledSubClassOfReadControlledSuperClassPasses.save(),
                instanceOfReadControlledSubClassOfReadControlledSuperClassFailsRelationship.save(),
                instanceOfReadControlledSubClassOfReadControlledSuperClassFailsBoolean.save(),
                instanceOfReadControlledDiscriminatedSuperClassPasses.save(),
                instanceOfReadControlledDiscriminatedSuperClassFailsRelationship.save(),
                instanceOfReadControlledDiscriminatedSuperClassFailsString.save(),
                instanceOfReadControlledDiscriminatedSuperClassFailsBoolean.save(),
                instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassPasses.save(),
                instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsRelationship.save(),
                instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsBoolean.save(),
                instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsString.save(),
                instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsNumber.save(),
            ]);
        });

        after(async () => {
            await ClassControlsReadControlledSuperClass.clear();
            await ReadControlledSuperClass.clear();
            await ReadControlledSubClassOfReadControlledSuperClass.clear();
            await ReadControlledDiscriminatedSuperClass.clear();
            await ReadControlledSubClassOfReadControlledDiscriminatedSuperClass.clear();
            await ReadControlledClassReadControlledByParameters.clear();
        });

        describe('Tests for invalid arguments.', () => {

            it('First argument must be an InstanceSet.', async () => {
                let expectedErrorMessage = 'Incorrect parameters. ' + ReadControlledSuperClass.className + '.readControlFilter(InstanceSet instanceSet, ...readControlMethodParameters)';
                await testForErrorAsync('ClassModel.readControlFilter()', expectedErrorMessage, async () => {
                    return ReadControlledSuperClass.readControlFilter();
                })
            });

            it('First argument must be an InstanceSet.', async () => {
                let expectedErrorMessage = 'Incorrect parameters. ' + ReadControlledSuperClass.className + '.readControlFilter(InstanceSet instanceSet, ...readControlMethodParameters)';
                await testForErrorAsync('ClassModel.readControlFilter()', expectedErrorMessage, async () => {
                    return ReadControlledSuperClass.readControlFilter({ some: 'object' });
                })
            });

        });

        describe('Read Control Methods Are Inherited', () => {
            
            it('A class with no supers has only it\'s own read control method.', () => {
                if (ReadControlledSuperClass.readControlMethods.length === 0)
                    throw new Error('Class is missing it\'s own read control method.');

                if (ReadControlledSuperClass.readControlMethods.length > 1)
                    throw new Error('Class has more than one read control method.');
            });

            it('A sub class has both it\'s own read control method, and the super class\' read control method.', () => {
                if (ReadControlledSubClassOfReadControlledSuperClass.readControlMethods.length < 2)
                    throw new Error('Class is missing a read control method.');
                
                if (ReadControlledSubClassOfReadControlledSuperClass.readControlMethods.length != 2)
                    throw new Error('Class is has the wrong number of read control methods.');
            });

            it('A discriminated sub class has all the read control methods it should.', () => {
                if (ReadControlledSubClassOfReadControlledDiscriminatedSuperClass.readControlMethods.length != 4)
                    throw new Error('Class is has the wrong number of read control methods.');
            });
        
        });

        describe('Test filtering out instances that don\'t pass access control check.', () => {

            describe('ReadControlledSuperClass.readControlFilter()', () => {

                it('Access Control Filter called on Class with only direct instances of Class.', async () => {
                    const classModel = ReadControlledSuperClass;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledSuperClassPasses,
                        instanceOfReadControlledSuperClassFailsRelationship
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledSuperClassPasses
                    ]);

                    const filteredInstanceSet = await classModel.readControlFilter(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.readControlFilter() did not return the expected InstanceSet.');
                });

                it('Access Control Filter called on Class with instances of class and sub class.', async () => {
                    const classModel = ReadControlledSuperClass;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledSuperClassPasses,
                        instanceOfReadControlledSuperClassFailsRelationship,
                        instanceOfReadControlledSubClassOfReadControlledSuperClassPasses,
                        instanceOfReadControlledSubClassOfReadControlledSuperClassFailsBoolean,
                        instanceOfReadControlledSubClassOfReadControlledSuperClassFailsRelationship
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledSuperClassPasses,
                        instanceOfReadControlledSubClassOfReadControlledSuperClassPasses
                    ]);

                    const filteredInstanceSet = await classModel.readControlFilter(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.readControlFilter() did not return the expected InstanceSet.');
                });

                it('Access Control Filter called on Class with instances of class and 2 layers of sub classes.', async () => {
                    const classModel = ReadControlledSuperClass;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledSuperClassPasses,
                        instanceOfReadControlledSuperClassFailsRelationship,
                        instanceOfReadControlledSubClassOfReadControlledSuperClassPasses,
                        instanceOfReadControlledSubClassOfReadControlledSuperClassFailsBoolean,
                        instanceOfReadControlledSubClassOfReadControlledSuperClassFailsRelationship,
                        instanceOfReadControlledDiscriminatedSuperClassPasses,
                        instanceOfReadControlledDiscriminatedSuperClassFailsString,
                        instanceOfReadControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfReadControlledDiscriminatedSuperClassFailsRelationship
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledSuperClassPasses,
                        instanceOfReadControlledSubClassOfReadControlledSuperClassPasses,
                        instanceOfReadControlledDiscriminatedSuperClassPasses
                    ]);

                    const filteredInstanceSet = await classModel.readControlFilter(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.readControlFilter() did not return the expected InstanceSet.');
                });

                it('Access Control Filter called on Class with instances of 3 layers of sub classes.', async () => {
                    const classModel = ReadControlledSuperClass;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledSuperClassPasses,
                        instanceOfReadControlledSuperClassFailsRelationship,
                        instanceOfReadControlledSubClassOfReadControlledSuperClassPasses,
                        instanceOfReadControlledSubClassOfReadControlledSuperClassFailsBoolean,
                        instanceOfReadControlledSubClassOfReadControlledSuperClassFailsRelationship,
                        instanceOfReadControlledDiscriminatedSuperClassPasses,
                        instanceOfReadControlledDiscriminatedSuperClassFailsString,
                        instanceOfReadControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfReadControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassPasses,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsString,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsNumber
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledSuperClassPasses,
                        instanceOfReadControlledSubClassOfReadControlledSuperClassPasses,
                        instanceOfReadControlledDiscriminatedSuperClassPasses,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassPasses
                    ]);
                    const filteredInstanceSet = await classModel.readControlFilter(instanceSet);

                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.readControlFilter() did not return the expected InstanceSet.');
                });

            });

            describe('ReadControlledSubClassOfReadControlledSuperClass.readControlFilter()', () => {

                it('Access Control Filter called on Class with only direct instances of Class.', async () => {
                    const classModel = ReadControlledSubClassOfReadControlledSuperClass;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledSubClassOfReadControlledSuperClassPasses,
                        instanceOfReadControlledSubClassOfReadControlledSuperClassFailsBoolean,
                        instanceOfReadControlledSubClassOfReadControlledSuperClassFailsRelationship
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledSubClassOfReadControlledSuperClassPasses
                    ]);

                    const filteredInstanceSet = await classModel.readControlFilter(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.readControlFilter() did not return the expected InstanceSet.');
                });

                it('Access Control Filter called on Class with instances of class and 1 layers of sub classes.', async () => {
                    const classModel = ReadControlledSubClassOfReadControlledSuperClass;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledSubClassOfReadControlledSuperClassPasses,
                        instanceOfReadControlledSubClassOfReadControlledSuperClassFailsBoolean,
                        instanceOfReadControlledSubClassOfReadControlledSuperClassFailsRelationship,
                        instanceOfReadControlledDiscriminatedSuperClassPasses,
                        instanceOfReadControlledDiscriminatedSuperClassFailsString,
                        instanceOfReadControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfReadControlledDiscriminatedSuperClassFailsRelationship
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledSubClassOfReadControlledSuperClassPasses,
                        instanceOfReadControlledDiscriminatedSuperClassPasses
                    ]);

                    const filteredInstanceSet = await classModel.readControlFilter(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.readControlFilter() did not return the expected InstanceSet.');
                });

                it('Access Control Filter called on Class with instances of 2 layers of sub classes.', async () => {
                    const classModel = ReadControlledSubClassOfReadControlledSuperClass;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledSubClassOfReadControlledSuperClassPasses,
                        instanceOfReadControlledSubClassOfReadControlledSuperClassFailsBoolean,
                        instanceOfReadControlledSubClassOfReadControlledSuperClassFailsRelationship,
                        instanceOfReadControlledDiscriminatedSuperClassPasses,
                        instanceOfReadControlledDiscriminatedSuperClassFailsString,
                        instanceOfReadControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfReadControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassPasses,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsString,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsNumber
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledSubClassOfReadControlledSuperClassPasses,
                        instanceOfReadControlledDiscriminatedSuperClassPasses,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassPasses
                    ]);

                    const filteredInstanceSet = await classModel.readControlFilter(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.readControlFilter() did not return the expected InstanceSet.');
                });

            });

            describe('ReadControlledDiscriminatedSuperClass.readControlFilter()', () => {

                it('Access Control Filter called on Class with only direct instances of Class.', async () => {
                    const classModel = ReadControlledDiscriminatedSuperClass;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledDiscriminatedSuperClassPasses,
                        instanceOfReadControlledDiscriminatedSuperClassFailsString,
                        instanceOfReadControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfReadControlledDiscriminatedSuperClassFailsRelationship
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledDiscriminatedSuperClassPasses
                    ]);

                    const filteredInstanceSet = await classModel.readControlFilter(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.readControlFilter() did not return the expected InstanceSet.');
                });

                it('Access Control Filter called on Class with instances of 1 layers of sub classes.', async () => {
                    const classModel = ReadControlledDiscriminatedSuperClass;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledDiscriminatedSuperClassPasses,
                        instanceOfReadControlledDiscriminatedSuperClassFailsString,
                        instanceOfReadControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfReadControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassPasses,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsString,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsNumber
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledDiscriminatedSuperClassPasses,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassPasses
                    ]);

                    const filteredInstanceSet = await classModel.readControlFilter(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.readControlFilter() did not return the expected InstanceSet.');
                });

            });

            describe('ReadControlledSubClassOfReadControlledDiscriminatedSuperClass.readControlFilter()', () => {

                it('Access Control Filter called on Class with only direct instances of Class.', async () => {
                    const classModel = ReadControlledSubClassOfReadControlledDiscriminatedSuperClass;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassPasses,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsString,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsNumber
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassPasses
                    ]);

                    const filteredInstanceSet = await classModel.readControlFilter(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.readControlFilter() did not return the expected InstanceSet.');
                });

            });

            describe('ReadControlledClassReadControlledByParameters.readControlFilter()', () => {

                it('Instance passes access control check', async () => {
                    const classModel = ReadControlledClassReadControlledByParameters;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledClassReadControlledByParameters,
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledClassReadControlledByParameters
                    ]);
                    const parameters = [1, 1, true];

                    const filteredInstanceSet = await classModel.readControlFilter(instanceSet, ...parameters);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.readControlFilter() did not return the expected InstanceSet.');
                });

                it('Instance fails access control check because of Numbers.', async () => {
                    const classModel = ReadControlledClassReadControlledByParameters;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledClassReadControlledByParameters,
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel);
                    const parameters = [-2, 1, true];

                    const filteredInstanceSet = await classModel.readControlFilter(instanceSet, ...parameters);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.readControlFilter() did not return the expected InstanceSet.');
                });

                it('Instance fails access control check because of Boolean.', async () => {
                    const classModel = ReadControlledClassReadControlledByParameters;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfReadControlledClassReadControlledByParameters,
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel);
                    const parameters = [1, 1, false];

                    const filteredInstanceSet = await classModel.readControlFilter(instanceSet, ...parameters);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.readControlFilter() did not return the expected InstanceSet.');
                });

            });

        });

        describe('Test find methods for access filtering.', () => {

            describe('Test findById() with access filtering', () => {

                it('Call findById() on an instance of an access controlled class. Instance passes filter.', async () => {
                    const classToCallFindByIdOn = ReadControlledSuperClass;
                    const instanceToFind = instanceOfReadControlledSuperClassPasses;
                    const instanceFound = await classToCallFindByIdOn.findById(instanceToFind._id);

                    if (!instanceFound)
                        throw new Error('findById() did not return an instance.');

                    if (!instanceFound._id.equals(instanceToFind._id))
                        throw new Error(
                            'An instance was returned, but it is not the correct one.\n' +
                            'Expected: \n' + instanceToFind + '\n' +
                            'Actual: \n' + instanceFound
                        );
                });

                it('Call findById() on an instance of an access controlled class, from super class. Instance passes filter.', async () => {
                    const classToCallFindByIdOn = ReadControlledSuperClass;
                    const instanceToFind = instanceOfReadControlledSubClassOfReadControlledSuperClassPasses;
                    const instanceFound = await classToCallFindByIdOn.findById(instanceToFind._id);

                    if (!instanceFound)
                        throw new Error('findById() did not return an instance.');

                    if (!instanceFound._id.equals(instanceToFind._id))
                        throw new Error(
                            'An instance was returned, but it is not the correct one.\n' +
                            'Expected: \n' + instanceToFind + '\n' +
                            'Actual: \n' + instanceFound
                        );

                });

                it('Call findById() on an instance of an access controlled class. Instance does not pass filter.', async () => {
                    const classToCallFindByIdOn = ReadControlledSuperClass;
                    const instanceToFind = instanceOfReadControlledSuperClassFailsRelationship;
                    const instanceFound = await classToCallFindByIdOn.findById(instanceToFind._id);

                    if (instanceFound)
                        throw new Error('findById() returned an instance.');
                });

                it('Call findById() on an instance of an access controlled class, from super class. Instance does not pass filter based on super access control method.', async () => {
                    const classToCallFindByIdOn = ReadControlledSuperClass;
                    const instanceToFind = instanceOfReadControlledSubClassOfReadControlledSuperClassFailsRelationship;
                    const instanceFound = await classToCallFindByIdOn.findById(instanceToFind._id);

                    if (instanceFound)
                        throw new Error('findById() returned an instance.');

                });

                it('Call findById() on an instance of an access controlled class, from super class. Instance does not pass filter based on it\'s own access control method.', async () => {
                    const classToCallFindByIdOn = ReadControlledSuperClass;
                    const instanceToFind = instanceOfReadControlledSubClassOfReadControlledSuperClassFailsBoolean;
                    const instanceFound = await classToCallFindByIdOn.findById(instanceToFind._id);

                    if (instanceFound)
                        throw new Error('findById() returned an instance.');

                });

            });

            describe('Test findOne() with access filtering', () => {

                it('Call findOne() on an instance of an access controlled class. instance passes filter.', async () => {
                    const classToCallFindByIdOn = ReadControlledSuperClass;
                    const instanceToFind = instanceOfReadControlledSuperClassPasses;

                    const filter = {
                        name: 'instanceOfReadControlledSuperClassPasses'
                    }

                    const instanceFound = await classToCallFindByIdOn.findOne(filter);

                    if (!instanceFound)
                        throw new Error('findOne() did not return an instance.');

                    if (!instanceFound._id.equals(instanceToFind._id))
                        throw new Error(
                            'An instance was returned, but it is not the correct one.\n' +
                            'Expected: \n' + instanceToFind + '\n' +
                            'Actual: \n' + instanceFound
                        );
                });

                it('Call findOne() on an instance of an access controlled class, from super class. Instance passes filter.', async () => {
                    const classToCallFindByIdOn = ReadControlledSuperClass;
                    const instanceToFind = instanceOfReadControlledSubClassOfReadControlledSuperClassPasses;

                    const filter = {
                        name: 'instanceOfReadControlledSubClassOfReadControlledSuperClassPasses'
                    }

                    const instanceFound = await classToCallFindByIdOn.findOne(filter);

                    if (!instanceFound)
                        throw new Error('findOne() did not return an instance.');

                    if (!instanceFound._id.equals(instanceToFind._id))
                        throw new Error(
                            'An instance was returned, but it is not the correct one.\n' +
                            'Expected: \n' + instanceToFind + '\n' +
                            'Actual: \n' + instanceFound
                        );
                });

                it('Call findOne() on an instance of an access controlled class. Instance does not pass filter.', async () => {
                    const classToCallFindByIdOn = ReadControlledSuperClass;

                    const filter = {
                        name: 'instanceOfReadControlledSuperClassFailsRelationship'
                    }

                    const instanceFound = await classToCallFindByIdOn.findOne(filter);

                    if (instanceFound)
                        throw new Error('findOne() returned an instance');

                });

                it('Call findOne() on an instance of an access controlled class, from super class. Instance does not pass filter based on super access control method.', async () => {
                    const classToCallFindByIdOn = ReadControlledSuperClass;

                    const filter = {
                        name: 'instanceOfReadControlledSubClassOfReadControlledSuperClassFailsRelationship'
                    }

                    const instanceFound = await classToCallFindByIdOn.findOne(filter);

                    if (instanceFound)
                        throw new Error('findOne() returned an instance');

                });

                it('Call findOne() on an instance of an access controlled class, from super class. Instance does not pass filter based on it\'s own access control method.', async () => {
                    const classToCallFindByIdOn = ReadControlledSuperClass;

                    const filter = {
                        name: 'instanceOfReadControlledSubClassOfReadControlledSuperClassFailsBoolean'
                    }

                    const instanceFound = await classToCallFindByIdOn.findOne(filter);

                    if (instanceFound)
                        throw new Error('findOne() returned an instance');

                });

            });

            describe('Test find() with access filtering', () => {

                it('Call find() on access controlled super class with a passing and not passing instance of each sub class.', async () => {
                    const instanceNames = [
                        'instanceOfReadControlledSuperClassPasses',
                        'instanceOfReadControlledSuperClassFailsRelationship',
                        'instanceOfReadControlledSubClassOfReadControlledSuperClassPasses',
                        'instanceOfReadControlledSubClassOfReadControlledSuperClassFailsRelationship',
                        'instanceOfReadControlledSubClassOfReadControlledSuperClassFailsBoolean',
                        'instanceOfReadControlledDiscriminatedSuperClassPasses',
                        'instanceOfReadControlledDiscriminatedSuperClassFailsRelationship',
                        'instanceOfReadControlledDiscriminatedSuperClassFailsString',
                        'instanceOfReadControlledDiscriminatedSuperClassFailsBoolean',
                        'instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassPasses',
                        'instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsRelationship',
                        'instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassFailsBoolean',
                        'ReadControlledSubClassOfReadControlledDiscriminatedSuperClass',
                        'ReadControlledSubClassOfReadControlledDiscriminatedSuperClass'
                    ];
                    const expectedInstances = new InstanceSet(ReadControlledSuperClass, [
                        instanceOfReadControlledSuperClassPasses,
                        instanceOfReadControlledSubClassOfReadControlledSuperClassPasses,
                        instanceOfReadControlledDiscriminatedSuperClassPasses,
                        instanceOfReadControlledSubClassOfReadControlledDiscriminatedSuperClassPasses
                    ]);

                    const instancesFound = await ReadControlledSuperClass.find({name: {$in: instanceNames}});

                    if (!expectedInstances.equals(instancesFound)) 
                        throw new Error('find did not filter instances correctly.')

                });

            });

        });

    });

    describe('ClassModel.updateControlFilterInstanceSet()', () => {

        // Set up updateControlled Instances
        // For each class, create on instance which will pass all update control filters, and one each that will fail due to one of the update control methods
        {
            // ClassControlsUpdateControlledSuperClass Instances
            var instanceOfClassControlsUpdateControlledSuperClassAllowed = new Instance(ClassControlsUpdateControlledSuperClass);
            instanceOfClassControlsUpdateControlledSuperClassAllowed.allowed = true;
            
            var instanceOfClassControlsUpdateControlledSuperClassNotAllowed = new Instance(ClassControlsUpdateControlledSuperClass);
            instanceOfClassControlsUpdateControlledSuperClassNotAllowed.allowed = false;

            // UpdateControlledSuperClass Instances
            var instanceOfUpdateControlledSuperClassPasses = new Instance(UpdateControlledSuperClass);
            instanceOfUpdateControlledSuperClassPasses.name = 'instanceOfUpdateControlledSuperClassPasses';
            instanceOfUpdateControlledSuperClassPasses.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;

            var instanceOfUpdateControlledSuperClassFailsRelationship = new Instance(UpdateControlledSuperClass);
            instanceOfUpdateControlledSuperClassFailsRelationship.name = 'instanceOfUpdateControlledSuperClassFailsRelationship';
            instanceOfUpdateControlledSuperClassFailsRelationship.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassNotAllowed;

            var instancesOfUpdateControlledSuperClass = new InstanceSet(UpdateControlledSuperClass, [
                instanceOfUpdateControlledSuperClassPasses,
                instanceOfUpdateControlledSuperClassFailsRelationship
            ]);

            // UpdateControlledSubClassOfUpdateControlledSuperClass Instances
            var instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassPasses = new Instance(UpdateControlledSubClassOfUpdateControlledSuperClass);
            instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassPasses.name = 'instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassPasses';
            instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassPasses.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;
            instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassPasses.boolean = true;

            var instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship = new Instance(UpdateControlledSubClassOfUpdateControlledSuperClass);
            instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship.name = 'instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship';
            instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassNotAllowed;
            instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship.boolean = true;

            var instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean = new Instance(UpdateControlledSubClassOfUpdateControlledSuperClass);
            instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean.name = 'instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean'
            instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;
            instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean.boolean = false;
            
            var instancesOfUpdateControlledSubClassOfUpdateControlledSuperClass = new InstanceSet(UpdateControlledSubClassOfUpdateControlledSuperClass, [
                instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassPasses,
                instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship,
                instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean
            ]);

            // UpdateControlledDiscriminatedSuperClass Instances
            var instanceOfUpdateControlledDiscriminatedSuperClassPasses = new Instance(UpdateControlledDiscriminatedSuperClass);
            instanceOfUpdateControlledDiscriminatedSuperClassPasses.name = 'instanceOfUpdateControlledDiscriminatedSuperClassPasses';
            instanceOfUpdateControlledDiscriminatedSuperClassPasses.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;
            instanceOfUpdateControlledDiscriminatedSuperClassPasses.boolean = true;
            instanceOfUpdateControlledDiscriminatedSuperClassPasses.string = 'updateControlled';

            var instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship = new Instance(UpdateControlledDiscriminatedSuperClass);
            instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship.name = 'instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship';
            instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassNotAllowed;
            instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship.boolean = true;
            instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship.string = 'updateControlled';

            var instanceOfUpdateControlledDiscriminatedSuperClassFailsString = new Instance(UpdateControlledDiscriminatedSuperClass);
            instanceOfUpdateControlledDiscriminatedSuperClassFailsString.name = 'instanceOfUpdateControlledDiscriminatedSuperClassFailsString';
            instanceOfUpdateControlledDiscriminatedSuperClassFailsString.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;
            instanceOfUpdateControlledDiscriminatedSuperClassFailsString.boolean = true;
            instanceOfUpdateControlledDiscriminatedSuperClassFailsString.string = 'not updateControlled';

            var instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean = new Instance(UpdateControlledDiscriminatedSuperClass);
            instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean.name = 'instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean';
            instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;
            instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean.boolean = false;
            instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean.string = 'updateControlled';
            
            var instancesOfUpdateControlledDiscriminatedSuperClass = new InstanceSet(UpdateControlledDiscriminatedSuperClass, [
                instanceOfUpdateControlledDiscriminatedSuperClassPasses,
                instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                instanceOfUpdateControlledDiscriminatedSuperClassFailsString,
                instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean
            ]);

            // UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass Instances
            var instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses = new Instance(UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass);
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses.name = 'instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses';
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;  
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses.boolean = true;
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses.string = 'updateControlled';         
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses.number = 1;

            var instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship = new Instance(UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass);
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship.name = 'instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship';
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassNotAllowed;             
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship.number = 1;
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship.boolean = true;
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship.string = 'updateControlled';

            var instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean = new Instance(UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass);
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean.name = 'instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean';
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;     
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean.boolean = false;
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean.string = 'updateControlled';
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean.number = 1;

            var instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString = new Instance(UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass);
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString.name = 'instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString';
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;     
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString.boolean = true;
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString.string = 'not updateControlled';            
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString.number = 1;

            var instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber = new Instance(UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass);
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber.name = 'instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber';
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber.boolean = true;
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber.string = 'updateControlled';      
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber.number = -1;
            
            var instancesOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass = new InstanceSet(UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass, [
                instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses,
                instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString,
                instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber
            ]);

            var updateControlledInstances = new InstanceSet(UpdateControlledSuperClass);
            updateControlledInstances.addInstances(instancesOfUpdateControlledSuperClass);
            updateControlledInstances.addInstances(instancesOfUpdateControlledSubClassOfUpdateControlledSuperClass);
            updateControlledInstances.addInstances(instancesOfUpdateControlledDiscriminatedSuperClass);
            updateControlledInstances.addInstances(instancesOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass);

            // UpdateControlledClassUpdateControlledByParameters Instances
            var instanceOfUpdateControlledClassUpdateControlledByParameters = new Instance(UpdateControlledClassUpdateControlledByParameters);

        }

        // Save all SecurityFilter Test Instances
        before(async () => {
            await instanceOfClassControlsUpdateControlledSuperClassAllowed.save();
            await instanceOfClassControlsUpdateControlledSuperClassNotAllowed.save();

        });

        after(async () => {
            await ClassControlsUpdateControlledSuperClass.clear();
            await UpdateControlledSuperClass.clear();
            await UpdateControlledSubClassOfUpdateControlledSuperClass.clear();
            await UpdateControlledDiscriminatedSuperClass.clear();
            await UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass.clear();
            await UpdateControlledClassUpdateControlledByParameters.clear();
        });

        describe('Tests for invalid arguments.', () => {

            it('First Argument must be an InstanceSet', async () => {
                let updatable;
                const expectedErrorMessage = 'Incorrect parameters. ' + UpdateControlledSuperClass.className + '.updateControlCheckSet(InstanceSet instanceSet, ...updateControlMethodParameters)';
                const instanceSet = new InstanceSet(UpdateControlledSuperClass, [instanceOfUpdateControlledSuperClassPasses, instanceOfUpdateControlledSuperClassPasses]);

                try {
                    updatable = await UpdateControlledSuperClass.updateControlCheckSet(instanceOfUpdateControlledSuperClassPasses);
                }
                catch (error) {
                    if (error.message != expectedErrorMessage) {
                        throw  new Error(
                            'updateControlCheckSet() threw an unexpected error.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' + 
                            'Actual:   ' + error.message
                        );
                    }
                }

                if (updatable)
                    throw new Error ('ClassModel.updateControlCheckSet() returned when it should have thrown an error.');
            });

        });

        describe('Update Control Methods Are Inherited', () => {
            
            it('A class with no supers has only it\'s own update control method.', () => {
                if (UpdateControlledSuperClass.updateControlMethods.length === 0)
                    throw new Error('Class is missing it\'s own update control method.');

                if (UpdateControlledSuperClass.updateControlMethods.length > 1)
                    throw new Error('Class has more than one update control method.');
            });

            it('A sub class has both it\'s own update control method, and the super class\' update control method.', () => {
                if (UpdateControlledSubClassOfUpdateControlledSuperClass.updateControlMethods.length < 2)
                    throw new Error('Class is missing a update control method.');
                
                if (UpdateControlledSubClassOfUpdateControlledSuperClass.updateControlMethods.length != 2)
                    throw new Error('Class is has the wrong number of update control methods.');
            });

            it('A discriminated sub class has all the update control methods it should.', () => {
                if (UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass.updateControlMethods.length != 4)
                    throw new Error('Class is has the wrong number of update control methods.');
            });
        
        });

        describe('Test Update Control Check throws error when an instance doesn\'t pass check.', () => {

            describe('UpdateControlledSuperClass.updateControlCheckSet()', () => {

                it('Update Control Check called on Class with only direct instances of Class.', async () => {
                    const instanceSet = new InstanceSet(UpdateControlledSuperClass, [
                        instanceOfUpdateControlledSuperClassPasses,
                        instanceOfUpdateControlledSuperClassFailsRelationship
                    ]);
                    const instancesExpectedToFail = new InstanceSet(UpdateControlledSuperClass, [instanceOfUpdateControlledSuperClassFailsRelationship]);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + instancesExpectedToFail.getInstanceIds();

                    await testForErrorAsync('ClassModel.updateControlCheckSet', expectedErrorMessage, async () => {
                        return  UpdateControlledSuperClass.updateControlCheckSet(instanceSet);
                    });
                });

                it('Update Control Check called on Class with instances of class and sub class.', async () => {
                    const instanceSet = new InstanceSet(UpdateControlledSuperClass, [
                        instanceOfUpdateControlledSuperClassPasses,
                        instanceOfUpdateControlledSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassPasses,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship
                    ]);
                    const instancesExpectedToFail = new InstanceSet(UpdateControlledSuperClass, [
                        instanceOfUpdateControlledSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship
                    ]);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + instancesExpectedToFail.getInstanceIds();

                    await testForErrorAsync('ClassModel.updateControlCheckSet', expectedErrorMessage, async () => {
                        return  UpdateControlledSuperClass.updateControlCheckSet(instanceSet);
                    });
                });

                it('Update Control Check called on Class with instances of class and 3 layers of sub classes.', async () => {
                    const instanceSet = new InstanceSet(UpdateControlledSuperClass, [
                        instanceOfUpdateControlledSuperClassPasses,
                        instanceOfUpdateControlledSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassPasses,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship,
                        instanceOfUpdateControlledDiscriminatedSuperClassPasses,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber
                    ]);
                    const instancesExpectedToFail = new InstanceSet(UpdateControlledSuperClass, [
                        instanceOfUpdateControlledSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber
                    ]);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + instancesExpectedToFail.getInstanceIds();

                    await testForErrorAsync('ClassModel.updateControlCheckSet', expectedErrorMessage, async () => {
                        return  UpdateControlledSuperClass.updateControlCheckSet(instanceSet);
                    });
                });

            });

            describe('UpdateControlledSubClassOfUpdateControlledSuperClass.updateControlCheckSet()', () => {

                it('Update Control Check called on Class with only direct instances of Class.', async () => {
                    const instanceSet = new InstanceSet(UpdateControlledSuperClass, [
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassPasses,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship
                    ]);
                    const instancesExpectedToFail = new InstanceSet(UpdateControlledSuperClass, [
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship,
                    ]);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + instancesExpectedToFail.getInstanceIds();

                    await testForErrorAsync('ClassModel.updateControlCheckSet', expectedErrorMessage, async () => {
                        return  UpdateControlledSubClassOfUpdateControlledSuperClass.updateControlCheckSet(instanceSet);
                    });
                });

                it('Update Control Check called on Class with instances of class and 1 layers of sub classes.', async () => {
                    const instanceSet = new InstanceSet(UpdateControlledSuperClass, [
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassPasses,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship,
                        instanceOfUpdateControlledDiscriminatedSuperClassPasses,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship
                    ]);
                    const instancesExpectedToFail = new InstanceSet(UpdateControlledSuperClass, [
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship
                    ]);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + instancesExpectedToFail.getInstanceIds();

                    await testForErrorAsync('ClassModel.updateControlCheckSet', expectedErrorMessage, async () => {
                        return  UpdateControlledSubClassOfUpdateControlledSuperClass.updateControlCheckSet(instanceSet);
                    });
                });

                it('Update Control Check called on Class with instances of 2 layers of sub classes.', async () => {
                    const instanceSet = new InstanceSet(UpdateControlledSuperClass, [
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassPasses,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship,
                        instanceOfUpdateControlledDiscriminatedSuperClassPasses,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber
                    ]);
                    const instancesExpectedToFail = new InstanceSet(UpdateControlledSuperClass, [
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber
                    ]);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + instancesExpectedToFail.getInstanceIds();

                    await testForErrorAsync('ClassModel.updateControlCheckSet', expectedErrorMessage, async () => {
                        return  UpdateControlledSubClassOfUpdateControlledSuperClass.updateControlCheckSet(instanceSet);
                    });
                });

            });

            describe('UpdateControlledDiscriminatedSuperClass.updateControlCheckSet()', () => {

                it('Update Control Check called on Class with only direct instances of Class.', async () => {
                    const instanceSet = new InstanceSet(UpdateControlledSuperClass, [
                        instanceOfUpdateControlledDiscriminatedSuperClassPasses,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship
                    ]);
                    const instancesExpectedToFail = new InstanceSet(UpdateControlledSuperClass, [
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship
                    ]);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + instancesExpectedToFail.getInstanceIds();

                    await testForErrorAsync('ClassModel.updateControlCheckSet', expectedErrorMessage, async () => {
                        return  UpdateControlledDiscriminatedSuperClass.updateControlCheckSet(instanceSet);
                    });
                });

                it('Update Control Check called on Class with instances of 1 layers of sub classes', async () => {
                    const instanceSet = new InstanceSet(UpdateControlledSuperClass, [
                        instanceOfUpdateControlledDiscriminatedSuperClassPasses,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber
                    ]);
                    const instancesExpectedToFail = new InstanceSet(UpdateControlledSuperClass, [
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber
                    ]);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + instancesExpectedToFail.getInstanceIds();

                    await testForErrorAsync('ClassModel.updateControlCheckSet', expectedErrorMessage, async () => {
                        return  UpdateControlledDiscriminatedSuperClass.updateControlCheckSet(instanceSet);
                    });
                });

            });

            describe('UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass.updateControlCheckSet()', () => {

                it('Update Control Check called on Class with only direct instances of Class.', async () => {
                    const instanceSet = new InstanceSet(UpdateControlledSuperClass, [
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber
                    ]);
                    const instancesExpectedToFail = new InstanceSet(UpdateControlledSuperClass, [
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber
                    ]);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + instancesExpectedToFail.getInstanceIds();

                    await testForErrorAsync('ClassModel.updateControlCheckSet', expectedErrorMessage, async () => {
                        return  UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass.updateControlCheckSet(instanceSet);
                    });
                });

            });

            describe('UpdateControlledClassUpdateControlledByParameters.updateControlCheckSet()', () => {

                it('Update Control Check passes', async () => {
                    const instanceSet = new InstanceSet(UpdateControlledClassUpdateControlledByParameters, [instanceOfUpdateControlledClassUpdateControlledByParameters]);
                    const updateAllowed = await UpdateControlledClassUpdateControlledByParameters.updateControlCheckSet(instanceSet, 1, 1, true);
                    
                    if (!updateAllowed) {
                        throw new Error('Update check passed when it should have thrown an error.');
                    }
                });

                it('Instance fails update control check because of Numbers.', async () => {
                    const instanceSet = new InstanceSet(UpdateControlledClassUpdateControlledByParameters, [
                        instanceOfUpdateControlledClassUpdateControlledByParameters,
                    ]);
                    const instancesExpectedToFail = new InstanceSet(UpdateControlledClassUpdateControlledByParameters, [instanceOfUpdateControlledClassUpdateControlledByParameters]);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + instancesExpectedToFail.getInstanceIds();

                    await testForErrorAsync('ClassModel.updateControlCheckSet', expectedErrorMessage, async () => {
                        return  UpdateControlledClassUpdateControlledByParameters.updateControlCheckSet(instanceSet, -2, 1, true);
                    });
                });

                it('Instance fails update control check because of Boolean.', async () => {
                    const instanceSet = new InstanceSet(UpdateControlledClassUpdateControlledByParameters, [
                        instanceOfUpdateControlledClassUpdateControlledByParameters,
                    ]);
                    const instancesExpectedToFail = new InstanceSet(UpdateControlledClassUpdateControlledByParameters, [instanceOfUpdateControlledClassUpdateControlledByParameters]);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + instancesExpectedToFail.getInstanceIds();

                    await testForErrorAsync('ClassModel.updateControlCheckSet', expectedErrorMessage, async () => {
                        return  UpdateControlledClassUpdateControlledByParameters.updateControlCheckSet(instanceSet, 1, 1, false);
                    });
                });

            });

        });

    });

});

