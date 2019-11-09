const ClassModel = require('../../src/noomman/ClassModel');
const InstanceSet = require('../../src/noomman/InstanceSet');
const Instance = require('../../src/noomman/Instance');
const database = require('../../src/noomman/database');
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
    var SubClassOfDiscriminatedSuperClass = TestClassModels.SubClassOfDiscriminatedSuperClass;
    var DiscriminatedSubClassOfSuperClass = TestClassModels.DiscriminatedSubClassOfSuperClass;
    var SubClassOfDiscriminatedSubClassOfSuperClass = TestClassModels.SubClassOfDiscriminatedSubClassOfSuperClass;
    var SubClassOfSubClassOfSuperClass = TestClassModels.SubClassOfSubClassOfSuperClass;
    var SubClassOfAbstractSubClassOfSuperClass = TestClassModels.SubClassOfAbstractSubClassOfSuperClass;

    // Relationship Classes
    var SingularRelationshipClass = TestClassModels.SingularRelationshipClass;
    var NonSingularRelationshipClass = TestClassModels.NonSingularRelationshipClass;
    var SubClassOfSingularRelationshipClass = TestClassModels.SubClassOfSingularRelationshipClass;
    var SubClassOfNonSingularRelationshipClass = TestClassModels.SubClassOfNonSingularRelationshipClass;
    var TwoWayRelationshipClass1 = TestClassModels.TwoWayRelationshipClass1;
    var TwoWayRelationshipClass2 = TestClassModels.TwoWayRelationshipClass2;

    // CreateControlled Classes
    var CreateControlledSuperClass = TestClassModels.CreateControlledSuperClass;
    var CreateControlledSubClassOfCreateControlledSuperClass = TestClassModels.CreateControlledSubClassOfCreateControlledSuperClass;
    var CreateControlledDiscriminatedSuperClass = TestClassModels.CreateControlledDiscriminatedSuperClass;
    var CreateControlledSubClassOfCreateControlledDiscriminatedSuperClass = TestClassModels.CreateControlledSubClassOfCreateControlledDiscriminatedSuperClass;
    var ClassControlsCreateControlledSuperClass = TestClassModels.ClassControlsCreateControlledSuperClass;
    var CreateControlledClassCreateControlledByParameters = TestClassModels.CreateControlledClassCreateControlledByParameters;

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

    // DeleteControlled Classes
    var DeleteControlledSuperClass = TestClassModels.DeleteControlledSuperClass;
    var DeleteControlledSubClassOfDeleteControlledSuperClass = TestClassModels.DeleteControlledSubClassOfDeleteControlledSuperClass;
    var DeleteControlledDiscriminatedSuperClass = TestClassModels.DeleteControlledDiscriminatedSuperClass;
    var DeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClass = TestClassModels.DeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClass;
    var ClassControlsDeleteControlledSuperClass = TestClassModels.ClassControlsDeleteControlledSuperClass;
    var DeleteControlledClassDeleteControlledByParameters = TestClassModels.DeleteControlledClassDeleteControlledByParameters;

    // Validation Classes
    
    var ValidationSuperClass = TestClassModels.ValidationSuperClass;
    var SubClassOfValidationSuperClass = TestClassModels.SubClassOfValidationSuperClass;
    var ValidationDiscriminatedSuperClass = TestClassModels.ValidationDiscriminatedSuperClass;
    var SubClassOfValidationDiscriminatedSuperClass = TestClassModels.SubClassOfValidationDiscriminatedSuperClass;
    var AsyncValidationClass = TestClassModels.AsyncValidationClass;
    var RelatedValidationClass = TestClassModels.RelatedValidationClass;

    // Auditable Classes
    
    var AuditableSuperClass = TestClassModels.AuditableSuperClass;
    var AuditableSubClass = TestClassModels.AuditableSubClass
    var AuditableDiscriminatedSubClass = TestClassModels.AuditableDiscriminatedSubClass;
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

        describe('Validation Requirements', () => {

            it('If validations are provied, it must be an Array.', () => {
                const expectedErrorMessage = 'If validations are provided, it must be an Array.';

                testForError('ClassModel.constructor()', expectedErrorMessage, () => {
                    new ClassModel({
                        className: 'ValidationsClass1',
                        validations: {},
                    });
                });
            });

            it('If auditable is provided, it must be a boolean.', () => {
                testForError('ClassModel.constructor()', 'If auditable is provided, it must be a boolean.', () => {
                    new ClassModel({
                        className: 'BadAuditableClass',
                        auditable: 0,
                    });
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
    
            it('If useSuperClassCollection is set, superClasses have only one class.', () => {
                testForError('ClassModel.constructor()', 'If useSuperClassCollection is true, a single super class must be provided.', () => {
                    new ClassModel({
                        className: 'SubClassModel',
                        superClasses: [SuperClass, DiscriminatedSuperClass],
                        useSuperClassCollection: true,
                    })
                });
            });
    
            it('If useSuperClassCollection is set, superClasses must be given.', () => {
                testForError('ClassModel.constructor()', 'If useSuperClassCollection is true, a single super class must be provided.', () => {
                    new ClassModel({
                        className: 'SubClassModel',
                        useSuperClassCollection: true,
                    })
                });
            });
    
            it('A sub class with useSuperClassCollection set to true cannot be abstract.', () => {
                testForError('ClassModel.constructor()', 'If useSuperClassCollection is true, abstract cannot be true.', () => {
                    new ClassModel({
                        className: 'SubClassModel',
                        abstract: true,
                        superClasses: [DiscriminatedSuperClass],
                        useSuperClassCollection: true,
                    });
                });
            });  
    
            it('A sub class of a class using super class collection cannot have a subclass.', () => {
                testForError('ClassModel.constructor()', 'You cannot create a sub class of a class which has useSuperClassCollection set to true.', () => {
                    new ClassModel({
                        className: 'SubClassModel',
                        superClasses: [SubClassOfDiscriminatedSuperClass],
                    });
                });
            });  
    
            it('Sub class schema cannot contain the same field names as a super class schema.', () => {
                testForError('ClassModel.contructor()', 'Sub class schema cannot contain the same attribute names as a super class schema.', () => {
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
                });
            });  
    
            it('Sub class schema cannot contain the same field names as a super class schema.', () => {
                testForError('ClassModel.contructor()', 'Sub class schema cannot contain the same attribute names as a super class schema.', () => {
                    new ClassModel({
                        className: 'SubClassModel',
                        superClasses: [DiscriminatedSuperClass],
                        useSuperClassCollection: true,
                        attributes: [
                            {
                                name: 'boolean',
                                type: Boolean,
                            }
                        ],
                    });
                });
            });  
    
            it('If a sub class is created, it is pushed to the super class\'s "subClasses" array.', () => {
                if (SuperClass.subClasses.length == 0)
                    throw new Error('SuperClass.subClasses array has no entries in it.');
                if (!SuperClass.subClasses.includes(SubClassOfSuperClass)) 
                    throw new Error('SuperClass.subClasses does not contain sub class.');
                
                if (DiscriminatedSuperClass.subClasses.length == 0)
                    throw new Error('DiscriminatedSuperClass.subClasses array has no entries in it.');
                if (!DiscriminatedSuperClass.subClasses.includes(SubClassOfDiscriminatedSuperClass)) 
                    throw new Error('DiscriminatedSuperClass.subClasses does not contain sub class.');
    
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
                testForError('ClassModel.constructor', 'You cannot create a sub class of a class which has useSuperClassCollection set to true.', () => {
                    new ClassModel({
                        className: 'SubClassModel',
                        superClasses: [SubClassOfDiscriminatedSuperClass]
                    });

                });
            });

            it('A sub class of an auditable class cannot have auditable set to false.', () => {
                testForError('ClassModel.constructor()', 'You cannot create a non-auditable sub class of an auditable super class.', () => {
                    new ClassModel({
                        className: 'BadAuditableSubClass',
                        superClasses: [AuditableSuperClass],
                        auditable: false,
                    })
                });
            });
    
            it.skip('An abstract, non-discriminated class should have no collection.', () => {
                if (AbstractSuperClass.collection);
                    throw new Error('An abstract class should not have a collection.');
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

                await SubClassOfDiscriminatedSuperClass.insertOne(document);

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

                await SubClassOfDiscriminatedSuperClass.insertMany([document1, document2]);

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

        describe('ClassModel.overwrite()', () => {

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
                await SuperClass.overwrite(document);

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

                await SubClassOfDiscriminatedSuperClass.insertOne(document);
                document.boolean = true;
                await SubClassOfDiscriminatedSuperClass.overwrite(document);

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
            var instanceOfSubClassOfDiscriminatedSuperClass = new Instance(SubClassOfDiscriminatedSuperClass);
            var instanceOfSubClassOfDiscriminatedSubClassOfSuperClass = new Instance(SubClassOfDiscriminatedSubClassOfSuperClass);
            var instanceOfSubClassOfSubClassOfSuperClass = new Instance(SubClassOfSubClassOfSuperClass);
            var instanceOfSubClassOfAbstractSubClassOfSuperClass = new Instance(SubClassOfAbstractSubClassOfSuperClass);
    
            instanceOfAllFieldsMutexClass.string = 'instanceOfAllFieldsMutexClass';
            instanceOfDiscriminatedSuperClass.name = 'instanceOfDiscriminatedSuperClass';
            instanceOfSuperClass.name = 'instanceOfSuperClass';
            instanceOfSubClassOfSuperClass.name = 'instanceOfSubClassOfSuperClass';
            instanceOfSubClassOfAbstractSuperClass.name = 'instanceOfSubClassOfAbstractSuperClass';
            instanceOfSubClassOfDiscriminatedSuperClass.name = 'instanceOfSubClassOfDiscriminatedSuperClass';
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
                instanceOfSubClassOfDiscriminatedSuperClass.save(),
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
                SubClassOfDiscriminatedSuperClass.clear(),
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
                    const classToCallFindOneOn = SubClassOfDiscriminatedSuperClass;
                    const instanceToFind = instanceOfSubClassOfDiscriminatedSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfDiscriminatedSuperClass'
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
                    const instanceToFind = instanceOfSubClassOfDiscriminatedSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfDiscriminatedSuperClass'
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
                    const classToCallFindInstanceByIdOn = SubClassOfDiscriminatedSuperClass;
                    const instanceToFind = instanceOfSubClassOfDiscriminatedSuperClass;

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
                    const instanceToFind = instanceOfSubClassOfDiscriminatedSuperClass;

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
                        const classToCallFindOn = SubClassOfDiscriminatedSuperClass;
                        const classOfInstance = SubClassOfDiscriminatedSuperClass;
                        const instanceToFind = instanceOfSubClassOfDiscriminatedSuperClass;
                        const expectedInstances = new InstanceSet(classOfInstance, [instanceToFind]);
    
                        const filter = {
                            name: 'instanceOfSubClassOfDiscriminatedSuperClass'
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
                        const instanceToFind = instanceOfSubClassOfDiscriminatedSuperClass;
                        const expectedInstances = new InstanceSet(classToCallFindOn, [instanceToFind]);
    
                        const filter = {
                            name: 'instanceOfSubClassOfDiscriminatedSuperClass'
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

    describe('CRUD Control Methods', () => {

        describe('ClassModel.createControlCheck()', () => {
    
            // Set up createControlled Instances
            // For each class, create on instance which will pass all create control filters, and one each that will fail due to one of the create control methods
            {
                // ClassControlsCreateControlledSuperClass Instances
                var instanceOfClassControlsCreateControlledSuperClassAllowed = new Instance(ClassControlsCreateControlledSuperClass);
                instanceOfClassControlsCreateControlledSuperClassAllowed.allowed = true;
                
                var instanceOfClassControlsCreateControlledSuperClassNotAllowed = new Instance(ClassControlsCreateControlledSuperClass);
                instanceOfClassControlsCreateControlledSuperClassNotAllowed.allowed = false;
    
                // CreateControlledSuperClass Instances
                var instanceOfCreateControlledSuperClassPasses = new Instance(CreateControlledSuperClass);
                instanceOfCreateControlledSuperClassPasses.name = 'instanceOfCreateControlledSuperClassPasses';
                instanceOfCreateControlledSuperClassPasses.createControlledBy = instanceOfClassControlsCreateControlledSuperClassAllowed;
    
                var instanceOfCreateControlledSuperClassFailsRelationship = new Instance(CreateControlledSuperClass);
                instanceOfCreateControlledSuperClassFailsRelationship.name = 'instanceOfCreateControlledSuperClassFailsRelationship';
                instanceOfCreateControlledSuperClassFailsRelationship.createControlledBy = instanceOfClassControlsCreateControlledSuperClassNotAllowed;
    
                var instancesOfCreateControlledSuperClass = new InstanceSet(CreateControlledSuperClass, [
                    instanceOfCreateControlledSuperClassPasses,
                    instanceOfCreateControlledSuperClassFailsRelationship
                ]);
    
                // CreateControlledSubClassOfCreateControlledSuperClass Instances
                var instanceOfCreateControlledSubClassOfCreateControlledSuperClassPasses = new Instance(CreateControlledSubClassOfCreateControlledSuperClass);
                instanceOfCreateControlledSubClassOfCreateControlledSuperClassPasses.name = 'instanceOfCreateControlledSubClassOfCreateControlledSuperClassPasses';
                instanceOfCreateControlledSubClassOfCreateControlledSuperClassPasses.createControlledBy = instanceOfClassControlsCreateControlledSuperClassAllowed;
                instanceOfCreateControlledSubClassOfCreateControlledSuperClassPasses.boolean = true;
    
                var instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsRelationship = new Instance(CreateControlledSubClassOfCreateControlledSuperClass);
                instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsRelationship.name = 'instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsRelationship';
                instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsRelationship.createControlledBy = instanceOfClassControlsCreateControlledSuperClassNotAllowed;
                instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsRelationship.boolean = true;
    
                var instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsBoolean = new Instance(CreateControlledSubClassOfCreateControlledSuperClass);
                instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsBoolean.name = 'instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsBoolean'
                instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsBoolean.createControlledBy = instanceOfClassControlsCreateControlledSuperClassAllowed;
                instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsBoolean.boolean = false;
                
                var instancesOfCreateControlledSubClassOfCreateControlledSuperClass = new InstanceSet(CreateControlledSubClassOfCreateControlledSuperClass, [
                    instanceOfCreateControlledSubClassOfCreateControlledSuperClassPasses,
                    instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsRelationship,
                    instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsBoolean
                ]);
    
                // CreateControlledDiscriminatedSuperClass Instances
                var instanceOfCreateControlledDiscriminatedSuperClassPasses = new Instance(CreateControlledDiscriminatedSuperClass);
                instanceOfCreateControlledDiscriminatedSuperClassPasses.name = 'instanceOfCreateControlledDiscriminatedSuperClassPasses';
                instanceOfCreateControlledDiscriminatedSuperClassPasses.createControlledBy = instanceOfClassControlsCreateControlledSuperClassAllowed;
                instanceOfCreateControlledDiscriminatedSuperClassPasses.boolean = true;
                instanceOfCreateControlledDiscriminatedSuperClassPasses.string = 'createControlled';
    
                var instanceOfCreateControlledDiscriminatedSuperClassFailsRelationship = new Instance(CreateControlledDiscriminatedSuperClass);
                instanceOfCreateControlledDiscriminatedSuperClassFailsRelationship.name = 'instanceOfCreateControlledDiscriminatedSuperClassFailsRelationship';
                instanceOfCreateControlledDiscriminatedSuperClassFailsRelationship.createControlledBy = instanceOfClassControlsCreateControlledSuperClassNotAllowed;
                instanceOfCreateControlledDiscriminatedSuperClassFailsRelationship.boolean = true;
                instanceOfCreateControlledDiscriminatedSuperClassFailsRelationship.string = 'createControlled';
    
                var instanceOfCreateControlledDiscriminatedSuperClassFailsString = new Instance(CreateControlledDiscriminatedSuperClass);
                instanceOfCreateControlledDiscriminatedSuperClassFailsString.name = 'instanceOfCreateControlledDiscriminatedSuperClassFailsString';
                instanceOfCreateControlledDiscriminatedSuperClassFailsString.createControlledBy = instanceOfClassControlsCreateControlledSuperClassAllowed;
                instanceOfCreateControlledDiscriminatedSuperClassFailsString.boolean = true;
                instanceOfCreateControlledDiscriminatedSuperClassFailsString.string = 'not createControlled';
    
                var instanceOfCreateControlledDiscriminatedSuperClassFailsBoolean = new Instance(CreateControlledDiscriminatedSuperClass);
                instanceOfCreateControlledDiscriminatedSuperClassFailsBoolean.name = 'instanceOfCreateControlledDiscriminatedSuperClassFailsBoolean';
                instanceOfCreateControlledDiscriminatedSuperClassFailsBoolean.createControlledBy = instanceOfClassControlsCreateControlledSuperClassAllowed;
                instanceOfCreateControlledDiscriminatedSuperClassFailsBoolean.boolean = false;
                instanceOfCreateControlledDiscriminatedSuperClassFailsBoolean.string = 'createControlled';
                
                var instancesOfCreateControlledDiscriminatedSuperClass = new InstanceSet(CreateControlledDiscriminatedSuperClass, [
                    instanceOfCreateControlledDiscriminatedSuperClassPasses,
                    instanceOfCreateControlledDiscriminatedSuperClassFailsRelationship,
                    instanceOfCreateControlledDiscriminatedSuperClassFailsString,
                    instanceOfCreateControlledDiscriminatedSuperClassFailsBoolean
                ]);
    
                // CreateControlledSubClassOfCreateControlledDiscriminatedSuperClass Instances
                var instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassPasses = new Instance(CreateControlledSubClassOfCreateControlledDiscriminatedSuperClass);
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassPasses.name = 'instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassPasses';
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassPasses.createControlledBy = instanceOfClassControlsCreateControlledSuperClassAllowed;  
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassPasses.boolean = true;
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassPasses.string = 'createControlled';         
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassPasses.number = 1;
    
                var instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsRelationship = new Instance(CreateControlledSubClassOfCreateControlledDiscriminatedSuperClass);
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsRelationship.name = 'instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsRelationship';
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsRelationship.createControlledBy = instanceOfClassControlsCreateControlledSuperClassNotAllowed;             
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsRelationship.number = 1;
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsRelationship.boolean = true;
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsRelationship.string = 'createControlled';
    
                var instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsBoolean = new Instance(CreateControlledSubClassOfCreateControlledDiscriminatedSuperClass);
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsBoolean.name = 'instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsBoolean';
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsBoolean.createControlledBy = instanceOfClassControlsCreateControlledSuperClassAllowed;     
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsBoolean.boolean = false;
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsBoolean.string = 'createControlled';
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsBoolean.number = 1;
    
                var instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsString = new Instance(CreateControlledSubClassOfCreateControlledDiscriminatedSuperClass);
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsString.name = 'instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsString';
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsString.createControlledBy = instanceOfClassControlsCreateControlledSuperClassAllowed;     
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsString.boolean = true;
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsString.string = 'not createControlled';            
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsString.number = 1;
    
                var instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsNumber = new Instance(CreateControlledSubClassOfCreateControlledDiscriminatedSuperClass);
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsNumber.name = 'instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsNumber';
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsNumber.createControlledBy = instanceOfClassControlsCreateControlledSuperClassAllowed;
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsNumber.boolean = true;
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsNumber.string = 'createControlled';      
                instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsNumber.number = -1;
                
                var instancesOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClass = new InstanceSet(CreateControlledSubClassOfCreateControlledDiscriminatedSuperClass, [
                    instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassPasses,
                    instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsRelationship,
                    instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsBoolean,
                    instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsString,
                    instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsNumber
                ]);
    
                var createControlledInstances = new InstanceSet(CreateControlledSuperClass);
                createControlledInstances.addInstances(instancesOfCreateControlledSuperClass);
                createControlledInstances.addInstances(instancesOfCreateControlledSubClassOfCreateControlledSuperClass);
                createControlledInstances.addInstances(instancesOfCreateControlledDiscriminatedSuperClass);
                createControlledInstances.addInstances(instancesOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClass);
    
                // CreateControlledClassCreateControlledByParameters Instances
                var instanceOfCreateControlledClassCreateControlledByParameters = new Instance(CreateControlledClassCreateControlledByParameters);
    
            }
    
            // Save all CreateControl Test Instances
            before(async () => {
                await instanceOfClassControlsCreateControlledSuperClassAllowed.save();
                await instanceOfClassControlsCreateControlledSuperClassNotAllowed.save();
            });
    
            after(async () => {
                await ClassControlsCreateControlledSuperClass.clear();
                await CreateControlledSuperClass.clear();
                await CreateControlledSubClassOfCreateControlledSuperClass.clear();
                await CreateControlledDiscriminatedSuperClass.clear();
                await CreateControlledSubClassOfCreateControlledDiscriminatedSuperClass.clear();
                await CreateControlledClassCreateControlledByParameters.clear();
            });
    
            describe('Tests for invalid arguments.', () => {
    
                it('First Argument must be an InstanceSet', async () => {
                    let updatable;
                    const expectedErrorMessage = 'Incorrect parameters. ' + CreateControlledSuperClass.className + '.createControlCheck(InstanceSet instanceSet, ...createControlMethodParameters)';
                    const instanceSet = new InstanceSet(CreateControlledSuperClass, [instanceOfCreateControlledSuperClassPasses, instanceOfCreateControlledSuperClassPasses]);
    
                    try {
                        updatable = await CreateControlledSuperClass.createControlCheck(instanceOfCreateControlledSuperClassPasses);
                    }
                    catch (error) {
                        if (error.message != expectedErrorMessage) {
                            throw  new Error(
                                'createControlCheck() threw an unexpected error.\n' + 
                                'Expected: ' + expectedErrorMessage + '\n' + 
                                'Actual:   ' + error.message
                            );
                        }
                    }
    
                    if (updatable)
                        throw new Error ('ClassModel.createControlCheck() returned when it should have thrown an error.');
                });
    
            });
    
            describe('Create Control Methods Are Inherited', () => {
                
                it('A class with no supers has only it\'s own create control method.', () => {
                    if (CreateControlledSuperClass.createControlMethods.length === 0)
                        throw new Error('Class is missing it\'s own create control method.');
    
                    if (CreateControlledSuperClass.createControlMethods.length > 1)
                        throw new Error('Class has more than one create control method.');
                });
    
                it('A sub class has both it\'s own create control method, and the super class\' create control method.', () => {
                    if (CreateControlledSubClassOfCreateControlledSuperClass.createControlMethods.length < 2)
                        throw new Error('Class is missing a create control method.');
                    
                    if (CreateControlledSubClassOfCreateControlledSuperClass.createControlMethods.length != 2)
                        throw new Error('Class is has the wrong number of create control methods.');
                });
    
                it('A discriminated sub class has all the create control methods it should.', () => {
                    if (CreateControlledSubClassOfCreateControlledDiscriminatedSuperClass.createControlMethods.length != 4)
                        throw new Error('Class is has the wrong number of create control methods.');
                });
            
            });
    
            describe('Test Create Control Check throws error when an instance doesn\'t pass check.', () => {
    
                describe('CreateControlledSuperClass.createControlCheck()', () => {
    
                    it('Create Control Check called on Class with only direct instances of Class.', async () => {
                        const instanceSet = new InstanceSet(CreateControlledSuperClass, [
                            instanceOfCreateControlledSuperClassPasses,
                            instanceOfCreateControlledSuperClassFailsRelationship
                        ]);
                        const instancesExpectedToFail = new InstanceSet(CreateControlledSuperClass, [instanceOfCreateControlledSuperClassFailsRelationship]);
                        const expectedErrorMessage = 'Illegal attempt to create instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.createControlCheck', expectedErrorMessage, async () => {
                            return  CreateControlledSuperClass.createControlCheck(instanceSet);
                        });
                    });
    
                    it('Create Control Check called on Class with instances of class and sub class.', async () => {
                        const instanceSet = new InstanceSet(CreateControlledSuperClass, [
                            instanceOfCreateControlledSuperClassPasses,
                            instanceOfCreateControlledSuperClassFailsRelationship,
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassPasses,
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsBoolean,
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsRelationship
                        ]);
                        const instancesExpectedToFail = new InstanceSet(CreateControlledSuperClass, [
                            instanceOfCreateControlledSuperClassFailsRelationship,
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsBoolean,
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsRelationship
                        ]);
                        const expectedErrorMessage = 'Illegal attempt to create instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.createControlCheck', expectedErrorMessage, async () => {
                            return  CreateControlledSuperClass.createControlCheck(instanceSet);
                        });
                    });
    
                    it('Create Control Check called on Class with instances of class and 3 layers of sub classes.', async () => {
                        const instanceSet = new InstanceSet(CreateControlledSuperClass, [
                            instanceOfCreateControlledSuperClassPasses,
                            instanceOfCreateControlledSuperClassFailsRelationship,
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassPasses,
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsBoolean,
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsRelationship,
                            instanceOfCreateControlledDiscriminatedSuperClassPasses,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsString,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassPasses,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsString,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsNumber
                        ]);
                        const instancesExpectedToFail = new InstanceSet(CreateControlledSuperClass, [
                            instanceOfCreateControlledSuperClassFailsRelationship,
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsBoolean,
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsRelationship,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsString,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsString,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsNumber
                        ]);
                        const expectedErrorMessage = 'Illegal attempt to create instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.createControlCheck', expectedErrorMessage, async () => {
                            return  CreateControlledSuperClass.createControlCheck(instanceSet);
                        });
                    });
    
                });
    
                describe('CreateControlledSubClassOfCreateControlledSuperClass.createControlCheck()', () => {
    
                    it('Create Control Check called on Class with only direct instances of Class.', async () => {
                        const instanceSet = new InstanceSet(CreateControlledSuperClass, [
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassPasses,
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsBoolean,
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsRelationship
                        ]);
                        const instancesExpectedToFail = new InstanceSet(CreateControlledSuperClass, [
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsBoolean,
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsRelationship,
                        ]);
                        const expectedErrorMessage = 'Illegal attempt to create instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.createControlCheck', expectedErrorMessage, async () => {
                            return  CreateControlledSubClassOfCreateControlledSuperClass.createControlCheck(instanceSet);
                        });
                    });
    
                    it('Create Control Check called on Class with instances of class and 1 layers of sub classes.', async () => {
                        const instanceSet = new InstanceSet(CreateControlledSuperClass, [
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassPasses,
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsBoolean,
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsRelationship,
                            instanceOfCreateControlledDiscriminatedSuperClassPasses,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsString,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsRelationship
                        ]);
                        const instancesExpectedToFail = new InstanceSet(CreateControlledSuperClass, [
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsBoolean,
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsRelationship,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsString,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsRelationship
                        ]);
                        const expectedErrorMessage = 'Illegal attempt to create instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.createControlCheck', expectedErrorMessage, async () => {
                            return  CreateControlledSubClassOfCreateControlledSuperClass.createControlCheck(instanceSet);
                        });
                    });
    
                    it('Create Control Check called on Class with instances of 2 layers of sub classes.', async () => {
                        const instanceSet = new InstanceSet(CreateControlledSuperClass, [
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassPasses,
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsBoolean,
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsRelationship,
                            instanceOfCreateControlledDiscriminatedSuperClassPasses,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsString,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassPasses,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsString,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsNumber
                        ]);
                        const instancesExpectedToFail = new InstanceSet(CreateControlledSuperClass, [
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsBoolean,
                            instanceOfCreateControlledSubClassOfCreateControlledSuperClassFailsRelationship,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsString,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsString,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsNumber
                        ]);
                        const expectedErrorMessage = 'Illegal attempt to create instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.createControlCheck', expectedErrorMessage, async () => {
                            return  CreateControlledSubClassOfCreateControlledSuperClass.createControlCheck(instanceSet);
                        });
                    });
    
                });
    
                describe('CreateControlledDiscriminatedSuperClass.createControlCheck()', () => {
    
                    it('Create Control Check called on Class with only direct instances of Class.', async () => {
                        const instanceSet = new InstanceSet(CreateControlledSuperClass, [
                            instanceOfCreateControlledDiscriminatedSuperClassPasses,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsString,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsRelationship
                        ]);
                        const instancesExpectedToFail = new InstanceSet(CreateControlledSuperClass, [
                            instanceOfCreateControlledDiscriminatedSuperClassFailsString,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsRelationship
                        ]);
                        const expectedErrorMessage = 'Illegal attempt to create instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.createControlCheck', expectedErrorMessage, async () => {
                            return  CreateControlledDiscriminatedSuperClass.createControlCheck(instanceSet);
                        });
                    });
    
                    it('Create Control Check called on Class with instances of 1 layers of sub classes', async () => {
                        const instanceSet = new InstanceSet(CreateControlledSuperClass, [
                            instanceOfCreateControlledDiscriminatedSuperClassPasses,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsString,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassPasses,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsString,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsNumber
                        ]);
                        const instancesExpectedToFail = new InstanceSet(CreateControlledSuperClass, [
                            instanceOfCreateControlledDiscriminatedSuperClassFailsString,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfCreateControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsString,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsNumber
                        ]);
                        const expectedErrorMessage = 'Illegal attempt to create instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.createControlCheck', expectedErrorMessage, async () => {
                            return  CreateControlledDiscriminatedSuperClass.createControlCheck(instanceSet);
                        });
                    });
    
                });
    
                describe('CreateControlledSubClassOfCreateControlledDiscriminatedSuperClass.createControlCheck()', () => {
    
                    it('Create Control Check called on Class with only direct instances of Class.', async () => {
                        const instanceSet = new InstanceSet(CreateControlledSuperClass, [
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassPasses,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsString,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsNumber
                        ]);
                        const instancesExpectedToFail = new InstanceSet(CreateControlledSuperClass, [
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsString,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfCreateControlledSubClassOfCreateControlledDiscriminatedSuperClassFailsNumber
                        ]);
                        const expectedErrorMessage = 'Illegal attempt to create instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.createControlCheck', expectedErrorMessage, async () => {
                            return  CreateControlledSubClassOfCreateControlledDiscriminatedSuperClass.createControlCheck(instanceSet);
                        });
                    });
    
                });
    
                describe('CreateControlledClassCreateControlledByParameters.createControlCheck()', () => {
    
                    it('Create Control Check passes', async () => {
                        const instanceSet = new InstanceSet(CreateControlledClassCreateControlledByParameters, [instanceOfCreateControlledClassCreateControlledByParameters]);
                        await CreateControlledClassCreateControlledByParameters.createControlCheck(instanceSet, 1, 1, true);
                    });
    
                    it('Instance fails create control check because of Numbers.', async () => {
                        const instanceSet = new InstanceSet(CreateControlledClassCreateControlledByParameters, [
                            instanceOfCreateControlledClassCreateControlledByParameters,
                        ]);
                        const instancesExpectedToFail = new InstanceSet(CreateControlledClassCreateControlledByParameters, [instanceOfCreateControlledClassCreateControlledByParameters]);
                        const expectedErrorMessage = 'Illegal attempt to create instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.createControlCheck', expectedErrorMessage, async () => {
                            return CreateControlledClassCreateControlledByParameters.createControlCheck(instanceSet, -2, 1, true);
                        });
                    });
    
                    it('Instance fails create control check because of Boolean.', async () => {
                        const instanceSet = new InstanceSet(CreateControlledClassCreateControlledByParameters, [
                            instanceOfCreateControlledClassCreateControlledByParameters,
                        ]);
                        const instancesExpectedToFail = new InstanceSet(CreateControlledClassCreateControlledByParameters, [instanceOfCreateControlledClassCreateControlledByParameters]);
                        const expectedErrorMessage = 'Illegal attempt to create instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.createControlCheck', expectedErrorMessage, async () => {
                            return  CreateControlledClassCreateControlledByParameters.createControlCheck(instanceSet, 1, 1, false);
                        });
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
    
        describe('ClassModel.updateControlCheck()', () => {
    
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
                    const expectedErrorMessage = 'Incorrect parameters. ' + UpdateControlledSuperClass.className + '.updateControlCheck(InstanceSet instanceSet, ...updateControlMethodParameters)';
                    const instanceSet = new InstanceSet(UpdateControlledSuperClass, [instanceOfUpdateControlledSuperClassPasses, instanceOfUpdateControlledSuperClassPasses]);
    
                    try {
                        updatable = await UpdateControlledSuperClass.updateControlCheck(instanceOfUpdateControlledSuperClassPasses);
                    }
                    catch (error) {
                        if (error.message != expectedErrorMessage) {
                            throw  new Error(
                                'updateControlCheck() threw an unexpected error.\n' + 
                                'Expected: ' + expectedErrorMessage + '\n' + 
                                'Actual:   ' + error.message
                            );
                        }
                    }
    
                    if (updatable)
                        throw new Error ('ClassModel.updateControlCheck() returned when it should have thrown an error.');
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
    
                describe('UpdateControlledSuperClass.updateControlCheck()', () => {
    
                    it('Update Control Check called on Class with only direct instances of Class.', async () => {
                        const instanceSet = new InstanceSet(UpdateControlledSuperClass, [
                            instanceOfUpdateControlledSuperClassPasses,
                            instanceOfUpdateControlledSuperClassFailsRelationship
                        ]);
                        const instancesExpectedToFail = new InstanceSet(UpdateControlledSuperClass, [instanceOfUpdateControlledSuperClassFailsRelationship]);
                        const expectedErrorMessage = 'Illegal attempt to update instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.updateControlCheck', expectedErrorMessage, async () => {
                            return  UpdateControlledSuperClass.updateControlCheck(instanceSet);
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
    
                        await testForErrorAsync('ClassModel.updateControlCheck', expectedErrorMessage, async () => {
                            return  UpdateControlledSuperClass.updateControlCheck(instanceSet);
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
    
                        await testForErrorAsync('ClassModel.updateControlCheck', expectedErrorMessage, async () => {
                            return  UpdateControlledSuperClass.updateControlCheck(instanceSet);
                        });
                    });
    
                });
    
                describe('UpdateControlledSubClassOfUpdateControlledSuperClass.updateControlCheck()', () => {
    
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
    
                        await testForErrorAsync('ClassModel.updateControlCheck', expectedErrorMessage, async () => {
                            return  UpdateControlledSubClassOfUpdateControlledSuperClass.updateControlCheck(instanceSet);
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
    
                        await testForErrorAsync('ClassModel.updateControlCheck', expectedErrorMessage, async () => {
                            return  UpdateControlledSubClassOfUpdateControlledSuperClass.updateControlCheck(instanceSet);
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
    
                        await testForErrorAsync('ClassModel.updateControlCheck', expectedErrorMessage, async () => {
                            return  UpdateControlledSubClassOfUpdateControlledSuperClass.updateControlCheck(instanceSet);
                        });
                    });
    
                });
    
                describe('UpdateControlledDiscriminatedSuperClass.updateControlCheck()', () => {
    
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
    
                        await testForErrorAsync('ClassModel.updateControlCheck', expectedErrorMessage, async () => {
                            return  UpdateControlledDiscriminatedSuperClass.updateControlCheck(instanceSet);
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
    
                        await testForErrorAsync('ClassModel.updateControlCheck', expectedErrorMessage, async () => {
                            return  UpdateControlledDiscriminatedSuperClass.updateControlCheck(instanceSet);
                        });
                    });
    
                });
    
                describe('UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass.updateControlCheck()', () => {
    
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
    
                        await testForErrorAsync('ClassModel.updateControlCheck', expectedErrorMessage, async () => {
                            return  UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass.updateControlCheck(instanceSet);
                        });
                    });
    
                });
    
                describe('UpdateControlledClassUpdateControlledByParameters.updateControlCheck()', () => {
    
                    it('Update Control Check passes', async () => {
                        const instanceSet = new InstanceSet(UpdateControlledClassUpdateControlledByParameters, [instanceOfUpdateControlledClassUpdateControlledByParameters]);
                        await UpdateControlledClassUpdateControlledByParameters.updateControlCheck(instanceSet, 1, 1, true);
                    });
    
                    it('Instance fails update control check because of Numbers.', async () => {
                        const instanceSet = new InstanceSet(UpdateControlledClassUpdateControlledByParameters, [
                            instanceOfUpdateControlledClassUpdateControlledByParameters,
                        ]);
                        const instancesExpectedToFail = new InstanceSet(UpdateControlledClassUpdateControlledByParameters, [instanceOfUpdateControlledClassUpdateControlledByParameters]);
                        const expectedErrorMessage = 'Illegal attempt to update instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.updateControlCheck', expectedErrorMessage, async () => {
                            return UpdateControlledClassUpdateControlledByParameters.updateControlCheck(instanceSet, -2, 1, true);
                        });
                    });
    
                    it('Instance fails update control check because of Boolean.', async () => {
                        const instanceSet = new InstanceSet(UpdateControlledClassUpdateControlledByParameters, [
                            instanceOfUpdateControlledClassUpdateControlledByParameters,
                        ]);
                        const instancesExpectedToFail = new InstanceSet(UpdateControlledClassUpdateControlledByParameters, [instanceOfUpdateControlledClassUpdateControlledByParameters]);
                        const expectedErrorMessage = 'Illegal attempt to update instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.updateControlCheck', expectedErrorMessage, async () => {
                            return  UpdateControlledClassUpdateControlledByParameters.updateControlCheck(instanceSet, 1, 1, false);
                        });
                    });
    
                });
    
            });
    
        });
    
        describe('ClassModel.deleteControlCheck()', () => {
    
            // Set up deleteControlled Instances
            // For each class, create on instance which will pass all delete control filters, and one each that will fail due to one of the delete control methods
            {
                // ClassControlsDeleteControlledSuperClass Instances
                var instanceOfClassControlsDeleteControlledSuperClassAllowed = new Instance(ClassControlsDeleteControlledSuperClass);
                instanceOfClassControlsDeleteControlledSuperClassAllowed.allowed = true;
                
                var instanceOfClassControlsDeleteControlledSuperClassNotAllowed = new Instance(ClassControlsDeleteControlledSuperClass);
                instanceOfClassControlsDeleteControlledSuperClassNotAllowed.allowed = false;
    
                // DeleteControlledSuperClass Instances
                var instanceOfDeleteControlledSuperClassPasses = new Instance(DeleteControlledSuperClass);
                instanceOfDeleteControlledSuperClassPasses.name = 'instanceOfDeleteControlledSuperClassPasses';
                instanceOfDeleteControlledSuperClassPasses.deleteControlledBy = instanceOfClassControlsDeleteControlledSuperClassAllowed;
    
                var instanceOfDeleteControlledSuperClassFailsRelationship = new Instance(DeleteControlledSuperClass);
                instanceOfDeleteControlledSuperClassFailsRelationship.name = 'instanceOfDeleteControlledSuperClassFailsRelationship';
                instanceOfDeleteControlledSuperClassFailsRelationship.deleteControlledBy = instanceOfClassControlsDeleteControlledSuperClassNotAllowed;
    
                var instancesOfDeleteControlledSuperClass = new InstanceSet(DeleteControlledSuperClass, [
                    instanceOfDeleteControlledSuperClassPasses,
                    instanceOfDeleteControlledSuperClassFailsRelationship
                ]);
    
                // DeleteControlledSubClassOfDeleteControlledSuperClass Instances
                var instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassPasses = new Instance(DeleteControlledSubClassOfDeleteControlledSuperClass);
                instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassPasses.name = 'instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassPasses';
                instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassPasses.deleteControlledBy = instanceOfClassControlsDeleteControlledSuperClassAllowed;
                instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassPasses.boolean = true;
    
                var instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsRelationship = new Instance(DeleteControlledSubClassOfDeleteControlledSuperClass);
                instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsRelationship.name = 'instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsRelationship';
                instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsRelationship.deleteControlledBy = instanceOfClassControlsDeleteControlledSuperClassNotAllowed;
                instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsRelationship.boolean = true;
    
                var instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsBoolean = new Instance(DeleteControlledSubClassOfDeleteControlledSuperClass);
                instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsBoolean.name = 'instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsBoolean'
                instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsBoolean.deleteControlledBy = instanceOfClassControlsDeleteControlledSuperClassAllowed;
                instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsBoolean.boolean = false;
                
                var instancesOfDeleteControlledSubClassOfDeleteControlledSuperClass = new InstanceSet(DeleteControlledSubClassOfDeleteControlledSuperClass, [
                    instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassPasses,
                    instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsRelationship,
                    instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsBoolean
                ]);
    
                // DeleteControlledDiscriminatedSuperClass Instances
                var instanceOfDeleteControlledDiscriminatedSuperClassPasses = new Instance(DeleteControlledDiscriminatedSuperClass);
                instanceOfDeleteControlledDiscriminatedSuperClassPasses.name = 'instanceOfDeleteControlledDiscriminatedSuperClassPasses';
                instanceOfDeleteControlledDiscriminatedSuperClassPasses.deleteControlledBy = instanceOfClassControlsDeleteControlledSuperClassAllowed;
                instanceOfDeleteControlledDiscriminatedSuperClassPasses.boolean = true;
                instanceOfDeleteControlledDiscriminatedSuperClassPasses.string = 'deleteControlled';
    
                var instanceOfDeleteControlledDiscriminatedSuperClassFailsRelationship = new Instance(DeleteControlledDiscriminatedSuperClass);
                instanceOfDeleteControlledDiscriminatedSuperClassFailsRelationship.name = 'instanceOfDeleteControlledDiscriminatedSuperClassFailsRelationship';
                instanceOfDeleteControlledDiscriminatedSuperClassFailsRelationship.deleteControlledBy = instanceOfClassControlsDeleteControlledSuperClassNotAllowed;
                instanceOfDeleteControlledDiscriminatedSuperClassFailsRelationship.boolean = true;
                instanceOfDeleteControlledDiscriminatedSuperClassFailsRelationship.string = 'deleteControlled';
    
                var instanceOfDeleteControlledDiscriminatedSuperClassFailsString = new Instance(DeleteControlledDiscriminatedSuperClass);
                instanceOfDeleteControlledDiscriminatedSuperClassFailsString.name = 'instanceOfDeleteControlledDiscriminatedSuperClassFailsString';
                instanceOfDeleteControlledDiscriminatedSuperClassFailsString.deleteControlledBy = instanceOfClassControlsDeleteControlledSuperClassAllowed;
                instanceOfDeleteControlledDiscriminatedSuperClassFailsString.boolean = true;
                instanceOfDeleteControlledDiscriminatedSuperClassFailsString.string = 'not deleteControlled';
    
                var instanceOfDeleteControlledDiscriminatedSuperClassFailsBoolean = new Instance(DeleteControlledDiscriminatedSuperClass);
                instanceOfDeleteControlledDiscriminatedSuperClassFailsBoolean.name = 'instanceOfDeleteControlledDiscriminatedSuperClassFailsBoolean';
                instanceOfDeleteControlledDiscriminatedSuperClassFailsBoolean.deleteControlledBy = instanceOfClassControlsDeleteControlledSuperClassAllowed;
                instanceOfDeleteControlledDiscriminatedSuperClassFailsBoolean.boolean = false;
                instanceOfDeleteControlledDiscriminatedSuperClassFailsBoolean.string = 'deleteControlled';
                
                var instancesOfDeleteControlledDiscriminatedSuperClass = new InstanceSet(DeleteControlledDiscriminatedSuperClass, [
                    instanceOfDeleteControlledDiscriminatedSuperClassPasses,
                    instanceOfDeleteControlledDiscriminatedSuperClassFailsRelationship,
                    instanceOfDeleteControlledDiscriminatedSuperClassFailsString,
                    instanceOfDeleteControlledDiscriminatedSuperClassFailsBoolean
                ]);
    
                // DeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClass Instances
                var instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassPasses = new Instance(DeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClass);
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassPasses.name = 'instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassPasses';
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassPasses.deleteControlledBy = instanceOfClassControlsDeleteControlledSuperClassAllowed;  
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassPasses.boolean = true;
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassPasses.string = 'deleteControlled';         
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassPasses.number = 1;
    
                var instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsRelationship = new Instance(DeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClass);
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsRelationship.name = 'instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsRelationship';
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsRelationship.deleteControlledBy = instanceOfClassControlsDeleteControlledSuperClassNotAllowed;             
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsRelationship.number = 1;
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsRelationship.boolean = true;
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsRelationship.string = 'deleteControlled';
    
                var instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsBoolean = new Instance(DeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClass);
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsBoolean.name = 'instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsBoolean';
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsBoolean.deleteControlledBy = instanceOfClassControlsDeleteControlledSuperClassAllowed;     
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsBoolean.boolean = false;
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsBoolean.string = 'deleteControlled';
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsBoolean.number = 1;
    
                var instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsString = new Instance(DeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClass);
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsString.name = 'instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsString';
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsString.deleteControlledBy = instanceOfClassControlsDeleteControlledSuperClassAllowed;     
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsString.boolean = true;
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsString.string = 'not deleteControlled';            
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsString.number = 1;
    
                var instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsNumber = new Instance(DeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClass);
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsNumber.name = 'instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsNumber';
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsNumber.deleteControlledBy = instanceOfClassControlsDeleteControlledSuperClassAllowed;
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsNumber.boolean = true;
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsNumber.string = 'deleteControlled';      
                instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsNumber.number = -1;
                
                var instancesOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClass = new InstanceSet(DeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClass, [
                    instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassPasses,
                    instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsRelationship,
                    instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsBoolean,
                    instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsString,
                    instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsNumber
                ]);
    
                var deleteControlledInstances = new InstanceSet(DeleteControlledSuperClass);
                deleteControlledInstances.addInstances(instancesOfDeleteControlledSuperClass);
                deleteControlledInstances.addInstances(instancesOfDeleteControlledSubClassOfDeleteControlledSuperClass);
                deleteControlledInstances.addInstances(instancesOfDeleteControlledDiscriminatedSuperClass);
                deleteControlledInstances.addInstances(instancesOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClass);
    
                // DeleteControlledClassDeleteControlledByParameters Instances
                var instanceOfDeleteControlledClassDeleteControlledByParameters = new Instance(DeleteControlledClassDeleteControlledByParameters);
    
            }
    
            // Save all SecurityFilter Test Instances
            before(async () => {
                await instanceOfClassControlsDeleteControlledSuperClassAllowed.save();
                await instanceOfClassControlsDeleteControlledSuperClassNotAllowed.save();
    
            });
    
            after(async () => {
                await ClassControlsDeleteControlledSuperClass.clear();
                await DeleteControlledSuperClass.clear();
                await DeleteControlledSubClassOfDeleteControlledSuperClass.clear();
                await DeleteControlledDiscriminatedSuperClass.clear();
                await DeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClass.clear();
                await DeleteControlledClassDeleteControlledByParameters.clear();
            });
    
            describe('Tests for invalid arguments.', () => {
    
                it('First Argument must be an InstanceSet', async () => {
                    let updatable;
                    const expectedErrorMessage = 'Incorrect parameters. ' + DeleteControlledSuperClass.className + '.deleteControlCheck(InstanceSet instanceSet, ...deleteControlMethodParameters)';
                    const instanceSet = new InstanceSet(DeleteControlledSuperClass, [instanceOfDeleteControlledSuperClassPasses, instanceOfDeleteControlledSuperClassPasses]);
    
                    try {
                        updatable = await DeleteControlledSuperClass.deleteControlCheck(instanceOfDeleteControlledSuperClassPasses);
                    }
                    catch (error) {
                        if (error.message != expectedErrorMessage) {
                            throw  new Error(
                                'deleteControlCheck() threw an unexpected error.\n' + 
                                'Expected: ' + expectedErrorMessage + '\n' + 
                                'Actual:   ' + error.message
                            );
                        }
                    }
    
                    if (updatable)
                        throw new Error ('ClassModel.deleteControlCheck() returned when it should have thrown an error.');
                });
    
            });
    
            describe('Delete Control Methods Are Inherited', () => {
                
                it('A class with no supers has only it\'s own delete control method.', () => {
                    if (DeleteControlledSuperClass.deleteControlMethods.length === 0)
                        throw new Error('Class is missing it\'s own delete control method.');
    
                    if (DeleteControlledSuperClass.deleteControlMethods.length > 1)
                        throw new Error('Class has more than one delete control method.');
                });
    
                it('A sub class has both it\'s own delete control method, and the super class\' delete control method.', () => {
                    if (DeleteControlledSubClassOfDeleteControlledSuperClass.deleteControlMethods.length < 2)
                        throw new Error('Class is missing a delete control method.');
                    
                    if (DeleteControlledSubClassOfDeleteControlledSuperClass.deleteControlMethods.length != 2)
                        throw new Error('Class is has the wrong number of delete control methods.');
                });
    
                it('A discriminated sub class has all the delete control methods it should.', () => {
                    if (DeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClass.deleteControlMethods.length != 4)
                        throw new Error('Class is has the wrong number of delete control methods.');
                });
            
            });
    
            describe('Test Delete Control Check throws error when an instance doesn\'t pass check.', () => {
    
                describe('DeleteControlledSuperClass.deleteControlCheck()', () => {
    
                    it('Delete Control Check called on Class with only direct instances of Class.', async () => {
                        const instanceSet = new InstanceSet(DeleteControlledSuperClass, [
                            instanceOfDeleteControlledSuperClassPasses,
                            instanceOfDeleteControlledSuperClassFailsRelationship
                        ]);
                        const instancesExpectedToFail = new InstanceSet(DeleteControlledSuperClass, [instanceOfDeleteControlledSuperClassFailsRelationship]);
                        const expectedErrorMessage = 'Illegal attempt to delete instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.deleteControlCheck', expectedErrorMessage, async () => {
                            return  DeleteControlledSuperClass.deleteControlCheck(instanceSet);
                        });
                    });
    
                    it('Delete Control Check called on Class with instances of class and sub class.', async () => {
                        const instanceSet = new InstanceSet(DeleteControlledSuperClass, [
                            instanceOfDeleteControlledSuperClassPasses,
                            instanceOfDeleteControlledSuperClassFailsRelationship,
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassPasses,
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsBoolean,
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsRelationship
                        ]);
                        const instancesExpectedToFail = new InstanceSet(DeleteControlledSuperClass, [
                            instanceOfDeleteControlledSuperClassFailsRelationship,
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsBoolean,
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsRelationship
                        ]);
                        const expectedErrorMessage = 'Illegal attempt to delete instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.deleteControlCheck', expectedErrorMessage, async () => {
                            return  DeleteControlledSuperClass.deleteControlCheck(instanceSet);
                        });
                    });
    
                    it('Delete Control Check called on Class with instances of class and 3 layers of sub classes.', async () => {
                        const instanceSet = new InstanceSet(DeleteControlledSuperClass, [
                            instanceOfDeleteControlledSuperClassPasses,
                            instanceOfDeleteControlledSuperClassFailsRelationship,
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassPasses,
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsBoolean,
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsRelationship,
                            instanceOfDeleteControlledDiscriminatedSuperClassPasses,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsString,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassPasses,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsString,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsNumber
                        ]);
                        const instancesExpectedToFail = new InstanceSet(DeleteControlledSuperClass, [
                            instanceOfDeleteControlledSuperClassFailsRelationship,
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsBoolean,
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsRelationship,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsString,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsString,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsNumber
                        ]);
                        const expectedErrorMessage = 'Illegal attempt to delete instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.deleteControlCheck', expectedErrorMessage, async () => {
                            return  DeleteControlledSuperClass.deleteControlCheck(instanceSet);
                        });
                    });
    
                });
    
                describe('DeleteControlledSubClassOfDeleteControlledSuperClass.deleteControlCheck()', () => {
    
                    it('Delete Control Check called on Class with only direct instances of Class.', async () => {
                        const instanceSet = new InstanceSet(DeleteControlledSuperClass, [
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassPasses,
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsBoolean,
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsRelationship
                        ]);
                        const instancesExpectedToFail = new InstanceSet(DeleteControlledSuperClass, [
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsBoolean,
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsRelationship,
                        ]);
                        const expectedErrorMessage = 'Illegal attempt to delete instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.deleteControlCheck', expectedErrorMessage, async () => {
                            return  DeleteControlledSubClassOfDeleteControlledSuperClass.deleteControlCheck(instanceSet);
                        });
                    });
    
                    it('Delete Control Check called on Class with instances of class and 1 layers of sub classes.', async () => {
                        const instanceSet = new InstanceSet(DeleteControlledSuperClass, [
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassPasses,
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsBoolean,
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsRelationship,
                            instanceOfDeleteControlledDiscriminatedSuperClassPasses,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsString,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsRelationship
                        ]);
                        const instancesExpectedToFail = new InstanceSet(DeleteControlledSuperClass, [
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsBoolean,
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsRelationship,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsString,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsRelationship
                        ]);
                        const expectedErrorMessage = 'Illegal attempt to delete instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.deleteControlCheck', expectedErrorMessage, async () => {
                            return  DeleteControlledSubClassOfDeleteControlledSuperClass.deleteControlCheck(instanceSet);
                        });
                    });
    
                    it('Delete Control Check called on Class with instances of 2 layers of sub classes.', async () => {
                        const instanceSet = new InstanceSet(DeleteControlledSuperClass, [
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassPasses,
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsBoolean,
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsRelationship,
                            instanceOfDeleteControlledDiscriminatedSuperClassPasses,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsString,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassPasses,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsString,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsNumber
                        ]);
                        const instancesExpectedToFail = new InstanceSet(DeleteControlledSuperClass, [
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsBoolean,
                            instanceOfDeleteControlledSubClassOfDeleteControlledSuperClassFailsRelationship,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsString,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsString,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsNumber
                        ]);
                        const expectedErrorMessage = 'Illegal attempt to delete instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.deleteControlCheck', expectedErrorMessage, async () => {
                            return  DeleteControlledSubClassOfDeleteControlledSuperClass.deleteControlCheck(instanceSet);
                        });
                    });
    
                });
    
                describe('DeleteControlledDiscriminatedSuperClass.deleteControlCheck()', () => {
    
                    it('Delete Control Check called on Class with only direct instances of Class.', async () => {
                        const instanceSet = new InstanceSet(DeleteControlledSuperClass, [
                            instanceOfDeleteControlledDiscriminatedSuperClassPasses,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsString,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsRelationship
                        ]);
                        const instancesExpectedToFail = new InstanceSet(DeleteControlledSuperClass, [
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsString,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsRelationship
                        ]);
                        const expectedErrorMessage = 'Illegal attempt to delete instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.deleteControlCheck', expectedErrorMessage, async () => {
                            return  DeleteControlledDiscriminatedSuperClass.deleteControlCheck(instanceSet);
                        });
                    });
    
                    it('Delete Control Check called on Class with instances of 1 layers of sub classes', async () => {
                        const instanceSet = new InstanceSet(DeleteControlledSuperClass, [
                            instanceOfDeleteControlledDiscriminatedSuperClassPasses,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsString,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassPasses,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsString,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsNumber
                        ]);
                        const instancesExpectedToFail = new InstanceSet(DeleteControlledSuperClass, [
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsString,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfDeleteControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsString,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsNumber
                        ]);
                        const expectedErrorMessage = 'Illegal attempt to delete instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.deleteControlCheck', expectedErrorMessage, async () => {
                            return  DeleteControlledDiscriminatedSuperClass.deleteControlCheck(instanceSet);
                        });
                    });
    
                });
    
                describe('DeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClass.deleteControlCheck()', () => {
    
                    it('Delete Control Check called on Class with only direct instances of Class.', async () => {
                        const instanceSet = new InstanceSet(DeleteControlledSuperClass, [
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassPasses,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsString,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsNumber
                        ]);
                        const instancesExpectedToFail = new InstanceSet(DeleteControlledSuperClass, [
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsString,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsBoolean,
                            instanceOfDeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClassFailsNumber
                        ]);
                        const expectedErrorMessage = 'Illegal attempt to delete instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.deleteControlCheck', expectedErrorMessage, async () => {
                            return  DeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClass.deleteControlCheck(instanceSet);
                        });
                    });
    
                });
    
                describe('DeleteControlledClassDeleteControlledByParameters.deleteControlCheck()', () => {
    
                    it('Delete Control Check passes', async () => {
                        const instanceSet = new InstanceSet(DeleteControlledClassDeleteControlledByParameters, [instanceOfDeleteControlledClassDeleteControlledByParameters]);
                        await DeleteControlledClassDeleteControlledByParameters.deleteControlCheck(instanceSet, 1, 1, true);
                    });
    
                    it('Instance fails delete control check because of Numbers.', async () => {
                        const instanceSet = new InstanceSet(DeleteControlledClassDeleteControlledByParameters, [
                            instanceOfDeleteControlledClassDeleteControlledByParameters,
                        ]);
                        const instancesExpectedToFail = new InstanceSet(DeleteControlledClassDeleteControlledByParameters, [instanceOfDeleteControlledClassDeleteControlledByParameters]);
                        const expectedErrorMessage = 'Illegal attempt to delete instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.deleteControlCheck', expectedErrorMessage, async () => {
                            return DeleteControlledClassDeleteControlledByParameters.deleteControlCheck(instanceSet, -2, 1, true);
                        });
                    });
    
                    it('Instance fails delete control check because of Boolean.', async () => {
                        const instanceSet = new InstanceSet(DeleteControlledClassDeleteControlledByParameters, [
                            instanceOfDeleteControlledClassDeleteControlledByParameters,
                        ]);
                        const instancesExpectedToFail = new InstanceSet(DeleteControlledClassDeleteControlledByParameters, [instanceOfDeleteControlledClassDeleteControlledByParameters]);
                        const expectedErrorMessage = 'Illegal attempt to delete instances: ' + instancesExpectedToFail.getInstanceIds();
    
                        await testForErrorAsync('ClassModel.deleteControlCheck', expectedErrorMessage, async () => {
                            return  DeleteControlledClassDeleteControlledByParameters.deleteControlCheck(instanceSet, 1, 1, false);
                        });
                    });
    
                });
    
            });
    
        });

    });

    describe('Validations', () => {

        describe('Validations are Inheritted', () => {

            it('Class has it\'s own validations set', () => {
                if (ValidationSuperClass.validations.length !== 2)
                    throw new Error('Class does not have the correct number of validations.');
            });

            it('Class has it\'s own validations set and inherits from direct parent class.', () => {
                if (SubClassOfValidationSuperClass.validations.length !== 3)
                    throw new Error('Class does not have the correct number of validations.');
            });

            it('Discriminated sub class inherits validations.', () => {
                if (SubClassOfValidationDiscriminatedSuperClass.validations.length !== 4)
                    throw new Error('Class does not have the correct number of validations.');
            });

        });

    });

    describe('ClassModel.cardinalityOfRelationship()', () => {

        it('null to one.', () => {
            const cardinality = SingularRelationshipClass.cardinalityOfRelationship('singularRelationship');

            if (cardinality.from !== null || cardinality.to !== '1')
                throw new Error('incorrect cardinallity: ' + JSON.stringify(cardinality));
        });

        it('null to many.', () => {
            const cardinality = NonSingularRelationshipClass.cardinalityOfRelationship('nonSingularRelationship');

            if (cardinality.from !== null || cardinality.to !== 'many')
                throw new Error('incorrect cardinallity: ' + JSON.stringify(cardinality));
        });

        it('one to one.', () => {
            const cardinality = TwoWayRelationshipClass1.cardinalityOfRelationship('oneToOne');

            if (cardinality.from !== '1' || cardinality.to !== '1')
                throw new Error('incorrect cardinallity: ' + JSON.stringify(cardinality));
        });

        it('one to many.', () => {
            const cardinality = TwoWayRelationshipClass1.cardinalityOfRelationship('oneToMany');

            if (cardinality.from !== '1' || cardinality.to !== 'many')
                throw new Error('incorrect cardinallity: ' + JSON.stringify(cardinality));            
        });

        it('many to one.', () => {
            const cardinality = TwoWayRelationshipClass1.cardinalityOfRelationship('manyToOne');

            if (cardinality.from !== 'many' || cardinality.to !== '1')
                throw new Error('incorrect cardinallity: ' + JSON.stringify(cardinality));       
        });

        it('many to many.', () => {
            const cardinality = TwoWayRelationshipClass1.cardinalityOfRelationship('manyToMany');

            if (cardinality.from !== 'many' || cardinality.to !== 'many')
                throw new Error('incorrect cardinallity: ' + JSON.stringify(cardinality));       
        });

    });

});

