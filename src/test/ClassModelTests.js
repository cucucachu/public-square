var assert = require('assert');
var expect = require('expect');
var promiseFinally = require('promise.prototype.finally');

var ClassModel = require('../dist/models/ClassModel');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('../dist/models/database');


promiseFinally.shim();

process.on('unhandledRejection', error => {
	console.log('unhandledRejection', error.message);
});

describe('Class Model Tests', function() {

    // Create Class Models that will be used across tests.
    {
        var CompareClass1Schema = {
            name: {
                type: String,
                required: true
            },
            numbers: {
                type: [Number]
            },
            class2: {
                type: Schema.Types.ObjectId,
                ref: 'CompareClass2',
                required: true,
                singular: true
            }
        };
    
        var CompareClass1 = new ClassModel({
            className: 'CompareClass1',
            schema: CompareClass1Schema
        });
    
        var CompareClass2Schema = {
            name: {
                type: String,
                required: true
            },
            class1s: {
                type: [Schema.Types.ObjectId],
                ref: 'CompareClass1'
            }
        }
    
        var CompareClass2 = new ClassModel({
            className: 'CompareClass2',
            schema: CompareClass2Schema
        });           
        
        var allFieldsRequiredClassSchema = {
            string: {
                type:String,
                required: true
            },
            strings: {
                type:[String],
                required: true
            },
            date: {
                type: Date,
                required: true
            },
            boolean: {
                type: Boolean,
                required: true
            },
            booleans: {
                type: [Boolean],
                required: true
            },
            number: {
                type: Number,
                required: true
            },
            numbers: {
                type: [Number],
                required: true
            },
            class1: {
                type: Schema.Types.ObjectId,
                ref: 'CompareClass1',
                required: true
            },
            class2s: {
                type: [Schema.Types.ObjectId],
                ref: 'CompareClass2',
                required: true
            }
        };
    
        var AllFieldsRequiredClass = new ClassModel({
            className: 'AllFieldsRequiredClass', 
            schema: allFieldsRequiredClassSchema
        });           
        
        var allFieldsMutexClassSchema = {
            string: {
                type:String,
                mutex: 'a'
            },
            strings: {
                type:[String],
                mutex: 'a'
            },
            date: {
                type: Date,
                mutex: 'a'
            },
            boolean: {
                type: Boolean,
                mutex: 'a'
            },
            booleans: {
                type: [Boolean],
                mutex: 'a'
            },
            number: {
                type: Number,
                mutex: 'a'
            },
            numbers: {
                type: [Number],
                mutex: 'a'
            },
            class1: {
                type: Schema.Types.ObjectId,
                ref: 'CompareClass1',
                mutex: 'a'
            },
            class2s: {
                type: [Schema.Types.ObjectId],
                ref: 'CompareClass2',
                mutex: 'a'
            }
        };
    
        var AllFieldsMutexClass = new ClassModel({
            className: 'AllFieldsMutexClass', 
            schema: allFieldsMutexClassSchema
        });
        
        var allFieldsInRequiredGroupClassSchema = {
            string: {
                type:String,
                requiredGroup: 'a'
            },
            strings: {
                type:[String],
                requiredGroup: 'a'
            },
            date: {
                type: Date,
                requiredGroup: 'a'
            },
            boolean: {
                type: Boolean,
                requiredGroup: 'a'
            },
            booleans: {
                type: [Boolean],
                requiredGroup: 'a'
            },
            number: {
                type: Number,
                requiredGroup: 'a'
            },
            numbers: {
                type: [Number],
                requiredGroup: 'a'
            },
            class1: {
                type: Schema.Types.ObjectId,
                ref: 'CompareClass1',
                requiredGroup: 'a'
            },
            class2s: {
                type: [Schema.Types.ObjectId],
                ref: 'CompareClass2',
                requiredGroup: 'a'
            }
        };
    
        var AllFieldsInRequiredGroupClass = new ClassModel({
            className: 'AllFieldsInRequiredGroupClass',
            schema: allFieldsInRequiredGroupClassSchema
        });

        var SuperClass = new ClassModel({
            className: "SuperClass",
            schema: {
                name: {
                    type: String
                },
                boolean: {
                    type: Boolean,
                },
                number: {
                    type: Number
                }
            }
        });

        var AbstractSuperClass = new ClassModel({
            className: "AbstractSuperClass",
            abstract: true,
            schema: {
                name: {
                    type: String
                },
                abstractBoolean: Boolean,
                abstractNumber: Number
            }
        });

        var DiscriminatedSuperClass = new ClassModel({
            className: "DiscriminatedSuperClass",
            discriminated: true,
            schema: {
                name: {
                    type: String
                },
                boolean: Boolean,
                number: Number
            }
        });

        var AbstractDiscriminatedSuperClass = new ClassModel({
            className: "AbstractDiscriminatedSuperClass",
            discriminated: true,
            abstract: true,
            schema: {
                name: {
                    type: String
                },
                boolean: Boolean,
                number: Number
            }
        });

        var SubClassOfSuperClassSchema = {
            subBoolean: {
                type: Boolean
            },
            subNumber: {
                type: Number
            }
        };        

        var SubClassOfSuperClass = new ClassModel({
            className: 'SubClassOfSuperClass',
            schema: SubClassOfSuperClassSchema,
            superClasses: [SuperClass]
        });

        var SubClassOfAbstractSuperClassSchema = {
            subBoolean: {
                type: Boolean
            },
            subNumber: {
                type: Number
            }
        };        

        var SubClassOfAbstractSuperClass = new ClassModel({
            className: 'SubClassOfAbstractSuperClass',
            schema: SubClassOfAbstractSuperClassSchema,
            superClasses: [AbstractSuperClass]
        });

        var SubClassOfSubCLassOfSuperClassSchema = {
            subSubBoolean: {
                type: Boolean,
                required: true
            },
            subSubNumber: {
                type: Number,
                required: true
            }
        };        

        var SubClassOfSubCLassOfSuperClass = new ClassModel({
            className: 'SubClassOfSubCLassOfSuperClass',
            schema: SubClassOfSubCLassOfSuperClassSchema,
            superClasses: [SubClassOfSuperClass]
        });

        var SubClassOfMultipleSuperClassesSchema = {
            subBoolean: {
                type: Boolean,
                required: true
            },
            subNumber: {
                type: Number,
                required: true
            }
        };        

        var SubClassOfMultipleSuperClasses = new ClassModel({
            className: 'SubClassOfMultipleSuperClasses',
            schema: SubClassOfMultipleSuperClassesSchema,
            superClasses: [SuperClass, AbstractSuperClass]
        });

        var SubClassOfDiscriminatorSuperClassSchema = {
            discriminatedBoolean: {
                type: Boolean
            },
            discriminatedNumber: {
                type: Number
            }
        };        

        var SubClassOfDiscriminatorSuperClass = new ClassModel({
            className: 'SubClassOfDiscriminatorSuperClass',
            schema: SubClassOfDiscriminatorSuperClassSchema,
            discriminatorSuperClass: DiscriminatedSuperClass
        });
    }

    describe('Class Model Constructor', function() {

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

        it('If superClasses is set, it must be an Array.', function() {
            try {
                new ClassModel({
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
            if(Object.keys(SubClassOfSubCLassOfSuperClass.schema).includes('boolean') == false) {
                throw new Error('Sub Class is missing the field "boolean".');
            }

            if(Object.keys(SubClassOfSubCLassOfSuperClass.schema).includes('number') == false) {
                throw new Error('Sub Class is missing the field "number".');
            }

            if(Object.keys(SubClassOfSubCLassOfSuperClass.schema).includes('subBoolean') == false) {
                throw new Error('Sub Class is missing the field "subBoolean".');
            }

            if(Object.keys(SubClassOfSubCLassOfSuperClass.schema).includes('subNumber') == false) {
                throw new Error('Sub Class is missing the field "subNumber".');
            }

            if(Object.keys(SubClassOfSubCLassOfSuperClass.schema).includes('subSubBoolean') == false) {
                throw new Error('Sub Class is missing the field "subSubBoolean".');
            }

            if(Object.keys(SubClassOfSubCLassOfSuperClass.schema).includes('subSubNumber') == false) {
                throw new Error('Sub Class is missing the field "subSubNumber".');
            }

            if (SuperClass.schema.boolean.type != SubClassOfSubCLassOfSuperClass.schema.boolean.type) {
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

        it('ClassModel.save() works properly.', function(done) {
            var instance = AllFieldsRequiredClass.create();
            var error = null;
            var compareResult;
            var testFailed;


            instance.string = 'String';
            instance.strings = ['String'];
            instance.date = new Date();
            instance.boolean = true;
            instance.booleans = [true];
            instance.number = 1;
            instance.numbers = [1];
            instance.class1 = CompareClass1.create()._id;
            instance.class2s = [CompareClass2.create()._id];

            AllFieldsRequiredClass.save(instance).then(    
                function(saved) {
                    AllFieldsRequiredClass.findById(instance._id).then(
                        function(found) {
                            compareResult = AllFieldsRequiredClass.compare(instance, found);
                            if (compareResult.match == false)
                                error = new Error(compareResult.message);
                        },
                        function(findError) {
                            console.log('error');
                            error = findError;
                        }
                    );
                },
                function(saveErr) {
                    testFailed = 1;
                    error = saveErr;
                }
            ).finally(function() {
                if (error)
                    done(error);
                else
                    done();
            });
        });

    });

    describe('ClassModel.findById()', function() {

        var instanceOfAllFieldsMutexClass = AllFieldsMutexClass.create();
        var instanceOfDiscriminatedSuperClass = DiscriminatedSuperClass.create();
        var instanceOfSuperClass = SuperClass.create();
        var instanceOfSubClassOfSuperClass = SubClassOfSuperClass.create();
        var instanceOfSubClassOfAbstractSuperClass = SubClassOfAbstractSuperClass.create();
        var instanceOfSubClassOfDiscriminatorSuperClass = SubClassOfDiscriminatorSuperClass.create();

        instanceOfAllFieldsMutexClass.string = 'instanceOfAllFieldsMutexClass';
        instanceOfDiscriminatedSuperClass.name = 'instanceOfDiscriminatedSuperClass';
        instanceOfSuperClass.name = 'instanceOfSuperClass';
        instanceOfSubClassOfSuperClass.name = 'instanceOfSubClassOfSuperClass';
        instanceOfSubClassOfAbstractSuperClass.name = 'instanceOfSubClassOfAbstractSuperClass';
        instanceOfSubClassOfDiscriminatorSuperClass.name = 'instanceOfSubClassOfDiscriminatorSuperClass';

        before(function(done) {

            AllFieldsMutexClass.save(instanceOfAllFieldsMutexClass).then(
                function() {
                    DiscriminatedSuperClass.save(instanceOfDiscriminatedSuperClass).then(
                        function() {
                            SuperClass.save(instanceOfSuperClass).then(
                                function() {
                                    SubClassOfSuperClass.save(instanceOfSubClassOfSuperClass).then(
                                        function() {
                                            SubClassOfDiscriminatorSuperClass.save(instanceOfSubClassOfDiscriminatorSuperClass).then(
                                                function() {
                                                    SubClassOfAbstractSuperClass.save(instanceOfSubClassOfAbstractSuperClass).finally(done);
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

        describe('Calling findById on the Class of the instance you want to find. (Direct)', function() {

            it('An instance of a concrete class with no subclasses can be found by Id.', function(done) {
                let error;
                let instance;

                AllFieldsMutexClass.findById(instanceOfAllFieldsMutexClass._id).then(
                    function(foundInstance) {
                        instance = foundInstance;
                    },
                    function(findError) {
                        error = findError;
                    }
                ).finally(function() {
                    if (error)
                        done(error);
                    else {
                        if (instance == null) {
                            done(new Error('findById() did not return an instance.'));
                        }
                        else {
                            let compareResult = AllFieldsMutexClass.compare(instance, instanceOfAllFieldsMutexClass);
                            if (!instance._id.equals(instanceOfAllFieldsMutexClass._id) || compareResult.match == false) {
                                done(new Error('An instance was returned, but it is not the correct one. ' + compareResult.message));
                            }
                            else {
                                done();
                            }
                        }
                    }
                });
            });
    
            it('An instance of a concrete discriminated class can be found by Id.', function(done) {
                let error;
                let instance;

                SubClassOfDiscriminatorSuperClass.findById(instanceOfSubClassOfDiscriminatorSuperClass._id).then(
                    function(foundInstance) {
                        instance = foundInstance;
                    },
                    function(findError) {
                        error = findError;
                    }
                ).finally(function() {
                    if (error)
                        done(error);
                    else {
                        if (instance == null) {
                            done(new Error('findById() did not return an instance.'));
                        }
                        else {
                            let compareResult = SubClassOfDiscriminatorSuperClass.compare(instance, instanceOfSubClassOfDiscriminatorSuperClass);
                            if (!instance._id.equals(instanceOfSubClassOfDiscriminatorSuperClass._id) || compareResult.match == false) {
                                done(new Error('An instance was returned, but it is not the correct one. ' + compareResult.message));
                            }
                            else {
                                done();
                            }
                        }
                    }
                });
            });
    
            it('An instance of a concrete super class can be found by Id.', function(done) {
                let error;
                let instance;

                SuperClass.findById(instanceOfSuperClass._id).then(
                    function(foundInstance) {
                        instance = foundInstance;
                    },
                    function(findError) {
                        error = findError;
                    }
                ).finally(function() {
                    if (error)
                        done(error);
                    else {
                        if (instance == null) {
                            done(new Error('findById() did not return an instance.'));
                        }
                        else {
                            let compareResult = SuperClass.compare(instance, instanceOfSuperClass);
                            if (!instance._id.equals(instanceOfSuperClass._id) || compareResult.match == false) {
                                done(new Error('An instance was returned, but it is not the correct one. ' + compareResult.message));
                            }
                            else {
                                done();
                            }
                        }
                    }
                });
            });
    
            it('An instance of a concrete discriminated sub-class can be found by Id.', function(done) {
                let error;
                let instance;

                DiscriminatedSuperClass.findById(instanceOfDiscriminatedSuperClass._id).then(
                    function(foundInstance) {
                        instance = foundInstance;
                    },
                    function(findError) {
                        error = findError;
                    }
                ).finally(function() {
                    if (error)
                        done(error);
                    else {
                        if (instance == null) {
                            done(new Error('findById() did not return an instance.'));
                        }
                        else {
                            let compareResult = DiscriminatedSuperClass.compare(instance, instanceOfDiscriminatedSuperClass);
                            if (!instance._id.equals(instanceOfDiscriminatedSuperClass._id) || compareResult.match == false) {
                                done(new Error('An instance was returned, but it is not the correct one. ' + compareResult.message));
                            }
                            else {
                                done();
                            }
                        }
                    }
                });
            });

        });

        describe('Calling findById on a super class of the class of the instance you want to find. (Indirect)', function() {
    
            it('An instance of a sub class of a discrimintated super class can be found by Id from the super class.', function(done) {
                let error;
                let instance;

                DiscriminatedSuperClass.findById(instanceOfSubClassOfDiscriminatorSuperClass._id).then(
                    function(foundInstance) {
                        instance = foundInstance;
                    },
                    function(findError) {
                        error = findError;
                    }
                ).finally(function() {
                    if (error)
                        done(error);
                    else {
                        if (instance == null) {
                            done(new Error('findById() did not return an instance.'));
                        }
                        else {
                            let compareResult = SubClassOfDiscriminatorSuperClass.compare(instance, instanceOfSubClassOfDiscriminatorSuperClass);
                            if (!instance._id.equals(instanceOfSubClassOfDiscriminatorSuperClass._id) || compareResult.match == false) {
                                done(new Error('An instance was returned, but it is not the correct one. ' + compareResult.message));
                            }
                            else {
                                done();
                            }
                        }
                    }
                });
            });
    
            it('An instance of a concrete sub class of a non-discriminated super class can be found by Id from the super class.', function(done) {
                let error;
                let instance;

                SuperClass.findById(instanceOfSubClassOfSuperClass._id).then(
                    function(foundInstance) {
                        instance = foundInstance;
                    },
                    function(findError) {
                        error = findError;
                    }
                ).finally(function() {
                    if (error)
                        done(error);
                    else {
                        if (instance == null) {
                            done(new Error('findById() did not return an instance.'));
                        }
                        else {
                            let compareResult = SubClassOfSuperClass.compare(instance, instanceOfSubClassOfSuperClass);
                            if (!instance._id.equals(instanceOfSubClassOfSuperClass._id) || compareResult.match == false) {
                                done(new Error('An instance was returned, but it is not the correct one. ' + compareResult.message));
                            }
                            else {
                                done();
                            }
                        }
                    }
                });
            });
            
            it('An instance of a concrete sub class of a non-discriminated abstract super class can be found by Id from the super class.', function(done) {
                let error;
                let instance;

                AbstractSuperClass.findById(instanceOfSubClassOfAbstractSuperClass._id).then(
                    function(foundInstance) {
                        instance = foundInstance;
                    },
                    function(findError) {
                        error = findError;
                    }
                ).finally(function() {
                    if (error)
                        done(error);
                    else {
                        if (instance == null) {
                            done(new Error('findById() did not return an instance.'));
                        }
                        else {
                            let compareResult = SubClassOfAbstractSuperClass.compare(instance, instanceOfSubClassOfAbstractSuperClass);
                            if (!instance._id.equals(instanceOfSubClassOfAbstractSuperClass._id) || compareResult.match == false) {
                                done(new Error('An instance was returned, but it is not the correct one. ' + compareResult.message));
                            }
                            else {
                                done();
                            }
                        }
                    }
                });
            });

        });

        describe('Calling findById on a super class of the super class of the instance you want to find. (Recursive)', function() {
    
            it('SuperClass -> Discriminated Sub Class -> Sub Sub Class', function(done) {
                done();
            });
    
            it('SuperClass -> Abstract Discriminated Sub Class -> Sub Sub Class', function(done) {
                done();
            });
    
            it('SuperClass -> Sub Class -> Sub Sub Class', function(done) {
                done();
            });
    
            it('SuperClass -> Abstract Sub Class -> Sub Sub Class', function(done) {
                done();
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
                                                    SubClassOfAbstractSuperClass.clear(instanceOfSubClassOfAbstractSuperClass).finally(done);
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

});

