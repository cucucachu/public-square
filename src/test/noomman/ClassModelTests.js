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

    // AccessControlled Classes
    var AccessControlledSuperClass = TestClassModels.AccessControlledSuperClass;
    var AccessControlledSubClassOfAccessControlledSuperClass = TestClassModels.AccessControlledSubClassOfAccessControlledSuperClass;
    var AccessControlledDiscriminatedSuperClass = TestClassModels.AccessControlledDiscriminatedSuperClass;
    var AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass = TestClassModels.AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass;
    var ClassControlsAccessControlledSuperClass = TestClassModels.ClassControlsAccessControlledSuperClass;
    var AccessControlledClassAccessControlledByParameters = TestClassModels.AccessControlledClassAccessControlledByParameters;
    var SingularRelationshipToAccessControlledClassAccessControlledByParameters = TestClassModels.SingularRelationshipToAccessControlledClassAccessControlledByParameters;
    var NonSingularRelationshipToAccessControlledClassAccessControlledByParameters = TestClassModels.NonSingularRelationshipToAccessControlledClassAccessControlledByParameters;

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
                var schema = {
                    text: {
                        type: String,
                        required: true
                    },
                    singularRelationship: {
                        type: Schema.Types.ObjectId,
                        ref: 'OtherClass',
                        required: true
                    },
                    nonSingularRelationship: {
                        type: [Schema.Types.ObjectId],
                        ref: 'OtherClass'
                    }
                }
    
                try {
                    new ClassModel({
                        accessControlled: false,
                        updateControlled: false,
                        schema: schema
                    });
                }
                catch(error) {
                    if (error.message == 'className is required.')
                        return true;
                    else 
                        throw new Error(error.message);
                }
    
                throw new Error('Constructor should have thrown an error: className is required.');
            });
    
            it('Schema is required.', () => {
                try {
                    new ClassModel({
                        accessControlled: false,
                        updateControlled: false,
                        className: 'Class'
                    });
                }
                catch(error) {
                    if (error.message == 'schema is required.')
                        return true;
                    else 
                        throw new Error(error.message);
                }
    
                throw new Error('Constructor should have thrown an error: schema is required.');
            });
    
            it('AccessControlled is required', () => {
                try {
                    new ClassModel({
                        className: 'Class',
                        updateControlled: false,
                        schema: {}
                    });
                }
                catch (error) {
                        if (error.message == 'accessControlled is required.')
                            return true;
                        else 
                            throw new Error(error.message);
                    }
                throw new Error('Constructor should have thrown an error: accessControlled is required.');
            });
    
            it('UpdateControlled is required', () => {
                try {
                    new ClassModel({
                        className: 'Class',
                        accessControlled: false,
                        schema: {}
                    });
                }
                catch (error) {
                        if (error.message == 'updateControlled is required.')
                            return true;
                        else 
                            throw new Error(error.message);
                    }
                throw new Error('Constructor should have thrown an error: updateControlled is required.');
            });

        });

        describe('Inheritence Requirements', () => {

            it('If superClasses is set, it must be an Array.', () => {
                try {
                    new ClassModel({
                        accessControlled: false,
                        updateControlled: false,
                        className: 'SubClassModel',
                        schema: {
                            boolean: Boolean
                        },
                        superClasses: SuperClass
                    });
                }
                catch(error) {
                    if (error.message == 'If superClasses is set, it must be an Array.')
                        return true;
                    else 
                        throw new Error(error.message);
                }
    
                throw new Error('Constructor should have thrown an error: If superClasses is set, it must be an Array.');
            });
    
            it('If superClasses is set, it cannot be an empty Array.', () => {
                try {
                    new ClassModel({
                        accessControlled: false,
                        updateControlled: false,
                        className: 'SubClassModel',
                        schema: {
                            boolean: Boolean
                        },
                        superClasses: []
                    });
                }
                catch(error) {
                    if (error.message == 'If superClasses is set, it cannot be an empty Array.')
                        return true;
                    else 
                        throw new Error(error.message);
                }
    
                throw new Error('Constructor should have thrown an error: If superClasses is set, it cannot be an empty Array.');
            });
    
            it('If discriminatorSuperClass is set, it can only be a single class.', () => {
                try {
                    new ClassModel({
                        accessControlled: false,
                        updateControlled: false,
                        className: 'SubClassModel',
                        schema: {
                            boolean: Boolean
                        },
                        discriminatorSuperClass: [SuperClass, DiscriminatedSuperClass]
                    });
                }
                catch(error) {
                    if (error.message == 'If discriminatorSuperClass is set, it can only be a single class.')
                        return true;
                    else 
                        throw new Error(error.message);
                }
    
                throw new Error('Constructor should have thrown an error: If discriminatorSuperClass is set, it can only be a single class.');
            });
    
            it('A ClassModel cannot have both superClasses and discriminatorSuperClass.', () => {
                try {
                    new ClassModel({
                        accessControlled: false,
                        updateControlled: false,
                        className: 'SubClassModel',
                        schema: {
                            boolean: Boolean
                        },
                        superClasses: [SuperClass],
                        discriminatorSuperClass: DiscriminatedSuperClass
                    });
                }
                catch(error) {
                    if (error.message == 'A ClassModel cannot have both superClasses and discriminatorSuperClass.')
                        return true;
                    else 
                        throw new Error(error.message);
                }
    
                throw new Error('Constructor should have thrown an error: A ClassModel cannot have both superClasses and discriminatorSuperClass.');
            });
    
            it('A ClassModel cannot have both superClasses and discriminatorSuperClass.', () => {
                try {
                    new ClassModel({
                        accessControlled: false,
                        updateControlled: false,
                        className: 'SubClassModel',
                        schema: {
                            boolean: Boolean
                        },
                        superClasses: [SuperClass],
                        discriminatorSuperClass: DiscriminatedSuperClass
                    });
                }
                catch(error) {
                    if (error.message == 'A ClassModel cannot have both superClasses and discriminatorSuperClass.')
                        return true;
                    else 
                        throw new Error(error.message);
                }
    
                throw new Error('Constructor should have thrown an error: A ClassModel cannot have both superClasses and discriminatorSuperClass.');
            });
    
            it('If a class is used as a discriminatedSuperClass, that class must have its "discriminated" field set to true.', () => {
                try {
                    new ClassModel({
                        accessControlled: false,
                        updateControlled: false,
                        className: 'SubClassModel',
                        schema: {},
                        discriminatorSuperClass: SuperClass
                    });
                }
                catch(error) {
                    if (error.message == 'If a class is used as a discriminatedSuperClass, that class must have its "discriminated" field set to true.')
                        return true;
                    else 
                        throw new Error(error.message);
                }
    
                throw new Error('Constructor should have thrown an error: If a class is used as a discriminatedSuperClass, that class must have its "discriminated" field set to true.');
            });
    
            it('If a class is set as a superClass, that class cannot have its "discriminated" field set to true.', () => {
                try {
                    new ClassModel({
                        accessControlled: false,
                        updateControlled: false,
                        className: 'SubClassModel',
                        schema: {},
                        superClasses: [DiscriminatedSuperClass]
                    });
                }
                catch(error) {
                    if (error.message == 'If a class is set as a superClass, that class cannot have its "discriminated" field set to true.')
                        return true;
                    else 
                        throw new Error(error.message);
                }
    
                throw new Error('Constructor should have thrown an error: If a class is set as a superClass, that class cannot have its "discriminated" field set to true.');
            });  
    
            it('A discriminator sub class cannot be abstract.', () => {
                try {
                    new ClassModel({
                        accessControlled: false,
                        updateControlled: false,
                        className: 'SubClassModel',
                        schema: {},
                        discriminatorSuperClass: DiscriminatedSuperClass,
                        abstract: true
                    });
                }
                catch(error) {
                    if (error.message == 'A discriminator sub class cannot be abstract.')
                        return true;
                    else 
                        throw new Error(error.message);
                }
    
                throw new Error('Constructor should have thrown an error: A discriminator sub class cannot be abstract.');
            });  
    
            it('A sub class of a discriminated super class cannot be discriminated.', () => {
                try {
                    new ClassModel({
                        accessControlled: false,
                        updateControlled: false,
                        className: 'SubClassModel',
                        schema: {},
                        discriminatorSuperClass: DiscriminatedSuperClass,
                        discriminated: true
                    });
                }
                catch(error) {
                    if (error.message == 'A sub class of a discriminated super class cannot be discriminated.')
                        return true;
                    else 
                        throw new Error(error.message);
                }
    
                throw new Error('A sub class of a discriminated super class cannot be discriminated.');
            });  
    
            it('Sub class schema cannot contain the same field names as a super class schema.', () => {
                try {
                    new ClassModel({
                        accessControlled: false,
                        updateControlled: false,
                        className: 'SubClassModel',
                        schema: {
                            boolean: {
                                type: Boolean
                            }
                        },
                        superClasses: [SuperClass]
                    });
                }
                catch(error) {
                    if (error.message == 'Sub class schema cannot contain the same field names as a super class schema.')
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
    
            it('A subclass schema is the combination of its direct schema with the schema of a super class.', () => {
                if(Object.keys(SubClassOfSuperClass.schema).includes('boolean') == false) {
                    throw new Error('Sub Class is missing the field "boolean".');
                }
    
                if(Object.keys(SubClassOfSuperClass.schema).includes('number') == false) {
                    throw new Error('Sub Class is missing the field "number".');
                }
    
                if(Object.keys(SubClassOfSuperClass.schema).includes('subBoolean') == false) {
                    throw new Error('Sub Class is missing the field "subBoolean".');
                }
    
                if(Object.keys(SubClassOfSuperClass.schema).includes('subNumber') == false) {
                    throw new Error('Sub Class is missing the field "subNumber".');
                }
    
                if (SuperClass.schema.boolean.type != SubClassOfSuperClass.schema.boolean.type) {
                    throw new Error('The field boolean.type was not copied correctly.')
                }
    
                return true;
            });
    
            it('A subclass schema is the combination of its direct schema with the schema the whole chane of Super Classes.', () => {
                if(Object.keys(SubClassOfSubClassOfSuperClass.schema).includes('boolean') == false) {
                    throw new Error('Sub Class is missing the field "boolean".');
                }
    
                if(Object.keys(SubClassOfSubClassOfSuperClass.schema).includes('number') == false) {
                    throw new Error('Sub Class is missing the field "number".');
                }
    
                if(Object.keys(SubClassOfSubClassOfSuperClass.schema).includes('subBoolean') == false) {
                    throw new Error('Sub Class is missing the field "subBoolean".');
                }
    
                if(Object.keys(SubClassOfSubClassOfSuperClass.schema).includes('subNumber') == false) {
                    throw new Error('Sub Class is missing the field "subNumber".');
                }
    
                if(Object.keys(SubClassOfSubClassOfSuperClass.schema).includes('subSubBoolean') == false) {
                    throw new Error('Sub Class is missing the field "subSubBoolean".');
                }
    
                if(Object.keys(SubClassOfSubClassOfSuperClass.schema).includes('subSubNumber') == false) {
                    throw new Error('Sub Class is missing the field "subSubNumber".');
                }
    
                if (SuperClass.schema.boolean.type != SubClassOfSubClassOfSuperClass.schema.boolean.type) {
                    throw new Error('The field boolean.type was not copied correctly.')
                }
    
                return true;
            });
    
            it('A subclass schema is the combination of its direct schema with the schema of each of its super classes.', () => {
                if(Object.keys(SubClassOfMultipleSuperClasses.schema).includes('boolean') == false) {
                    throw new Error('Sub Class is missing the field "boolean".');
                }
    
                if(Object.keys(SubClassOfMultipleSuperClasses.schema).includes('number') == false) {
                    throw new Error('Sub Class is missing the field "number".');
                }
    
                if(Object.keys(SubClassOfMultipleSuperClasses.schema).includes('subBoolean') == false) {
                    throw new Error('Sub Class is missing the field "subBoolean".');
                }
    
                if(Object.keys(SubClassOfMultipleSuperClasses.schema).includes('subNumber') == false) {
                    throw new Error('Sub Class is missing the field "subNumber".');
                }
    
                if(Object.keys(SubClassOfMultipleSuperClasses.schema).includes('abstractBoolean') == false) {
                    throw new Error('Sub Class is missing the field "abstractBoolean".');
                }
    
                if(Object.keys(SubClassOfMultipleSuperClasses.schema).includes('abstractNumber') == false) {
                    throw new Error('Sub Class is missing the field "abstractNumber".');
                }
    
                if (SuperClass.schema.boolean.type != SubClassOfMultipleSuperClasses.schema.boolean.type) {
                    throw new Error('The field boolean.type was not copied correctly.')
                }
    
                return true;
            });
    
            it('A class cannot be a sub class of a sub class of a discriminated class.', () => {
                try {
                    new ClassModel({
                        accessControlled: false,
                        className: 'SubClassModel',
                        schema: {},
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

        describe('Access Control Requirements', () => {

            it('If a class is accessControlled, it must have a accessControlMethod, or it must have at least one super class with an accessControlMethod.', () => {
                try {
                    new ClassModel({
                        className: 'Class',
                        accessControlled: true,
                        updateControlled: false,
                        schema: {}
                    });
                }
                catch (error) {
                        if (error.message == 'If a class is accessControlled, it must have an accessControlMethod, or it must have at least one super class with an accessControlMethod.')
                            return true;
                        else 
                            throw new Error(error.message);
                    }
                throw new Error('Constructor should have thrown an error: If a class is accessControlled, it must have an accessControlMethod, or it must have at least one super class with an accessControlMethod.');
            });
    
            it('A class that is not accessControlled cannot have an accessControlMethod.', () => {
                try {
                    new ClassModel({
                        className: 'Class',
                        accessControlled: false,
                        updateControlled: false,
                        accessControlMethod: () => { return true },
                        schema: {}
                    });
                }
                catch (error) {
                        if (error.message == 'A class that is not accessControlled cannot have an accessControlMethod.')
                            return true;
                        else 
                            throw new Error(error.message);
                    }
                throw new Error('Constructor should have thrown an error: A class that is not accessControlled cannot have an accessControlMethod.');
            });
    
            it('A class which is not accessControlled cannot be a sub class of a class which is accessControlled.', () => {
                try {
                    new ClassModel({
                        className: 'Class',
                        accessControlled: false,
                        updateControlled: false,
                        superClasses: [AccessControlledSuperClass],
                        schema: {}
                    });
                }
                catch (error) {
                        if (error.message == 'A class which is not accessControlled cannot be a sub class of a class which is accessControlled.')
                            return true;
                        else 
                            throw new Error(error.message);
                    }
                throw new Error('Constructor should have thrown an error: A class which is not accessControlled cannot be a sub class of a class which is accessControlled.');
            });
    
            it('A subclass of an accessControlled discriminated super class must also be accessControlled.', () => {
                try {
                    new ClassModel({
                        className: 'Class',
                        accessControlled: false,
                        updateControlled: false,
                        discriminatorSuperClass: AccessControlledDiscriminatedSuperClass,
                        schema: {}
                    });
                }
                catch (error) {
                        if (error.message == 'A subclass of a accessControlled discriminated super class must also be accessControlled.')
                            return true;
                        else 
                            throw new Error(error.message);
                    }
                throw new Error('Constructor should have thrown an error: A subclass of a accessControlled discriminated super class must also be accessControlled.');
            });

        });

        describe('Update Control Requirements', () => {

            it('If a class is updateControlled, it must have a updateControlMethod, or it must have at least one super class with an updateControlMethod.', () => {
                try {
                    new ClassModel({
                        className: 'Class',
                        accessControlled: false,
                        updateControlled: true,
                        schema: {}
                    });
                }
                catch (error) {
                        if (error.message == 'If a class is updateControlled, it must have an updateControlMethod, or it must have at least one super class with an updateControlMethod.')
                            return true;
                        else 
                            throw new Error(error.message);
                    }
                throw new Error('Constructor should have thrown an error: If a class is updateControlled, it must have an updateControlMethod, or it must have at least one super class with an updateControlMethod.');
            });
    
            it('A class that is not updateControlled cannot have an updateControlMethod.', () => {
                try {
                    new ClassModel({
                        className: 'Class',
                        accessControlled: false,
                        updateControlled: false,
                        updateControlMethod: () => { return true },
                        schema: {}
                    });
                }
                catch (error) {
                        if (error.message == 'A class that is not updateControlled cannot have an updateControlMethod.')
                            return true;
                        else 
                            throw new Error(error.message);
                    }
                throw new Error('Constructor should have thrown an error: A class that is not updateControlled cannot have an updateControlMethod.');
            });
    
            it('A class which is not updateControlled cannot be a sub class of a class which is updateControlled.', () => {
                try {
                    new ClassModel({
                        className: 'Class',
                        accessControlled: false,
                        updateControlled: false,
                        superClasses: [UpdateControlledSuperClass],
                        schema: {}
                    });
                }
                catch (error) {
                        if (error.message == 'A class which is not updateControlled cannot be a sub class of a class which is updateControlled.')
                            return true;
                        else 
                            throw new Error(error.message);
                    }
                throw new Error('Constructor should have thrown an error: A class which is not updateControlled cannot be a sub class of a class which is updateControlled.');
            });
    
            it('A subclass of an updateControlled discriminated super class must also be updateControlled.', () => {
                try {
                    new ClassModel({
                        className: 'Class',
                        accessControlled: false,
                        updateControlled: false,
                        discriminatorSuperClass: UpdateControlledDiscriminatedSuperClass,
                        schema: {}
                    });
                }
                catch (error) {
                        if (error.message == 'A subclass of a updateControlled discriminated super class must also be updateControlled.')
                            return true;
                        else 
                            throw new Error(error.message);
                    }
                throw new Error('Constructor should have thrown an error: A subclass of a updateControlled discriminated super class must also be updateControlled.');
            });

        });

        describe('Happy Path', () => {

            it('Constructor excepts and sets parameters.', () => {
                var schema = {
                    text: {
                        type: String,
                        required: true
                    },
                    singularRelationship: {
                        type: Schema.Types.ObjectId,
                        ref: 'OtherClass',
                        required: true
                    },
                    nonSingularRelationship: {
                        type: [Schema.Types.ObjectId],
                        ref: 'OtherClass'
                    }
                }
    
                var SimpleClassModel = new ClassModel({
                    accessControlled: false,
                    updateControlled: false,
                    className: 'SimpleClassModel',
                    schema: schema
                });
    
                if (SimpleClassModel.className != 'SimpleClassModel')
                    return false;
                if (SimpleClassModel.schema != schema)
                    return false;
                return true;
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

                    const instanceFound = await classToCallFindOneOn.findById(instanceToFind.id);

                    if (!instanceFound)
                        throw new Error('findById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findById() returned the wrong instance.');
                });

                it('An instance of a concrete discriminated class can be found.', async () => {
                    const classToCallFindInstanceByIdOn = SubClassOfDiscriminatorSuperClass;
                    const instanceToFind = instanceOfSubClassOfDiscriminatorSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findById(instanceToFind.id);

                    if (!instanceFound)
                        throw new Error('findById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findById() returned the wrong instance.');
                });

                it('An instance of a concrete super class can be found.', async () => {
                    const classToCallFindInstanceByIdOn = SuperClass;
                    const instanceToFind = instanceOfSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findById(instanceToFind.id);

                    if (!instanceFound)
                        throw new Error('findById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findById() returned the wrong instance.');
                });

                it('An instance of a concrete discriminated sub-class can be found.', async () => {
                    const classToCallFindInstanceByIdOn = DiscriminatedSuperClass;
                    const instanceToFind = instanceOfDiscriminatedSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findById(instanceToFind.id);

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

                    const instanceFound = await classToCallFindInstanceByIdOn.findById(instanceToFind.id);

                    if (!instanceFound) 
                        throw new Error('findById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findById() returned the wrong instance.');
                });

                it('An instance of a concrete sub class of a non-discriminated super class can be found from the super class.', async () => {
                    const classToCallFindInstanceByIdOn = SuperClass;
                    const instanceToFind = instanceOfSubClassOfSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findById(instanceToFind.id);

                    if (!instanceFound) 
                        throw new Error('findById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findById() returned the wrong instance.');
                });

                it('An instance of a concrete sub class of a non-discriminated abstract super class can be found from the super class.', async () => {
                    const classToCallFindInstanceByIdOn = AbstractSuperClass;
                    const instanceToFind = instanceOfSubClassOfAbstractSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findById(instanceToFind.id);

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

                    const instanceFound = await classToCallFindInstanceByIdOn.findById(instanceToFind.id);

                    if (!instanceFound) 
                        throw new Error('findById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findById() returned the wrong instance.');
                });

                it('SuperClass -> Sub Class -> Sub Sub Class', async () => {
                    const classToCallFindInstanceByIdOn = SuperClass;
                    const instanceToFind = instanceOfSubClassOfSubClassOfSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findById(instanceToFind.id);

                    if (!instanceFound) 
                        throw new Error('findById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findById() returned the wrong instance.');
                });

                it('SuperClass -> Abstract Sub Class -> Sub Sub Class', async () => {
                    const classToCallFindInstanceByIdOn = SuperClass;
                    const instanceToFind = instanceOfSubClassOfAbstractSubClassOfSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findById(instanceToFind.id);

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

    describe('ClassModel.accessControlFilter()', () => {

        // Set up accessControlled Instances
        // For each class, create on instance which will pass all access control filters, and one each that will fail due to one of the access control methods
        {
            // ClassControlsAccessControlledSuperClass Instances
            var instanceOfClassControlsAccessControlledSuperClassAllowed = new Instance(ClassControlsAccessControlledSuperClass);
            instanceOfClassControlsAccessControlledSuperClassAllowed.allowed = true;
            
            var instanceOfClassControlsAccessControlledSuperClassNotAllowed = new Instance(ClassControlsAccessControlledSuperClass);
            instanceOfClassControlsAccessControlledSuperClassNotAllowed.allowed = false;

            // AccessControlledSuperClass Instances
            var instanceOfAccessControlledSuperClassPasses = new Instance(AccessControlledSuperClass);
            instanceOfAccessControlledSuperClassPasses.name = 'instanceOfAccessControlledSuperClassPasses';
            instanceOfAccessControlledSuperClassPasses.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;

            var instanceOfAccessControlledSuperClassFailsRelationship = new Instance(AccessControlledSuperClass);
            instanceOfAccessControlledSuperClassFailsRelationship.name = 'instanceOfAccessControlledSuperClassFailsRelationship';
            instanceOfAccessControlledSuperClassFailsRelationship.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassNotAllowed;

            // AccessControlledSubClassOfAccessControlledSuperClass Instances
            var instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses = new Instance(AccessControlledSubClassOfAccessControlledSuperClass);
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses.name = 'instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses';
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses.boolean = true;

            var instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship = new Instance(AccessControlledSubClassOfAccessControlledSuperClass);
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship.name = 'instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship';
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassNotAllowed;
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship.boolean = true;

            var instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean = new Instance(AccessControlledSubClassOfAccessControlledSuperClass);
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean.name = 'instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean'
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean.boolean = false;

            // AccessControlledDiscriminatedSuperClass Instances
            var instanceOfAccessControlledDiscriminatedSuperClassPasses = new Instance(AccessControlledDiscriminatedSuperClass);
            instanceOfAccessControlledDiscriminatedSuperClassPasses.name = 'instanceOfAccessControlledDiscriminatedSuperClassPasses';
            instanceOfAccessControlledDiscriminatedSuperClassPasses.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;
            instanceOfAccessControlledDiscriminatedSuperClassPasses.boolean = true;
            instanceOfAccessControlledDiscriminatedSuperClassPasses.string = 'accessControlled';

            var instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship = new Instance(AccessControlledDiscriminatedSuperClass);
            instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship.name = 'instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship';
            instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassNotAllowed;
            instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship.boolean = true;
            instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship.string = 'accessControlled';

            var instanceOfAccessControlledDiscriminatedSuperClassFailsString = new Instance(AccessControlledDiscriminatedSuperClass);
            instanceOfAccessControlledDiscriminatedSuperClassFailsString.name = 'instanceOfAccessControlledDiscriminatedSuperClassFailsString';
            instanceOfAccessControlledDiscriminatedSuperClassFailsString.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;
            instanceOfAccessControlledDiscriminatedSuperClassFailsString.boolean = true;
            instanceOfAccessControlledDiscriminatedSuperClassFailsString.string = 'not accessControlled';

            var instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean = new Instance(AccessControlledDiscriminatedSuperClass);
            instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean.name = 'instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean';
            instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;
            instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean.boolean = false;
            instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean.string = 'accessControlled';

            // AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass Instances
            var instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses = new Instance(AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass);
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses.name = 'instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses';
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;  
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses.boolean = true;
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses.string = 'accessControlled';         
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses.number = 1;

            var instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship = new Instance(AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass);
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship.name = 'instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship';
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassNotAllowed;             
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship.number = 1;
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship.boolean = true;
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship.string = 'accessControlled';

            var instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean = new Instance(AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass);
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean.name = 'instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean';
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;     
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean.boolean = false;
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean.string = 'accessControlled';
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean.number = 1;

            var instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString = new Instance(AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass);
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString.name = 'instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString';
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;     
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString.boolean = true;
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString.string = 'not accessControlled';            
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString.number = 1;

            var instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber = new Instance(AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass);
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber.name = 'instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber';
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber.boolean = true;
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber.string = 'accessControlled';      
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber.number = -1;

            // AccessControlledClassAccessControlledByParameters Instances
            var instanceOfAccessControlledClassAccessControlledByParameters = new Instance(AccessControlledClassAccessControlledByParameters);

        }

        // Save all SecurityFilter Test Instances
        before(async () => {
            await Promise.all([
                instanceOfClassControlsAccessControlledSuperClassAllowed.save(),
                instanceOfClassControlsAccessControlledSuperClassNotAllowed.save(),
                instanceOfAccessControlledSuperClassPasses.save(),
                instanceOfAccessControlledSuperClassFailsRelationship.save(),
                instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses.save(),
                instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship.save(),
                instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean.save(),
                instanceOfAccessControlledDiscriminatedSuperClassPasses.save(),
                instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship.save(),
                instanceOfAccessControlledDiscriminatedSuperClassFailsString.save(),
                instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean.save(),
                instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses.save(),
                instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship.save(),
                instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean.save(),
                instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString.save(),
                instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber.save(),
            ]);
        });

        after(async () => {
            await ClassControlsAccessControlledSuperClass.clear();
            await AccessControlledSuperClass.clear();
            await AccessControlledSubClassOfAccessControlledSuperClass.clear();
            await AccessControlledDiscriminatedSuperClass.clear();
            await AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass.clear();
            await AccessControlledClassAccessControlledByParameters.clear();
        });

        describe('Tests for invalid arguments.', () => {

            it('First argument must be an InstanceSet.', async () => {
                let expectedErrorMessage = 'Incorrect parameters. ' + AccessControlledSuperClass.className + '.accessControlFilter(InstanceSet instanceSet, ...accessControlMethodParameters)';
                await testForErrorAsync('ClassModel.accessControlFilter()', expectedErrorMessage, async () => {
                    return AccessControlledSuperClass.accessControlFilter();
                })
            });

            it('First argument must be an InstanceSet.', async () => {
                let expectedErrorMessage = 'Incorrect parameters. ' + AccessControlledSuperClass.className + '.accessControlFilter(InstanceSet instanceSet, ...accessControlMethodParameters)';
                await testForErrorAsync('ClassModel.accessControlFilter()', expectedErrorMessage, async () => {
                    return AccessControlledSuperClass.accessControlFilter({ some: 'object' });
                })
            });

        });

        describe('Test filtering out instances that don\'t pass access control check.', () => {

            describe('AccessControlledSuperClass.accessControlFilter()', () => {

                it('Access Control Filter called on Class with only direct instances of Class.', async () => {
                    const classModel = AccessControlledSuperClass;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSuperClassFailsRelationship
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledSuperClassPasses
                    ]);

                    const filteredInstanceSet = await classModel.accessControlFilter(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilter() did not return the expected InstanceSet.');
                });

                it('Access Control Filter called on Class with instances of class and sub class.', async () => {
                    const classModel = AccessControlledSuperClass;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSuperClassFailsRelationship,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses
                    ]);

                    const filteredInstanceSet = await classModel.accessControlFilter(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilter() did not return the expected InstanceSet.');
                });

                it('Access Control Filter called on Class with instances of class and 2 layers of sub classes.', async () => {
                    const classModel = AccessControlledSuperClass;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSuperClassFailsRelationship,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship,
                        instanceOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsString,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledDiscriminatedSuperClassPasses
                    ]);

                    const filteredInstanceSet = await classModel.accessControlFilter(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilter() did not return the expected InstanceSet.');
                });

                it('Access Control Filter called on Class with instances of 3 layers of sub classes.', async () => {
                    const classModel = AccessControlledSuperClass;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSuperClassFailsRelationship,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship,
                        instanceOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsString,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses
                    ]);
                    const filteredInstanceSet = await classModel.accessControlFilter(instanceSet);

                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilter() did not return the expected InstanceSet.');
                });

            });

            describe('AccessControlledSubClassOfAccessControlledSuperClass.accessControlFilter()', () => {

                it('Access Control Filter called on Class with only direct instances of Class.', async () => {
                    const classModel = AccessControlledSubClassOfAccessControlledSuperClass;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses
                    ]);

                    const filteredInstanceSet = await classModel.accessControlFilter(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilter() did not return the expected InstanceSet.');
                });

                it('Access Control Filter called on Class with instances of class and 1 layers of sub classes.', async () => {
                    const classModel = AccessControlledSubClassOfAccessControlledSuperClass;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship,
                        instanceOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsString,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledDiscriminatedSuperClassPasses
                    ]);

                    const filteredInstanceSet = await classModel.accessControlFilter(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilter() did not return the expected InstanceSet.');
                });

                it('Access Control Filter called on Class with instances of 2 layers of sub classes.', async () => {
                    const classModel = AccessControlledSubClassOfAccessControlledSuperClass;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship,
                        instanceOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsString,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses
                    ]);

                    const filteredInstanceSet = await classModel.accessControlFilter(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilter() did not return the expected InstanceSet.');
                });

            });

            describe('AccessControlledDiscriminatedSuperClass.accessControlFilter()', () => {

                it('Access Control Filter called on Class with only direct instances of Class.', async () => {
                    const classModel = AccessControlledDiscriminatedSuperClass;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsString,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledDiscriminatedSuperClassPasses
                    ]);

                    const filteredInstanceSet = await classModel.accessControlFilter(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilter() did not return the expected InstanceSet.');
                });

                it('Access Control Filter called on Class with instances of 1 layers of sub classes.', async () => {
                    const classModel = AccessControlledDiscriminatedSuperClass;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsString,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses
                    ]);

                    const filteredInstanceSet = await classModel.accessControlFilter(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilter() did not return the expected InstanceSet.');
                });

            });

            describe('AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass.accessControlFilter()', () => {

                it('Access Control Filter called on Class with only direct instances of Class.', async () => {
                    const classModel = AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses
                    ]);

                    const filteredInstanceSet = await classModel.accessControlFilter(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilter() did not return the expected InstanceSet.');
                });

            });

            describe('AccessControlledClassAccessControlledByParameters.accessControlFilter()', () => {

                it('Instance passes access control check', async () => {
                    const classModel = AccessControlledClassAccessControlledByParameters;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledClassAccessControlledByParameters,
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledClassAccessControlledByParameters
                    ]);
                    const parameters = [1, 1, true];

                    const filteredInstanceSet = await classModel.accessControlFilter(instanceSet, ...parameters);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilter() did not return the expected InstanceSet.');
                });

                it('Instance fails access control check because of Numbers.', async () => {
                    const classModel = AccessControlledClassAccessControlledByParameters;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledClassAccessControlledByParameters,
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel);
                    const parameters = [-2, 1, true];

                    const filteredInstanceSet = await classModel.accessControlFilter(instanceSet, ...parameters);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilter() did not return the expected InstanceSet.');
                });

                it('Instance fails access control check because of Boolean.', async () => {
                    const classModel = AccessControlledClassAccessControlledByParameters;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledClassAccessControlledByParameters,
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel);
                    const parameters = [1, 1, false];

                    const filteredInstanceSet = await classModel.accessControlFilter(instanceSet, ...parameters);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilter() did not return the expected InstanceSet.');
                });

            });

        });

        describe('Test find methods for access filtering.', () => {

            describe('Test findById() with access filtering', () => {

                it('Call findById() on an instance of an access controlled class. Instance passes filter.', async () => {
                    const classToCallFindByIdOn = AccessControlledSuperClass;
                    const instanceToFind = instanceOfAccessControlledSuperClassPasses;
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
                    const classToCallFindByIdOn = AccessControlledSuperClass;
                    const instanceToFind = instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses;
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
                    const classToCallFindByIdOn = AccessControlledSuperClass;
                    const instanceToFind = instanceOfAccessControlledSuperClassFailsRelationship;
                    const instanceFound = await classToCallFindByIdOn.findById(instanceToFind._id);

                    if (instanceFound)
                        throw new Error('findById() returned an instance.');
                });

                it('Call findById() on an instance of an access controlled class, from super class. Instance does not pass filter based on super access control method.', async () => {
                    const classToCallFindByIdOn = AccessControlledSuperClass;
                    const instanceToFind = instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship;
                    const instanceFound = await classToCallFindByIdOn.findById(instanceToFind._id);

                    if (instanceFound)
                        throw new Error('findById() returned an instance.');

                });

                it('Call findById() on an instance of an access controlled class, from super class. Instance does not pass filter based on it\'s own access control method.', async () => {
                    const classToCallFindByIdOn = AccessControlledSuperClass;
                    const instanceToFind = instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean;
                    const instanceFound = await classToCallFindByIdOn.findById(instanceToFind._id);

                    if (instanceFound)
                        throw new Error('findById() returned an instance.');

                });

            });

            describe('Test findOne() with access filtering', () => {

                it('Call findOne() on an instance of an access controlled class. instance passes filter.', async () => {
                    const classToCallFindByIdOn = AccessControlledSuperClass;
                    const instanceToFind = instanceOfAccessControlledSuperClassPasses;

                    const filter = {
                        name: 'instanceOfAccessControlledSuperClassPasses'
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
                    const classToCallFindByIdOn = AccessControlledSuperClass;
                    const instanceToFind = instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses;

                    const filter = {
                        name: 'instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses'
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
                    const classToCallFindByIdOn = AccessControlledSuperClass;

                    const filter = {
                        name: 'instanceOfAccessControlledSuperClassFailsRelationship'
                    }

                    const instanceFound = await classToCallFindByIdOn.findOne(filter);

                    if (instanceFound)
                        throw new Error('findOne() returned an instance');

                });

                it('Call findOne() on an instance of an access controlled class, from super class. Instance does not pass filter based on super access control method.', async () => {
                    const classToCallFindByIdOn = AccessControlledSuperClass;

                    const filter = {
                        name: 'instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship'
                    }

                    const instanceFound = await classToCallFindByIdOn.findOne(filter);

                    if (instanceFound)
                        throw new Error('findOne() returned an instance');

                });

                it('Call findOne() on an instance of an access controlled class, from super class. Instance does not pass filter based on it\'s own access control method.', async () => {
                    const classToCallFindByIdOn = AccessControlledSuperClass;

                    const filter = {
                        name: 'instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean'
                    }

                    const instanceFound = await classToCallFindByIdOn.findOne(filter);

                    if (instanceFound)
                        throw new Error('findOne() returned an instance');

                });

            });

            describe('Test find() with access filtering', () => {

                it('Call find() on access controlled super class with a passing and not passing instance of each sub class.', async () => {
                    const instanceNames = [
                        'instanceOfAccessControlledSuperClassPasses',
                        'instanceOfAccessControlledSuperClassFailsRelationship',
                        'instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses',
                        'instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship',
                        'instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean',
                        'instanceOfAccessControlledDiscriminatedSuperClassPasses',
                        'instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship',
                        'instanceOfAccessControlledDiscriminatedSuperClassFailsString',
                        'instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean',
                        'instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses',
                        'instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship',
                        'instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean',
                        'AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass',
                        'AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass'
                    ];
                    const expectedInstances = new InstanceSet(AccessControlledSuperClass, [
                        instanceOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses
                    ]);

                    const instancesFound = await AccessControlledSuperClass.find({name: {$in: instanceNames}});

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

    describe('Attributes and Relationships', () => {

        describe('ClassModel.getAttributes()', () => {

            it('ClassModel.getAttributes() returns all the attributes for ClassModel AllFieldsRequiredClass.', () => {
                const attributes = AllFieldsRequiredClass.getAttributes();
                const attributeNames = attributes.map(attribute => attribute.name);
                const expectedAttributeNames = ['string', 'strings', 'date', 'boolean', 'booleans', 'number', 'numbers'];
                const expectedLists = ['strings', 'booleans', 'numbers'];

                for (const attributeName of expectedAttributeNames) 
                    if (!attributeNames.includes(attributeName))
                        throw new Error('getAttributes() did not return the expected attribute ' + attributeName);   

                for (const attribute of attributes) 
                    if (expectedLists.includes(attribute.name) && attribute.list !== true)
                        throw new Error('getAttributes() did not set the \'list\' property correctly.');  

                for (const attribute of attributes) 
                    if (!expectedLists.includes(attribute.name) && attribute.list === true)
                        throw new Error('getAttributes() did not set the \'list\' property correctly.');                
            });

        });

        describe('ClassModel.getSingularRelationships()', () => {

            it('ClassModel.getSingularRelationships() returns all the Singular Relationships for ClassModel AllFieldsRequiredClass.', () => {
                const singularRelationships = AllFieldsRequiredClass.getSingularRelationships();

                if (singularRelationships.length != 1 || singularRelationships[0].name !== 'class1')
                    throw new Error ('getSingularRelationships() did not return the expected relationship.');
            });

        });

        describe('ClassModel.getNonSingularRelationships()', () => {

            it('ClassModel.getNonSingularRelationships() returns all the Non-Singular Relationships for ClassModel AllFieldsRequiredClass.', () => {
                const nonSingularRelationships = AllFieldsRequiredClass.getNonSingularRelationships();

                if (nonSingularRelationships.length != 1 || nonSingularRelationships[0].name !== 'class2s')
                    throw new Error ('getNonSingularRelationships() did not return the expected relationship.');
            });

        });

    });

});

