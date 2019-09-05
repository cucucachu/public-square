const promiseFinally = require('promise.prototype.finally');
require("@babel/polyfill");

const ClassModel = require('../dist/models/ClassModel');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const database = require('../dist/models/database');


promiseFinally.shim();

process.on('unhandledRejection', error => {
	console.log('unhandledRejection', error.message);
});

describe('Class Model Tests', function() {

    before(async () => {
        console.log('Typeof connect ' + typeof(database.connect))
        await database.connect();
    });

    // Create Class Models that will be used across tests.
    {

        // Compare Classes
        {        
            var CompareClass1 = new ClassModel({
                accessControlled: false,
                className: 'CompareClass1',
                schema: {
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
                }
            });

            var CompareClass2 = new ClassModel({
                accessControlled: false,
                className: 'CompareClass2',
                schema: {
                    name: {
                        type: String,
                        required: true
                    },
                    class1s: {
                        type: [Schema.Types.ObjectId],
                        ref: 'CompareClass1'
                    }
                }
            }); 
        }          
        
        // Validation Classes
        {        
            var AllFieldsRequiredClass = new ClassModel({
                accessControlled: false,
                className: 'AllFieldsRequiredClass', 
                schema: {
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
                }
            });
        
            var AllFieldsMutexClass = new ClassModel({
                accessControlled: false,
                className: 'AllFieldsMutexClass', 
                schema: {
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
                }
            });
        
            var AllFieldsInRequiredGroupClass = new ClassModel({
                accessControlled: false,
                className: 'AllFieldsInRequiredGroupClass',
                schema: {
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
                }
            });

        }

        // Inheritance Classes
        {
            var SuperClass = new ClassModel({
                accessControlled: false,
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
                accessControlled: false,
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
                accessControlled: false,
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
                accessControlled: false,
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
    
            var SubClassOfSuperClass = new ClassModel({
                accessControlled: false,
                className: 'SubClassOfSuperClass',
                superClasses: [SuperClass],
                schema: {
                    subBoolean: {
                        type: Boolean
                    },
                    subNumber: {
                        type: Number
                    }
                },
            });   
    
            var SubClassOfAbstractSuperClass = new ClassModel({
                accessControlled: false,
                className: 'SubClassOfAbstractSuperClass',
                superClasses: [AbstractSuperClass],
                schema: {
                    subBoolean: {
                        type: Boolean
                    },
                    subNumber: {
                        type: Number
                    }
                }
            });
    
            var AbstractSubClassOfSuperClass = new ClassModel({
                accessControlled: false,
                className: 'AbstractSubClassOfSuperClass',
                superClasses: [SuperClass],
                abstract: true,
                schema: {
                    abstractSubBoolean: {
                        type: Boolean
                    },
                    abstractSubNumber: {
                        type: Number
                    }
                }
            });      
    
            var SubClassOfMultipleSuperClasses = new ClassModel({
                accessControlled: false,
                className: 'SubClassOfMultipleSuperClasses',
                superClasses: [SuperClass, AbstractSuperClass],
                schema: {
                    subBoolean: {
                        type: Boolean,
                        required: true
                    },
                    subNumber: {
                        type: Number,
                        required: true
                    }
                }
            });   
    
            var SubClassOfDiscriminatorSuperClass = new ClassModel({
                accessControlled: false,
                className: 'SubClassOfDiscriminatorSuperClass',
                discriminatorSuperClass: DiscriminatedSuperClass,
                schema: {
                    discriminatedBoolean: {
                        type: Boolean
                    },
                    discriminatedNumber: {
                        type: Number
                    }
                }
            });
    
            var DiscriminatedSubClassOfSuperClass = new ClassModel({
                accessControlled: false,
                className: 'DiscriminatedSubClassOfSuperClass',
                discriminated: true,
                superClasses: [SuperClass],
                schema: {
                    discriminatedBoolean: {
                        type: Boolean
                    },
                    discriminatedNumber: {
                        type:Boolean
                    }
                }
            });
    
            var SubClassOfDiscriminatedSubClassOfSuperClass = new ClassModel({
                accessControlled: false,
                className: 'SubClassOfDiscriminatedSubClassOfSuperClass',
                discriminatorSuperClass: DiscriminatedSubClassOfSuperClass,
                schema: {
                    subDiscriminatedBoolean: {
                        type: Boolean
                    },
                    subDiscriminatedNumber: {
                        type: Number
                    }
                }
            });     
    
            var SubClassOfSubClassOfSuperClass = new ClassModel({
                accessControlled: false,
                className: 'SubClassOfSubClassOfSuperClass',
                schema: {
                    subSubBoolean: {
                        type: Boolean
                    },
                    subSubNumber: {
                        type: Number
                    }
                },
                superClasses: [SubClassOfSuperClass]
            });
    
            var SubClassOfAbstractSubClassOfSuperClass = new ClassModel({
                accessControlled: false,
                className: 'SubClassOfAbstractSubClassOfSuperClass',
                superClasses: [AbstractSubClassOfSuperClass],
                schema: {
                    subAbstractSubBoolean: {
                        type: Boolean
                    },
                    subAbstractSubNumber: {
                        type: Number
                    }
                }
            });

        }

        // Relationship Classes
        {
            var SingularRelationshipClass = new ClassModel({
                accessControlled: false,
                className: 'SingularRelationshipClass',
                schema: {
                    singularRelationship: {
                        type: Schema.Types.ObjectId,
                        ref: 'NonSingularRelationshipClass'
                    },
                    boolean: {
                        type: Boolean
                    },
                    booleans: {
                        type: [Boolean]
                    }
                }
            });
    
            var NonSingularRelationshipClass = new ClassModel({
                accessControlled: false,
                className: 'NonSingularRelationshipClass',
                schema: {
                    nonSingularRelationship: {
                        type: [Schema.Types.ObjectId],
                        ref: 'SingularRelationshipClass'
                    },
                    boolean: {
                        type: Boolean
                    }
                } 
            });
    
            var SubClassOfSingularRelationshipClass = new ClassModel({
                accessControlled: false,
                className: 'SubClassOfSingularRelationshipClass',
                schema: {},
                superClasses: [SingularRelationshipClass] 
            });
    
            var SubClassOfNonSingularRelationshipClass = new ClassModel({
                accessControlled: false,
                className: 'SubClassOfNonSingularRelationshipClass',
                schema: {},
                superClasses: [NonSingularRelationshipClass] 
            });

        }

        // AccessControlled Classes
        {
            // A class which is accessControlled by another instance. If that instance has a boolean attribute 'allowed' set to 
            // true, then the instance of this class can be viewed. 
            var AccessControlledSuperClass = new ClassModel({
                className: 'AccessControlledSuperClass',
                accessControlled: true,
                accessControlMethod: async instance => { 
                    let accessControlledByInstance =  await AccessControlledSuperClass.walk(instance, 'accessControlledBy');
                    return accessControlledByInstance.allowed;
                },
                schema: {
                    accessControlledBy: {
                        type: Schema.Types.ObjectId,
                        ref: 'ClassControlsAccessControlledSuperClass'
                    }
                }
            });

            // A class which is accessControlled by it's own boolean attribute. If the boolean is set to true, and it passes the 
            // its super class'es access filter, then the instance will be returned by access filter.
            var AccessControlledSubClassOfAccessControlledSuperClass = new ClassModel({
                className: 'AccessControlledSubClassOfAccessControlledSuperClass',
                accessControlled: true,
                accessControlMethod: async instance => { return instance.boolean },
                superClasses: [AccessControlledSuperClass],
                schema: {
                    boolean: {
                        type: Boolean
                    }
                }
            });

            // A class which is accessControlled by it's own string attribute. If the string matches 'accessControlled', and it passes all
            // it's super classes accessfilters, than an instance of this class will be returned by accessFilter().
            var AccessControlledDiscriminatedSuperClass = new ClassModel({
                className: 'AccessControlledDiscriminatedSuperClass',
                accessControlled: true,
                discriminated: true,
                superClasses: [AccessControlledSubClassOfAccessControlledSuperClass],
                accessControlMethod: async instance => { return instance.string == 'accessControlled' },
                schema: {
                    string: {
                        type: String
                    }
                }
            });

            // A class which is accessControlled by it's own number attribute. If the number is greater than 0, and it passes all
            // it's super classes accessfilters, than an instance of this class will be returned by accessFilter().
            var AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass = new ClassModel({
                className: 'AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass',
                accessControlled: true, 
                discriminatorSuperClass: AccessControlledDiscriminatedSuperClass,
                accessControlMethod: async instance => { return instance.number > 0 },
                schema: {
                    number: {
                        type: Number
                    }
                }
            });

            // A class which is used to secure another class. If an instance of this class has its 'allowed' attribute
            // set to true, than instances of AccessControlledSuperClass related to this instance will pass the accessFilter.
            var ClassControlsAccessControlledSuperClass = new ClassModel({
                className: 'ClassControlsAccessControlledSuperClass',
                accessControlled: false,
                schema: {
                    allowed: {
                        type: Boolean
                    }
                }
            });

            // A class which is accessControlled by parameters passed into the accessFilter method. If the two numbers add up to a 
            // positive number, and the boolean is true, than the instance will pass the access filter. 
            var AccessControlledClassAccessControlledByParameters = new ClassModel({
                className: 'AccessControlledClassAccessControlledByParameters',
                accessControlled: true,
                accessControlMethod: async (instance, numberA, numberB, boolean) => {
                    return (numberA + numberB > 0) && boolean;
                },
                schema: {}
            });
        }

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
                    accessControlled: false,
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

        it('If a class is accessControlled, it must have a accessControlMethod, or it must have at least one super class with an accessControlMethod.', () => {
            try {
                new ClassModel({
                    className: 'Class',
                    accessControlled: true,
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

        it('If superClasses is set, it must be an Array.', function() {
            try {
                new ClassModel({
                    accessControlled: false,
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
                    accessControlled: false,
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

        it('ClassModel.save() throws an error when called on an instance of a different ClassModel.', function() {
            let expectedErrorMessage = 'AllFieldsRequiredClass.save() called on an instance of a different class.'; 
            let instance = SuperClass.create();
            let testFailed = true;

            AllFieldsRequiredClass.save(instance).then(
                () => {

                },
                (saveError) => {
                    if (saveError.message != expectedErrorMessage) 
                        throw new Error(
                            'ClassModel.save() did not throw the expected error message.\n' + 
                            'Expected: ' + expectedErrorMessage + '\n' + 
                            'Actual:   ' + saveError.message
                        )
                    
                    testFailed = false;

                }
            ).finally(() => {
                if (testFailed)
                    throw new Error('ClassModel.save() did not throw an error when it should have.');
            })

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

            // await AllFieldsRequiredClass.save(instance);
            // console.log('Instance Saved');
            // console.log(instance._id);
            // const found = await AllFieldsRequiredClass.findById(instance._id);
            // console.log('Instance Found');
            // const compareResult = AllFieldsRequiredClass.compare(instance, found);
            // console.log('Instance compared.');

            // if (!compareResult.match) {
            //     console.log('in here' + compareResult.message);
            //     throw new Error(compareResult.mesasage);
            // }

            // console.log('done');
            // return true;



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

        it('Throws an error if argument an instance of the wrong classModel.', function(done) {
            let instance = AllFieldsRequiredClass.create();
            let expectedErrorMessage = 'SuperClass.save() called on an instance of a different class.';
            let error;
            
            SuperClass.saveAll([instance]).then(
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
                                                    SubClassOfAbstractSuperClass.save(instanceOfSubClassOfAbstractSuperClass).then(
                                                        function() {
                                                            SubClassOfDiscriminatedSubClassOfSuperClass.save(instanceOfSubClassOfDiscriminatedSubClassOfSuperClass).then(
                                                                function() {
                                                                    SubClassOfSubClassOfSuperClass.save(instanceOfSubClassOfSubClassOfSuperClass).then(
                                                                        function() {
                                                                            SubClassOfAbstractSubClassOfSuperClass.save(instanceOfSubClassOfAbstractSubClassOfSuperClass).finally(done);
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

        describe('ClassModel.findById()', function() {
    
            describe('Calling findById on the Class of the instance you want to find. (Direct)', function() {

                it('An instance of a concrete class with no subclasses can be found by Id.', async () => {
                    const classOfInstance = AllFieldsMutexClass
                    const instanceToFind = instanceOfAllFieldsMutexClass
                    const instanceFound = await classOfInstance.findById(instanceToFind._id);

                    if (!instanceFound) {
                        throw new Error('findById() did not return an instance');
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
                        throw new Error('findById() did not return an instance');
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
                        throw new Error('findById() did not return an instance');
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
                        throw new Error('findById() did not return an instance');
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
                        throw new Error('findById() did not return an instance');
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
                        throw new Error('findById() did not return an instance');
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
                        throw new Error('findById() did not return an instance');
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
                        throw new Error('findById() did not return an instance');
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
                        throw new Error('findById() did not return an instance');
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
                        throw new Error('findById() did not return an instance');
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
                        throw new Error('findOne() did not return an instance');
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
                        throw new Error('findOne() did not return an instance');
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
                        throw new Error('findOne() did not return an instance');
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
                        throw new Error('findOne() did not return an instance');
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
                        throw new Error('findOne() did not return an instance');
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
                        throw new Error('findOne() did not return an instance');
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
                        throw new Error('findOne() did not return an instance');
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
                        throw new Error('findOne() did not return an instance');
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
                        throw new Error('findOne() did not return an instance');
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
                        throw new Error('findOne() did not return an instance');
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

    describe('ClassModel.accessFilter()', function() {

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
            instanceOfAccessControlledSuperClassPasses.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;

            var instanceOfAccessControlledSuperClassFailsRelationship = AccessControlledSuperClass.create();
            instanceOfAccessControlledSuperClassFailsRelationship.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassNotAllowed;

            // AccessControlledSubClassOfAccessControlledSuperClass Instances
            var instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses = AccessControlledSubClassOfAccessControlledSuperClass.create();
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses.boolean = true;

            var instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship = AccessControlledSubClassOfAccessControlledSuperClass.create();
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassNotAllowed;
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship.boolean = true;

            var instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean = AccessControlledSubClassOfAccessControlledSuperClass.create();
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;
            instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean.boolean = false;

            // AccessControlledDiscriminatedSuperClass Instances
            var instanceOfAccessControlledDiscriminatedSuperClassPasses = AccessControlledDiscriminatedSuperClass.create();
            instanceOfAccessControlledDiscriminatedSuperClassPasses.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;
            instanceOfAccessControlledDiscriminatedSuperClassPasses.boolean = true;
            instanceOfAccessControlledDiscriminatedSuperClassPasses.string = 'accessControlled';

            var instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship = AccessControlledDiscriminatedSuperClass.create();
            instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassNotAllowed;
            instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship.boolean = true;
            instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship.string = 'accessControlled';

            var instanceOfAccessControlledDiscriminatedSuperClassFailsString = AccessControlledDiscriminatedSuperClass.create();
            instanceOfAccessControlledDiscriminatedSuperClassFailsString.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;
            instanceOfAccessControlledDiscriminatedSuperClassFailsString.boolean = true;
            instanceOfAccessControlledDiscriminatedSuperClassFailsString.string = 'not accessControlled';

            var instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean = AccessControlledDiscriminatedSuperClass.create();
            instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;
            instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean.boolean = false;
            instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean.string = 'accessControlled';

            // AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass Instances
            var instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses = AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass.create(); 
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;  
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses.boolean = true;
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses.string = 'accessControlled';         
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses.number = 1;

            var instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship = AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass.create();
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassNotAllowed;             
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship.number = 1;
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship.boolean = true;
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship.string = 'accessControlled';

            var instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean = AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass.create();
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;     
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean.boolean = false;
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean.string = 'accessControlled';
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean.number = 1;

            var instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString = AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass.create();
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;     
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString.boolean = true;
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString.string = 'not accessControlled';            
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString.number = 1;

            var instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber = AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass.create(); 
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber.accessControlledBy = instanceOfClassControlsAccessControlledSuperClassAllowed;
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber.boolean = true;
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber.string = 'accessControlled';      
            instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber.number = -1;

            // AccessControlledClassAccessControlledByParameters Instances
            var instanceOfAccessControlledClassAccessControlledByParameters = AccessControlledClassAccessControlledByParameters.create();

        }

        // Save all SecurityFilter Test Instances
        before(done => {
            ClassControlsAccessControlledSuperClass.saveAll([
                instanceOfClassControlsAccessControlledSuperClassAllowed,
                instanceOfClassControlsAccessControlledSuperClassNotAllowed
            ]).then(() => {
                AccessControlledSuperClass.saveAll([
                    instanceOfAccessControlledSuperClassPasses,
                    instanceOfAccessControlledSuperClassFailsRelationship
                ]).then(() => {
                    AccessControlledSubClassOfAccessControlledSuperClass.saveAll([
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean
                    ]).then(() => {
                        AccessControlledDiscriminatedSuperClass.saveAll([
                            instanceOfAccessControlledDiscriminatedSuperClassPasses,
                            instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship,
                            instanceOfAccessControlledDiscriminatedSuperClassFailsString,
                            instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean
                        ]).then(() => {
                            AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass.saveAll([
                                instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses,
                                instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsRelationship,
                                instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsBoolean,
                                instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsString,
                                instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassFailsNumber
                            ]).catch(done).finally(done);
                        });
                    });
                });
            });
        });

        describe('Tests for invalid arguments.', function() {

            it('First Argument must be an Array', (done) => {
                let error;
                let expectedErrorMessage = 'Incorrect parameters. ' + AccessControlledSuperClass.className + '.accessFilter(Array<instance> instances, ...accessControlMethodParameters)';

                AccessControlledSuperClass.accessFilter(instanceOfAccessControlledSuperClassPasses, instanceOfAccessControlledSuperClassPasses._id).then(
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
                        done(new Error('ClassModel.accessFilter() should have thrown an error.'));
                    }
                });
            });

            it('All instances must be of the Class or a Sub Class', (done) => {
                let error;
                let expectedErrorMessage = AccessControlledSubClassOfAccessControlledSuperClass.className + '.accessFilter() called with instances of a different class.';

                AccessControlledSubClassOfAccessControlledSuperClass.accessFilter([instanceOfAccessControlledSuperClassPasses, instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses], instanceOfAccessControlledSubClassOfAccessControlledDiscriminatedSuperClassPasses._id).then(
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
                        done(new Error('ClassModel.accessFilter() should have thrown an error.'));
                    }
                });
            });

        });

        describe('Test filtering out instances that don\'t pass access control check.', () => {

            describe('AccessControlledSuperClass.accessFilter()', () => {

                it('Security Filter called on Class with only direct instances of Class.', done => {
                    let instances = [instanceOfAccessControlledSuperClassPasses, instanceOfAccessControlledSuperClassFailsRelationship];

                    let expectedInstances = [instanceOfAccessControlledSuperClassPasses];
                    
                    AccessControlledSuperClass.accessFilter(instances)
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

                it('Security Filter called on Class with instances of class and sub class.', done => {
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

                    AccessControlledSuperClass.accessFilter(instances)
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

                it('Security Filter called on Class with instances of class and 2 layers of sub classes', done => {
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

                    AccessControlledSuperClass.accessFilter(instances)
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

                it('Security Filter called on Class with instances of 3 layers of sub classes', done => {
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

                    AccessControlledSuperClass.accessFilter(instances)
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

            describe('AccessControlledSubClassOfAccessControlledSuperClass.accessFilter()', () => {

                it('Security Filter called on Class with only direct instances of Class.', done => {
                    let instances = [
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsBoolean,
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassFailsRelationship
                    ];

                    let expectedInstances = [
                        instanceOfAccessControlledSubClassOfAccessControlledSuperClassPasses
                    ];

                    AccessControlledSubClassOfAccessControlledSuperClass.accessFilter(instances)
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

                it('Security Filter called on Class with instances of class and 1 layers of sub classes', done => {
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

                    AccessControlledSubClassOfAccessControlledSuperClass.accessFilter(instances)
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

                it('Security Filter called on Class with instances of 2 layers of sub classes', done => {
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

                    AccessControlledSubClassOfAccessControlledSuperClass.accessFilter(instances)
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

            describe('AccessControlledDiscriminatedSuperClass.accessFilter()', () => {

                it('Security Filter called on Class with only direct instances of Class.', done => {
                    let instances = [
                        instanceOfAccessControlledDiscriminatedSuperClassPasses,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsString,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsBoolean,
                        instanceOfAccessControlledDiscriminatedSuperClassFailsRelationship
                    ];

                    let expectedInstances = [
                        instanceOfAccessControlledDiscriminatedSuperClassPasses
                    ];

                    AccessControlledDiscriminatedSuperClass.accessFilter(instances)
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

                it('Security Filter called on Class with instances of 1 layers of sub classes', done => {
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

                    AccessControlledDiscriminatedSuperClass.accessFilter(instances)
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

            describe('AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass.accessFilter()', () => {

                it('Security Filter called on Class with only direct instances of Class.', done => {
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

                    AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass.accessFilter(instances)
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

            describe('AccessControlledClassAccessControlledByParameters.accessFilter()', () => {

                it('Instance passes access control check', done => {
                    let instances = [instanceOfAccessControlledClassAccessControlledByParameters];

                    let expectedInstances = [instanceOfAccessControlledClassAccessControlledByParameters];
                    
                    AccessControlledClassAccessControlledByParameters.accessFilter(instances, 1, 1, true)
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
                    
                    AccessControlledClassAccessControlledByParameters.accessFilter(instances, -2, 1, true)
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
                    
                    AccessControlledClassAccessControlledByParameters.accessFilter(instances, 1, 1, false)
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

    });

    after(() => {
        database.close();
    });

});

