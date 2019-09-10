require("@babel/polyfill");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassModel = require('../dist/models/ClassModel');
const SuperSet = require('../dist/models/SuperSet');
const database = require('../dist/models/database');
const TestClassModels = require('./TestClassModels');

// Load all TestClassModels 
{
    var CompareClass1 = TestClassModels.CompareClass1;
    var CompareClass2 = TestClassModels.CompareClass2;
    var AllFieldsRequiredClass = TestClassModels.AllFieldsRequiredClass;
    var AllFieldsMutexClass = TestClassModels.AllFieldsMutexClass;
    var AllFieldsInRequiredGroupClass = TestClassModels.AllFieldsInRequiredGroupClass;
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
    var SingularRelationshipClass = TestClassModels.SingularRelationshipClass;
    var NonSingularRelationshipClass = TestClassModels.NonSingularRelationshipClass;
    var SubClassOfSingularRelationshipClass = TestClassModels.SubClassOfSingularRelationshipClass;
    var SubClassOfNonSingularRelationshipClass = TestClassModels.SubClassOfNonSingularRelationshipClass;
    var AccessControlledSuperClass = TestClassModels.AccessControlledSuperClass;
    var AccessControlledSubClassOfAccessControlledSuperClass = TestClassModels.AccessControlledSubClassOfAccessControlledSuperClass;
    var AccessControlledDiscriminatedSuperClass = TestClassModels.AccessControlledDiscriminatedSuperClass;
    var AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass = TestClassModels.AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass;
    var ClassControlsAccessControlledSuperClass = TestClassModels.ClassControlsAccessControlledSuperClass;
    var AccessControlledClassAccessControlledByParameters = TestClassModels.AccessControlledClassAccessControlledByParameters;
    var UpdateControlledSuperClass = TestClassModels.UpdateControlledSuperClass;
    var UpdateControlledSubClassOfUpdateControlledSuperClass = TestClassModels.UpdateControlledSubClassOfUpdateControlledSuperClass;
    var UpdateControlledDiscriminatedSuperClass = TestClassModels.UpdateControlledDiscriminatedSuperClass;
    var UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass = TestClassModels.UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass;
    var ClassControlsUpdateControlledSuperClass = TestClassModels.ClassControlsUpdateControlledSuperClass;
    var UpdateControlledClassUpdateControlledByParameters = TestClassModels.UpdateControlledClassUpdateControlledByParameters;
}

describe('Class Model Tests', function() {

    before(async () => {
        await database.connect();
    });

    describe('Class Model Constructor', function() {

        describe('Required constructor parameters', () => {

            it('ClassName is required.', function() {
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
    
            it('Schema is required.', function() {
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

            it('If superClasses is set, it must be an Array.', function() {
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
    
            it('If superClasses is set, it cannot be an empty Array.', function() {
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
    
            it('If discriminatorSuperClass is set, it can only be a single class.', function() {
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
    
            it('A ClassModel cannot have both superClasses and discriminatorSuperClass.', function() {
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
    
            it('A ClassModel cannot have both superClasses and discriminatorSuperClass.', function() {
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
    
            it('If a class is used as a discriminatedSuperClass, that class must have its "discriminated" field set to true.', function() {
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
    
            it('If a class is set as a superClass, that class cannot have its "discriminated" field set to true.', function() {
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
    
            it('A discriminator sub class cannot be abstract.', function() {
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
    
            it('A sub class of a discriminated super class cannot be discriminated.', function() {
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
    
            it('Sub class schema cannot contain the same field names as a super class schema.', function() {
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
    
            it('If a sub class is created, it is pushed to the super class\'s "subClasses" array.', function() {
    
                if (SuperClass.subClasses.length == 0)
                    throw new Error('SuperClass.subClasses array has no entries in it.');
                if (!SuperClass.subClasses.includes(SubClassOfSuperClass)) 
                    throw new Error('SuperClass.subClasses does not contain sub class.');
    
                return true;
            });
    
            it('A subclass schema is the combination of its direct schema with the schema of a super class.', function() {
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
    
            it('A subclass schema is the combination of its direct schema with the schema the whole chane of Super Classes.', function() {
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
    
            it('A subclass schema is the combination of its direct schema with the schema of each of its super classes.', function() {
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
    
            it('A class cannot be a sub class of a sub class of a discriminated class.', function() {
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
    
            it('An abstract, non-discriminated class should have no Model.', function() {
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

            it('Constructor excepts and sets parameters.', function() {
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

    describe('ClassModel.create()', function() {

        it('You cannot created an instance of an abstract class.', function() {
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

        it('You cannot created an instance of an abstract discriminated class.', function() {
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

    describe('ClassModel.compare()', function() {

        it('ClassModel.compare() returns true if instances are the same instance.', function() {
            var instance1 = CompareClass1.create();
            var compareResult;

            instance1.name = " Name 1";
            instance1.class2 = CompareClass2.create()._id;

            compareResult = CompareClass1.compare(instance1, instance1);

            if (compareResult.match == false) {
                throw new Error('ClassModel.compare should have returned true.')
            }
        });

        it('ClassModel.compare() returns true if both instances are null.', function() {
            var compareResult = CompareClass1.compare(null, null);

            if (compareResult.match == false) {
                throw new Error('ClassModel.compare should have returned true.')
            }

            if (compareResult.message != 'Both instances are null.') {
                throw new Error('ClassModel.compare should have returned the message "Both instances are null.". but it returned: ' + compareResult.message);
            }
        });

        it('ClassModel.compare() returns false if first instance is null.', function() {
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

        it('ClassModel.compare() returns false if second instance is null.', function() {
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

        it('ClassModel.compare() returns true if all fields are the same.', function() {
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

        it('ClassModel.compare() returns false if an attribute is different.', function() {
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

        it('ClassModel.compare() returns false if an attribute in an array is different.', function() {
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

        it('ClassModel.compare() returns false if singular relationship is different.', function() {
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

        it('ClassModel.compare() returns false one of the singular relationships is empty.', function() {
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

        it('ClassModel.compare() returns false if one instance in a non-singular relationship is different.', function() {
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

        it('ClassModel.compare() returns false if all instances in a non-singular relationship is different.', function() {
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

        it('ClassModel.compare() returns false if non-singular relationship is different (one not set).', function() {
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

        it('ClassModel.compare() returns false if non-singular relationship have different lengths.', function() {
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

    describe('ClassModel.validate()', function() {

        describe('Required Validation', function() {

            it('All fields are required. All are set. No error thrown.', function() {
                let instance = AllFieldsRequiredClass.create();

                instance.string = 'String';
                instance.strings = ['String'];
                instance.date = new Date();
                instance.boolean = true;
                instance.booleans = [true];
                instance.number = 1;
                instance.numbers = [1];
                instance.class1 = CompareClass1.create()._id;
                instance.class2s = [CompareClass2.create()._id];

                try {
                    AllFieldsRequiredClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;

            });
                
            it('All fields are required. All but string are set. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: string: Path `string` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.strings = ['String'];
                instance.date = new Date();
                instance.boolean = true;
                instance.booleans = [true];
                instance.number = 1;
                instance.numbers = [1];
                instance.class1 = CompareClass1.create()._id;
                instance.class2s = [CompareClass2.create()._id];
    
                try {
                    AllFieldsRequiredClass.validate(instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }
    
                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
                
            it('All fields are required. All are set, but string is set to empty string. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: string: Path `string` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.string = '';
                instance.strings = ['String'];
                instance.date = new Date();
                instance.boolean = true;
                instance.booleans = [true];
                instance.number = 1;
                instance.numbers = [1];
                instance.class1 = CompareClass1.create()._id;
                instance.class2s = [CompareClass2.create()._id];
    
                try {
                    AllFieldsRequiredClass.validate(instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }
    
                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
                
            it('All fields are required. All but strings are set. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: strings: Path `strings` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.string = 'String';
                instance.date = new Date();
                instance.boolean = true;
                instance.booleans = [true];
                instance.number = 1;
                instance.numbers = [1];
                instance.class1 = CompareClass1.create()._id;
                instance.class2s = [CompareClass2.create()._id];

    
                try {
                    AllFieldsRequiredClass.validate(instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }
    
                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
                
            it('All fields are required. All but date are set. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: date: Path `date` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.string = 'String';
                instance.strings = ['String'];
                instance.boolean = true;
                instance.booleans = [true];
                instance.number = 1;
                instance.numbers = [1];
                instance.class1 = CompareClass1.create()._id;
                instance.class2s = [CompareClass2.create()._id];

    
                try {
                    AllFieldsRequiredClass.validate(instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }
    
                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
                
            it('All fields are required. All but boolean are set. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: boolean: Path `boolean` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.string = 'String';
                instance.strings = ['String'];
                instance.date = new Date();
                instance.booleans = [true];
                instance.number = 1;
                instance.numbers = [1];
                instance.class1 = CompareClass1.create()._id;
                instance.class2s = [CompareClass2.create()._id];

    
                try {
                    AllFieldsRequiredClass.validate(instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }
    
                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
                
            it('All fields are required. All are set, but boolean is set to false. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: boolean: Path `boolean` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.string = 'String';
                instance.strings = ['String'];
                instance.date = new Date();
                instance.boolean = false;
                instance.booleans = [true];
                instance.number = 1;
                instance.numbers = [1];
                instance.class1 = CompareClass1.create()._id;
                instance.class2s = [CompareClass2.create()._id];

    
                try {
                    AllFieldsRequiredClass.validate(instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }
    
                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
                
            it('All fields are required. All but booleans are set. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: booleans: Path `booleans` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.string = 'String';
                instance.strings = ['String'];
                instance.date = new Date();
                instance.boolean = true;
                instance.number = 1;
                instance.numbers = [1];
                instance.class1 = CompareClass1.create()._id;
                instance.class2s = [CompareClass2.create()._id];

    
                try {
                    AllFieldsRequiredClass.validate(instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }
    
                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
                
            it('All fields are required. All but number are set. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: number: Path `number` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.string = 'String';
                instance.strings = ['String'];
                instance.date = new Date();
                instance.boolean = true;
                instance.booleans = [true];
                instance.numbers = [1];
                instance.class1 = CompareClass1.create()._id;
                instance.class2s = [CompareClass2.create()._id];

    
                try {
                    AllFieldsRequiredClass.validate(instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }
    
                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
                
            it('All fields are required. All but numbers are set. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: numbers: Path `numbers` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.string = 'String';
                instance.strings = ['String'];
                instance.date = new Date();
                instance.boolean = true;
                instance.booleans = [true];
                instance.number = 1;
                instance.class1 = CompareClass1.create()._id;
                instance.class2s = [CompareClass2.create()._id];

    
                try {
                    AllFieldsRequiredClass.validate(instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }
    
                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
                
            it('All fields are required. All but class1 are set. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: class1: Path `class1` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.string = 'String';
                instance.strings = ['String'];
                instance.date = new Date();
                instance.boolean = true;
                instance.booleans = [true];
                instance.number = 1;
                instance.numbers = [1];
                instance.class2s = [CompareClass2.create()._id];

    
                try {
                    AllFieldsRequiredClass.validate(instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }
    
                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
                
            it('All fields are required. All but class2s are set. Error thrown.', function() {
                let expectedErrorMessage = 'AllFieldsRequiredClass validation failed: class2s: Path `class2s` is required.';
                let instance = AllFieldsRequiredClass.create();

                instance.string = 'String';
                instance.strings = ['String'];
                instance.date = new Date();
                instance.boolean = true;
                instance.booleans = [true];
                instance.number = 1;
                instance.numbers = [1];
                instance.class1 = CompareClass1.create()._id;

    
                try {
                    AllFieldsRequiredClass.validate(instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }
    
                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });

        });

        describe('Required Group Validation', function() {
                
            it('multiple fields (one of each type) share a required group no fields are set. Error thrown.', function() {
                let expectedErrorMessage = 'Required Group violations found for requirement group(s):  a';
            
                let instance = AllFieldsInRequiredGroupClass.create();
    
                try {
                    AllFieldsInRequiredGroupClass.validate(instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }
    
                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
                
            it('multiple fields (one of each type) share a required group boolean is set to false. Error thrown.', function() {
                let expectedErrorMessage = 'Required Group violations found for requirement group(s):  a';
            
                let instance = AllFieldsInRequiredGroupClass.create();

                instance.boolean = false;
    
                try {
                    AllFieldsInRequiredGroupClass.validate(instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }
    
                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
                
            it('multiple fields (one of each type) share a required group string is set to "". Error thrown.', function() {
                let expectedErrorMessage = 'Required Group violations found for requirement group(s):  a';
            
                let instance = AllFieldsInRequiredGroupClass.create();
    
                instance.string = '';

                try {
                    AllFieldsInRequiredGroupClass.validate(instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }
    
                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
                
            it('multiple fields (one of each type) share a required group class2s is set to empty array. Error thrown.', function() {
                let expectedErrorMessage = 'Required Group violations found for requirement group(s):  a';
            
                let instance = AllFieldsInRequiredGroupClass.create();

                instance.class2s = [];
    
                try {
                    AllFieldsInRequiredGroupClass.validate(instance);
                }
                catch (validationError) {
                    if (validationError.message == expectedErrorMessage) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }
    
                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
            
            it('multiple fields (one of each type) share a required group and string is set. No error thrown.', function() {

                let instance = AllFieldsInRequiredGroupClass.create();

                instance.string = 'String';

                try {
                    AllFieldsInRequiredGroupClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) share a required group and strings is set. No error thrown.', function() {

                let instance = AllFieldsInRequiredGroupClass.create();

                instance.strings = ['String'];

                try {
                    AllFieldsInRequiredGroupClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) share a required group and boolean is set. No error thrown.', function() {

                let instance = AllFieldsInRequiredGroupClass.create();

                instance.boolean = true;

                try {
                    AllFieldsInRequiredGroupClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) share a required group and booleans is set. No error thrown.', function() {

                let instance = AllFieldsInRequiredGroupClass.create();

                instance.booleans = [true];

                try {
                    AllFieldsInRequiredGroupClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) share a required group and date is set. No error thrown.', function() {

                let instance = AllFieldsInRequiredGroupClass.create();

                instance.date = new Date();

                try {
                    AllFieldsInRequiredGroupClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) share a required group and number is set. No error thrown.', function() {

                let instance = AllFieldsInRequiredGroupClass.create();

                instance.number = 1;

                try {
                    AllFieldsInRequiredGroupClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) share a required group and number is set to 0. No error thrown.', function() {

                let instance = AllFieldsInRequiredGroupClass.create();

                instance.number = 0;

                try {
                    AllFieldsInRequiredGroupClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) share a required group and numbers is set. No error thrown.', function() {

                let instance = AllFieldsInRequiredGroupClass.create();

                instance.numbers = [1];

                try {
                    AllFieldsInRequiredGroupClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) share a required group and class1 is set. No error thrown.', function() {

                let instance = AllFieldsInRequiredGroupClass.create();

                instance.class1 = CompareClass1.create()._id;

                try {
                    AllFieldsInRequiredGroupClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) share a required group and class2s is set. No error thrown.', function() {

                let instance = AllFieldsInRequiredGroupClass.create();

                instance.class2s = [CompareClass2.create()._id];

                try {
                    AllFieldsInRequiredGroupClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });


        });

        describe('Mutex Validation', function() {
            
            it('2 attribute fields (boolean, date) have a mutex and both are set. Error thrown.', function() {
                let expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field boolean with mutex \'a\'. Field date with mutex \'a\'.';
                let expectedErrorMutex = /^Mutex violations found for instance .* Field boolean with mutex \'a\'. Field date with mutex \'a\'.$/;
                
                let schema = {
                    boolean: {
                        type: Boolean,
                        mutex: 'a'
                    },
                    date: {
                        type: Date,
                        mutex: 'a'
                    }
                };

                let MutexClassA = new ClassModel({
                    accessControlled: false,
                    updateControlled: false,
                    className: 'MutexClassA', 
                    schema: schema
                });

                let instance = MutexClassA.create();

                instance.boolean = true;
                instance.date = new Date();

                try {
                    MutexClassA.validate(instance);
                }
                catch (validationError) {
                    if (expectedErrorMutex.test(validationError.message)) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }

                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
            
            it('2 attribute fields (boolean, date) have a mutex and one (boolean) is set. No error thrown.', function() {
                let schema = {
                    boolean: {
                        type: Boolean,
                        mutex: 'a'
                    },
                    date: {
                        type: Date,
                        mutex: 'a'
                    }
                };

                let MutexClassAA = new ClassModel({
                    accessControlled: false,
                    updateControlled: false,
                    className: 'MutexClassAA', 
                    schema: schema
                });

                let instance = MutexClassAA.create();

                instance.boolean = true;

                try {
                    MutexClassAA.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }
                
                return true;
            });
            
            it('2 singular relationship fields have a mutex and both are set. Error thrown.', function() {
                let expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field class1 with mutex \'a\'. Field class2 with mutex \'a\'.';
                let expectedErrorMutex = /^Mutex violations found for instance .* Field class1 with mutex \'a\'. Field class2 with mutex \'a\'.$/;
            
                let schema = {
                    class1: {
                        type: Schema.Types.ObjectId,
                        ref: 'CompareClass1',
                        mutex: 'a'
                    },
                    class2: {
                        type: Schema.Types.ObjectId,
                        ref: 'CompareClass2',
                        mutex: 'a'
                    }
                };

                let MutexClassB = new ClassModel({
                    accessControlled: false,
                    updateControlled: false,
                    className: 'MutexClassB', 
                    schema: schema
                });

                let instance = MutexClassB.create();

                instance.class1 = CompareClass1.create()._id;
                instance.class2 = CompareClass2.create()._id;

                try {
                    MutexClassB.validate(instance);
                }
                catch (validationError) {
                    if (expectedErrorMutex.test(validationError.message)) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }

                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
            
            it('2 singular relationship fields have a mutex and one is set. No error thrown.', function() {
                let schema = {
                    class1: {
                        type: Schema.Types.ObjectId,
                        ref: 'CompareClass1',
                        mutex: 'a'
                    },
                    class2: {
                        type: Schema.Types.ObjectId,
                        ref: 'CompareClass2',
                        mutex: 'a'
                    }
                };

                let MutexClassBB = new ClassModel({
                    accessControlled: false,
                    updateControlled: false,
                    className: 'MutexClassBB', 
                    schema: schema
                });

                let instance = MutexClassBB.create();

                instance.class1 = CompareClass1.create()._id;

                try {
                    MutexClassBB.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('2 non-singular relationship fields have a mutex and both are set. Error thrown.', function() {
                let expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field class1s with mutex \'a\'. Field class2s with mutex \'a\'.';
                let expectedErrorMutex = /^Mutex violations found for instance .* Field class1s with mutex \'a\'. Field class2s with mutex \'a\'.$/;
            
                let schema = {
                    class1s: {
                        type: [Schema.Types.ObjectId],
                        ref: 'CompareClass1',
                        mutex: 'a'
                    },
                    class2s: {
                        type: [Schema.Types.ObjectId],
                        ref: 'CompareClass2',
                        mutex: 'a'
                    }
                };

                let MutexClassC = new ClassModel({
                    accessControlled: false,
                    updateControlled: false,
                    className: 'MutexClassC', 
                    schema: schema
                });

                let instance = MutexClassC.create();

                instance.class1s = [CompareClass1.create()._id, CompareClass1.create()._id];
                instance.class2s = [CompareClass2.create()._id, CompareClass2.create()._id];

                try {
                    MutexClassC.validate(instance);
                }
                catch (validationError) {
                    if (expectedErrorMutex.test(validationError.message)) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }

                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
            
            it('2 non-singular relationship fields have a mutex and one is set. No error thrown.', function() {
                let schema = {
                    class1s: {
                        type: [Schema.Types.ObjectId],
                        ref: 'CompareClass1',
                        mutex: 'a'
                    },
                    class2s: {
                        type: [Schema.Types.ObjectId],
                        ref: 'CompareClass2',
                        mutex: 'a'
                    }
                };

                let MutexClassCC = new ClassModel({
                    accessControlled: false,
                    updateControlled: false,
                    className: 'MutexClassCC', 
                    schema: schema
                });

                let instance = MutexClassCC.create();

                instance.class1s = [CompareClass1.create()._id, CompareClass1.create()._id];

                try {
                    MutexClassCC.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and string is set. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.string = 'String';

                try {
                    AllFieldsMutexClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and date is set. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.date = new Date();

                try {
                    AllFieldsMutexClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and boolean is set to false. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.boolean = false;

                try {
                    AllFieldsMutexClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and boolean is set to true. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.boolean = true;

                try {
                    AllFieldsMutexClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and number is set to 0. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.number = 0;

                try {
                    AllFieldsMutexClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and number is set to 1. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.number = 1;

                try {
                    AllFieldsMutexClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and numbers is set to empty array. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.numbers = [];

                try {
                    AllFieldsMutexClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and numbers is set to an array of 0s. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.numbers = [0, 0, 0];

                try {
                    AllFieldsMutexClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and numbers is set to an array of 1s. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.numbers = [1, 1, 1];

                try {
                    AllFieldsMutexClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and class1 is set. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.class1 = CompareClass1.create()._id;

                try {
                    AllFieldsMutexClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and class2s are set to a single instance. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.class2s = CompareClass2.create()._id;

                try {
                    AllFieldsMutexClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and class2s are set to multiple instances. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.class2s = [CompareClass2.create()._id, CompareClass2.create()._id];

                try {
                    AllFieldsMutexClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and none are set. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                try {
                    AllFieldsMutexClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and number is set to 1 and numbers, strings, booleans, and class2s are set to empty array. No error thrown.', function() {

                let instance = AllFieldsMutexClass.create();

                instance.number = 1;
                instance.numbers = [];
                instance.booleans = [];
                instance.strings = [];
                instance.class2s = [];

                try {
                    AllFieldsMutexClass.validate(instance);
                }
                catch (validationError) {
                    throw new Error(
                        'ClassModel.validate threw an error when it shouldn\'t have.\n' + 
                        'Error: ' + validationError.message
                    );
                }

                return true;
            });
            
            it('multiple fields (one of each type) have a mutex and number is set to 0 and numbers are set to an array of 0s. Error thrown.', function() {
                let expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field number with mutex \'a\'. Field numbers with mutex \'a\'.';
                let expectedErrorMutex = /^Mutex violations found for instance .* Field number with mutex \'a\'. Field numbers with mutex \'a\'.$/;
            
                let instance = AllFieldsMutexClass.create();

                instance.number = 0;
                instance.numbers = [0, 0, 0];

                try {
                    AllFieldsMutexClass.validate(instance);
                }
                catch (validationError) {
                    if (expectedErrorMutex.test(validationError.message)) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }

                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
                
            it('multiple fields (one of each type) have a mutex and number is set to 1 and booleans is set to [false]. Error thrown.', function() {
                let expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field booleans with mutex \'a\'. Field number with mutex \'a\'.';
                let expectedErrorMutex = /^Mutex violations found for instance .* Field booleans with mutex \'a\'. Field number with mutex \'a\'.$/;
            
                let instance = AllFieldsMutexClass.create();
    
                instance.number = 1;
                instance.booleans = [false];
    
                try {
                    AllFieldsMutexClass.validate(instance);
                }
                catch (validationError) {
                    if (expectedErrorMutex.test(validationError.message)) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }
    
                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });
                
            it('multiple fields (one of each type) have a mutex and number is set to 1 and strings is set to [\"\"]. Error thrown.', function() {
                let expectedErrorMessage = 'Mutex violations found for instance <ObjectId> Field strings with mutex \'a\'. Field number with mutex \'a\'.';
                let expectedErrorMutex = /^Mutex violations found for instance .* Field strings with mutex \'a\'. Field number with mutex \'a\'.$/;
            
                let instance = AllFieldsMutexClass.create();
    
                instance.number = 1;
                instance.strings = [''];
    
                try {
                    AllFieldsMutexClass.validate(instance);
                }
                catch (validationError) {
                    if (expectedErrorMutex.test(validationError.message)) {
                        return true;
                    }
                    else {
                        throw new Error(
                            'ClassModel.validate returned the wrong error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' +
                            'Actual:   ' + validationError.message
                        );
                    }
                }
    
                throw new Error('ClassModel.validate did not throw an error when it should have.');
            });

        });

    });

    describe('ClassModel.save()', function() {    

        it('ClassModel.save() throws an error when called on an instance of a different ClassModel.', async () => {
            const expectedErrorMessage = 'AllFieldsRequiredClass.save() called on an instance of a different class.'; 
            const instance = SuperClass.create();
            let errorThrown = false;

            try {
                await AllFieldsRequiredClass.save(instance);
            }
            catch (error) {
                if (error.message != expectedErrorMessage) {
                    throw new Error(
                        'ClassModel.save() did not throw the expected error message.\n' + 
                        'Expected: ' + expectedErrorMessage + '\n' + 
                        'Actual:   ' + error.message
                    );
                }
                errorThrown = true;
            }

            if (!errorThrown) 
                throw new Error('ClassModel.save() did not throw an error when it should have.');
        });

        it('ClassModel.save() works properly.', async () => {
            let instance = AllFieldsRequiredClass.create();
            instance.string = 'String';
            instance.strings = ['String'];
            instance.date = new Date();
            instance.boolean = true;
            instance.booleans = [true];
            instance.number = 1;
            instance.numbers = [1];
            instance.class1 = CompareClass1.create()._id;
            instance.class2s = [CompareClass2.create()._id];

            await AllFieldsRequiredClass.save(instance);
            const found = await AllFieldsRequiredClass.findById(instance._id);

            if (!found) 
                throw new Error('ClassModel.save() did not throw an error, but was not saved.');

            if (instance.id != found.id)
                throw new Error('ClassModel.save() did not throw an error, but the instance found is different than the instance saved.');
        });

    });

    describe('ClassModel.saveAll()', function() {

        it('Throws an error if no arguments passed.', function(done) {
            let expectedErrorMessage = 'AllFieldsRequiredClass.saveAll(instances): instances cannot be null.';
            let error;

            
            AllFieldsRequiredClass.saveAll().then(
                function() {
                },
                function(saveError) {
                    error = saveError;
                }
            ).finally(function() {
                if (!error) {
                    done(new Error('ClassModel.saveAll() did not throw an error when it should have.'));
                }
                else {
                    if (error.message != expectedErrorMessage) {
                        done(new Error(
                            'ClassModel.save() did not throw the expected error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' + 
                            'Actual:   ' + error.message
                        ));
                    }
                    else {
                        done();
                    }
                }
            });
        });

        it('Throws an error if argument is not an array.', function(done) {
            let instance = AllFieldsRequiredClass.create();
            let expectedErrorMessage = 'AllFieldsRequiredClass.saveAll(instances): instances must be an Array.';
            let error;

            
            AllFieldsRequiredClass.saveAll(instance).then(
                function() {
                },
                function(saveError) {
                    error = saveError;
                }
            ).finally(function() {
                if (!error) {
                    done(new Error('ClassModel.saveAll() did not throw an error when it should have.'));
                }
                else {
                    if (error.message != expectedErrorMessage) {
                        done(new Error(
                            'ClassModel.save() did not throw the expected error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' + 
                            'Actual:   ' + error.message
                        ));
                    }
                    else {
                        done();
                    }
                }
            });
        });

        it('Throws an error if argument an instance of the wrong classModel.', async () => {
            const instance = AllFieldsRequiredClass.create();
            const expectedErrorMessage = 'SuperClass.saveAll() passed instances of a different class.';
            let errorThrown = false;

            try {
                await SuperClass.saveAll([instance]);
            }
            catch (error) {
                if (error.message != expectedErrorMessage) {
                    throw new Error(
                        'ClassModel.save() did not throw the expected error message.\n' + 
                        'Expected: ' + expectedErrorMessage + '\n' + 
                        'Actual:   ' + error.message
                    );
                }
                errorThrown = true;
            }
            
            if (!errorThrown)
                throw new Error('ClassModel.saveAll() did not throw an error when it should have.');
        });

        it('Saves multiple instances.', function(done) {
            let instanceA = AllFieldsRequiredClass.create();
            let instanceB = AllFieldsRequiredClass.create();
            let instances = [instanceA, instanceB];
            let error = null;

            instanceA.string = 'instanceA';
            instanceA.strings = ['instanceA'];
            instanceA.date = new Date();
            instanceA.boolean = true;
            instanceA.booleans = [true];
            instanceA.number = 1;
            instanceA.numbers = [1];
            instanceA.class1 = CompareClass1.create()._id;
            instanceA.class2s = [CompareClass2.create()._id];

            instanceB.string = 'instanceB';
            instanceB.strings = ['instanceB'];
            instanceB.date = new Date();
            instanceB.boolean = true;
            instanceB.booleans = [true];
            instanceB.number = 2;
            instanceB.numbers = [2];
            instanceB.class1 = CompareClass1.create()._id;
            instanceB.class2s = [CompareClass2.create()._id];

            AllFieldsRequiredClass.saveAll(instances).then(    
                function() {
                    AllFieldsRequiredClass.find({_id: {$in: [instanceA._id, instanceB._id]}}).then(
                        function(foundInstances) {
                            instances.forEach(function(desiredInstance) {
                                let compareResults = [];
                                let instancesFound = 0;
                                foundInstances.forEach(function(instance) {
                                    if (instance._id.equals(desiredInstance._id)) {
                                        instancesFound++;
                                        compareResults.push(AllFieldsRequiredClass.compare(instance, desiredInstance));
                                    }
                                });
                                if (instancesFound == 2 && (compareResults[0].match == false || compareResults[1].match == false)) {
                                    error = new Error('Instances were saved and retrieved, but they at least one doesn\'t match.' + compareResults[0].message + compareResults[1].message);
                                }
                                if (instancesFound == 1) {
                                    error = new Error('Instances saved but only one instance found.');
                                }
                                if (instancesFound == 0) {
                                    error = new Error('Instances saved but not found.');
                                }
                            });
                        },
                        function(findError) {
                            error = findError;
                        }
                    );
                },
                function(saveErr) {
                    error = saveErr;
                }
            ).finally(function() {
                if (error)
                    done(error);
                else
                    done();
            });
        });

    })

    describe('ClassModel Query Methods', function() {

        // Create Instances for tests.
        {
            var instanceOfAllFieldsMutexClass = AllFieldsMutexClass.create();
            var instanceOfDiscriminatedSuperClass = DiscriminatedSuperClass.create();
            var instanceOfSuperClass = SuperClass.create();
            var instanceOfSubClassOfSuperClass = SubClassOfSuperClass.create();
            var instanceOfSubClassOfAbstractSuperClass = SubClassOfAbstractSuperClass.create();
            var instanceOfSubClassOfDiscriminatorSuperClass = SubClassOfDiscriminatorSuperClass.create();
            var instanceOfSubClassOfDiscriminatedSubClassOfSuperClass = SubClassOfDiscriminatedSubClassOfSuperClass.create();
            var instanceOfSubClassOfSubClassOfSuperClass = SubClassOfSubClassOfSuperClass.create();
            var instanceOfSubClassOfAbstractSubClassOfSuperClass = SubClassOfAbstractSubClassOfSuperClass.create();
    
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
                AllFieldsMutexClass.save(instanceOfAllFieldsMutexClass),
                DiscriminatedSuperClass.save(instanceOfDiscriminatedSuperClass),
                SuperClass.save(instanceOfSuperClass),
                SubClassOfSuperClass.save(instanceOfSubClassOfSuperClass),
                SubClassOfDiscriminatorSuperClass.save(instanceOfSubClassOfDiscriminatorSuperClass),
                SubClassOfAbstractSuperClass.save(instanceOfSubClassOfAbstractSuperClass),
                SubClassOfDiscriminatedSubClassOfSuperClass.save(instanceOfSubClassOfDiscriminatedSubClassOfSuperClass),
                SubClassOfSubClassOfSuperClass.save(instanceOfSubClassOfSubClassOfSuperClass),
                SubClassOfAbstractSubClassOfSuperClass.save(instanceOfSubClassOfAbstractSubClassOfSuperClass),
            ]);
        });

        describe('ClassModel.findById()', function() {
    
            describe('Calling findById on the Class of the instance you want to find. (Direct)', function() {

                it('An instance of a concrete class with no subclasses can be found by Id.', async () => {
                    const classOfInstance = AllFieldsMutexClass
                    const instanceToFind = instanceOfAllFieldsMutexClass
                    const instanceFound = await classOfInstance.findById(instanceToFind._id);

                    if (!instanceFound) {
                        throw new Error('findById() did not return an instance.');
                    }
                    
                    const compareResult = classOfInstance.compare(instanceFound, instanceToFind);

                    if (!instanceFound._id.equals(instanceToFind._id) || compareResult.match == false) {
                        throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                    }
                });
        
                it('An instance of a concrete discriminated class can be found by Id.', async () => {
                    const classOfInstance = SubClassOfDiscriminatorSuperClass;
                    const instanceToFind = instanceOfSubClassOfDiscriminatorSuperClass
                    const instanceFound = await classOfInstance.findById(instanceToFind._id);

                    if (!instanceFound) {
                        throw new Error('findById() did not return an instance.');
                    }
                    
                    const compareResult = classOfInstance.compare(instanceFound, instanceToFind);

                    if (!instanceFound._id.equals(instanceToFind._id) || compareResult.match == false) {
                        throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                    }
                });
        
                it('An instance of a concrete super class can be found by Id.', async () => {
                    const classOfInstance = SuperClass;
                    const instanceToFind = instanceOfSuperClass
                    const instanceFound = await classOfInstance.findById(instanceToFind._id);

                    if (!instanceFound) {
                        throw new Error('findById() did not return an instance.');
                    }
                    
                    const compareResult = classOfInstance.compare(instanceFound, instanceToFind);

                    if (!instanceFound._id.equals(instanceToFind._id) || compareResult.match == false) {
                        throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                    }
                });
        
                it('An instance of a concrete discriminated sub-class can be found by Id.', async () => {
                    const classOfInstance = DiscriminatedSuperClass;
                    const instanceToFind = instanceOfDiscriminatedSuperClass
                    const instanceFound = await classOfInstance.findById(instanceToFind._id);

                    if (!instanceFound) {
                        throw new Error('findById() did not return an instance.');
                    }
                    
                    const compareResult = classOfInstance.compare(instanceFound, instanceToFind);

                    if (!instanceFound._id.equals(instanceToFind._id) || compareResult.match == false) {
                        throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                    }
                });
    
            });
    
            describe('Calling findById on a super class of the class of the instance you want to find. (Indirect)', function() {
        
                it('An instance of a sub class of a discrimintated super class can be found by Id from the super class.', async () => {
                    const classToCallFindByIdOn = DiscriminatedSuperClass;
                    const classOfInstance = SubClassOfDiscriminatorSuperClass;
                    const instanceToFind = instanceOfSubClassOfDiscriminatorSuperClass;
                    const instanceFound = await classToCallFindByIdOn.findById(instanceToFind._id);

                    if (!instanceFound) {
                        throw new Error('findById() did not return an instance.');
                    }
                    
                    const compareResult = classOfInstance.compare(instanceFound, instanceToFind);

                    if (!instanceFound._id.equals(instanceToFind._id) || compareResult.match == false) {
                        throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                    }
                });
        
                it('An instance of a concrete sub class of a non-discriminated super class can be found by Id from the super class.', async () => {
                    const classToCallFindByIdOn = SuperClass;
                    const classOfInstance = SubClassOfSuperClass;
                    const instanceToFind = instanceOfSubClassOfSuperClass;
                    const instanceFound = await classToCallFindByIdOn.findById(instanceToFind._id);

                    if (!instanceFound) {
                        throw new Error('findById() did not return an instance.');
                    }
                    
                    const compareResult = classOfInstance.compare(instanceFound, instanceToFind);

                    if (!instanceFound._id.equals(instanceToFind._id) || compareResult.match == false) {
                        throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                    }
                });
        
                it('An instance of a concrete sub class of a non-discriminated abstract super class can be found by Id from the super class.', async () => {
                    const classToCallFindByIdOn = AbstractSuperClass;
                    const classOfInstance = SubClassOfAbstractSuperClass;
                    const instanceToFind = instanceOfSubClassOfAbstractSuperClass;
                    const instanceFound = await classToCallFindByIdOn.findById(instanceToFind._id);

                    if (!instanceFound) {
                        throw new Error('findById() did not return an instance.');
                    }
                    
                    const compareResult = classOfInstance.compare(instanceFound, instanceToFind);

                    if (!instanceFound._id.equals(instanceToFind._id) || compareResult.match == false) {
                        throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                    }
                });
    
            });
    
            describe('Calling findById on a super class of the super class of the instance you want to find. (Recursive)', function() {
        
        
                it('SuperClass -> Discriminated Sub Class -> Sub Sub Class', async () => {
                    const classToCallFindByIdOn = SuperClass;
                    const classOfInstance = SubClassOfDiscriminatedSubClassOfSuperClass;
                    const instanceToFind = instanceOfSubClassOfDiscriminatedSubClassOfSuperClass;
                    const instanceFound = await classToCallFindByIdOn.findById(instanceToFind._id);

                    if (!instanceFound) {
                        throw new Error('findById() did not return an instance.');
                    }
                    
                    const compareResult = classOfInstance.compare(instanceFound, instanceToFind);

                    if (!instanceFound._id.equals(instanceToFind._id) || compareResult.match == false) {
                        throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                    }
                });

                it('SuperClass -> Sub Class -> Sub Sub Class', async () => {
                    const classToCallFindByIdOn = SuperClass;
                    const classOfInstance = SubClassOfSubClassOfSuperClass;
                    const instanceToFind = instanceOfSubClassOfSubClassOfSuperClass;
                    const instanceFound = await classToCallFindByIdOn.findById(instanceToFind._id);

                    if (!instanceFound) {
                        throw new Error('findById() did not return an instance.');
                    }
                    
                    const compareResult = classOfInstance.compare(instanceFound, instanceToFind);

                    if (!instanceFound._id.equals(instanceToFind._id) || compareResult.match == false) {
                        throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                    }
                });

                it('SuperClass -> Abstract Sub Class -> Sub Sub Class', async () => {
                    const classToCallFindByIdOn = SuperClass;
                    const classOfInstance = SubClassOfAbstractSubClassOfSuperClass;
                    const instanceToFind = instanceOfSubClassOfAbstractSubClassOfSuperClass;
                    const instanceFound = await classToCallFindByIdOn.findById(instanceToFind._id);

                    if (!instanceFound) {
                        throw new Error('findById() did not return an instance.');
                    }
                    
                    const compareResult = classOfInstance.compare(instanceFound, instanceToFind);

                    if (!instanceFound._id.equals(instanceToFind._id) || compareResult.match == false) {
                        throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                    }
                });
    
            });
    
        });

        describe('ClassModel.findOne()', function() {
    
            describe('Calling findOne on the Class of the instance you want to find. (Direct)', function() {

                it('An instance of a concrete class with no subclasses can be found.', async () => {
                    const classToCallFindOneOn = AllFieldsMutexClass;
                    const classOfInstance = AllFieldsMutexClass;
                    const instanceToFind = instanceOfAllFieldsMutexClass;

                    const filter = {
                        string: 'instanceOfAllFieldsMutexClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOne(filter);

                    if (!instanceFound) {
                        throw new Error('findOne() did not return an instance.');
                    }
                    
                    const compareResult = classOfInstance.compare(instanceFound, instanceToFind);

                    if (!instanceFound._id.equals(instanceToFind._id) || compareResult.match == false) {
                        throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                    }
                });

                it('An instance of a concrete discriminated class can be found.', async () => {
                    const classToCallFindOneOn = SubClassOfDiscriminatorSuperClass;
                    const classOfInstance = SubClassOfDiscriminatorSuperClass;
                    const instanceToFind = instanceOfSubClassOfDiscriminatorSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfDiscriminatorSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOne(filter);

                    if (!instanceFound) {
                        throw new Error('findOne() did not return an instance.');
                    }
                    
                    const compareResult = classOfInstance.compare(instanceFound, instanceToFind);

                    if (!instanceFound._id.equals(instanceToFind._id) || compareResult.match == false) {
                        throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                    }
                });

                it('An instance of a concrete super class can be found.', async () => {
                    const classToCallFindOneOn = SuperClass;
                    const classOfInstance = SuperClass;
                    const instanceToFind = instanceOfSuperClass;

                    const filter = {
                        name: 'instanceOfSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOne(filter);

                    if (!instanceFound) {
                        throw new Error('findOne() did not return an instance.');
                    }
                    
                    const compareResult = classOfInstance.compare(instanceFound, instanceToFind);

                    if (!instanceFound._id.equals(instanceToFind._id) || compareResult.match == false) {
                        throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                    }
                });

                it('An instance of a concrete discriminated sub-class can be found.', async () => {
                    const classToCallFindOneOn = DiscriminatedSuperClass;
                    const classOfInstance = DiscriminatedSuperClass;
                    const instanceToFind = instanceOfDiscriminatedSuperClass;

                    const filter = {
                        name: 'instanceOfDiscriminatedSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOne(filter);

                    if (!instanceFound) {
                        throw new Error('findOne() did not return an instance.');
                    }
                    
                    const compareResult = classOfInstance.compare(instanceFound, instanceToFind);

                    if (!instanceFound._id.equals(instanceToFind._id) || compareResult.match == false) {
                        throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                    }
                });
    
            });
    
            describe('Calling findOne on a super class of the class of the instance you want to find. (Indirect)', function() {

                it('An instance of a sub class of a discrimintated super class can be found by Id from the super class.', async () => {
                    const classToCallFindOneOn = DiscriminatedSuperClass;
                    const classOfInstance = SubClassOfDiscriminatorSuperClass;
                    const instanceToFind = instanceOfSubClassOfDiscriminatorSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfDiscriminatorSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOne(filter);

                    if (!instanceFound) {
                        throw new Error('findOne() did not return an instance.');
                    }
                    
                    const compareResult = classOfInstance.compare(instanceFound, instanceToFind);

                    if (!instanceFound._id.equals(instanceToFind._id) || compareResult.match == false) {
                        throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                    }
                });
        
                it('An instance of a concrete sub class of a non-discriminated super class can be found by Id from the super class.', async () => {
                    const classToCallFindOneOn = SuperClass;
                    const classOfInstance = SubClassOfSuperClass;
                    const instanceToFind = instanceOfSubClassOfSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOne(filter);

                    if (!instanceFound) {
                        throw new Error('findOne() did not return an instance.');
                    }
                    
                    const compareResult = classOfInstance.compare(instanceFound, instanceToFind);

                    if (!instanceFound._id.equals(instanceToFind._id) || compareResult.match == false) {
                        throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                    }
                });
        
                it('An instance of a concrete sub class of a non-discriminated abstract super class can be found by Id from the super class.', async () => {
                    const classToCallFindOneOn = AbstractSuperClass;
                    const classOfInstance = SubClassOfAbstractSuperClass;
                    const instanceToFind = instanceOfSubClassOfAbstractSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfAbstractSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOne(filter);

                    if (!instanceFound) {
                        throw new Error('findOne() did not return an instance.');
                    }
                    
                    const compareResult = classOfInstance.compare(instanceFound, instanceToFind);

                    if (!instanceFound._id.equals(instanceToFind._id) || compareResult.match == false) {
                        throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                    }
                });
    
            });
    
            describe('Calling findOne on a super class of the super class of the instance you want to find. (Recursive)', function() {
        
                it('SuperClass -> Discriminated Sub Class -> Sub Sub Class', async () => {
                    const classToCallFindOneOn = SuperClass;
                    const classOfInstance = SubClassOfDiscriminatedSubClassOfSuperClass;
                    const instanceToFind = instanceOfSubClassOfDiscriminatedSubClassOfSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfDiscriminatedSubClassOfSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOne(filter);

                    if (!instanceFound) {
                        throw new Error('findOne() did not return an instance.');
                    }
                    
                    const compareResult = classOfInstance.compare(instanceFound, instanceToFind);

                    if (!instanceFound._id.equals(instanceToFind._id) || compareResult.match == false) {
                        throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                    }
                });
        
                it('SuperClass -> Sub Class -> Sub Sub Class', async () => {
                    const classToCallFindOneOn = SuperClass;
                    const classOfInstance = SubClassOfSubClassOfSuperClass;
                    const instanceToFind = instanceOfSubClassOfSubClassOfSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfSubClassOfSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOne(filter);

                    if (!instanceFound) {
                        throw new Error('findOne() did not return an instance.');
                    }
                    
                    const compareResult = classOfInstance.compare(instanceFound, instanceToFind);

                    if (!instanceFound._id.equals(instanceToFind._id) || compareResult.match == false) {
                        throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                    }
                });
        
                it('SuperClass -> Abstract Sub Class -> Sub Sub Class', async () => {
                    const classToCallFindOneOn = SuperClass;
                    const classOfInstance = SubClassOfAbstractSubClassOfSuperClass;
                    const instanceToFind = instanceOfSubClassOfAbstractSubClassOfSuperClass;

                    const filter = {
                        name: 'instanceOfSubClassOfAbstractSubClassOfSuperClass'
                    }

                    const instanceFound = await classToCallFindOneOn.findOne(filter);

                    if (!instanceFound) {
                        throw new Error('findOne() did not return an instance.');
                    }
                    
                    const compareResult = classOfInstance.compare(instanceFound, instanceToFind);

                    if (!instanceFound._id.equals(instanceToFind._id) || compareResult.match == false) {
                        throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                    }
                });
    
            });
    
        });

        describe('ClassModel.find()', function() {

            describe('Finding a single instance.', function() {
    
                describe('Calling find on the Class of the instance you want to find. (Direct)', function() {
        
                    it('An instance of a concrete class with no subclasses can be found.', async () => {
                        const classToCallFindOn = AllFieldsMutexClass;
                        const classOfInstance = AllFieldsMutexClass;
                        const instanceToFind = instanceOfAllFieldsMutexClass;
    
                        const filter = {
                            string: 'instanceOfAllFieldsMutexClass'
                        }
    
                        const instancesFound = await classToCallFindOn.find(filter);
    
                        if (instancesFound == null || instancesFound.length == 0)
                            throw new Error('find() did not return any instances.');

                        if (instancesFound.length > 1) {
                            throw new Error('find() returned more than one instance.');
                        }
                        
                        const compareResult = classOfInstance.compare(instancesFound[0], instanceToFind);
    
                        if (!instancesFound[0]._id.equals(instanceToFind._id) || compareResult.match == false) {
                            throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                        }
                    });
        
                    it('An instance of a concrete discriminated class can be found.', async () => {
                        const classToCallFindOn = SubClassOfDiscriminatorSuperClass;
                        const classOfInstance = SubClassOfDiscriminatorSuperClass;
                        const instanceToFind = instanceOfSubClassOfDiscriminatorSuperClass;
    
                        const filter = {
                            name: 'instanceOfSubClassOfDiscriminatorSuperClass'
                        }
    
                        const instancesFound = await classToCallFindOn.find(filter);
    
                        if (instancesFound == null || instancesFound.length == 0)
                            throw new Error('find() did not return any instances.');

                        if (instancesFound.length > 1) {
                            throw new Error('find() returned more than one instance.');
                        }
                        
                        const compareResult = classOfInstance.compare(instancesFound[0], instanceToFind);
    
                        if (!instancesFound[0]._id.equals(instanceToFind._id) || compareResult.match == false) {
                            throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                        }
                    });
        
                    it('An instance of a concrete super class can be found.', async () => {
                        const classToCallFindOn = SuperClass;
                        const classOfInstance = SuperClass;
                        const instanceToFind = instanceOfSuperClass;
    
                        const filter = {
                            name: 'instanceOfSuperClass'
                        }
    
                        const instancesFound = await classToCallFindOn.find(filter);
    
                        if (instancesFound == null || instancesFound.length == 0)
                            throw new Error('find() did not return any instances.');

                        if (instancesFound.length > 1) {
                            throw new Error('find() returned more than one instance.');
                        }
                        
                        const compareResult = classOfInstance.compare(instancesFound[0], instanceToFind);
    
                        if (!instancesFound[0]._id.equals(instanceToFind._id) || compareResult.match == false) {
                            throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                        }
                    });
        
                    it('An instance of a concrete discriminated sub-class can be found.', async () => {
                        const classToCallFindOn = DiscriminatedSuperClass;
                        const classOfInstance = DiscriminatedSuperClass;
                        const instanceToFind = instanceOfDiscriminatedSuperClass;
    
                        const filter = {
                            name: 'instanceOfDiscriminatedSuperClass'
                        }
    
                        const instancesFound = await classToCallFindOn.find(filter);
    
                        if (instancesFound == null || instancesFound.length == 0)
                            throw new Error('find() did not return any instances.');

                        if (instancesFound.length > 1) {
                            throw new Error('find() returned more than one instance.');
                        }
                        
                        const compareResult = classOfInstance.compare(instancesFound[0], instanceToFind);
    
                        if (!instancesFound[0]._id.equals(instanceToFind._id) || compareResult.match == false) {
                            throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                        }
                    });
        
                });
        
                describe('Calling find on a super class of the class of the instance you want to find. (Indirect)', function() {
        
                    it('An instance of a sub class of a discrimintated super class can be found by Id from the super class.', async () => {
                        const classToCallFindOn = DiscriminatedSuperClass;
                        const classOfInstance = SubClassOfDiscriminatorSuperClass;
                        const instanceToFind = instanceOfSubClassOfDiscriminatorSuperClass;
    
                        const filter = {
                            name: 'instanceOfSubClassOfDiscriminatorSuperClass'
                        }
    
                        const instancesFound = await classToCallFindOn.find(filter);
    
                        if (instancesFound == null || instancesFound.length == 0)
                            throw new Error('find() did not return any instances.');

                        if (instancesFound.length > 1) {
                            throw new Error('find() returned more than one instance.');
                        }
                        
                        const compareResult = classOfInstance.compare(instancesFound[0], instanceToFind);
    
                        if (!instancesFound[0]._id.equals(instanceToFind._id) || compareResult.match == false) {
                            throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                        }
                    });
        
                    it('An instance of a concrete sub class of a non-discriminated super class can be found by Id from the super class.', async () => {
                        const classToCallFindOn = SuperClass;
                        const classOfInstance = SubClassOfSuperClass;
                        const instanceToFind = instanceOfSubClassOfSuperClass;
    
                        const filter = {
                            name: 'instanceOfSubClassOfSuperClass'
                        }
    
                        const instancesFound = await classToCallFindOn.find(filter);
    
                        if (instancesFound == null || instancesFound.length == 0)
                            throw new Error('find() did not return any instances.');

                        if (instancesFound.length > 1) {
                            throw new Error('find() returned more than one instance.');
                        }
                        
                        const compareResult = classOfInstance.compare(instancesFound[0], instanceToFind);
    
                        if (!instancesFound[0]._id.equals(instanceToFind._id) || compareResult.match == false) {
                            throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                        }
                    });
        
                    it('An instance of a concrete sub class of a non-discriminated abstract super class can be found by Id from the super class.', async () => {
                        const classToCallFindOn = AbstractSuperClass;
                        const classOfInstance = SubClassOfAbstractSuperClass;
                        const instanceToFind = instanceOfSubClassOfAbstractSuperClass;
    
                        const filter = {
                            name: 'instanceOfSubClassOfAbstractSuperClass'
                        }
    
                        const instancesFound = await classToCallFindOn.find(filter);
    
                        if (instancesFound == null || instancesFound.length == 0)
                            throw new Error('find() did not return any instances.');

                        if (instancesFound.length > 1) {
                            throw new Error('find() returned more than one instance.');
                        }
                        
                        const compareResult = classOfInstance.compare(instancesFound[0], instanceToFind);
    
                        if (!instancesFound[0]._id.equals(instanceToFind._id) || compareResult.match == false) {
                            throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                        }
                    });
        
                });
        
                describe('Calling find() on a super class of the super class of the instance you want to find. (Recursive)', function() {
        
                    it('SuperClass -> Discriminated Sub Class -> Sub Sub Class', async () => {
                        const classToCallFindOn = SuperClass;
                        const classOfInstance = SubClassOfDiscriminatedSubClassOfSuperClass;
                        const instanceToFind = instanceOfSubClassOfDiscriminatedSubClassOfSuperClass;
    
                        const filter = {
                            name: 'instanceOfSubClassOfDiscriminatedSubClassOfSuperClass'
                        }
    
                        const instancesFound = await classToCallFindOn.find(filter);
    
                        if (instancesFound == null || instancesFound.length == 0)
                            throw new Error('find() did not return any instances.');

                        if (instancesFound.length > 1) {
                            throw new Error('find() returned more than one instance.');
                        }
                        
                        const compareResult = classOfInstance.compare(instancesFound[0], instanceToFind);
    
                        if (!instancesFound[0]._id.equals(instanceToFind._id) || compareResult.match == false) {
                            throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                        }
                    });
        
                    it('SuperClass -> Sub Class -> Sub Sub Class', async () => {
                        const classToCallFindOn = SuperClass;
                        const classOfInstance = SubClassOfSubClassOfSuperClass;
                        const instanceToFind = instanceOfSubClassOfSubClassOfSuperClass;
    
                        const filter = {
                            name: 'instanceOfSubClassOfSubClassOfSuperClass'
                        }
    
                        const instancesFound = await classToCallFindOn.find(filter);
    
                        if (instancesFound == null || instancesFound.length == 0)
                            throw new Error('find() did not return any instances.');

                        if (instancesFound.length > 1) {
                            throw new Error('find() returned more than one instance.');
                        }
                        
                        const compareResult = classOfInstance.compare(instancesFound[0], instanceToFind);
    
                        if (!instancesFound[0]._id.equals(instanceToFind._id) || compareResult.match == false) {
                            throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                        }
                    });
        
                    it('SuperClass -> Abstract Sub Class -> Sub Sub Class', async () => {
                        const classToCallFindOn = SuperClass;
                        const classOfInstance = SubClassOfAbstractSubClassOfSuperClass;
                        const instanceToFind = instanceOfSubClassOfAbstractSubClassOfSuperClass;
    
                        const filter = {
                            name: 'instanceOfSubClassOfAbstractSubClassOfSuperClass'
                        }
    
                        const instancesFound = await classToCallFindOn.find(filter);
    
                        if (instancesFound == null || instancesFound.length == 0)
                            throw new Error('find() did not return any instances.');

                        if (instancesFound.length > 1) {
                            throw new Error('find() returned more than one instance.');
                        }
                        
                        const compareResult = classOfInstance.compare(instancesFound[0], instanceToFind);
    
                        if (!instancesFound[0]._id.equals(instanceToFind._id) || compareResult.match == false) {
                            throw new Error('An instance was returned, but it is not the correct one. ' + compareResult.message);
                        }
                    });
        
                });
        
            });

            describe('Finding Multiple Instances.', function() {
        
                it('Find two instances of a super class. One is an instance of the super class itself, one is 2 levels deep.', async () => {
                    const classToCallFindOn = SuperClass;
                    const instancesToFind = [instanceOfSuperClass, instanceOfSubClassOfDiscriminatedSubClassOfSuperClass];

                    const filter = {
                        name: {$in: ['instanceOfSuperClass', 'instanceOfSubClassOfDiscriminatedSubClassOfSuperClass']}
                    }; 

                    const instancesFound = await classToCallFindOn.find(filter);

                    if (instancesFound == null || instancesFound.length == 0)
                        throw new Error('find() did not return any instances.');
                    
                    if (instancesFound.length < instancesToFind.length)
                        throw new Error('find() did not return all the instances.');
                    
                    if (instancesFound.length > instancesToFind.length)
                        throw new Error('find() returned too many instances');
                    
                    let instancesCorrectlyFound = 0;

                    for (const instanceToFind of instancesToFind)
                        for (const instanceFound of instancesFound)
                            if (instanceFound.id == instanceToFind.id) {
                                instancesCorrectlyFound++;
                                break;
                            }
                    
                    if (instancesCorrectlyFound != instancesToFind.length)
                        throw new Error(
                            'find() returned the correct number of instances, but did not return the correct instances.\n' +
                            'Instances found: \n' + instancesFound + '\n' + 
                            'Expected instances: \n' + instancesToFind
                        );
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

                    if (instancesFound == null || instancesFound.length == 0)
                        throw new Error('find() did not return any instances.');
                    
                    if (instancesFound.length < instancesToFind.length)
                        throw new Error('find() did not return all the instances.');
                    
                    if (instancesFound.length > instancesToFind.length)
                        throw new Error('find() returned too many instances');
                    
                    let instancesCorrectlyFound = 0;

                    for (const instanceToFind of instancesToFind)
                        for (const instanceFound of instancesFound)
                            if (instanceFound.id == instanceToFind.id) {
                                instancesCorrectlyFound++;
                                break;
                            }
                    
                    if (instancesCorrectlyFound != instancesToFind.length)
                        throw new Error(
                            'find() returned the correct number of instances, but did not return the correct instances.\n' +
                            'Instances found: \n' + instancesFound + '\n' + 
                            'Expected instances: \n' + instancesToFind
                        );
                });

            });

        });

        after(function(done) {

            AllFieldsMutexClass.clear(instanceOfAllFieldsMutexClass).then(
                function() {
                    DiscriminatedSuperClass.clear(instanceOfDiscriminatedSuperClass).then(
                        function() {
                            SuperClass.clear(instanceOfSuperClass).then(
                                function() {
                                    SubClassOfSuperClass.clear(instanceOfSubClassOfSuperClass).then(
                                        function() {
                                            SubClassOfDiscriminatorSuperClass.clear(instanceOfSubClassOfDiscriminatorSuperClass).then(
                                                function() {
                                                    SubClassOfAbstractSuperClass.clear(instanceOfSubClassOfAbstractSuperClass).then(
                                                        function() {
                                                            AllFieldsRequiredClass.clear().then(
                                                                function() {
                                                                    DiscriminatedSubClassOfSuperClass.clear().then(
                                                                        function() {
                                                                            SubClassOfAbstractSubClassOfSuperClass.clear().then(
                                                                                function() {
                                                                                    SubClassOfSubClassOfSuperClass.clear().finally(done);
                                                                                }
                                                                            );
                                                                        }
                                                                    );
                                                                }
                                                            );
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    )
                                }
                            )
                        }
                    )
                }
            );

        });

    });

    describe('ClassModel.walk()', function() {

        // Create instances for tests.
        {
            var instanceOfSingularRelationshipClassA = SingularRelationshipClass.create();
            var instanceOfSingularRelationshipClassB = SingularRelationshipClass.create();
            var instanceOfNonSingularRelationshipClass = NonSingularRelationshipClass.create();
            var instanceOfSubClassOfSingularRelationshipClassA = SubClassOfSingularRelationshipClass.create();
            var instanceOfSubClassOfSingularRelationshipClassB = SubClassOfSingularRelationshipClass.create();
            var instanceOfSubClassOfNonSingularRelationshipClass = SubClassOfNonSingularRelationshipClass.create();
    
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

        before(function(done) {
            SingularRelationshipClass.saveAll([instanceOfSingularRelationshipClassA, instanceOfSingularRelationshipClassB]).then(function() {
                NonSingularRelationshipClass.save(instanceOfNonSingularRelationshipClass).then(function() {
                    SubClassOfSingularRelationshipClass.saveAll([instanceOfSubClassOfSingularRelationshipClassA, instanceOfSubClassOfSingularRelationshipClassB]).then(function() {
                        SubClassOfNonSingularRelationshipClass.save(instanceOfSubClassOfNonSingularRelationshipClass).finally(done);
                    });
                });
            });
        });

        describe('Tests for invalid arguments.', function() {

            it('ClassModel.walk() called with no arguments.', function(done) {
                let expectedErrorMessage = 'SingularRelationshipClass.walk() called with insufficient arguments. Should be walk(instance, relationship, <optional>filter).';
                let error;

                SingularRelationshipClass.walk().then(
                    () => {
                        error = new Error('ClassModel.walk() promise resolved when it should have rejected with an error.');
                    },
                    (walkError) => {
                        if (walkError.message != expectedErrorMessage) {
                            error = new Error(
                                'ClassModel.walk() did not throw the expected error.\n' +
                                'Expected: ' + expectedErrorMessage + '\n' +
                                'Actual:   ' + walkError.message
                            );
                        }
                    }
                ).finally(() => {
                    if (error)
                        done(error);
                    else
                        done();
                });
            });

            it('ClassModel.walk() called with only one argument (instance).', function(done) {
                let expectedErrorMessage = 'SingularRelationshipClass.walk() called with insufficient arguments. Should be walk(instance, relationship, <optional>filter).';
                let error;

                SingularRelationshipClass.walk(instanceOfSingularRelationshipClassA).then(
                    () => {
                        error = new Error('ClassModel.walk() promise resolved when it should have rejected with an error.');
                    },
                    (walkError) => {
                        if (walkError.message != expectedErrorMessage) {
                            error = new Error(
                                'ClassModel.walk() did not throw the expected error.\n' +
                                'Expected: ' + expectedErrorMessage + '\n' +
                                'Actual:   ' + walkError.message
                            );
                        }
                    }
                ).finally(() => {
                    if (error)
                        done(error);
                    else
                        done();
                });
            });

            it('ClassModel.walk() called with first argument that is an instance of a different class model.', function(done) {
                let expectedErrorMessage = 'SingularRelationshipClass.walk(): First argument needs to be an instance of SingularRelationshipClass\'s classModel or one of its sub classes.';
                let error;

                SingularRelationshipClass.walk(NonSingularRelationshipClass, '').then(
                    () => {
                        error = new Error('ClassModel.walk() promise resolved when it should have rejected with an error.');
                    },
                    (walkError) => {
                        if (walkError.message != expectedErrorMessage) {
                            error = new Error(
                                'ClassModel.walk() did not throw the expected error.\n' +
                                'Expected: ' + expectedErrorMessage + '\n' +
                                'Actual:   ' + walkError.message
                            );
                        }
                    }
                ).finally(() => {
                    if (error)
                        done(error);
                    else
                        done();
                });
            });

            it('ClassModel.walk() called with second argument that is not a String.', function(done) {
                let expectedErrorMessage = 'SingularRelationshipClass.walk(): Second argument needs to be a String.';
                let error;

                SingularRelationshipClass.walk(instanceOfSingularRelationshipClassA, true).then(
                    () => {
                        error = new Error('ClassModel.walk() promise resolved when it should have rejected with an error.');
                    },
                    (walkError) => {
                        if (walkError.message != expectedErrorMessage) {
                            error = new Error(
                                'ClassModel.walk() did not throw the expected error.\n' +
                                'Expected: ' + expectedErrorMessage + '\n' +
                                'Actual:   ' + walkError.message
                            );
                        }
                    }
                ).finally(() => {
                    if (error)
                        done(error);
                    else
                        done();
                });
            });

            it('ClassModel.walk() called with second argument that is not a field in the schema.', function(done) {
                let expectedErrorMessage = 'SingularRelationshipClass.walk(): Second argument needs to be a field in SingularRelationshipClass\'s schema.';
                let error;

                SingularRelationshipClass.walk(instanceOfSingularRelationshipClassA, 'rabbit').then(
                    () => {
                        error = new Error('ClassModel.walk() promise resolved when it should have rejected with an error.');
                    },
                    (walkError) => {
                        if (walkError.message != expectedErrorMessage) {
                            error = new Error(
                                'ClassModel.walk() did not throw the expected error.\n' +
                                'Expected: ' + expectedErrorMessage + '\n' +
                                'Actual:   ' + walkError.message
                            );
                        }
                    }
                ).finally(() => {
                    if (error)
                        done(error);
                    else
                        done();
                });
            });

            it('ClassModel.walk() called with second argument that is not a relationsihp in the schema. (boolean)', function(done) {
                let expectedErrorMessage = 'SingularRelationshipClass.walk(): field "boolean" is not a relationship.';
                let error;

                SingularRelationshipClass.walk(instanceOfSingularRelationshipClassA, 'boolean').then(
                    () => {
                        error = new Error('ClassModel.walk() promise resolved when it should have rejected with an error.');
                    },
                    (walkError) => {
                        if (walkError.message != expectedErrorMessage) {
                            error = new Error(
                                'ClassModel.walk() did not throw the expected error.\n' +
                                'Expected: ' + expectedErrorMessage + '\n' +
                                'Actual:   ' + walkError.message
                            );
                        }
                    }
                ).finally(() => {
                    if (error)
                        done(error);
                    else
                        done();
                });
            });

            it('ClassModel.walk() called with second argument that is not a relationsihp in the schema. (Array of Booleans)', function(done) {
                let expectedErrorMessage = 'SingularRelationshipClass.walk(): field "booleans" is not a relationship.';
                let error;

                SingularRelationshipClass.walk(instanceOfSingularRelationshipClassA, 'booleans').then(
                    () => {
                        error = new Error('ClassModel.walk() promise resolved when it should have rejected with an error.');
                    },
                    (walkError) => {
                        if (walkError.message != expectedErrorMessage) {
                            error = new Error(
                                'ClassModel.walk() did not throw the expected error.\n' +
                                'Expected: ' + expectedErrorMessage + '\n' +
                                'Actual:   ' + walkError.message
                            );
                        }
                    }
                ).finally(() => {
                    if (error)
                        done(error);
                    else
                        done();
                });
            });

            it('ClassModel.walk() called with third argument that is not an object.', function(done) {
                let expectedErrorMessage = 'SingularRelationshipClass.walk(): Third argument needs to be an object.';
                let error;

                SingularRelationshipClass.walk(instanceOfSingularRelationshipClassA, 'singularRelationship', '{type: notAnObject}').then(
                    () => {
                        error = new Error('ClassModel.walk() promise resolved when it should have rejected with an error.');
                    },
                    (walkError) => {
                        if (walkError.message != expectedErrorMessage) {
                            error = new Error(
                                'ClassModel.walk() did not throw the expected error.\n' +
                                'Expected: ' + expectedErrorMessage + '\n' +
                                'Actual:   ' + walkError.message
                            );
                        }
                    }
                ).finally(() => {
                    if (error)
                        done(error);
                    else
                        done();
                });
            });

        });

        describe('Test walking the relationships.', function() {

            it('Walking a singular relationship.', function(done) {
                let expectedInstance = instanceOfNonSingularRelationshipClass;
                let error;

                SingularRelationshipClass.walk(instanceOfSingularRelationshipClassA, 'singularRelationship').then(
                    (instance) => {
                        if (instance == null) 
                            error = new Error('walk() did not return an instance.');
                        if (!(instance._id.equals(expectedInstance._id)))
                            error = new Error('walk() returned an instance, but it is not the right one.');
                    },
                    (walkError) => {
                        error = walkError;
                    }
                ).finally(() => {
                    if (error)
                        done(error);
                    else   
                        done();
                });

            });

            it('Walking a nonsingular relationship.', function(done) {
                let expectedInstances = [instanceOfSingularRelationshipClassA, instanceOfSingularRelationshipClassB];
                let error;

                NonSingularRelationshipClass.walk(instanceOfNonSingularRelationshipClass, 'nonSingularRelationship').then(
                    (instances) => {
                        if (instances == null) 
                            error = new Error('walk() returned null. It should have at least returned an empty array.');
                        if (instances.length == 0) 
                            error = new Error('walk() returned an empty array.');
                        if (instances.length == 1) 
                            error = new Error('walk() only returned a single instance, it should have returned 2 instances.');
                        expectedInstances.forEach((expectedInstance) => {
                            let expectedInstanceFound = false;
                            instances.forEach((instance) => {
                                if (instance._id.equals(expectedInstance._id))
                                    expectedInstanceFound = true;
                            });
                            if (!expectedInstanceFound) {
                                error = new Error('One of the expected instances was not returned.');
                            }
                        });
                    },
                    (walkError) => {
                        error = walkError;
                    }
                ).finally(() => {
                    if (error)
                        done(error);
                    else   
                        done();
                });
            });

            it('Walking a singular relationship by calling walk() from the super class.', function(done) {
                let expectedInstance = instanceOfSubClassOfNonSingularRelationshipClass;
                let error;

                SingularRelationshipClass.walk(instanceOfSubClassOfSingularRelationshipClassA, 'singularRelationship').then(
                    (instance) => {
                        if (instance == null) 
                            error = new Error('walk() did not return an instance.');
                        if (!(instance._id.equals(expectedInstance._id)))
                            error = new Error('walk() returned an instance, but it is not the right one.');
                    },
                    (walkError) => {
                        error = walkError;
                    }
                ).finally(() => {
                    if (error)
                        done(error);
                    else   
                        done();
                });
            });

            it('Walking a nonsingular relationship by calling walk() from the super class.', function(done) {
                let expectedInstances = [instanceOfSubClassOfSingularRelationshipClassA._id, instanceOfSubClassOfSingularRelationshipClassB._id];
                let error;

                NonSingularRelationshipClass.walk(instanceOfSubClassOfNonSingularRelationshipClass, 'nonSingularRelationship').then(
                    (instances) => {
                        if (instances == null) 
                            error = new Error('walk() returned null. It should have at least returned an empty array.');
                        if (instances.length == 0) 
                            error = new Error('walk() returned an empty array.');
                        if (instances.length == 1) 
                            error = new Error('walk() only returned a single instance, it should have returned 2 instances.');
                        expectedInstances.forEach((expectedInstance) => {
                            let expectedInstanceFound = false;
                            instances.forEach((instance) => {
                                if (instance._id.equals(expectedInstance._id))
                                    expectedInstanceFound = true;
                            });
                            if (!expectedInstanceFound) {
                                error = new Error('One of the expected instances was not returned.');
                            }
                        });
                    },
                    (walkError) => {
                        error = walkError;
                    }
                ).finally(() => {
                    if (error)
                        done(error);
                    else   
                        done();
                });
            });

        });

        after(function(done) {
            SingularRelationshipClass.clear().then(function() {
                NonSingularRelationshipClass.clear().then(function() {
                    SubClassOfSingularRelationshipClass.clear().then(function() {
                        SubClassOfNonSingularRelationshipClass.clear().finally(done);
                    });
                });
            });
        });

    });

    describe('ClassModel.accessControlFilter()', function() {

        // Set up accessControlled Instances
        // For each class, create on instance which will pass all access control filters, and one each that will fail due to one of the access control methods
        {
            // ClassControlsAccessControlledSuperClass Instances
            var instanceOfClassControlsAccessControlledSuperClassAllowed = ClassControlsAccessControlledSuperClass.create();
            instanceOfClassControlsAccessControlledSuperClassAllowed.allowed = true;
            
            var instanceOfClassControlsAccessControlledSuperClassNotAllowed = ClassControlsAccessControlledSuperClass.create();
            instanceOfClassControlsAccessControlledSuperClassNotAllowed.allowed = false;

            // AccessControlledSuperClass Instances
            var instanceOfAccessControlledSuperClassPasses = AccessControlledSuperClass.create();
            instanceOfAccessControlledSuperClassPasses.name = 'instanceOfAccessControlledSuperClassPasses';
            instanceOfAccessControlledSuperClassPasses.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;

            var instanceOfAccessControlledSuperClassFailsRelationship = AccessControlledSuperClass.create();
            instanceOfAccessControlledSuperClassFailsRelationship.name = 'instanceOfAccessControlledSuperClassFailsRelationship';
            instanceOfAccessControlledSuperClassFailsRelationship.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassNotAllowed;

            // AccessControlledSubClassOfAccessControlledSuperClass Instances
            var instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses = AccessControlledSubClassOfAccessControlledSuperClass.create();
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses.name = 'instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses';
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses.boolean = true;

            var instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship = AccessControlledSubClassOfAccessControlledSuperClass.create();
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship.name = 'instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship';
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassNotAllowed;
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship.boolean = true;

            var instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean = AccessControlledSubClassOfAccessControlledSuperClass.create();
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean.name = 'instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean'
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean.boolean = false;

            // AccessControlledDiscriminatedSuperClass Instances
            var instanceOfAccessControlledDiscriminatedSuperClassPasses = AccessControlledDiscriminatedSuperClass.create();
            instanceOfAccessControlledDiscriminatedSuperClassPasses.name = 'instanceOfAccessControlledDiscriminatedSuperClassPasses';
            instanceOfAccessControlledDiscriminatedSuperClassPasses.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;
            instanceOfAccessControlledDiscriminatedSuperClassPasses.boolean = true;
            instanceOfAccessControlledDiscriminatedSuperClassPasses.string = 'accessControlled';

            var instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship = AccessControlledDiscriminatedSuperClass.create();
            instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship.name = 'instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship';
            instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassNotAllowed;
            instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship.boolean = true;
            instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship.string = 'accessControlled';

            var instanceOfAccessControlledDiscriminatedSuperClassFailsString = AccessControlledDiscriminatedSuperClass.create();
            instanceOfAccessControlledDiscriminatedSuperClassFailsString.name = 'instanceOfAccessControlledDiscriminatedSuperClassFailsString';
            instanceOfAccessControlledDiscriminatedSuperClassFailsString.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;
            instanceOfAccessControlledDiscriminatedSuperClassFailsString.boolean = true;
            instanceOfAccessControlledDiscriminatedSuperClassFailsString.string = 'not accessControlled';

            var instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean = AccessControlledDiscriminatedSuperClass.create();
            instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean.name = 'instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean';
            instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;
            instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean.boolean = false;
            instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean.string = 'accessControlled';

            // AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass Instances
            var instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses = AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass.create();
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses.name = 'instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses';
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;  
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses.boolean = true;
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses.string = 'accessControlled';         
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses.number = 1;

            var instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship = AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass.create();
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship.name = 'instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship';
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassNotAllowed;             
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship.number = 1;
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship.boolean = true;
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship.string = 'accessControlled';

            var instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean = AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass.create();
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean.name = 'instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean';
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;     
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean.boolean = false;
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean.string = 'accessControlled';
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean.number = 1;

            var instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString = AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass.create();
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString.name = 'instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString';
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;     
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString.boolean = true;
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString.string = 'not accessControlled';            
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString.number = 1;

            var instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber = AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass.create();
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber.name = 'instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber';
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber.boolean = true;
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber.string = 'accessControlled';      
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber.number = -1;

            // AccessControlledClassAccessControlledByParameters Instances
            var instanceOfAccessControlledClassAccessControlledByParameters = AccessControlledClassAccessControlledByParameters.create();

        }

        // Save all SecurityFilter Test Instances
        before(async () => {
            await ClassControlsAccessControlledSuperClass.saveAll([
                instanceOfClassControlsAccessControlledSuperClassAllowed,
                instanceOfClassControlsAccessControlledSuperClassNotAllowed
            ]);
            await AccessControlledSuperClass.saveAll([
                instanceOfAccessControlledSuperClassPasses,
                instanceOfAccessControlledSuperClassFailsRelationship
            ]);
            await AccessControlledSubClassOfAccessControlledSuperClass.saveAll([
                instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship,
                instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean
            ]);
            await AccessControlledDiscriminatedSuperClass.saveAll([
                instanceOfAccessControlledDiscriminatedSuperClassPasses,
                instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship,
                instanceOfAccessControlledDiscriminatedSuperClassFailsString,
                instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean
            ]);
            await AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass.saveAll([
                instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses,
                instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship,
                instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean,
                instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString,
                instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber
            ]);

        });

        describe('Tests for invalid arguments.', function() {

            it('First Argument must be an Array', (done) => {
                let error;
                let expectedErrorMessage = 'Incorrect parameters. ' + AccessControlledSuperClass.className + '.accessControlFilter(Array<instance> instances, ...accessControlMethodParameters)';

                AccessControlledSuperClass.accessControlFilter(instanceOfAccessControlledSuperClassPasses, instanceOfAccessControlledSuperClassPasses._id).then(
                    (filtered) => {
                    },
                    (accessControlError) => {
                        error = accessControlError;
                    }
                ).finally(() => {
                    if (error) {
                        if (error.message == expectedErrorMessage) {
                            done();
                        }
                        else {
                            done(new Error(
                                'accessFilter() threw an unexpected error.\n' + 
                                'Expected: ' + expectedErrorMessage + '\n' + 
                                'Actual:   ' + error.message
                            ));
                        }
                    }
                    else {
                        done(new Error('ClassModel.accessControlFilter() should have thrown an error.'));
                    }
                });
            });

            it('All instances must be of the Class or a Sub Class', (done) => {
                let error;
                let expectedErrorMessage = AccessControlledSubClassOfAccessControlledSuperClass.className + '.accessControlFilter() called with instances of a different class.';

                AccessControlledSubClassOfAccessControlledSuperClass.accessControlFilter([instanceOfAccessControlledSuperClassPasses, instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses], instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses._id).then(
                    (filtered) => {
                    },
                    (accessControlError) => {
                        error = accessControlError;
                    }
                ).finally(() => {
                    if (error) {
                        if (error.message == expectedErrorMessage) {
                            done();
                        }
                        else {
                            done(new Error(
                                'accessFilter() threw an unexpected error.\n' + 
                                'Expected: ' + expectedErrorMessage + '\n' + 
                                'Actual:   ' + error.message
                            ));
                        }
                    }
                    else {
                        done(new Error('ClassModel.accessControlFilter() should have thrown an error.'));
                    }
                });
            });

        });

        describe('Test filtering out instances that don\'t pass access control check.', () => {

            describe('AccessControlledSuperClass.accessControlFilter()', () => {

                it('Access Control Filter called on Class with only direct instances of Class.', done => {
                    let instances = [instanceOfAccessControlledSuperClassPasses, instanceOfAccessControlledSuperClassFailsRelationship];

                    let expectedInstances = [instanceOfAccessControlledSuperClassPasses];
                    
                    AccessControlledSuperClass.accessControlFilter(instances)
                        .then(
                            filtered => {
                                if (filtered.length != expectedInstances.length)
                                    done(new Error("Filtering Failed. Instances returned: " + filtered));
                                else {
                                    let filteredCorrectly = true;

                                    for (let instance of expectedInstances) {
                                        if (!filtered.includes(instance))
                                            filteredCorrectly = false;
                                    }

                                    if (!filteredCorrectly) {
                                        done(new Error("Filtering Failed. Instances returned: " + filtered));
                                    }
                                    else done();
                                }
                            },
                            error => {
                                done(error);
                            }
                        ).catch(error => {
                            done(error);
                        });
                });

                it('Access Control Filter called on Class with instances of class and sub class.', done => {
                    let instances = [
                        instanceOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSuperClassFailsRelationship,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship
                    ];

                    let expectedInstances = [
                        instanceOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses
                    ];

                    AccessControlledSuperClass.accessControlFilter(instances)
                        .then(
                            filtered => {
                                if (filtered.length != expectedInstances.length)
                                    done(new Error("Filtering Failed. Instances returned: " + filtered));
                                else {
                                    let filteredCorrectly = true;

                                    for (let instance of expectedInstances) {
                                        if (!filtered.includes(instance))
                                            filteredCorrectly = false;
                                    }

                                    if (!filteredCorrectly) {
                                        done(new Error("Filtering Failed. Instances returned: " + filtered));
                                    }
                                    else done();
                                }
                            },
                            error => {
                                done(error);
                            }
                        ).catch(error => {
                            done(error);
                        });
                });

                it('Access Control Filter called on Class with instances of class and 2 layers of sub classes', done => {
                    let instances = [
                        instanceOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSuperClassFailsRelationship,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship,
                        instanceOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsString,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship
                    ];

                    let expectedInstances = [
                        instanceOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledDiscriminatedSuperClassPasses
                    ];

                    AccessControlledSuperClass.accessControlFilter(instances)
                        .then(
                            filtered => {
                                if (filtered.length != expectedInstances.length)
                                    done(new Error("Filtering Failed. Wrong number of instances returned. Instances returned: " + filtered));
                                else {
                                    let filteredCorrectly = true;

                                    for (let instance of expectedInstances) {
                                        if (!filtered.includes(instance)) {
                                            filteredCorrectly = false;
                                        }
                                    }

                                    if (!filteredCorrectly) {
                                        done(new Error("Filtering Failed. Instances returned: " + filtered));
                                    }
                                    else done();
                                }
                            },
                            error => {
                                done(error);
                            }
                        ).catch(error => {
                            done(error);
                        });
                });

                it('Access Control Filter called on Class with instances of 3 layers of sub classes', done => {
                    let instances = [
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
                    ];

                    let expectedInstances = [
                        instanceOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses
                    ];

                    AccessControlledSuperClass.accessControlFilter(instances)
                        .then(
                            filtered => {
                                if (filtered.length != expectedInstances.length)
                                    done(new Error("Filtering Failed. Wrong number of instances returned. Instances returned: " + filtered));
                                else {
                                    let filteredCorrectly = true;

                                    for (let instance of expectedInstances) {
                                        if (!filtered.includes(instance)) {
                                            filteredCorrectly = false;
                                        }
                                    }

                                    if (!filteredCorrectly) {
                                        done(new Error("Filtering Failed. Instances returned: " + filtered));
                                    }
                                    else done();
                                }
                            },
                            error => {
                                done(error);
                            }
                        ).catch(error => {
                            done(error);
                        });
                });
            });

            describe('AccessControlledSubClassOfAccessControlledSuperClass.accessControlFilter()', () => {

                it('Access Control Filter called on Class with only direct instances of Class.', done => {
                    let instances = [
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship
                    ];

                    let expectedInstances = [
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses
                    ];

                    AccessControlledSubClassOfAccessControlledSuperClass.accessControlFilter(instances)
                        .then(
                            filtered => {
                                if (filtered.length != expectedInstances.length)
                                    done(new Error("Filtering Failed. Instances returned: " + filtered));
                                else {
                                    let filteredCorrectly = true;

                                    for (let instance of expectedInstances) {
                                        if (!filtered.includes(instance))
                                            filteredCorrectly = false;
                                    }

                                    if (!filteredCorrectly) {
                                        done(new Error("Filtering Failed. Instances returned: " + filtered));
                                    }
                                    else done();
                                }
                            },
                            error => {
                                done(error);
                            }
                        ).catch(error => {
                            done(error);
                        });
                });

                it('Access Control Filter called on Class with instances of class and 1 layers of sub classes', done => {
                    let instances = [
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship,
                        instanceOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsString,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship
                    ];

                    let expectedInstances = [
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledDiscriminatedSuperClassPasses
                    ];

                    AccessControlledSubClassOfAccessControlledSuperClass.accessControlFilter(instances)
                        .then(
                            filtered => {
                                if (filtered.length != expectedInstances.length)
                                    done(new Error("Filtering Failed. Wrong number of instances returned. Instances returned: " + filtered));
                                else {
                                    let filteredCorrectly = true;

                                    for (let instance of expectedInstances) {
                                        if (!filtered.includes(instance)) {
                                            filteredCorrectly = false;
                                        }
                                    }

                                    if (!filteredCorrectly) {
                                        done(new Error("Filtering Failed. Instances returned: " + filtered));
                                    }
                                    else done();
                                }
                            },
                            error => {
                                done(error);
                            }
                        ).catch(error => {
                            done(error);
                        });
                });

                it('Access Control Filter called on Class with instances of 2 layers of sub classes', done => {
                    let instances = [
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
                    ];

                    let expectedInstances = [
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses
                    ];

                    AccessControlledSubClassOfAccessControlledSuperClass.accessControlFilter(instances)
                        .then(
                            filtered => {
                                if (filtered.length != expectedInstances.length)
                                    done(new Error("Filtering Failed. Wrong number of instances returned. Instances returned: " + filtered));
                                else {
                                    let filteredCorrectly = true;

                                    for (let instance of expectedInstances) {
                                        if (!filtered.includes(instance)) {
                                            filteredCorrectly = false;
                                        }
                                    }

                                    if (!filteredCorrectly) {
                                        done(new Error("Filtering Failed. Instances returned: " + filtered));
                                    }
                                    else done();
                                }
                            },
                            error => {
                                done(error);
                            }
                        ).catch(error => {
                            done(error);
                        });
                });
            });

            describe('AccessControlledDiscriminatedSuperClass.accessControlFilter()', () => {

                it('Access Control Filter called on Class with only direct instances of Class.', done => {
                    let instances = [
                        instanceOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsString,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship
                    ];

                    let expectedInstances = [
                        instanceOfAccessControlledDiscriminatedSuperClassPasses
                    ];

                    AccessControlledDiscriminatedSuperClass.accessControlFilter(instances)
                        .then(
                            filtered => {
                                if (filtered.length != expectedInstances.length)
                                    done(new Error("Filtering Failed. Wrong number of instances returned. Instances returned: " + filtered));
                                else {
                                    let filteredCorrectly = true;

                                    for (let instance of expectedInstances) {
                                        if (!filtered.includes(instance)) {
                                            filteredCorrectly = false;
                                        }
                                    }

                                    if (!filteredCorrectly) {
                                        done(new Error("Filtering Failed. Instances returned: " + filtered));
                                    }
                                    else done();
                                }
                            },
                            error => {
                                done(error);
                            }
                        ).catch(error => {
                            done(error);
                        });
                });

                it('Access Control Filter called on Class with instances of 1 layers of sub classes', done => {
                    let instances = [
                        instanceOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsString,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber
                    ];

                    let expectedInstances = [
                        instanceOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses
                    ];

                    AccessControlledDiscriminatedSuperClass.accessControlFilter(instances)
                        .then(
                            filtered => {
                                if (filtered.length != expectedInstances.length)
                                    done(new Error("Filtering Failed. Wrong number of instances returned. Instances returned: " + filtered));
                                else {
                                    let filteredCorrectly = true;

                                    for (let instance of expectedInstances) {
                                        if (!filtered.includes(instance)) {
                                            filteredCorrectly = false;
                                        }
                                    }

                                    if (!filteredCorrectly) {
                                        done(new Error("Filtering Failed. Instances returned: " + filtered));
                                    }
                                    else done();
                                }
                            },
                            error => {
                                done(error);
                            }
                        ).catch(error => {
                            done(error);
                        });
                });
            });

            describe('AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass.accessControlFilter()', () => {

                it('Access Control Filter called on Class with only direct instances of Class.', done => {
                    let instances = [
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber
                    ];

                    let expectedInstances = [
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses
                    ];

                    AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass.accessControlFilter(instances)
                        .then(
                            filtered => {
                                if (filtered.length != expectedInstances.length)
                                    done(new Error("Filtering Failed. Wrong number of instances returned. Instances returned: " + filtered));
                                else {
                                    let filteredCorrectly = true;

                                    for (let instance of expectedInstances) {
                                        if (!filtered.includes(instance)) {
                                            filteredCorrectly = false;
                                        }
                                    }

                                    if (!filteredCorrectly) {
                                        done(new Error("Filtering Failed. Instances returned: " + filtered));
                                    }
                                    else done();
                                }
                            },
                            error => {
                                done(error);
                            }
                        ).catch(error => {
                            done(error);
                        });
                });
            });

            describe('AccessControlledClassAccessControlledByParameters.accessControlFilter()', () => {

                it('Instance passes access control check', done => {
                    let instances = [instanceOfAccessControlledClassAccessControlledByParameters];

                    let expectedInstances = [instanceOfAccessControlledClassAccessControlledByParameters];
                    
                    AccessControlledClassAccessControlledByParameters.accessControlFilter(instances, 1, 1, true)
                        .then(
                            filtered => {
                                if (filtered.length != expectedInstances.length)
                                    done(new Error("Filtering Failed. Instances returned: " + filtered));
                                else {
                                    let filteredCorrectly = true;

                                    for (let instance of expectedInstances) {
                                        if (!filtered.includes(instance))
                                            filteredCorrectly = false;
                                    }

                                    if (!filteredCorrectly) {
                                        done(new Error("Filtering Failed. Instances returned: " + filtered));
                                    }
                                    else done();
                                }
                            },
                            error => {
                                done(error);
                            }
                        ).catch(error => {
                            done(error);
                        });

                });

                it('Instance fails access control check because of Numbers.', done => {
                    let instances = [instanceOfAccessControlledClassAccessControlledByParameters];

                    let expectedInstances = [];
                    
                    AccessControlledClassAccessControlledByParameters.accessControlFilter(instances, -2, 1, true)
                        .then(
                            filtered => {
                                if (filtered.length != expectedInstances.length)
                                    done(new Error("Filtering Failed. Instances returned: " + filtered));
                                else {
                                    let filteredCorrectly = true;

                                    for (let instance of expectedInstances) {
                                        if (!filtered.includes(instance))
                                            filteredCorrectly = false;
                                    }

                                    if (!filteredCorrectly) {
                                        done(new Error("Filtering Failed. Instances returned: " + filtered));
                                    }
                                    else done();
                                }
                            },
                            error => {
                                done(error);
                            }
                        ).catch(error => {
                            done(error);
                        });

                });

                it('Instance failes access control check because of Boolean', done => {
                    let instances = [instanceOfAccessControlledClassAccessControlledByParameters];

                    let expectedInstances = [];
                    
                    AccessControlledClassAccessControlledByParameters.accessControlFilter(instances, 1, 1, false)
                        .then(
                            filtered => {
                                if (filtered.length != expectedInstances.length)
                                    done(new Error("Filtering Failed. Instances returned: " + filtered));
                                else {
                                    let filteredCorrectly = true;

                                    for (let instance of expectedInstances) {
                                        if (!filtered.includes(instance))
                                            filteredCorrectly = false;
                                    }

                                    if (!filteredCorrectly) {
                                        done(new Error("Filtering Failed. Instances returned: " + filtered));
                                    }
                                    else done();
                                }
                            },
                            error => {
                                done(error);
                            }
                        ).catch(error => {
                            done(error);
                        });

                });

            });

        });

        describe('Test find methods for access filtering.', () => {

            describe('Test findById() with access filtering', () => {

                it('Call findByID() on an instance of an access controlled class. Instance passes filter.', async () => {
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

                it('Call findByID() on an instance of an access controlled class, from super class. Instance passes filter.', async () => {
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

                it('Call findByID() on an instance of an access controlled class. Instance does not pass filter.', async () => {
                    const classToCallFindByIdOn = AccessControlledSuperClass;
                    const instanceToFind = instanceOfAccessControlledSuperClassFailsRelationship;
                    const instanceFound = await classToCallFindByIdOn.findById(instanceToFind._id);

                    if (instanceFound)
                        throw new Error('findById() returned an instance.');
                });

                it('Call findByID() on an instance of an access controlled class, from super class. Instance does not pass filter based on super access control method.', async () => {
                    const classToCallFindByIdOn = AccessControlledSuperClass;
                    const instanceToFind = instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship;
                    const instanceFound = await classToCallFindByIdOn.findById(instanceToFind._id);

                    if (instanceFound)
                        throw new Error('findById() returned an instance.');

                });

                it('Call findByID() on an instance of an access controlled class, from super class. Instance does not pass filter based on it\'s own access control method.', async () => {
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
                    const instancesToFind = [
                        instanceOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses
                    ];

                    const instancesFound = await AccessControlledSuperClass.find({name: {$in: instanceNames}});

                    if (instancesFound.length < instancesToFind.length) 
                        throw new Error('find() returned too few instances.');
                    
                    if (instancesFound.length > instancesToFind.length)
                        throw new Error('find() returned too many instances')

                    let instancesCorrectlyFound = 0;

                    for (const instanceToFind of instancesToFind)
                        for (const instanceFound of instancesFound)
                            if (instanceFound.id == instanceToFind.id) {
                                instancesCorrectlyFound++;
                                break;
                            }
                    
                    if (instancesCorrectlyFound != instancesToFind.length)
                        throw new Error(
                            'find() returned the correct number of instances, but did not return the correct instances.\n' +
                            'Instances found: \n' + instancesFound + '\n' + 
                            'Expected instances: \n' + instancesToFind
                        );
                });

            });

        });

        after(async () => {
            await ClassControlsAccessControlledSuperClass.clear();
            await AccessControlledSuperClass.clear();
            await AccessControlledSubClassOfAccessControlledSuperClass.clear();
            await AccessControlledDiscriminatedSuperClass.clear();
            await AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass.clear();
        });

    });

    describe('ClassModel.updateControlFilter()', function() {

        // Set up updateControlled Instances
        // For each class, create on instance which will pass all update control filters, and one each that will fail due to one of the update control methods
        {
            // ClassControlsUpdateControlledSuperClass Instances
            var instanceOfClassControlsUpdateControlledSuperClassAllowed = ClassControlsUpdateControlledSuperClass.create();
            instanceOfClassControlsUpdateControlledSuperClassAllowed.allowed = true;
            
            var instanceOfClassControlsUpdateControlledSuperClassNotAllowed = ClassControlsUpdateControlledSuperClass.create();
            instanceOfClassControlsUpdateControlledSuperClassNotAllowed.allowed = false;

            // UpdateControlledSuperClass Instances
            var instanceOfUpdateControlledSuperClassPasses = UpdateControlledSuperClass.create();
            instanceOfUpdateControlledSuperClassPasses.name = 'instanceOfUpdateControlledSuperClassPasses';
            instanceOfUpdateControlledSuperClassPasses.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;

            var instanceOfUpdateControlledSuperClassFailsRelationship = UpdateControlledSuperClass.create();
            instanceOfUpdateControlledSuperClassFailsRelationship.name = 'instanceOfUpdateControlledSuperClassFailsRelationship';
            instanceOfUpdateControlledSuperClassFailsRelationship.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassNotAllowed;

            // UpdateControlledSubClassOfUpdateControlledSuperClass Instances
            var instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassPasses = UpdateControlledSubClassOfUpdateControlledSuperClass.create();
            instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassPasses.name = 'instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassPasses';
            instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassPasses.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;
            instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassPasses.boolean = true;

            var instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship = UpdateControlledSubClassOfUpdateControlledSuperClass.create();
            instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship.name = 'instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship';
            instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassNotAllowed;
            instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship.boolean = true;

            var instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean = UpdateControlledSubClassOfUpdateControlledSuperClass.create();
            instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean.name = 'instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean'
            instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;
            instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean.boolean = false;

            // UpdateControlledDiscriminatedSuperClass Instances
            var instanceOfUpdateControlledDiscriminatedSuperClassPasses = UpdateControlledDiscriminatedSuperClass.create();
            instanceOfUpdateControlledDiscriminatedSuperClassPasses.name = 'instanceOfUpdateControlledDiscriminatedSuperClassPasses';
            instanceOfUpdateControlledDiscriminatedSuperClassPasses.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;
            instanceOfUpdateControlledDiscriminatedSuperClassPasses.boolean = true;
            instanceOfUpdateControlledDiscriminatedSuperClassPasses.string = 'updateControlled';

            var instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship = UpdateControlledDiscriminatedSuperClass.create();
            instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship.name = 'instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship';
            instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassNotAllowed;
            instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship.boolean = true;
            instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship.string = 'updateControlled';

            var instanceOfUpdateControlledDiscriminatedSuperClassFailsString = UpdateControlledDiscriminatedSuperClass.create();
            instanceOfUpdateControlledDiscriminatedSuperClassFailsString.name = 'instanceOfUpdateControlledDiscriminatedSuperClassFailsString';
            instanceOfUpdateControlledDiscriminatedSuperClassFailsString.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;
            instanceOfUpdateControlledDiscriminatedSuperClassFailsString.boolean = true;
            instanceOfUpdateControlledDiscriminatedSuperClassFailsString.string = 'not updateControlled';

            var instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean = UpdateControlledDiscriminatedSuperClass.create();
            instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean.name = 'instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean';
            instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;
            instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean.boolean = false;
            instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean.string = 'updateControlled';

            // UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass Instances
            var instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses = UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass.create();
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses.name = 'instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses';
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;  
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses.boolean = true;
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses.string = 'updateControlled';         
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses.number = 1;

            var instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship = UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass.create();
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship.name = 'instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship';
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassNotAllowed;             
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship.number = 1;
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship.boolean = true;
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship.string = 'updateControlled';

            var instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean = UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass.create();
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean.name = 'instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean';
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;     
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean.boolean = false;
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean.string = 'updateControlled';
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean.number = 1;

            var instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString = UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass.create();
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString.name = 'instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString';
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;     
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString.boolean = true;
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString.string = 'not updateControlled';            
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString.number = 1;

            var instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber = UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass.create();
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber.name = 'instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber';
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber.boolean = true;
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber.string = 'updateControlled';      
            instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber.number = -1;

            // UpdateControlledClassUpdateControlledByParameters Instances
            var instanceOfUpdateControlledClassUpdateControlledByParameters = UpdateControlledClassUpdateControlledByParameters.create();

        }

        // Save all SecurityFilter Test Instances
        before(async () => {
            await ClassControlsUpdateControlledSuperClass.saveAll([
                instanceOfClassControlsUpdateControlledSuperClassAllowed,
                instanceOfClassControlsUpdateControlledSuperClassNotAllowed
            ]);

        });

        describe('Tests for invalid arguments.', function() {

            it('First Argument must be an Array', async () => {
                let updatable;
                const expectedErrorMessage = 'Incorrect parameters. ' + UpdateControlledSuperClass.className + '.updateControlCheck(Array<instance> instances, ...updateControlMethodParameters)';

                try {
                    updatable = await UpdateControlledSuperClass.updateControlCheck(instanceOfUpdateControlledSuperClassPasses, instanceOfUpdateControlledSuperClassPasses._id);
                }
                catch (error) {
                    if (error.message != expectedErrorMessage) {
                        throw  new Error(
                            'accessFilter() threw an unexpected error.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' + 
                            'Actual:   ' + error.message
                        );
                    }
                }

                if (updatable)
                    throw new Error ('ClassModel.updateControlCheck() returned when it should have thrown an error.');
            });

            it('All instances must be of the Class or a Sub Class', async () => {
                let updatable;
                const expectedErrorMessage = UpdateControlledSubClassOfUpdateControlledSuperClass.className + '.updateControlCheck() called with instances of a different class.';

                try {
                    updatable = await UpdateControlledSubClassOfUpdateControlledSuperClass.updateControlCheck([instanceOfUpdateControlledSuperClassPasses, instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses], instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses._id)
                }
                catch (error) {
                    if (error.message != expectedErrorMessage) {
                        throw  new Error(
                            'accessFilter() threw an unexpected error.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' + 
                            'Actual:   ' + error.message
                        );
                    }
                }

                if (updatable)
                    throw new Error ('ClassModel.updateControlCheck() returned when it should have thrown an error.');
            });

        });

        describe('Test Update Control Check throws error when an instance doesn\'t pass check.', () => {

            describe('UpdateControlledSuperClass.updateControlCheck()', () => {

                it('Update Control Check called on Class with only direct instances of Class.', async () => {
                    const instances = [instanceOfUpdateControlledSuperClassPasses, instanceOfUpdateControlledSuperClassFailsRelationship];
                    const instancesExpectedToFail = new SuperSet([instanceOfUpdateControlledSuperClassFailsRelationship]);
                    const expectedInstanceIds = instancesExpectedToFail.mapToArray(instance => instance.id);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + expectedInstanceIds;
                    let passed = false;

                    try {
                        await UpdateControlledSuperClass.updateControlCheck(instances);
                    }
                    catch (error) {
                        if (error.message != expectedErrorMessage) {
                            throw new Error(
                                'updateControlCheck() threw an error, but not the expected one.\n' + 
                                'expected: ' + expectedErrorMessage + '\n' + 
                                'actual:   ' + error.message
                            );
                        }
                        passed = true;
                    }

                    if (!passed) {
                        throw new Error('updateControlCheck() returned when it should have thrown an error.');
                    }
                });

                it('Update Control Check called on Class with instances of class and sub class.', async () => {
                    const instances = [
                        instanceOfUpdateControlledSuperClassPasses,
                        instanceOfUpdateControlledSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassPasses,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship
                    ];
                    const instancesExpectedToFail = new SuperSet([
                        instanceOfUpdateControlledSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship
                    ]);
                    const expectedInstanceIds = instancesExpectedToFail.mapToArray(instance => instance.id);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + expectedInstanceIds;
                    let passed = false;

                    try {
                        await UpdateControlledSuperClass.updateControlCheck(instances);
                    }
                    catch (error) {
                        if (error.message != expectedErrorMessage) {
                            throw new Error(
                                'updateControlCheck() threw an error, but not the expected one.\n' + 
                                'expected: ' + expectedErrorMessage + '\n' + 
                                'actual:   ' + error.message
                            );
                        }
                        passed = true;
                    }

                    if (!passed) {
                        throw new Error('updateControlCheck() returned when it should have thrown an error.');
                    }
                });

                it('Update Control Check called on Class with instances of class and 3 layers of sub classes', async () => {
                    const instances = [
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
                    ];
                    const instancesExpectedToFail = new SuperSet([                
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
                    const expectedInstanceIds = instancesExpectedToFail.mapToArray(instance => instance.id);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + expectedInstanceIds;
                    let passed = false;

                    try {
                        await UpdateControlledSuperClass.updateControlCheck(instances);
                    }
                    catch (error) {
                        if (error.message != expectedErrorMessage) {
                            throw new Error(
                                'updateControlCheck() threw an error, but not the expected one.\n' + 
                                'expected: ' + expectedErrorMessage + '\n' + 
                                'actual:   ' + error.message
                            );
                        }
                        passed = true;
                    }

                    if (!passed) {
                        throw new Error('updateControlCheck() returned when it should have thrown an error.');
                    }
                });

            });

            describe('UpdateControlledSubClassOfUpdateControlledSuperClass.updateControlCheck()', () => {

                it('Update Control Check called on Class with only direct instances of Class.', async () => {
                    const instances = [
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassPasses,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship
                    ];
                    const instancesExpectedToFail = new SuperSet([                
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship,

                    ]);
                    const expectedInstanceIds = instancesExpectedToFail.mapToArray(instance => instance.id);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + expectedInstanceIds;
                    let passed = false;

                    try {
                        await UpdateControlledSubClassOfUpdateControlledSuperClass.updateControlCheck(instances);
                    }
                    catch (error) {
                        if (error.message != expectedErrorMessage) {
                            throw new Error(
                                'updateControlCheck() threw an error, but not the expected one.\n' + 
                                'expected: ' + expectedErrorMessage + '\n' + 
                                'actual:   ' + error.message
                            );
                        }
                        passed = true;
                    }

                    if (!passed) {
                        throw new Error('updateControlCheck() returned when it should have thrown an error.');
                    }
                });

                it('Update Control Check called on Class with instances of class and 1 layers of sub classes', async () => {
                    const instances = [
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassPasses,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship,
                        instanceOfUpdateControlledDiscriminatedSuperClassPasses,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship
                    ];
                    const instancesExpectedToFail = new SuperSet([                
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledSuperClassFailsRelationship,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship
                    ]);
                    const expectedInstanceIds = instancesExpectedToFail.mapToArray(instance => instance.id);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + expectedInstanceIds;
                    let passed = false;

                    try {
                        await UpdateControlledSubClassOfUpdateControlledSuperClass.updateControlCheck(instances);
                    }
                    catch (error) {
                        if (error.message != expectedErrorMessage) {
                            throw new Error(
                                'updateControlCheck() threw an error, but not the expected one.\n' + 
                                'expected: ' + expectedErrorMessage + '\n' + 
                                'actual:   ' + error.message
                            );
                        }
                        passed = true;
                    }

                    if (!passed) {
                        throw new Error('updateControlCheck() returned when it should have thrown an error.');
                    }
                });

                it('Update Control Check called on Class with instances of 2 layers of sub classes', async () => {
                    const instances = [
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
                    ];
                    const instancesExpectedToFail = new SuperSet([                
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
                    const expectedInstanceIds = instancesExpectedToFail.mapToArray(instance => instance.id);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + expectedInstanceIds;
                    let passed = false;

                    try {
                        await UpdateControlledSubClassOfUpdateControlledSuperClass.updateControlCheck(instances);
                    }
                    catch (error) {
                        if (error.message != expectedErrorMessage) {
                            throw new Error(
                                'updateControlCheck() threw an error, but not the expected one.\n' + 
                                'expected: ' + expectedErrorMessage + '\n' + 
                                'actual:   ' + error.message
                            );
                        }
                        passed = true;
                    }

                    if (!passed) {
                        throw new Error('updateControlCheck() returned when it should have thrown an error.');
                    }
                });

            });

            describe('UpdateControlledDiscriminatedSuperClass.updateControlCheck()', () => {

                it('Update Control Check called on Class with only direct instances of Class.', async () => {
                    const instances = [
                        instanceOfUpdateControlledDiscriminatedSuperClassPasses,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship
                    ];
                    const instancesExpectedToFail = new SuperSet([
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship
                    ]);
                    const expectedInstanceIds = instancesExpectedToFail.mapToArray(instance => instance.id);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + expectedInstanceIds;
                    let passed = false;

                    try {
                        await UpdateControlledDiscriminatedSuperClass.updateControlCheck(instances);
                    }
                    catch (error) {
                        if (error.message != expectedErrorMessage) {
                            throw new Error(
                                'updateControlCheck() threw an error, but not the expected one.\n' + 
                                'expected: ' + expectedErrorMessage + '\n' + 
                                'actual:   ' + error.message
                            );
                        }
                        passed = true;
                    }

                    if (!passed) {
                        throw new Error('updateControlCheck() returned when it should have thrown an error.');
                    }
                });

                it('Update Control Check called on Class with instances of 1 layers of sub classes', async () => {
                    const instances = [
                        instanceOfUpdateControlledDiscriminatedSuperClassPasses,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber
                    ];
                    const instancesExpectedToFail = new SuperSet([
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber
                    ]);
                    const expectedInstanceIds = instancesExpectedToFail.mapToArray(instance => instance.id);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + expectedInstanceIds;
                    let passed = false;

                    try {
                        await UpdateControlledDiscriminatedSuperClass.updateControlCheck(instances);
                    }
                    catch (error) {
                        if (error.message != expectedErrorMessage) {
                            throw new Error(
                                'updateControlCheck() threw an error, but not the expected one.\n' + 
                                'expected: ' + expectedErrorMessage + '\n' + 
                                'actual:   ' + error.message
                            );
                        }
                        passed = true;
                    }

                    if (!passed) {
                        throw new Error('updateControlCheck() returned when it should have thrown an error.');
                    }
                });

            });

            describe('UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass.updateControlCheck()', () => {

                it('Update Control Check called on Class with only direct instances of Class.', async () => {
                    const instances = [
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassPasses,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber
                    ];
                    const instancesExpectedToFail = new SuperSet([
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsRelationship,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsString,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfUpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClassFailsNumber
                    ]);
                    const expectedInstanceIds = instancesExpectedToFail.mapToArray(instance => instance.id);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + expectedInstanceIds;
                    let passed = false;

                    try {
                        await UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass.updateControlCheck(instances);
                    }
                    catch (error) {
                        if (error.message != expectedErrorMessage) {
                            throw new Error(
                                'updateControlCheck() threw an error, but not the expected one.\n' + 
                                'expected: ' + expectedErrorMessage + '\n' + 
                                'actual:   ' + error.message
                            );
                        }
                        passed = true;
                    }

                    if (!passed) {
                        throw new Error('updateControlCheck() returned when it should have thrown an error.');
                    }
                });

            });

            describe('UpdateControlledClassUpdateControlledByParameters.updateControlCheck()', () => {

                it('Update Control Check passes', async () => {
                    const updateAllowed = await UpdateControlledClassUpdateControlledByParameters.updateControlCheck([instanceOfUpdateControlledClassUpdateControlledByParameters], 1, 1, true);
                    
                    if (!updateAllowed) {
                        throw new Error('Update check passed when it should have thrown an error.');
                    }
                });

                it('Instance fails update control check because of Numbers.', async () => {
                    const instances = [instanceOfUpdateControlledClassUpdateControlledByParameters];
                    const instancesExpectedToFail = new SuperSet([instanceOfUpdateControlledClassUpdateControlledByParameters]);
                    const expectedInstanceIds = instancesExpectedToFail.mapToArray(instance => instance.id);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + expectedInstanceIds;
                    let passed = false;

                    try {
                        await UpdateControlledClassUpdateControlledByParameters.updateControlCheck(instances, -2, 1, true);
                    }
                    catch (error) {
                        if (error.message != expectedErrorMessage) {
                            throw new Error(
                                'updateControlCheck() threw an error, but not the expected one.\n' + 
                                'expected: ' + expectedErrorMessage + '\n' + 
                                'actual:   ' + error.message
                            );
                        }
                        passed = true;
                    }

                    if (!passed) {
                        throw new Error('updateControlCheck() returned when it should have thrown an error.');
                    }
                });

                it('Instance fails update control check because of Boolean.', async () => {
                    const instances = [instanceOfUpdateControlledClassUpdateControlledByParameters];
                    const instancesExpectedToFail = new SuperSet([instanceOfUpdateControlledClassUpdateControlledByParameters]);
                    const expectedInstanceIds = instancesExpectedToFail.mapToArray(instance => instance.id);
                    const expectedErrorMessage = 'Illegal attempt to update instances: ' + expectedInstanceIds;
                    let passed = false;

                    try {
                        await UpdateControlledClassUpdateControlledByParameters.updateControlCheck(instances, 1, 1, false);
                    }
                    catch (error) {
                        if (error.message != expectedErrorMessage) {
                            throw new Error(
                                'updateControlCheck() threw an error, but not the expected one.\n' + 
                                'expected: ' + expectedErrorMessage + '\n' + 
                                'actual:   ' + error.message
                            );
                        }
                        passed = true;
                    }

                    if (!passed) {
                        throw new Error('updateControlCheck() returned when it should have thrown an error.');
                    }
                });

            });

        });

        describe('Test save methods for update control checks.', () => {

            describe('Test save() with update control checks', () => {

                describe('Without updateControlMethodParameters.', () => {

                    it('Call save() on an instance of an update controlled class. Instance saved.', async () => {
                        const classToCallSaveOn = UpdateControlledSuperClass;
                        const instanceToSave = UpdateControlledSuperClass.create();
                        instanceToSave.name = 'instanceOfUpdateControlledSuperClassPasses-save';
                        instanceToSave.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;
    
                        await classToCallSaveOn.save(instanceToSave);
                        const instanceSaved = await classToCallSaveOn.findById(instanceToSave._id);
    
                        if (!instanceSaved)
                            throw new Error('.save() returned without error, but instance could not be found in the database.');
                        
                        await classToCallSaveOn.delete(instanceToSave);
                    });
    
                    it('Call save() on an instance of an update controlled class. Save fails due to update control check.', async () => {
                        const classToCallSaveOn = UpdateControlledSuperClass;
                        const instanceToSave = instanceOfUpdateControlledSuperClassFailsRelationship;
                        const expectedErrorMessage = 'Error in ' + classToCallSaveOn.className + '.save(): Illegal attempt to update instances: ' + instanceToSave.id;
                        let errorThrown = false;
    
                        try {
                            await classToCallSaveOn.save(instanceToSave);
                        }
                        catch (error) {
                            if (error.message != expectedErrorMessage) {
                                throw new Error(
                                    '.save() threw an error, but not the expected one.\n' +
                                    'expected: ' + expectedErrorMessage + '\n' + 
                                    'actual:   ' + error.message
                                );
                            }
                            errorThrown = true;
                        }
    
                        if (!errorThrown)
                            throw new Error('.save() returned when it should have returned an error.');
                        
                        const instanceFound = await classToCallSaveOn.findById(instanceToSave._id);

                        if (instanceFound) 
                            throw new Error('.save() threw an error, but the instance was saved anyway.');
                    });

                });

                describe('Calling save with updateControlMethodParameters', () => {
    
                    it('Call save() on an instance of an update controlled class with updateControlMethodParameters. Save fails due to update control check.', async () => {
                        const classToCallSaveOn = UpdateControlledClassUpdateControlledByParameters;
                        const instanceToSave = instanceOfUpdateControlledClassUpdateControlledByParameters;
                        const expectedErrorMessage = 'Error in ' + classToCallSaveOn.className + '.save(): Illegal attempt to update instances: ' + instanceToSave.id;
                        const updateControlMethodParameters = [-2, 1, true];
                        let errorThrown = false;
    
                        try {
                            await classToCallSaveOn.save(instanceToSave, ...updateControlMethodParameters);
                        }
                        catch (error) {
                            if (error.message != expectedErrorMessage) {
                                throw new Error(
                                    '.save() threw an error, but not the expected one.\n' +
                                    'expected: ' + expectedErrorMessage + '\n' + 
                                    'actual:   ' + error.message
                                );
                            }
                            errorThrown = true;
                        }
    
                        if (!errorThrown)
                            throw new Error('.save() returned when it should have returned an error.');
                        
                        const instanceFound = await classToCallSaveOn.findById(instanceToSave._id);

                        if (instanceFound) 
                            throw new Error('.save() threw an error, but the instance was saved anyway.')
                    });
    
                    it('Call save() on an instance of an update controlled class with updateControlMethodParameters. Save fails due to update control check.', async () => {
                        const classToCallSaveOn = UpdateControlledClassUpdateControlledByParameters;
                        const instanceToSave = instanceOfUpdateControlledClassUpdateControlledByParameters;
                        const expectedErrorMessage = 'Error in ' + classToCallSaveOn.className + '.save(): Illegal attempt to update instances: ' + instanceToSave.id;
                        const updateControlMethodParameters = [1, 1, false];
                        let errorThrown = false;
                        
                        try {
                            await classToCallSaveOn.save(instanceToSave, ...updateControlMethodParameters);
                        }
                        catch (error) {
                            if (error.message != expectedErrorMessage) {
                                throw new Error(
                                    '.save() threw an error, but not the expected one.\n' +
                                    'expected: ' + expectedErrorMessage + '\n' + 
                                    'actual:   ' + error.message
                                );
                            }
                            errorThrown = true;
                        }
    
                        if (!errorThrown)
                            throw new Error('.save() returned when it should have returned an error.');

                        const instanceFound = await classToCallSaveOn.findById(instanceToSave._id);

                        if (instanceFound) 
                            throw new Error('.save() threw an error, but the instance was saved anyway.')
                    });

                    it('Call save() on an instance of an update controlled class with updateControlMethodParameters. Instance saved.', async () => {
                        const classToCallSaveOn = UpdateControlledClassUpdateControlledByParameters;
                        const instanceToSave = UpdateControlledClassUpdateControlledByParameters.create();
                        const updateControlMethodParameters = [1, 1, true];
    
                        await classToCallSaveOn.save(instanceToSave, ...updateControlMethodParameters);
                        const instanceSaved = await classToCallSaveOn.findById(instanceToSave._id);
    
                        if (!instanceSaved)
                            throw new Error('.save() returned without error, but instance could not be found in the database.');
                    });

                });

            });

            describe('Test saveAll() with update control check', () => {

                describe('Without updateControlMethodParameters.', () => {

                    it('Call saveAll() on an instances of an update controlled class. Instances saved.', async () => {
                        const classToCallSaveAllOn = UpdateControlledSuperClass;
                        const instanceToSave = UpdateControlledSuperClass.create();
                        instanceToSave.name = 'instanceOfUpdateControlledSuperClassPasses-saveAll';
                        instanceToSave.updateControlledBy = instanceOfClassControlsUpdateControlledSuperClassAllowed;
    
                        await classToCallSaveAllOn.saveAll([instanceToSave]);
                        const instanceSaved = await classToCallSaveAllOn.findById(instanceToSave._id);
    
                        if (!instanceSaved)
                            throw new Error('.saveAll() returned without error, but instance could not be found in the database.');
                        
                        await classToCallSaveAllOn.delete(instanceToSave);
                    });
    
                    it('Call saveAll() on instances of an update controlled class. Save fails due to update control check.', async () => {
                        const classToCallSaveAllOn = UpdateControlledSuperClass;
                        const instancesToSave = [
                            instanceOfUpdateControlledSuperClassPasses,
                            instanceOfUpdateControlledSuperClassFailsRelationship,
                        ];
                        const expectedErrorMessage = 'Error in ' + classToCallSaveAllOn.className + '.saveAll(): Illegal attempt to update instances: ' + instancesToSave[1].id;
                        let errorThrown = false;
    
                        try {
                            await classToCallSaveAllOn.saveAll(instancesToSave);
                        }
                        catch (error) {
                            if (error.message != expectedErrorMessage) {
                                throw new Error(
                                    '.saveAll() threw an error, but not the expected one.\n' +
                                    'expected: ' + expectedErrorMessage + '\n' + 
                                    'actual:   ' + error.message
                                );
                            }
                            errorThrown = true;
                        }
    
                        if (!errorThrown)
                            throw new Error('.saveAll() returned when it should have returned an error.');
                        
                        const instancesFound = await classToCallSaveAllOn.find({
                            _id: {$in: instancesToSave.map(instance => instance.id)}
                        });

                        if (instancesFound && instancesFound.length) 
                            throw new Error('.saveAll() threw an error, but the instance was saved anyway.');
                    });

                });

                describe('Calling save with updateControlMethodParameters', () => {

                    it('Call saveAll() on an instance of an update controlled class with updateControlMethodParameters. Instance saved.', async () => {
                        const classToCallSaveAllOn = UpdateControlledClassUpdateControlledByParameters;
                        const instanceToSave = UpdateControlledClassUpdateControlledByParameters.create();
                        const updateControlMethodParameters = [1, 1, true];
    
                        await classToCallSaveAllOn.saveAll([instanceToSave], ...updateControlMethodParameters);
                        const instanceSaved = await classToCallSaveAllOn.findById(instanceToSave._id);
    
                        if (!instanceSaved)
                            throw new Error('.saveAll() returned without error, but instance could not be found in the database.');
                        
                            
                        await classToCallSaveAllOn.delete(instanceToSave);
                    });
    
                    it('Call saveAll() on an instance of an update controlled class with updateControlMethodParameters. Save fails due to update control check.', async () => {
                        const classToCallSaveAllOn = UpdateControlledClassUpdateControlledByParameters;
                        const instanceToSave = UpdateControlledClassUpdateControlledByParameters.create();
                        const expectedErrorMessage = 'Error in ' + classToCallSaveAllOn.className + '.saveAll(): Illegal attempt to update instances: ' + instanceToSave.id;
                        const updateControlMethodParameters = [-2, 1, true];
                        let errorThrown = false;
    
                        try {
                            await classToCallSaveAllOn.saveAll([instanceToSave], ...updateControlMethodParameters);
                        }
                        catch (error) {
                            if (error.message != expectedErrorMessage) {
                                throw new Error(
                                    '.saveAll() threw an error, but not the expected one.\n' +
                                    'expected: ' + expectedErrorMessage + '\n' + 
                                    'actual:   ' + error.message
                                );
                            }
                            errorThrown = true;
                        }
    
                        if (!errorThrown)
                            throw new Error('.saveAll() returned when it should have returned an error.');
                        
                        const instanceFound = await classToCallSaveAllOn.findById(instanceToSave._id);

                        if (instanceFound) 
                            throw new Error('.saveAll() threw an error, but the instance was saved anyway.')
                    });
    
                    it('Call save() on an instance of an update controlled class with updateControlMethodParameters. Save fails due to update control check.', async () => {
                        const classToCallSaveAllOn = UpdateControlledClassUpdateControlledByParameters;
                        const instanceToSave = UpdateControlledClassUpdateControlledByParameters.create();
                        const expectedErrorMessage = 'Error in ' + classToCallSaveAllOn.className + '.saveAll(): Illegal attempt to update instances: ' + instanceToSave.id;
                        const updateControlMethodParameters = [1, 1, false];
                        let errorThrown = false;
                        
                        try {
                            await classToCallSaveAllOn.saveAll([instanceToSave], ...updateControlMethodParameters);
                        }
                        catch (error) {
                            if (error.message != expectedErrorMessage) {
                                throw new Error(
                                    '.saveAll() threw an error, but not the expected one.\n' +
                                    'expected: ' + expectedErrorMessage + '\n' + 
                                    'actual:   ' + error.message
                                );
                            }
                            errorThrown = true;
                        }
    
                        if (!errorThrown)
                            throw new Error('.saveAll() returned when it should have returned an error.');

                        const instanceFound = await classToCallSaveAllOn.findById(instanceToSave._id);

                        if (instanceFound) 
                            throw new Error('.saveAll() threw an error, but the instance was saved anyway.')
                    });

                });

            });

        });

        after(async () => {
            await ClassControlsUpdateControlledSuperClass.clear();
            await UpdateControlledSuperClass.clear();
            await UpdateControlledSubClassOfUpdateControlledSuperClass.clear();
            await UpdateControlledDiscriminatedSuperClass.clear();
            await UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass.clear();
            await UpdateControlledClassUpdateControlledByParameters.clear();
        });

    });

    after(() => {
        database.close();
    });

});

