require("@babel/polyfill");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassModel = require('../dist/models/ClassModel');
const SuperSet = require('../dist/models/SuperSet');
const InstanceSet = require('../dist/models/InstanceSet');
const Instance = require('../dist/models/Instance');
const database = require('../dist/models/database');
const TestClassModels = require('./TestClassModels');
const TestingFunctions = require('./TestingFunctions');
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

    describe('ClassModel.create()', () => {

        it('You cannot created an instance of an abstract class.', () => {
            let expectedErrorMessage = 'You cannot create an instance of an abstract class.';

            try {
                AbstractSuperClass.create();
            }
            catch(error) {
                if (error.message != expectedErrorMessage) {
                    throw new Error('ClassModel.create() did not throw the expected error.\n' +
                        'Expected: ' + expectedErrorMessage + '\n' + 
                        'Actual:   ' + error.message
                    );
                }
                else {
                    return true;
                }
            }

            throw new Error('ClassModel.create() should have thrown the error: ' + expectedErrorMessage);
        });

        it('You cannot created an instance of an abstract discriminated class.', () => {
            let expectedErrorMessage = 'You cannot create an instance of an abstract class.';

            try {
                AbstractDiscriminatedSuperClass.create();
            }
            catch(error) {
                if (error.message != expectedErrorMessage) {
                    throw new Error('ClassModel.create() did not throw the expected error.\n' +
                        'Expected: ' + expectedErrorMessage + '\n' + 
                        'Actual:   ' + error.message
                    );
                }
                else {
                    return true;
                }
            }

            throw new Error('ClassModel.create() should have thrown the error: ' + expectedErrorMessage);
        });

    });

    describe('ClassModel.compare()', () => {

        it('ClassModel.compare() returns true if instances are the same instance.', () => {
            var instance1 = CompareClass1.create();
            var compareResult;

            instance1.name = " Name 1";
            instance1.class2 = CompareClass2.create()._id;

            compareResult = CompareClass1.compare(instance1, instance1);

            if (compareResult.match == false) {
                throw new Error('ClassModel.compare should have returned true.')
            }
        });

        it('ClassModel.compare() returns true if both instances are null.', () => {
            var compareResult = CompareClass1.compare(null, null);

            if (compareResult.match == false) {
                throw new Error('ClassModel.compare should have returned true.')
            }

            if (compareResult.message != 'Both instances are null.') {
                throw new Error('ClassModel.compare should have returned the message "Both instances are null.". but it returned: ' + compareResult.message);
            }
        });

        it('ClassModel.compare() returns false if first instance is null.', () => {
            var instance2 = CompareClass1.create();
            var compareResult;
            var expectedCompareMessage = 'First instance is null.';

            instance2.name = "Name 2";

            compareResult = CompareClass1.compare(null, instance2);

            if (compareResult.match == true) {
                throw new Error('ClassModel.compare should have returned false because the first instance is null.')
            }
            if (compareResult.message != expectedCompareMessage) {
                throw new Error(
                    'ClassModel.compare() returned the wrong error message.\n' + 
                    'Expected: ' + expectedCompareMessage + '\n' +
                    'Actual:   ' + compareResult.message
                );
            }
        });

        it('ClassModel.compare() returns false if second instance is null.', () => {
            var instance1 = CompareClass1.create();
            var compareResult;
            var expectedCompareMessage = 'Second instance is null.';

            instance1.name = "Name 2";

            compareResult = CompareClass1.compare(instance1, null);

            if (compareResult.match == true) {
                throw new Error('ClassModel.compare should have returned false because the second instance is null.')
            }
            if (compareResult.message != expectedCompareMessage) {
                throw new Error(
                    'ClassModel.compare() returned the wrong error message.\n' + 
                    'Expected: ' + expectedCompareMessage + '\n' +
                    'Actual:   ' + compareResult.message
                );
            }
        });

        it('ClassModel.compare() returns true if all fields are the same.', () => {
            var instance1 = CompareClass1.create();
            var instance2 = CompareClass1.create();
            var compareResult;

            var relatedInstance1 = CompareClass2.create();

            instance1.name = "Name 1";
            instance1.class2 = relatedInstance1._id;

            instance2.name = "Name 1";
            instance2.class2 = relatedInstance1._id;

            compareResult = CompareClass1.compare(instance1, instance2);

            if (compareResult.match == false) {
                throw new Error('ClassModel.compare should have returned true.')
            }
        });

        it('ClassModel.compare() returns false if an attribute is different.', () => {
            var instance1 = CompareClass1.create();
            var instance2 = CompareClass1.create();
            var compareResult;
            var expectedCompareMessage = 'CompareClass1.name\'s do not match.';
            
            var relatedInstance1 = CompareClass2.create();

            instance1.name = "Name 1";
            instance1.class2 = relatedInstance1;

            instance2.name = "Name 2";
            instance2.class2 = relatedInstance1;

            compareResult = CompareClass1.compare(instance1, instance2);

            if (compareResult.match == true) {
                throw new Error('ClassModel.compare should have returned false because the names are different.')
            }
            if (compareResult.message != expectedCompareMessage) {
                throw new Error(
                    'ClassModel.compare() returned the wrong error message.\n' + 
                    'Expected: ' + expectedCompareMessage + '\n' +
                    'Actual:   ' + compareResult.message
                );
            }
        });

        it('ClassModel.compare() returns false if an attribute in an array is different.', () => {
            var instance1 = CompareClass1.create();
            var instance2 = CompareClass1.create();
            var compareResult;
            var expectedCompareMessage = 'CompareClass1.numbers\'s do not match.';
            
            var relatedInstance1 = CompareClass2.create();

            instance1.name = "Name 1";
            instance1.numbers = [1, 2];
            instance1.class2 = relatedInstance1;

            instance2.name = "Name 1";
            instance2.numbers = [1, 3];
            instance2.class2 = relatedInstance1;

            compareResult = CompareClass1.compare(instance1, instance2);

            if (compareResult.match == true) {
                throw new Error('ClassModel.compare should have returned false because the numbers are different.')
            }
            if (compareResult.message != expectedCompareMessage) {
                throw new Error(
                    'ClassModel.compare() returned the wrong error message.\n' + 
                    'Expected: ' + expectedCompareMessage + '\n' +
                    'Actual:   ' + compareResult.message
                );
            }
        });

        it('ClassModel.compare() returns false if singular relationship is different.', () => {
            var instance1 = CompareClass1.create();
            var instance2 = CompareClass1.create();
            var compareResult;
            var expectedCompareMessage = 'CompareClass1.class2\'s do not match.';

            instance1.name = "Name 1";
            instance1.class2 = CompareClass2.create()._id;

            instance2.name = "Name 1";
            instance2.class2 = CompareClass2.create()._id;

            compareResult = CompareClass1.compare(instance1, instance2);

            if (compareResult.match == true) {
                throw new Error('ClassModel.compare should have returned false because singular relationships are different.')
            }
            if (compareResult.message != expectedCompareMessage) {
                throw new Error(
                    'ClassModel.compare() returned the wrong error message.\n' + 
                    'Expected: ' + expectedCompareMessage + '\n' +
                    'Actual:   ' + compareResult.message
                );
            }
        });

        it('ClassModel.compare() returns false one of the singular relationships is empty.', () => {
            var instance1 = CompareClass1.create();
            var instance2 = CompareClass1.create();
            var compareResult;
            var expectedCompareMessage = 'CompareClass1.class2\'s do not match.';

            instance1.name = "Name 1";
            instance1.class2 = CompareClass2.create()._id;

            instance2.name = "Name 1";

            compareResult = CompareClass1.compare(instance1, instance2);

            if (compareResult.match == true) {
                throw new Error('ClassModel.compare should have returned false because singular relationships are different.')
            }
            if (compareResult.message != expectedCompareMessage) {
                throw new Error(
                    'ClassModel.compare() returned the wrong error message.\n' + 
                    'Expected: ' + expectedCompareMessage + '\n' +
                    'Actual:   ' + compareResult.message
                );
            }
        });

        it('ClassModel.compare() returns false if one instance in a non-singular relationship is different.', () => {
            var instance1 = CompareClass2.create();
            var instance2 = CompareClass2.create();
            var compareResult;
            var expectedCompareMessage = 'CompareClass2.class1s\'s do not match.';

            var relatedInstance1 = CompareClass2.create();

            instance1.name = "Name 1";
            instance1.class1s = [relatedInstance1._id, CompareClass1.create()._id];

            instance2.name = "Name 1";
            instance2.class1s =  [relatedInstance1._id, CompareClass1.create()._id];

            compareResult = CompareClass2.compare(instance1, instance2);

            if (compareResult.match == true) {
                throw new Error('ClassModel.compare should have returned false because singular relationships are different.')
            }
            if (compareResult.message != expectedCompareMessage) {
                throw new Error(
                    'ClassModel.compare() returned the wrong error message.\n' + 
                    'Expected: ' + expectedCompareMessage + '\n' +
                    'Actual:   ' + compareResult.message
                );
            }
        });

        it('ClassModel.compare() returns false if all instances in a non-singular relationship is different.', () => {
            var instance1 = CompareClass2.create();
            var instance2 = CompareClass2.create();
            var compareResult;
            var expectedCompareMessage = 'CompareClass2.class1s\'s do not match.';

            instance1.name = "Name 1";
            instance1.class1s = [CompareClass1.create()._id, CompareClass1.create()._id];

            instance2.name = "Name 1";
            instance2.class1s =  [CompareClass1.create()._id, CompareClass1.create()._id];

            compareResult = CompareClass2.compare(instance1, instance2);

            if (compareResult.match == true) {
                throw new Error('ClassModel.compare should have returned false because singular relationships are different.')
            }
            if (compareResult.message != expectedCompareMessage) {
                throw new Error(
                    'ClassModel.compare() returned the wrong error message.\n' + 
                    'Expected: ' + expectedCompareMessage + '\n' +
                    'Actual:   ' + compareResult.message
                );
            }
        });

        it('ClassModel.compare() returns false if non-singular relationship is different (one not set).', () => {
            var instance1 = CompareClass2.create();
            var instance2 = CompareClass2.create();
            var compareResult;
            var expectedCompareMessage = 'CompareClass2.class1s\'s do not match.';

            instance1.name = "Name 1";
            instance1.class1s = [CompareClass1.create()._id, CompareClass1.create()._id];

            instance2.name = "Name 1";
            instance2.class1s =  [];

            compareResult = CompareClass2.compare(instance1, instance2);

            if (compareResult.match == true) {
                throw new Error('ClassModel.compare should have returned false because singular relationships are different.')
            }
            if (compareResult.message != expectedCompareMessage) {
                throw new Error(
                    'ClassModel.compare() returned the wrong error message.\n' + 
                    'Expected: ' + expectedCompareMessage + '\n' +
                    'Actual:   ' + compareResult.message
                );
            }
        });

        it('ClassModel.compare() returns false if non-singular relationship have different lengths.', () => {
            var instance1 = CompareClass2.create();
            var instance2 = CompareClass2.create();
            var compareResult;
            var expectedCompareMessage = 'CompareClass2.class1s\'s do not match.';

            let relatedInstance1 = CompareClass2.create();
            let relatedInstance2 = CompareClass2.create();

            instance1.name = "Name 1";
            instance1.class1s = [relatedInstance1, relatedInstance2];

            instance2.name = "Name 1";
            instance2.class1s = [relatedInstance1, relatedInstance2, relatedInstance1];

            compareResult = CompareClass2.compare(instance1, instance2);

            if (compareResult.match == true) {
                throw new Error('ClassModel.compare should have returned false because singular relationships are different.')
            }
            if (compareResult.message != expectedCompareMessage) {
                throw new Error(
                    'ClassModel.compare() returned the wrong error message.\n' + 
                    'Expected: ' + expectedCompareMessage + '\n' +
                    'Actual:   ' + compareResult.message
                );
            }
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

            var documentOfAllFieldsMutexClass = AllFieldsMutexClass.create();
            var documentOfDiscriminatedSuperClass = DiscriminatedSuperClass.create();
            var documentOfSuperClass = SuperClass.create();
            var documentOfSubClassOfSuperClass = SubClassOfSuperClass.create();
            var documentOfSubClassOfAbstractSuperClass = SubClassOfAbstractSuperClass.create();
            var documentOfSubClassOfDiscriminatorSuperClass = SubClassOfDiscriminatorSuperClass.create();
            var documentOfSubClassOfDiscriminatedSubClassOfSuperClass = SubClassOfDiscriminatedSubClassOfSuperClass.create();
            var documentOfSubClassOfSubClassOfSuperClass = SubClassOfSubClassOfSuperClass.create();
            var documentOfSubClassOfAbstractSubClassOfSuperClass = SubClassOfAbstractSubClassOfSuperClass.create();
    
            documentOfAllFieldsMutexClass.string = 'documentOfAllFieldsMutexClass';
            documentOfDiscriminatedSuperClass.name = 'documentOfDiscriminatedSuperClass';
            documentOfSuperClass.name = 'documentOfSuperClass';
            documentOfSubClassOfSuperClass.name = 'documentOfSubClassOfSuperClass';
            documentOfSubClassOfAbstractSuperClass.name = 'documentOfSubClassOfAbstractSuperClass';
            documentOfSubClassOfDiscriminatorSuperClass.name = 'documentOfSubClassOfDiscriminatorSuperClass';
            documentOfSubClassOfDiscriminatedSubClassOfSuperClass.name = 'documentOfSubClassOfDiscriminatedSubClassOfSuperClass';
            documentOfSubClassOfSubClassOfSuperClass.name = 'documentOfSubClassOfSubClassOfSuperClass';
            documentOfSubClassOfAbstractSubClassOfSuperClass.name = 'documentOfSubClassOfAbstractSubClassOfSuperClass';
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

        describe('ClassModel.findOneInstance()', () => {
    
            describe('Calling findOneInstance on the Class of the instance you want to find. (Direct)', () => {

                it('An instance of a concrete class with no subclasses can be found.', async () => {
                    const classToCallFindOneOn = AllFieldsMutexClass;
                    const instanceToFind = instanceOfAllFieldsMutexClass;

                    const filter = {
                        string: 'instanceOfAllFieldsMutexClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOneInstance(filter);

                    if (!instanceFound)
                        throw new Error('findOneInstance() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findOneInstance() returned the wrong instance.');
                });

                it('An instance of a concrete discriminated class can be found.', async () => {
                    const classToCallFindOneOn = SubClassOfDiscriminatorSuperClass;
                    const instanceToFind = instanceOfSubClassOfDiscriminatorSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfDiscriminatorSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOneInstance(filter);

                    if (!instanceFound)
                        throw new Error('findOneInstance() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findOneInstance() returned the wrong instance.');
                });

                it('An instance of a concrete super class can be found.', async () => {
                    const classToCallFindOneOn = SuperClass;
                    const instanceToFind = instanceOfSuperClass;

                    const filter = {
                        name: 'instanceOfSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOneInstance(filter);

                    if (!instanceFound)
                        throw new Error('findOneInstance() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findOneInstance() returned the wrong instance.');
                });

                it('An instance of a concrete discriminated sub-class can be found.', async () => {
                    const classToCallFindOneOn = DiscriminatedSuperClass;
                    const instanceToFind = instanceOfDiscriminatedSuperClass;

                    const filter = {
                        name: 'instanceOfDiscriminatedSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOneInstance(filter);

                    if (!instanceFound)
                        throw new Error('findOneInstance() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findOneInstance() returned the wrong instance.');
                });
    
            });
    
            describe('Calling findOneInstance on a super class of the class of the instance you want to find. (Indirect)', () => {

                it('An instance of a sub class of a discrimintated super class can be found from the super class.', async () => {
                    const classToCallFindOneOn = DiscriminatedSuperClass;
                    const instanceToFind = instanceOfSubClassOfDiscriminatorSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfDiscriminatorSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOneInstance(filter);

                    if (!instanceFound) 
                        throw new Error('findOneInstance() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findOneInstance() returned the wrong instance.');
                });

                it('An instance of a concrete sub class of a non-discriminated super class can be found from the super class.', async () => {
                    const classToCallFindOneOn = SuperClass;
                    const instanceToFind = instanceOfSubClassOfSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfSuperClass'
                    }


                    const instanceFound = await classToCallFindOneOn.findOneInstance(filter);

                    if (!instanceFound) 
                        throw new Error('findOneInstance() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findOneInstance() returned the wrong instance.');
                });

                it('An instance of a concrete sub class of a non-discriminated abstract super class can be found from the super class.', async () => {
                    const classToCallFindOneOn = AbstractSuperClass;
                    const instanceToFind = instanceOfSubClassOfAbstractSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfAbstractSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOneInstance(filter);

                    if (!instanceFound) 
                        throw new Error('findOneInstance() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findOneInstance() returned the wrong instance.');
                });
    
            });
    
            describe('Calling findOneInstance on a super class of the super class of the instance you want to find. (Recursive)', () => {

                it('SuperClass -> Discriminated Sub Class -> Sub Sub Class', async () => {
                    const classToCallFindOneOn = SuperClass;
                    const instanceToFind = instanceOfSubClassOfDiscriminatedSubClassOfSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfDiscriminatedSubClassOfSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOneInstance(filter);

                    if (!instanceFound) 
                        throw new Error('findOneInstance() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findOneInstance() returned the wrong instance.');
                });

                it('SuperClass -> Sub Class -> Sub Sub Class', async () => {
                    const classToCallFindOneOn = SuperClass;
                    const instanceToFind = instanceOfSubClassOfSubClassOfSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfSubClassOfSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOneInstance(filter);

                    if (!instanceFound) 
                        throw new Error('findOneInstance() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findOneInstance() returned the wrong instance.');
                });

                it('SuperClass -> Abstract Sub Class -> Sub Sub Class', async () => {
                    const classToCallFindOneOn = SuperClass;
                    const instanceToFind = instanceOfSubClassOfAbstractSubClassOfSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfAbstractSubClassOfSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOneInstance(filter);

                    if (!instanceFound) 
                        throw new Error('findOneInstance() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findOneInstance() returned the wrong instance.');
                });
    
            });
    
        });

        describe('ClassModel.findInstanceById()', () => {
    
            describe('Calling findInstanceById on the Class of the instance you want to find. (Direct)', () => {

                it('An instance of a concrete class with no subclasses can be found.', async () => {
                    const classToCallFindOneOn = AllFieldsMutexClass;
                    const instanceToFind = instanceOfAllFieldsMutexClass;

                    const instanceFound = await classToCallFindOneOn.findInstanceById(instanceToFind.id);

                    if (!instanceFound)
                        throw new Error('findInstanceById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findInstanceById() returned the wrong instance.');
                });

                it('An instance of a concrete discriminated class can be found.', async () => {
                    const classToCallFindInstanceByIdOn = SubClassOfDiscriminatorSuperClass;
                    const instanceToFind = instanceOfSubClassOfDiscriminatorSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findInstanceById(instanceToFind.id);

                    if (!instanceFound)
                        throw new Error('findInstanceById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findInstanceById() returned the wrong instance.');
                });

                it('An instance of a concrete super class can be found.', async () => {
                    const classToCallFindInstanceByIdOn = SuperClass;
                    const instanceToFind = instanceOfSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findInstanceById(instanceToFind.id);

                    if (!instanceFound)
                        throw new Error('findInstanceById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findInstanceById() returned the wrong instance.');
                });

                it('An instance of a concrete discriminated sub-class can be found.', async () => {
                    const classToCallFindInstanceByIdOn = DiscriminatedSuperClass;
                    const instanceToFind = instanceOfDiscriminatedSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findInstanceById(instanceToFind.id);

                    if (!instanceFound)
                        throw new Error('findInstanceById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findInstanceById() returned the wrong instance.');
                });
    
            });
    
            describe('Calling findInstanceById on a super class of the class of the instance you want to find. (Indirect)', () => {

                it('An instance of a sub class of a discrimintated super class can be found from the super class.', async () => {
                    const classToCallFindInstanceByIdOn = DiscriminatedSuperClass;
                    const instanceToFind = instanceOfSubClassOfDiscriminatorSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findInstanceById(instanceToFind.id);

                    if (!instanceFound) 
                        throw new Error('findInstanceById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findInstanceById() returned the wrong instance.');
                });

                it('An instance of a concrete sub class of a non-discriminated super class can be found from the super class.', async () => {
                    const classToCallFindInstanceByIdOn = SuperClass;
                    const instanceToFind = instanceOfSubClassOfSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findInstanceById(instanceToFind.id);

                    if (!instanceFound) 
                        throw new Error('findInstanceById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findInstanceById() returned the wrong instance.');
                });

                it('An instance of a concrete sub class of a non-discriminated abstract super class can be found from the super class.', async () => {
                    const classToCallFindInstanceByIdOn = AbstractSuperClass;
                    const instanceToFind = instanceOfSubClassOfAbstractSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findInstanceById(instanceToFind.id);

                    if (!instanceFound) 
                        throw new Error('findInstanceById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findInstanceById() returned the wrong instance.');
                });
    
            });
    
            describe('Calling findInstanceById on a super class of the super class of the instance you want to find. (Recursive)', () => {

                it('SuperClass -> Discriminated Sub Class -> Sub Sub Class', async () => {
                    const classToCallFindInstanceByIdOn = SuperClass;
                    const instanceToFind = instanceOfSubClassOfDiscriminatedSubClassOfSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findInstanceById(instanceToFind.id);

                    if (!instanceFound) 
                        throw new Error('findInstanceById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findInstanceById() returned the wrong instance.');
                });

                it('SuperClass -> Sub Class -> Sub Sub Class', async () => {
                    const classToCallFindInstanceByIdOn = SuperClass;
                    const instanceToFind = instanceOfSubClassOfSubClassOfSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findInstanceById(instanceToFind.id);

                    if (!instanceFound) 
                        throw new Error('findInstanceById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findInstanceById() returned the wrong instance.');
                });

                it('SuperClass -> Abstract Sub Class -> Sub Sub Class', async () => {
                    const classToCallFindInstanceByIdOn = SuperClass;
                    const instanceToFind = instanceOfSubClassOfAbstractSubClassOfSuperClass;

                    const instanceFound = await classToCallFindInstanceByIdOn.findInstanceById(instanceToFind.id);

                    if (!instanceFound) 
                        throw new Error('findInstanceById() did not return an instance.');
                    
                    if (!instanceToFind.equals(instanceFound))
                        throw new Error('findInstanceById() returned the wrong instance.');
                });
    
            });
    
        });

        describe('ClassModel.findInstanceSet()', () => {

            describe('Finding a single instance.', () => {
    
                describe('Calling findInstanceSet on the Class of the instance you want to find. (Direct)', () => {
        
                    it('An instance of a concrete class with no subclasses can be found.', async () => {
                        const classToCallFindOn = AllFieldsMutexClass;
                        const classOfInstance = AllFieldsMutexClass;
                        const instanceToFind = instanceOfAllFieldsMutexClass;
                        const expectedInstances = new InstanceSet(classOfInstance, [instanceToFind]);
    
                        const filter = {
                            string: 'instanceOfAllFieldsMutexClass'
                        }
    
                        const instancesFound = await classToCallFindOn.findInstanceSet(filter);
    
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
    
                        const instancesFound = await classToCallFindOn.findInstanceSet(filter);
    
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
    
                        const instancesFound = await classToCallFindOn.findInstanceSet(filter);

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
    
                        const instancesFound = await classToCallFindOn.findInstanceSet(filter);

                        if (!instancesFound.equals(expectedInstances))
                            throw new Error('Returned instances are not what was expected.');
                    });
        
                });
        
                describe('Calling findInstanceSet on a super class of the class of the instance you want to findInstanceSet. (Indirect)', () => {
        
                    it('An instance of a sub class of a discrimintated super class can be from the super class.', async () => {
                        const classToCallFindOn = DiscriminatedSuperClass;
                        const instanceToFind = instanceOfSubClassOfDiscriminatorSuperClass;
                        const expectedInstances = new InstanceSet(classToCallFindOn, [instanceToFind]);
    
                        const filter = {
                            name: 'instanceOfSubClassOfDiscriminatorSuperClass'
                        }
    
                        const instancesFound = await classToCallFindOn.findInstanceSet(filter);
    
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
    
                        const instancesFound = await classToCallFindOn.findInstanceSet(filter);
    
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
    
                        const instancesFound = await classToCallFindOn.findInstanceSet(filter);
    
                        if (!instancesFound.equals(expectedInstances))
                            throw new Error('InstanceSet returned does not match what was expected.');
                    });
        
                });
        
                describe('Calling findInstanceSet() on a super class of the super class of the instance you want to find. (Recursive)', () => {
        
                    it('SuperClass -> Discriminated Sub Class -> Sub Sub Class', async () => {
                        const classToCallFindOn = SuperClass;
                        const instanceToFind = instanceOfSubClassOfDiscriminatedSubClassOfSuperClass;
                        const expectedInstances = new InstanceSet(classToCallFindOn, [instanceToFind]);
    
                        const filter = {
                            name: 'instanceOfSubClassOfDiscriminatedSubClassOfSuperClass'
                        }
    
                        const instancesFound = await classToCallFindOn.findInstanceSet(filter);
    
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
    
                        const instancesFound = await classToCallFindOn.findInstanceSet(filter);
    
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
    
                        const instancesFound = await classToCallFindOn.findInstanceSet(filter);
    
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

                    const instancesFound = await classToCallFindOn.findInstanceSet(filter);

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

                    const instancesFound = await classToCallFindOn.findInstanceSet(filter);

                    if (!instancesFound.equals(expectedInstances))
                        throw new Error('InstanceSet returned does not match what was expected.');
                });

            });

        });

    });

    describe('ClassModel.walkInstance()', () => {

        // Create instances for tests.
        {
            var instanceOfSingularRelationshipClassA = new Instance (SingularRelationshipClass);
            var instanceOfSingularRelationshipClassB = new Instance (SingularRelationshipClass);
            var instanceOfNonSingularRelationshipClass = new Instance (NonSingularRelationshipClass);
            var instanceOfSubClassOfSingularRelationshipClassA = new Instance (SubClassOfSingularRelationshipClass);
            var instanceOfSubClassOfSingularRelationshipClassB = new Instance (SubClassOfSingularRelationshipClass);
            var instanceOfSubClassOfNonSingularRelationshipClass = new Instance (SubClassOfNonSingularRelationshipClass);
    
            instanceOfSingularRelationshipClassA.singularRelationship = instanceOfNonSingularRelationshipClass._id;
            instanceOfSingularRelationshipClassA.boolean = true;
            instanceOfSingularRelationshipClassB.singularRelationship = instanceOfNonSingularRelationshipClass._id;
            instanceOfSingularRelationshipClassB.boolean = false;
            instanceOfNonSingularRelationshipClass.nonSingularRelationship = [instanceOfSingularRelationshipClassA._id, instanceOfSingularRelationshipClassB._id];
    
            instanceOfSubClassOfSingularRelationshipClassA.singularRelationship = instanceOfSubClassOfNonSingularRelationshipClass._id;
            instanceOfSubClassOfSingularRelationshipClassA.boolean = true;
            instanceOfSubClassOfSingularRelationshipClassB.singularRelationship = instanceOfSubClassOfNonSingularRelationshipClass._id;
            instanceOfSubClassOfSingularRelationshipClassB.boolean = false;
            instanceOfSubClassOfNonSingularRelationshipClass.nonSingularRelationship = [instanceOfSubClassOfSingularRelationshipClassA._id, instanceOfSubClassOfSingularRelationshipClassB._id];
        }

        before(async () => {
            await instanceOfSingularRelationshipClassA.save();
            await instanceOfSingularRelationshipClassB.save();
            await instanceOfNonSingularRelationshipClass.save();
            await instanceOfSubClassOfSingularRelationshipClassA.save();
            await instanceOfSubClassOfSingularRelationshipClassB.save();
            await instanceOfSubClassOfNonSingularRelationshipClass.save();
        });

        after(async () => {
            await SingularRelationshipClass.clear();
            await NonSingularRelationshipClass.clear();
            await SubClassOfSingularRelationshipClass.clear();
            await SubClassOfNonSingularRelationshipClass.clear();
        });

        describe('Tests for invalid arguments.', () => {

            it('ClassModel.walkInstance() called with no arguments.', async () => {
                let expectedErrorMessage = 'SingularRelationshipClass.walkInstance() called with insufficient arguments. Should be walkInstance(instance, relationship, <optional>filter).';

                await testForErrorAsync('ClassModel.walkInstance()', expectedErrorMessage, async () => {
                    return SingularRelationshipClass.walkInstance();
                });
            });

            it('ClassModel.walkInstance() called with only one argument (instance).', async () => {
                let expectedErrorMessage = 'SingularRelationshipClass.walkInstance() called with insufficient arguments. Should be walkInstance(instance, relationship, <optional>filter).';

                await testForErrorAsync('ClassModel.walkInstance()', expectedErrorMessage, async () => {
                    return SingularRelationshipClass.walkInstance(instanceOfSingularRelationshipClassA);
                });
            });

            it('ClassModel.walkInstance() called with only one argument (instance).', async () => {
                let expectedErrorMessage = 'SingularRelationshipClass.walkInstance() called with an argument which is not an instance.';

                await testForErrorAsync('ClassModel.walkInstance()', expectedErrorMessage, async () => {
                    return SingularRelationshipClass.walkInstance({ this: 'that'}, 'some_relationship');
                });
            });

            it('ClassModel.walkInstance() called with first argument that is an instance of a different class model.', async () => {
                let expectedErrorMessage = 'SingularRelationshipClass.walkInstance(): First argument needs to be an instance of SingularRelationshipClass\'s classModel or one of its sub classes.';
                
                await testForErrorAsync('ClassModel.walkInstance()', expectedErrorMessage, async () => {
                    return SingularRelationshipClass.walkInstance(instanceOfNonSingularRelationshipClass, 'some_relationship');
                });
            });

            it('ClassModel.walkInstance() called with second argument that is not a String.', async () => {
                let expectedErrorMessage = 'SingularRelationshipClass.walkInstance(): Second argument needs to be a String.';
                
                await testForErrorAsync('ClassModel.walkInstance()', expectedErrorMessage, async () => {
                    return SingularRelationshipClass.walkInstance(instanceOfSingularRelationshipClassA, true);
                });
            });

            it('ClassModel.walkInstance() called with second argument that is not a field in the schema.', async () => {
                let expectedErrorMessage = 'SingularRelationshipClass.walkInstance(): Second argument needs to be a field in SingularRelationshipClass\'s schema.';
                
                await testForErrorAsync('ClassModel.walkInstance()', expectedErrorMessage, async () => {
                    return SingularRelationshipClass.walkInstance(instanceOfSingularRelationshipClassA, 'rabbit');
                });
            });

            it('ClassModel.walkInstance() called with second argument that is not a relationsihp in the schema. (boolean)', async () => {
                let expectedErrorMessage = 'SingularRelationshipClass.walkInstance(): field "boolean" is not a relationship.';
                
                await testForErrorAsync('ClassModel.walkInstance()', expectedErrorMessage, async () => {
                    return SingularRelationshipClass.walkInstance(instanceOfSingularRelationshipClassA, 'boolean');
                });
            });

            it('ClassModel.walkInstance() called with second argument that is not a relationsihp in the schema. (Array of Booleans)', async () => {
                let expectedErrorMessage = 'SingularRelationshipClass.walkInstance(): field "booleans" is not a relationship.';
                
                await testForErrorAsync('ClassModel.walkInstance()', expectedErrorMessage, async () => {
                    return SingularRelationshipClass.walkInstance(instanceOfSingularRelationshipClassA, 'booleans');
                });
            });

            it('ClassModel.walkInstance() called with third argument that is not an object.', async () => {
                let expectedErrorMessage = 'SingularRelationshipClass.walkInstance(): Third argument needs to be an object.';
                
                await testForErrorAsync('ClassModel.walkInstance()', expectedErrorMessage, async () => {
                    return SingularRelationshipClass.walkInstance(instanceOfSingularRelationshipClassA, 'singularRelationship', '{type: notAnObject}');
                });
            });

        });

        describe('Test walking the relationships.', () => {

            it('Walking a singular relationship.', async () => {
                const expectedInstance = instanceOfNonSingularRelationshipClass;
                const instance = await SingularRelationshipClass.walkInstance(instanceOfSingularRelationshipClassA, 'singularRelationship');

                if (!instance)
                    throw new Error('walkInstance() did not return anything.');

                if (!expectedInstance.equals(instance))
                    throw new Error('walkInstance() did not return the correct instance.');
            });

            it('Walking a nonsingular relationship.', async () => {
                const expectedInstanceSet = new InstanceSet(SingularRelationshipClass, [
                    instanceOfSingularRelationshipClassA,
                    instanceOfSingularRelationshipClassB
                ]);
                const instanceSet = await NonSingularRelationshipClass.walkInstance(instanceOfNonSingularRelationshipClass, 'nonSingularRelationship');

                if (!expectedInstanceSet.equals(instanceSet))
                    throw new Error('walkInstance() did not return the correct instances.');
            });

            it('Walking a singular relationship by calling walkInstance() from the super class.', async () => {
                const expectedInstance = instanceOfSubClassOfNonSingularRelationshipClass;
                const instance = await SingularRelationshipClass.walkInstance(instanceOfSubClassOfSingularRelationshipClassA, 'singularRelationship');

                if (!instance)
                    throw new Error('walkInstance() did not return anything.');

                if (!expectedInstance.equals(instance))
                    throw new Error('walkInstance() did not return the correct instance.');
            });

            it('Walking a nonsingular relationship by calling walkInstance() from the super class.', async () => {
                const expectedInstanceSet = new InstanceSet(SingularRelationshipClass, [
                    instanceOfSubClassOfSingularRelationshipClassA,
                    instanceOfSubClassOfSingularRelationshipClassB
                ]);
                const instanceSet = await NonSingularRelationshipClass.walkInstance(instanceOfSubClassOfNonSingularRelationshipClass, 'nonSingularRelationship');

                if (!expectedInstanceSet.equals(instanceSet))
                    throw new Error('walkInstance() did not return the correct instances.');
            });

            it('Walking a nonsingular relationship by calling walkInstance() from the super class with a filter.', async () => {
                const expectedInstanceSet = new InstanceSet(SingularRelationshipClass, [
                    instanceOfSubClassOfSingularRelationshipClassA,
                ]);
                const filter = { boolean: true };

                const instanceSet = await NonSingularRelationshipClass.walkInstance(instanceOfSubClassOfNonSingularRelationshipClass, 'nonSingularRelationship', filter);

                if (!expectedInstanceSet.equals(instanceSet))
                    throw new Error('walkInstance() did not return the correct instances.');
            });

        });

    });

    describe('ClassModel.walkInstanceSet()', () => {

        // Create instances for tests.
        {
            var instanceOfSingularRelationshipClassA = new Instance (SingularRelationshipClass);
            var instanceOfSingularRelationshipClassB = new Instance (SingularRelationshipClass);
            var instanceOfNonSingularRelationshipClass = new Instance (NonSingularRelationshipClass);
            var instanceOfSubClassOfSingularRelationshipClassA = new Instance (SubClassOfSingularRelationshipClass);
            var instanceOfSubClassOfSingularRelationshipClassB = new Instance (SubClassOfSingularRelationshipClass);
            var instanceOfSubClassOfNonSingularRelationshipClass = new Instance (SubClassOfNonSingularRelationshipClass);
    
            instanceOfSingularRelationshipClassA.singularRelationship = instanceOfNonSingularRelationshipClass._id;
            instanceOfSingularRelationshipClassA.boolean = true;
            instanceOfSingularRelationshipClassB.singularRelationship = instanceOfNonSingularRelationshipClass._id;
            instanceOfSingularRelationshipClassB.boolean = false;
            instanceOfNonSingularRelationshipClass.nonSingularRelationship = [instanceOfSingularRelationshipClassA._id, instanceOfSingularRelationshipClassB._id];
    
            instanceOfSubClassOfSingularRelationshipClassA.singularRelationship = instanceOfSubClassOfNonSingularRelationshipClass._id;
            instanceOfSubClassOfSingularRelationshipClassA.boolean = true;
            instanceOfSubClassOfSingularRelationshipClassB.singularRelationship = instanceOfSubClassOfNonSingularRelationshipClass._id;
            instanceOfSubClassOfSingularRelationshipClassB.boolean = false;
            instanceOfSubClassOfNonSingularRelationshipClass.nonSingularRelationship = [instanceOfSubClassOfSingularRelationshipClassA._id, instanceOfSubClassOfSingularRelationshipClassB._id];
        }

        before(async () => {
            await instanceOfSingularRelationshipClassA.save();
            await instanceOfSingularRelationshipClassB.save();
            await instanceOfNonSingularRelationshipClass.save();
            await instanceOfSubClassOfSingularRelationshipClassA.save();
            await instanceOfSubClassOfSingularRelationshipClassB.save();
            await instanceOfSubClassOfNonSingularRelationshipClass.save();
        });

        after(async () => {
            await SingularRelationshipClass.clear();
            await NonSingularRelationshipClass.clear();
            await SubClassOfSingularRelationshipClass.clear();
            await SubClassOfNonSingularRelationshipClass.clear();
        });

        describe('Tests for invalid arguments', () => {

            it('Relationship is required.', async () => {
                const instanceSet = new InstanceSet(SingularRelationshipClass);
                const expectedErrorMessage = 'InstanceSet.walk() called without no relationship.';

                await testForErrorAsync('ClassModel.walkInstanceSet()', expectedErrorMessage, async () => {
                    return SingularRelationshipClass.walkInstanceSet(instanceSet);
                });

            });

            it('Relationship must be a string.', async () => {
                const instanceSet = new InstanceSet(SingularRelationshipClass);
                const expectedErrorMessage = 'InstanceSet.walk() relationship argument must be a String.';

                await testForErrorAsync('ClassModel.walkInstanceSet()', expectedErrorMessage, async () => {
                    return SingularRelationshipClass.walkInstanceSet(instanceSet, {I: 'am not a string'});
                });

            });

            it('Relationship must be part of the ClassModel schema.', async () => {
                const instanceSet = new InstanceSet(SingularRelationshipClass);
                const expectedErrorMessage = 'InstanceSet.walk() called with an invalid relationship for ClassModel SingularRelationshipClass.';

                await testForErrorAsync('ClassModel.walkInstanceSet()', expectedErrorMessage, async () => {
                    return SingularRelationshipClass.walkInstanceSet(instanceSet, 'notPartOfTheSchema');
                });

            });

            it('Relationship cannot be an attribute.', async () => {
                const instanceSet = new InstanceSet(SingularRelationshipClass);
                const expectedErrorMessage = 'InstanceSet.walk() called with an invalid relationship for ClassModel SingularRelationshipClass.';

                await testForErrorAsync('ClassModel.walkInstanceSet()', expectedErrorMessage, async () => {
                    return SingularRelationshipClass.walkInstanceSet(instanceSet, 'boolean');
                });

            });

            it('Filter must be an object, if given.', async () => {
                const instanceSet = new InstanceSet(SingularRelationshipClass);
                const expectedErrorMessage = 'InstanceSet.walk() filter argument must be an object.';

                await testForErrorAsync('ClassModel.walkInstanceSet()', expectedErrorMessage, async () => {
                    return SingularRelationshipClass.walkInstanceSet(instanceSet, 'singularRelationship', 1);
                });

            });

        });

        describe('Walking Relationships', () => {

            describe('Walking Relationships on InstanceSets with Only One Instance', () => {

                it('Walking a singular relationship.', async () => {
                    const instanceSet = new InstanceSet(SingularRelationshipClass, [
                        instanceOfSingularRelationshipClassA
                    ]);
                    const expectedInstanceSet = new InstanceSet(NonSingularRelationshipClass, [
                        instanceOfNonSingularRelationshipClass
                    ]);
                    const returnedInstanceSet = await SingularRelationshipClass.walkInstanceSet(instanceSet, 'singularRelationship');
                    
                    if (!expectedInstanceSet.equals(returnedInstanceSet))
                        throw new Error('walkInstanceSet() did not return the correct InstanceSet.');
                });
    
                it('Walking a nonsingular relationship.', async () => {
                    const instanceSet = new InstanceSet(NonSingularRelationshipClass, [
                        instanceOfNonSingularRelationshipClass
                    ]);
                    const expectedInstanceSet = new InstanceSet(SingularRelationshipClass, [
                        instanceOfSingularRelationshipClassA,
                        instanceOfSingularRelationshipClassB
                    ]);
                    const returnedInstanceSet = await NonSingularRelationshipClass.walkInstanceSet(instanceSet, 'nonSingularRelationship');
    
                    if (!expectedInstanceSet.equals(returnedInstanceSet))
                        throw new Error('walkInstanceSet() did not return the correct InstanceSet.');
                });
    
                it('Walking a singular relationship by calling walkInstanceSet() from the super class.', async () => {
                    const instanceSet = new InstanceSet(SingularRelationshipClass, [
                        instanceOfSubClassOfSingularRelationshipClassA
                    ]);
                    const expectedInstanceSet = new InstanceSet(NonSingularRelationshipClass, [
                        instanceOfSubClassOfNonSingularRelationshipClass
                    ]);
                    const returnedInstanceSet = await SingularRelationshipClass.walkInstanceSet(instanceSet, 'singularRelationship');
    
                    if (!expectedInstanceSet.equals(returnedInstanceSet))
                        throw new Error('walkInstanceSet() did not return the correct InstanceSet.');
                });
    
                it('Walking a nonsingular relationship by calling walkInstanceSet() from the super class.', async () => {
                    const instanceSet = new InstanceSet(NonSingularRelationshipClass, [
                        instanceOfSubClassOfNonSingularRelationshipClass
                    ]);
                    const expectedInstanceSet = new InstanceSet(SingularRelationshipClass, [
                        instanceOfSubClassOfSingularRelationshipClassA,
                        instanceOfSubClassOfSingularRelationshipClassB
                    ]);
                    const returnedInstanceSet = await NonSingularRelationshipClass.walkInstanceSet(instanceSet, 'nonSingularRelationship');
    
                    if (!expectedInstanceSet.equals(returnedInstanceSet))
                        throw new Error('walkInstanceSet() did not return the correct InstanceSet.');
                });
    
                it('Walking a nonsingular relationship by calling walkInstanceSet() from the super class.', async () => {
                    const instanceSet = new InstanceSet(NonSingularRelationshipClass, [
                        instanceOfSubClassOfNonSingularRelationshipClass
                    ]);
                    const expectedInstanceSet = new InstanceSet(SingularRelationshipClass, [
                        instanceOfSubClassOfSingularRelationshipClassA
                    ]);
                    const filter = { boolean: true };
    
                    const returnedInstanceSet = await NonSingularRelationshipClass.walkInstanceSet(instanceSet, 'nonSingularRelationship', filter);
    
                    if (!expectedInstanceSet.equals(returnedInstanceSet))
                        throw new Error('walkInstanceSet() did not return the correct InstanceSet.');
                });

            });

            describe('Walking Relationships On InstanceSets with Multiple Instances', () => {
    
                it('Walking a singular relationship by calling walkInstanceSet() from the super class.', async () => {
                    const instanceSet = new InstanceSet(SingularRelationshipClass, [
                        instanceOfSingularRelationshipClassA,
                        instanceOfSingularRelationshipClassB,
                        instanceOfSubClassOfSingularRelationshipClassA,
                        instanceOfSubClassOfSingularRelationshipClassB
                    ]);
                    const expectedInstanceSet = new InstanceSet(NonSingularRelationshipClass, [
                        instanceOfNonSingularRelationshipClass,
                        instanceOfSubClassOfNonSingularRelationshipClass
                    ]);
                    const returnedInstanceSet = await SingularRelationshipClass.walkInstanceSet(instanceSet, 'singularRelationship');
    
                    if (!expectedInstanceSet.equals(returnedInstanceSet))
                        throw new Error('walkInstanceSet() did not return the correct InstanceSet.');
                });
    
                it('Walking a non singular relationship by calling walkInstanceSet() from the super class.', async () => {
                    const instanceSet = new InstanceSet(NonSingularRelationshipClass, [
                        instanceOfNonSingularRelationshipClass,
                        instanceOfSubClassOfNonSingularRelationshipClass
                    ]);
                    const expectedInstanceSet = new InstanceSet(SingularRelationshipClass, [
                        instanceOfSingularRelationshipClassA,
                        instanceOfSingularRelationshipClassB,
                        instanceOfSubClassOfSingularRelationshipClassA,
                        instanceOfSubClassOfSingularRelationshipClassB
                    ]);
                    const returnedInstanceSet = await NonSingularRelationshipClass.walkInstanceSet(instanceSet, 'nonSingularRelationship');
    
                    if (!expectedInstanceSet.equals(returnedInstanceSet))
                        throw new Error('walkInstanceSet() did not return the correct InstanceSet.');
                });
    
                it('Walking a non singular relationship by calling walkInstanceSet() from the super class with filtering.', async () => {
                    const instanceSet = new InstanceSet(NonSingularRelationshipClass, [
                        instanceOfNonSingularRelationshipClass,
                        instanceOfSubClassOfNonSingularRelationshipClass
                    ]);
                    const expectedInstanceSet = new InstanceSet(SingularRelationshipClass, [
                        instanceOfSingularRelationshipClassA,
                        instanceOfSubClassOfSingularRelationshipClassA,
                    ]);
                    const filter = { boolean: true };

                    const returnedInstanceSet = await NonSingularRelationshipClass.walkInstanceSet(instanceSet, 'nonSingularRelationship', filter);
    
                    if (!expectedInstanceSet.equals(returnedInstanceSet))
                        throw new Error('walkInstanceSet() did not return the correct InstanceSet.');
                });

            });

        });

    });

    describe('ClassModel.accessControlFilterInstance()', () => {

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
        });

        describe('Tests for invalid arguments.', () => {

            it('First argument must be an InstanceSet.', async () => {
                let expectedErrorMessage = 'Incorrect parameters. ' + AccessControlledSuperClass.className + '.accessControlFilterInstance(InstanceSet instanceSet, ...accessControlMethodParameters)';
                await testForErrorAsync('ClassModel.accessControlFilterInstance()', expectedErrorMessage, async () => {
                    return AccessControlledSuperClass.accessControlFilterInstance();
                })
            });

            it('First argument must be an InstanceSet.', async () => {
                let expectedErrorMessage = 'Incorrect parameters. ' + AccessControlledSuperClass.className + '.accessControlFilterInstance(InstanceSet instanceSet, ...accessControlMethodParameters)';
                await testForErrorAsync('ClassModel.accessControlFilterInstance()', expectedErrorMessage, async () => {
                    return AccessControlledSuperClass.accessControlFilterInstance({ some: 'object' });
                })
            });

        });

        describe('Test filtering out instances that don\'t pass access control check.', () => {

            describe('AccessControlledSuperClass.accessControlFilterInstance()', () => {

                it('Access Control Filter called on Class with only direct instances of Class.', async () => {
                    const classModel = AccessControlledSuperClass;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSuperClassFailsRelationship
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledSuperClassPasses
                    ]);

                    const filteredInstanceSet = await classModel.accessControlFilterInstance(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilterInstance() did not return the expected InstanceSet.');
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

                    const filteredInstanceSet = await classModel.accessControlFilterInstance(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilterInstance() did not return the expected InstanceSet.');
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

                    const filteredInstanceSet = await classModel.accessControlFilterInstance(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilterInstance() did not return the expected InstanceSet.');
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

                    const filteredInstanceSet = await classModel.accessControlFilterInstance(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilterInstance() did not return the expected InstanceSet.');
                });

            });

            describe('AccessControlledSubClassOfAccessControlledSuperClass.accessControlFilterInstance()', () => {

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

                    const filteredInstanceSet = await classModel.accessControlFilterInstance(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilterInstance() did not return the expected InstanceSet.');
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

                    const filteredInstanceSet = await classModel.accessControlFilterInstance(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilterInstance() did not return the expected InstanceSet.');
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

                    const filteredInstanceSet = await classModel.accessControlFilterInstance(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilterInstance() did not return the expected InstanceSet.');
                });

            });

            describe('AccessControlledDiscriminatedSuperClass.accessControlFilterInstance()', () => {

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

                    const filteredInstanceSet = await classModel.accessControlFilterInstance(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilterInstance() did not return the expected InstanceSet.');
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

                    const filteredInstanceSet = await classModel.accessControlFilterInstance(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilterInstance() did not return the expected InstanceSet.');
                });

            });

            describe('AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass.accessControlFilterInstance()', () => {

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

                    const filteredInstanceSet = await classModel.accessControlFilterInstance(instanceSet);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilterInstance() did not return the expected InstanceSet.');
                });

            });

            describe('AccessControlledClassAccessControlledByParameters.accessControlFilterInstance()', () => {

                it('Instance passes access control check', async () => {
                    const classModel = AccessControlledClassAccessControlledByParameters;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledClassAccessControlledByParameters,
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledClassAccessControlledByParameters
                    ]);
                    const parameters = [1, 1, true];

                    const filteredInstanceSet = await classModel.accessControlFilterInstance(instanceSet, ...parameters);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilterInstance() did not return the expected InstanceSet.');
                });

                it('Instance fails access control check because of Numbers.', async () => {
                    const classModel = AccessControlledClassAccessControlledByParameters;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledClassAccessControlledByParameters,
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel);
                    const parameters = [-2, 1, true];

                    const filteredInstanceSet = await classModel.accessControlFilterInstance(instanceSet, ...parameters);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilterInstance() did not return the expected InstanceSet.');
                });

                it('Instance fails access control check because of Boolean.', async () => {
                    const classModel = AccessControlledClassAccessControlledByParameters;
                    const instanceSet = new InstanceSet(classModel, [
                        instanceOfAccessControlledClassAccessControlledByParameters,
                    ]);
                    const expectedInstanceSet = new InstanceSet(classModel);
                    const parameters = [1, 1, false];

                    const filteredInstanceSet = await classModel.accessControlFilterInstance(instanceSet, ...parameters);
                    
                    if (!expectedInstanceSet.equals(filteredInstanceSet))
                        throw new Error('classModel.accessControlFilterInstance() did not return the expected InstanceSet.');
                });

            });

        });

        describe('Test find methods for access filtering.', () => {

            describe('Test findInstanceById() with access filtering', () => {

                it('Call findInstanceById() on an instance of an access controlled class. Instance passes filter.', async () => {
                    const classToCallFindByIdOn = AccessControlledSuperClass;
                    const instanceToFind = instanceOfAccessControlledSuperClassPasses;
                    const instanceFound = await classToCallFindByIdOn.findInstanceById(instanceToFind._id);

                    if (!instanceFound)
                        throw new Error('findInstanceById() did not return an instance.');

                    if (!instanceFound._id.equals(instanceToFind._id))
                        throw new Error(
                            'An instance was returned, but it is not the correct one.\n' +
                            'Expected: \n' + instanceToFind + '\n' +
                            'Actual: \n' + instanceFound
                        );
                });

                it('Call findInstanceById() on an instance of an access controlled class, from super class. Instance passes filter.', async () => {
                    const classToCallFindByIdOn = AccessControlledSuperClass;
                    const instanceToFind = instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses;
                    const instanceFound = await classToCallFindByIdOn.findInstanceById(instanceToFind._id);

                    if (!instanceFound)
                        throw new Error('findInstanceById() did not return an instance.');

                    if (!instanceFound._id.equals(instanceToFind._id))
                        throw new Error(
                            'An instance was returned, but it is not the correct one.\n' +
                            'Expected: \n' + instanceToFind + '\n' +
                            'Actual: \n' + instanceFound
                        );

                });

                it('Call findInstanceById() on an instance of an access controlled class. Instance does not pass filter.', async () => {
                    const classToCallFindByIdOn = AccessControlledSuperClass;
                    const instanceToFind = instanceOfAccessControlledSuperClassFailsRelationship;
                    const instanceFound = await classToCallFindByIdOn.findInstanceById(instanceToFind._id);

                    if (instanceFound)
                        throw new Error('findInstanceById() returned an instance.');
                });

                it('Call findInstanceById() on an instance of an access controlled class, from super class. Instance does not pass filter based on super access control method.', async () => {
                    const classToCallFindByIdOn = AccessControlledSuperClass;
                    const instanceToFind = instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship;
                    const instanceFound = await classToCallFindByIdOn.findInstanceById(instanceToFind._id);

                    if (instanceFound)
                        throw new Error('findInstanceById() returned an instance.');

                });

                it('Call findInstanceById() on an instance of an access controlled class, from super class. Instance does not pass filter based on it\'s own access control method.', async () => {
                    const classToCallFindByIdOn = AccessControlledSuperClass;
                    const instanceToFind = instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean;
                    const instanceFound = await classToCallFindByIdOn.findInstanceById(instanceToFind._id);

                    if (instanceFound)
                        throw new Error('findInstanceById() returned an instance.');

                });

            });

            describe('Test findOneInstance() with access filtering', () => {

                it('Call findOneInstance() on an instance of an access controlled class. instance passes filter.', async () => {
                    const classToCallFindByIdOn = AccessControlledSuperClass;
                    const instanceToFind = instanceOfAccessControlledSuperClassPasses;

                    const filter = {
                        name: 'instanceOfAccessControlledSuperClassPasses'
                    }

                    const instanceFound = await classToCallFindByIdOn.findOneInstance(filter);

                    if (!instanceFound)
                        throw new Error('findOneInstance() did not return an instance.');

                    if (!instanceFound._id.equals(instanceToFind._id))
                        throw new Error(
                            'An instance was returned, but it is not the correct one.\n' +
                            'Expected: \n' + instanceToFind + '\n' +
                            'Actual: \n' + instanceFound
                        );
                });

                it('Call findOneInstance() on an instance of an access controlled class, from super class. Instance passes filter.', async () => {
                    const classToCallFindByIdOn = AccessControlledSuperClass;
                    const instanceToFind = instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses;

                    const filter = {
                        name: 'instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses'
                    }

                    const instanceFound = await classToCallFindByIdOn.findOneInstance(filter);

                    if (!instanceFound)
                        throw new Error('findOneInstance() did not return an instance.');

                    if (!instanceFound._id.equals(instanceToFind._id))
                        throw new Error(
                            'An instance was returned, but it is not the correct one.\n' +
                            'Expected: \n' + instanceToFind + '\n' +
                            'Actual: \n' + instanceFound
                        );
                });

                it('Call findOneInstance() on an instance of an access controlled class. Instance does not pass filter.', async () => {
                    const classToCallFindByIdOn = AccessControlledSuperClass;

                    const filter = {
                        name: 'instanceOfAccessControlledSuperClassFailsRelationship'
                    }

                    const instanceFound = await classToCallFindByIdOn.findOneInstance(filter);

                    if (instanceFound)
                        throw new Error('findOneInstance() returned an instance');

                });

                it('Call findOneInstance() on an instance of an access controlled class, from super class. Instance does not pass filter based on super access control method.', async () => {
                    const classToCallFindByIdOn = AccessControlledSuperClass;

                    const filter = {
                        name: 'instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship'
                    }

                    const instanceFound = await classToCallFindByIdOn.findOneInstance(filter);

                    if (instanceFound)
                        throw new Error('findOneInstance() returned an instance');

                });

                it('Call findOneInstance() on an instance of an access controlled class, from super class. Instance does not pass filter based on it\'s own access control method.', async () => {
                    const classToCallFindByIdOn = AccessControlledSuperClass;

                    const filter = {
                        name: 'instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean'
                    }

                    const instanceFound = await classToCallFindByIdOn.findOneInstance(filter);

                    if (instanceFound)
                        throw new Error('findOneInstance() returned an instance');

                });

            });

            describe('Test findInstanceSet() with access filtering', () => {

                it('Call findInstanceSet() on access controlled super class with a passing and not passing instance of each sub class.', async () => {
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

                    const instancesFound = await AccessControlledSuperClass.findInstanceSet({name: {$in: instanceNames}});

                    if (!expectedInstances.equals(instancesFound)) 
                        throw new Error('findInstanceSet did not filter instances correctly.')

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
                const expectedErrorMessage = 'Incorrect parameters. ' + UpdateControlledSuperClass.className + '.updateControlCheckInstanceSet(InstanceSet instanceSet, ...updateControlMethodParameters)';
                const instanceSet = new InstanceSet(UpdateControlledSuperClass, [instanceOfUpdateControlledSuperClassPasses, instanceOfUpdateControlledSuperClassPasses]);

                try {
                    updatable = await UpdateControlledSuperClass.updateControlCheckInstanceSet(instanceOfUpdateControlledSuperClassPasses);
                }
                catch (error) {
                    if (error.message != expectedErrorMessage) {
                        throw  new Error(
                            'updateControlCheckInstanceSet() threw an unexpected error.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' + 
                            'Actual:   ' + error.message
                        );
                    }
                }

                if (updatable)
                    throw new Error ('ClassModel.updateControlCheckInstanceSet() returned when it should have thrown an error.');
            });

        });

        describe('Test Update Control Check throws error when an instance doesn\'t pass check.', () => {

            describe('UpdateControlledSuperClass.updateControlCheckInstanceSet()', () => {

                it('Update Control Check called on Class with only direct instances of Class.', async () => {
                    const instanceSet = new InstanceSet(UpdateControlledSuperClass, [
                        instanceOfUpdateControlledSuperClassPasses,
                        instanceOfUpdateControlledSuperClassFailsRelationship
                    ]);
                    const instancesExpectedToFail = new InstanceSet(UpdateControlledSuperClass, [instanceOfUpdateControlledSuperClassFailsRelationship]);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + instancesExpectedToFail.getInstanceIds();

                    await testForErrorAsync('ClassModel.updateControlCheckInstanceSet', expectedErrorMessage, async () => {
                        return  UpdateControlledSuperClass.updateControlCheckInstanceSet(instanceSet);
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

                    await testForErrorAsync('ClassModel.updateControlCheckInstanceSet', expectedErrorMessage, async () => {
                        return  UpdateControlledSuperClass.updateControlCheckInstanceSet(instanceSet);
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

                    await testForErrorAsync('ClassModel.updateControlCheckInstanceSet', expectedErrorMessage, async () => {
                        return  UpdateControlledSuperClass.updateControlCheckInstanceSet(instanceSet);
                    });
                });

            });

            describe('UpdateControlledSubClassOfUpdateControlledSuperClass.updateControlCheckInstanceSet()', () => {

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

                    await testForErrorAsync('ClassModel.updateControlCheckInstanceSet', expectedErrorMessage, async () => {
                        return  UpdateControlledSubClassOfUpdateControlledSuperClass.updateControlCheckInstanceSet(instanceSet);
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

                    await testForErrorAsync('ClassModel.updateControlCheckInstanceSet', expectedErrorMessage, async () => {
                        return  UpdateControlledSubClassOfUpdateControlledSuperClass.updateControlCheckInstanceSet(instanceSet);
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

                    await testForErrorAsync('ClassModel.updateControlCheckInstanceSet', expectedErrorMessage, async () => {
                        return  UpdateControlledSubClassOfUpdateControlledSuperClass.updateControlCheckInstanceSet(instanceSet);
                    });
                });

            });

            describe('UpdateControlledDiscriminatedSuperClass.updateControlCheckInstanceSet()', () => {

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

                    await testForErrorAsync('ClassModel.updateControlCheckInstanceSet', expectedErrorMessage, async () => {
                        return  UpdateControlledDiscriminatedSuperClass.updateControlCheckInstanceSet(instanceSet);
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

                    await testForErrorAsync('ClassModel.updateControlCheckInstanceSet', expectedErrorMessage, async () => {
                        return  UpdateControlledDiscriminatedSuperClass.updateControlCheckInstanceSet(instanceSet);
                    });
                });

            });

            describe('UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass.updateControlCheckInstanceSet()', () => {

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

                    await testForErrorAsync('ClassModel.updateControlCheckInstanceSet', expectedErrorMessage, async () => {
                        return  UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass.updateControlCheckInstanceSet(instanceSet);
                    });
                });

            });

            describe('UpdateControlledClassUpdateControlledByParameters.updateControlCheckInstanceSet()', () => {

                it('Update Control Check passes', async () => {
                    const instanceSet = new InstanceSet(UpdateControlledClassUpdateControlledByParameters, [instanceOfUpdateControlledClassUpdateControlledByParameters]);
                    const updateAllowed = await UpdateControlledClassUpdateControlledByParameters.updateControlCheckInstanceSet(instanceSet, 1, 1, true);
                    
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

                    await testForErrorAsync('ClassModel.updateControlCheckInstanceSet', expectedErrorMessage, async () => {
                        return  UpdateControlledClassUpdateControlledByParameters.updateControlCheckInstanceSet(instanceSet, -2, 1, true);
                    });
                });

                it('Instance fails update control check because of Boolean.', async () => {
                    const instanceSet = new InstanceSet(UpdateControlledClassUpdateControlledByParameters, [
                        instanceOfUpdateControlledClassUpdateControlledByParameters,
                    ]);
                    const instancesExpectedToFail = new InstanceSet(UpdateControlledClassUpdateControlledByParameters, [instanceOfUpdateControlledClassUpdateControlledByParameters]);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + instancesExpectedToFail.getInstanceIds();

                    await testForErrorAsync('ClassModel.updateControlCheckInstanceSet', expectedErrorMessage, async () => {
                        return  UpdateControlledClassUpdateControlledByParameters.updateControlCheckInstanceSet(instanceSet, 1, 1, false);
                    });
                });

            });

        });

    });

});

