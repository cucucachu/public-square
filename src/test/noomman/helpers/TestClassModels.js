require("@babel/polyfill");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassModel = require('../../../dist/noomman/ClassModel');



// Create Class Models that will be used across tests.
{

    // Compare Classes
    {        
        var CompareClass1 = new ClassModel({
            accessControlled: false,
            updateControlled: false,
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
            updateControlled: false,
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

    // Simple Classes
    {   
        var TestClassWithNumber = new ClassModel({
            className: 'TestClassWithNumber',
            accessControlled: false,
            updateControlled: false,
            schema: {
                number: {
                    type: Number
                }
            }
        });

        var TestClassWithBoolean = new ClassModel({
            className: 'TestClassWithBoolean',
            accessControlled: false,
            updateControlled: false,
            schema: {
                boolean: {
                    type: Boolean
                }
            }
        });

        var TestClassWithAllSimpleFields = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'TestClassWithAllSimpleFields', 
            schema: {
                string: {
                    type:String
                },
                strings: {
                    type:[String]
                },
                date: {
                    type: Date
                },
                boolean: {
                    type: Boolean
                },
                booleans: {
                    type: [Boolean]
                },
                number: {
                    type: Number
                },
                numbers: {
                    type: [Number]
                }
            }
        });       

        var AllAttributesAndRelationshipsClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'AllAttributesAndRelationshipsClass', 
            schema: {
                string: {
                    type:String
                },
                strings: {
                    type:[String]
                },
                date: {
                    type: Date
                },
                dates: {
                    type: [Date]
                },
                boolean: {
                    type: Boolean
                },
                booleans: {
                    type: [Boolean]
                },
                number: {
                    type: Number
                },
                numbers: {
                    type: [Number]
                },
                class1: {
                    type: Schema.Types.ObjectId,
                    ref: 'CompareClass1'
                },
                class2s: {
                    type: [Schema.Types.ObjectId],
                    ref: 'CompareClass2'
                }
            }
        });
        
        var AbstractClass = new ClassModel({
            className: 'AbstractClass',
            accessControlled: false,
            updateControlled: false,
            abstract: true,
            schema: {
                number: {
                    type: Number
                }
            }
        });
    }
    
    // Validation Classes
    {        
        var AllFieldsRequiredClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
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
            updateControlled: false,
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
            updateControlled: false,
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

        var MutexClassA = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'MutexClassA', 
            schema: {
                boolean: {
                    type: Boolean,
                    mutex: 'a'
                },
                date: {
                    type: Date,
                    mutex: 'a'
                }
            }
        });

        var MutexClassB = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'MutexClassB', 
            schema: {
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
            }
        });

        var MutexClassC = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'MutexClassC', 
            schema: {
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
            }
        });

    }

    // Inheritance Classes
    {
        var SuperClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
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
            updateControlled: false,
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
            updateControlled: false,
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
            updateControlled: false,
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
            updateControlled: false,
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
            updateControlled: false,
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
            updateControlled: false,
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
            updateControlled: false,
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
            updateControlled: false,
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
            updateControlled: false,
            className: 'DiscriminatedSubClassOfSuperClass',
            discriminated: true,
            superClasses: [SuperClass],
            schema: {
                discriminatedBoolean: {
                    type: Boolean
                },
                discriminatedNumber: {
                    type:Number
                }
            }
        });

        var SubClassOfDiscriminatedSubClassOfSuperClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
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
            updateControlled: false,
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
            updateControlled: false,
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
            updateControlled: false,
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
            updateControlled: false,
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
            updateControlled: false,
            className: 'SubClassOfSingularRelationshipClass',
            schema: {},
            superClasses: [SingularRelationshipClass] 
        });

        var SubClassOfNonSingularRelationshipClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
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
            updateControlled: false,
            accessControlMethod: async instance => {
                const accessControlledByInstance = await instance.walk('accessControlledBy')
                return accessControlledByInstance.allowed;
            },
            schema: {
                name: {
                    type: String
                },
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
            updateControlled: false,
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
            updateControlled: false,
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
            updateControlled: false,
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
            updateControlled: false,
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
            updateControlled: false,
            accessControlMethod: async (instance, numberA, numberB, boolean) => {
                return (numberA + numberB > 0) && boolean;
            },
            schema: {}
        });

        var SingularRelationshipToAccessControlledClassAccessControlledByParameters = new ClassModel({
            className: 'SingularRelationshipToAccessControlledClassAccessControlledByParameters',
            accessControlled: false,
            updateControlled: false,
            schema: {
                name: {
                    type: String
                },
                singularRelationship: {
                    type: Schema.Types.ObjectId,
                    ref: 'AccessControlledClassAccessControlledByParameters'
                }
            }
        });

        var NonSingularRelationshipToAccessControlledClassAccessControlledByParameters = new ClassModel({
            className: 'NonSingularRelationshipToAccessControlledClassAccessControlledByParameters',
            accessControlled: false,
            updateControlled: false,
            schema: {
                name: {
                    type: String
                },
                nonSingularRelationship: {
                    type: [Schema.Types.ObjectId],
                    ref: 'AccessControlledClassAccessControlledByParameters'
                }
            }
        });
    }

    // UpdateControlled Classes
    {
        // A class which is updateControlled by another instance. If that instance has a boolean attribute 'allowed' set to 
        // true, then the instance of this class can be viewed. 
        var UpdateControlledSuperClass = new ClassModel({
            className: 'UpdateControlledSuperClass',
            accessControlled: false,
            updateControlled: true,
            updateControlMethod: async instance => {
                let updateControlledByInstance =  await instance.walk('updateControlledBy');
                return updateControlledByInstance.allowed;
            },
            schema: {
                name: {
                    type: String
                },
                updateControlledBy: {
                    type: Schema.Types.ObjectId,
                    ref: 'ClassControlsUpdateControlledSuperClass'
                }
            }
        });

        // A class which is updateControlled by it's own boolean attribute. If the boolean is set to true, and it passes the 
        // its super class'es update filter, then the instance will be returned by update filter.
        var UpdateControlledSubClassOfUpdateControlledSuperClass = new ClassModel({
            className: 'UpdateControlledSubClassOfUpdateControlledSuperClass',
            accessControlled: false,
            updateControlled: true,
            updateControlMethod: async instance => { return instance.boolean },
            superClasses: [UpdateControlledSuperClass],
            schema: {
                boolean: {
                    type: Boolean
                }
            }
        });

        // A class which is updateControlled by it's own string attribute. If the string matches 'updateControlled', and it passes all
        // it's super classes updatefilters, than an instance of this class will be returned by updateFilter().
        var UpdateControlledDiscriminatedSuperClass = new ClassModel({
            className: 'UpdateControlledDiscriminatedSuperClass',
            accessControlled: false,
            updateControlled: true,
            discriminated: true,
            superClasses: [UpdateControlledSubClassOfUpdateControlledSuperClass],
            updateControlMethod: async instance => { return instance.string == 'updateControlled' },
            schema: {
                string: {
                    type: String
                }
            }
        });

        // A class which is updateControlled by it's own number attribute. If the number is greater than 0, and it passes all
        // it's super classes updatefilters, than an instance of this class will be returned by updateFilter().
        var UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass = new ClassModel({
            className: 'UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass',
            accessControlled: false, 
            updateControlled: true,
            discriminatorSuperClass: UpdateControlledDiscriminatedSuperClass,
            updateControlMethod: async instance => { return instance.number > 0 },
            schema: {
                number: {
                    type: Number
                }
            }
        });

        // A class which is used to secure another class. If an instance of this class has its 'allowed' attribute
        // set to true, than instances of UpdateControlledSuperClass related to this instance will pass the updateFilter.
        var ClassControlsUpdateControlledSuperClass = new ClassModel({
            className: 'ClassControlsUpdateControlledSuperClass',
            accessControlled: false,
            updateControlled: false,
            schema: {
                allowed: {
                    type: Boolean
                }
            }
        });

        // A class which is updateControlled by parameters passed into the updateFilter method. If the two numbers add up to a 
        // positive number, and the boolean is true, than the instance will pass the update filter. 
        var UpdateControlledClassUpdateControlledByParameters = new ClassModel({
            className: 'UpdateControlledClassUpdateControlledByParameters',
            accessControlled: false,
            updateControlled: true,
            updateControlMethod: async (instance, numberA, numberB, boolean) => {
                return (numberA + numberB > 0) && boolean;
            },
            schema: {}
        });
    }

}

module.exports = {
    CompareClass1,
    CompareClass2,
    TestClassWithNumber,
    TestClassWithBoolean,
    TestClassWithAllSimpleFields,
    AllAttributesAndRelationshipsClass,
    AbstractClass,
    AllFieldsRequiredClass,
    AllFieldsMutexClass,
    AllFieldsInRequiredGroupClass,
    MutexClassA,
    MutexClassB,
    MutexClassC,
    SuperClass,
    AbstractSuperClass,
    DiscriminatedSuperClass, 
    AbstractDiscriminatedSuperClass,
    SubClassOfSuperClass,
    SubClassOfAbstractSuperClass,
    AbstractSubClassOfSuperClass,
    SubClassOfMultipleSuperClasses,
    SubClassOfDiscriminatorSuperClass,
    DiscriminatedSubClassOfSuperClass,
    SubClassOfDiscriminatedSubClassOfSuperClass,
    SubClassOfSubClassOfSuperClass,
    SubClassOfAbstractSubClassOfSuperClass,
    SingularRelationshipClass,
    NonSingularRelationshipClass,
    SubClassOfSingularRelationshipClass,
    SubClassOfNonSingularRelationshipClass,
    AccessControlledSuperClass,
    AccessControlledSubClassOfAccessControlledSuperClass,
    AccessControlledDiscriminatedSuperClass,
    AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass,
    ClassControlsAccessControlledSuperClass,
    AccessControlledClassAccessControlledByParameters,
    SingularRelationshipToAccessControlledClassAccessControlledByParameters,
    NonSingularRelationshipToAccessControlledClassAccessControlledByParameters,
    UpdateControlledSuperClass, 
    UpdateControlledSubClassOfUpdateControlledSuperClass,
    UpdateControlledDiscriminatedSuperClass,
    UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass,
    ClassControlsUpdateControlledSuperClass,
    UpdateControlledClassUpdateControlledByParameters
}