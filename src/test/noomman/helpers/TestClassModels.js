require("@babel/polyfill");

const ClassModel = require('../../../dist/noomman/ClassModel');



// Create Class Models that will be used across tests.
{

    // Compare Classes
    {        
        var CompareClass1 = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'CompareClass1',
            attributes: [
                {
                    name: 'name',
                    type: String,
                    required: true,
                },
                {
                    name: 'numbers',
                    type: Number,
                    list: true,
                }
            ],
            relationships: [
                {
                    name: 'class2',
                    toClass: 'CompareClass2',
                    required: true,
                    singular: true,
                },
            ],
        });

        var CompareClass2 = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'CompareClass2',
            attributes: [
                {
                    name: 'name',
                    type: String,
                    required: true,
                },
            ],
            relationships: [
                {
                    name: 'class1s',
                    toClass: 'CompareClass1',
                    singular: false,
                },
            ],
        }); 
    }       

    // Simple Classes
    {   
        var TestClassWithNumber = new ClassModel({
            className: 'TestClassWithNumber',
            accessControlled: false,
            updateControlled: false,
            attributes: [
                {
                    name: 'number',
                    type: Number,
                },
            ],
        });

        var TestClassWithBoolean = new ClassModel({
            className: 'TestClassWithBoolean',
            accessControlled: false,
            updateControlled: false,
            attributes: [
                {
                    name: 'boolean',
                    type: Boolean,
                },
            ],
        });

        var TestClassWithAllSimpleFields = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'TestClassWithAllSimpleFields',
            attributes: [
                {
                    name: 'string',
                    type: String,
                },
                {
                    name: 'strings',
                    type: String,
                    list: true,
                },
                {
                    name: 'date',
                    type: Date,
                },
                {
                    name: 'boolean',
                    type: Boolean,
                },
                {
                    name: 'booleans',
                    type: Boolean,
                    list: true,
                },
                {
                    name: 'number',
                    type: Number,
                },
                {
                    name: 'numbers',
                    type: Number,
                    list: true,
                },
            ],
        });       

        var AllAttributesAndRelationshipsClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'AllAttributesAndRelationshipsClass', 
            attributes: [
                {
                    name: 'string',
                    type: String,
                },
                {
                    name: 'strings',
                    type: String,
                    list: true,
                },
                {
                    name: 'date',
                    type: Date,
                },
                {
                    name: 'boolean',
                    type: Boolean,
                },
                {
                    name: 'booleans',
                    type: Boolean,
                    list: true,
                },
                {
                    name: 'number',
                    type: Number,
                },
                {
                    name: 'numbers',
                    type: Number,
                    list: true,
                },
            ],
            relationships: [
                {
                    name: 'class1',
                    toClass: 'CompareClass1',
                    singular: true,
                },
                {
                    name: 'class2s',
                    toClass: 'CompareClass2',
                    singular: false,
                }
            ],
        });
        
        var AbstractClass = new ClassModel({
            className: 'AbstractClass',
            accessControlled: false,
            updateControlled: false,
            abstract: true,
            attributes: [
                {
                    name: 'number',
                    type: Number,
                }
            ],
        });
    }
    
    // Validation Classes
    {        
        var AllFieldsRequiredClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'AllFieldsRequiredClass', 
            attributes: [
                {
                    name: 'string',
                    type: String,
                    required: true,
                },
                {
                    name: 'strings',
                    type: String,
                    list: true,
                    required: true,
                },
                {
                    name: 'date',
                    type: Date,
                    required: true,
                },
                {
                    name: 'boolean',
                    type: Boolean,
                    required: true,
                },
                {
                    name: 'booleans',
                    type: Boolean,
                    list: true,
                    required: true,
                },
                {
                    name: 'number',
                    type: Number,
                    required: true,
                },
                {
                    name: 'numbers',
                    type: Number,
                    list: true,
                    required: true,
                },
            ],
            relationships: [
                {
                    name: 'class1',
                    toClass: 'CompareClass1',
                    singular: true,
                    required: true,
                },
                {
                    name: 'class2s',
                    toClass: 'CompareClass2',
                    singular: false,
                    required: true,
                }
            ],
        });
    
        var AllFieldsMutexClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'AllFieldsMutexClass', 
            attributes: [
                {
                    name: 'string',
                    type: String,
                    mutex: 'a'
                },
                {
                    name: 'strings',
                    type: String,
                    list: true,
                    mutex: 'a'
                },
                {
                    name: 'date',
                    type: Date,
                    mutex: 'a'
                },
                {
                    name: 'boolean',
                    type: Boolean,
                    mutex: 'a'
                },
                {
                    name: 'booleans',
                    type: Boolean,
                    list: true,
                    mutex: 'a'
                },
                {
                    name: 'number',
                    type: Number,
                    mutex: 'a'
                },
                {
                    name: 'numbers',
                    type: Number,
                    list: true,
                    mutex: 'a'
                },
            ],
            relationships: [
                {
                    name: 'class1',
                    toClass: 'CompareClass1',
                    singular: true,
                    mutex: 'a'
                },
                {
                    name: 'class2s',
                    toClass: 'CompareClass2',
                    singular: false,
                    mutex: 'a'
                }
            ],
        });
    
        var AllFieldsInRequiredGroupClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'AllFieldsInRequiredGroupClass',
            attributes: [
                {
                    name: 'string',
                    type: String,
                    requiredGroup: 'a'
                },
                {
                    name: 'strings',
                    type: String,
                    list: true,
                    requiredGroup: 'a'
                },
                {
                    name: 'date',
                    type: Date,
                    requiredGroup: 'a'
                },
                {
                    name: 'boolean',
                    type: Boolean,
                    requiredGroup: 'a'
                },
                {
                    name: 'booleans',
                    type: Boolean,
                    list: true,
                    requiredGroup: 'a'
                },
                {
                    name: 'number',
                    type: Number,
                    requiredGroup: 'a'
                },
                {
                    name: 'numbers',
                    type: Number,
                    list: true,
                    requiredGroup: 'a'
                },
            ],
            relationships: [
                {
                    name: 'class1',
                    toClass: 'CompareClass1',
                    singular: true,
                    requiredGroup: 'a'
                },
                {
                    name: 'class2s',
                    toClass: 'CompareClass2',
                    singular: false,
                    requiredGroup: 'a'
                }
            ],
        });

        var MutexClassA = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'MutexClassA', 
            attributes: [
                {
                    name: 'boolean',
                    type: Boolean,
                    mutex: 'a',
                },
                {
                    name: 'date',
                    type: Date,
                    mutex: 'a',
                }
            ],
        });

        var MutexClassB = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'MutexClassB', 
            relationships: [
                {
                    name: 'class1',
                    toClass: 'CompareClass1',
                    singular: true,
                    mutex: 'a',
                },
                {
                    name: 'class2',
                    toClass: 'CompareClass2',
                    singular: true,
                    mutex: 'a',
                },
            ],
        });

        var MutexClassC = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'MutexClassC',
            relationships: [
                {
                    name: 'class1s',
                    toClass: 'CompareClass1',
                    singular: false,
                    mutex: 'a',
                },
                {
                    name: 'class2s',
                    toClass: 'CompareClass2',
                    singular: false,
                    mutex: 'a',
                },
            ],
        });

    }

    // Inheritance Classes
    {
        var SuperClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: "SuperClass",
            attributes: [
                {
                    name: 'name',
                    type: String,
                },
                {
                    name: 'boolean',
                    type: Boolean,
                },
                {
                    name: 'number',
                    type: Number,
                },
            ],
        });

        var AbstractSuperClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: "AbstractSuperClass",
            abstract: true,
            attributes: [
                {
                    name: 'name',
                    type: String,
                },
                {
                    name: 'abstractBoolean',
                    type: Boolean,
                },
                {
                    name: 'abstractNumber',
                    type: Number,
                },
            ],
        });

        var DiscriminatedSuperClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: "DiscriminatedSuperClass",
            discriminated: true,
            attributes: [
                {
                    name: 'name',
                    type: String,
                },
                {
                    name: 'boolean',
                    type: Boolean,
                },
                {
                    name: 'number',
                    type: Number,
                },
            ],
        });

        var AbstractDiscriminatedSuperClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: "AbstractDiscriminatedSuperClass",
            discriminated: true,
            abstract: true,
            attributes: [
                {
                    name: 'name',
                    type: String,
                },
                {
                    name: 'boolean',
                    type: Boolean,
                },
                {
                    name: 'number',
                    type: Number,
                },
            ],
        });   

        var SubClassOfSuperClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'SubClassOfSuperClass',
            superClasses: [SuperClass],
            attributes: [
                {
                    name: 'subBoolean',
                    type: Boolean,
                },
                {
                    name: 'subNumber',
                    type: Number,
                },
            ],
        });   

        var SubClassOfAbstractSuperClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'SubClassOfAbstractSuperClass',
            superClasses: [AbstractSuperClass],
            attributes: [
                {
                    name: 'subBoolean',
                    type: Boolean,
                },
                {
                    name: 'subNumber',
                    type: Number,
                },
            ],
        });

        var AbstractSubClassOfSuperClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'AbstractSubClassOfSuperClass',
            superClasses: [SuperClass],
            abstract: true,
            attributes: [
                {
                    name: 'abstractSubBoolean',
                    type: Boolean,
                },
                {
                    name: 'abstractSubNumber',
                    type: Number,
                },
            ],
        });      

        var SubClassOfMultipleSuperClasses = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'SubClassOfMultipleSuperClasses',
            superClasses: [SuperClass, AbstractSuperClass],
            attributes: [
                {
                    name: 'subBoolean',
                    type: Boolean,
                    required: true,
                },
                {
                    name: 'subNumber',
                    type: Number,
                    required: true,
                },
            ],
        });   

        var SubClassOfDiscriminatorSuperClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'SubClassOfDiscriminatorSuperClass',
            discriminatorSuperClass: DiscriminatedSuperClass,
            attributes: [
                {
                    name: 'discriminatedBoolean',
                    type: Boolean,
                },
                {
                    name: 'discriminatedNumber',
                    type: Number,
                },
            ],
        });

        var DiscriminatedSubClassOfSuperClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'DiscriminatedSubClassOfSuperClass',
            discriminated: true,
            superClasses: [SuperClass],
            attributes: [
                {
                    name: 'discriminatedBoolean',
                    type: Boolean,
                },
                {
                    name: 'discriminatedNumber',
                    type: Number,
                },
            ],
        });

        var SubClassOfDiscriminatedSubClassOfSuperClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'SubClassOfDiscriminatedSubClassOfSuperClass',
            discriminatorSuperClass: DiscriminatedSubClassOfSuperClass,
            attributes: [
                {
                    name: 'subDiscriminatedBoolean',
                    type: Boolean,
                },
                {
                    name: 'subDiscriminatedNumber',
                    type: Number,
                },
            ],
        });     

        var SubClassOfSubClassOfSuperClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'SubClassOfSubClassOfSuperClass',
            superClasses: [SubClassOfSuperClass],
            attributes: [
                {
                    name: 'subSubBoolean',
                    type: Boolean,
                },
                {
                    name: 'subSubNumber',
                    type: Number,
                },
            ],
        });

        var SubClassOfAbstractSubClassOfSuperClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'SubClassOfAbstractSubClassOfSuperClass',
            superClasses: [AbstractSubClassOfSuperClass],
            attributes: [
                {
                    name: 'subAbstractSubBoolean',
                    type: Boolean,
                },
                {
                    name: 'subAbstractSubNumber',
                    type: Number,
                },
            ],
        });

    }

    // Relationship Classes
    {
        var SingularRelationshipClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'SingularRelationshipClass',
            attributes: [
                {
                    name: 'boolean',
                    type: Boolean,
                },
                {
                    name: 'booleans',
                    type: Boolean,
                    list: true,
                },
            ],
            relationships: [
                {
                    name: 'singularRelationship',
                    toClass: 'NonSingularRelationshipClass',
                    singular: true,
                },
            ],
        });

        var NonSingularRelationshipClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'NonSingularRelationshipClass',
            attributes: [
                {
                    name: 'boolean',
                    type: Boolean,
                },
            ],
            relationships: [
                {
                    name: 'nonSingularRelationship',
                    toClass: 'SingularRelationshipClass',
                    singular: false,
                },
            ],
        });

        var SubClassOfSingularRelationshipClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'SubClassOfSingularRelationshipClass',
            superClasses: [SingularRelationshipClass] 
        });

        var SubClassOfNonSingularRelationshipClass = new ClassModel({
            accessControlled: false,
            updateControlled: false,
            className: 'SubClassOfNonSingularRelationshipClass',
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
            attributes: [
                {
                    name: 'name',
                    type: String,
                },
            ],
            relationships: [
                {
                    name: 'accessControlledBy',
                    toClass: 'ClassControlsAccessControlledSuperClass',
                    singular: true,
                },
            ],
        });

        // A class which is accessControlled by it's own boolean attribute. If the boolean is set to true, and it passes the 
        // its super class'es access filter, then the instance will be returned by access filter.
        var AccessControlledSubClassOfAccessControlledSuperClass = new ClassModel({
            className: 'AccessControlledSubClassOfAccessControlledSuperClass',
            accessControlled: true,
            updateControlled: false,
            accessControlMethod: async instance => { return instance.boolean },
            superClasses: [AccessControlledSuperClass],
            attributes: [
                {
                    name: 'boolean',
                    type: Boolean,
                },
            ],
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
            attributes: [
                {
                    name: 'string',
                    type: String,
                },
            ],
        });

        // A class which is accessControlled by it's own number attribute. If the number is greater than 0, and it passes all
        // it's super classes accessfilters, than an instance of this class will be returned by accessFilter().
        var AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass = new ClassModel({
            className: 'AccessControlledSubClassOfAccessControlledDiscriminatedSuperClass',
            accessControlled: true, 
            updateControlled: false,
            discriminatorSuperClass: AccessControlledDiscriminatedSuperClass,
            accessControlMethod: async instance => { 
                return instance.number > 0 
            },
            attributes: [
                {
                    name: 'number',
                    type: Number,
                },
            ],
        });

        // A class which is used to secure another class. If an instance of this class has its 'allowed' attribute
        // set to true, than instances of AccessControlledSuperClass related to this instance will pass the accessFilter.
        var ClassControlsAccessControlledSuperClass = new ClassModel({
            className: 'ClassControlsAccessControlledSuperClass',
            accessControlled: false,
            updateControlled: false,
            attributes: [
                {
                    name: 'allowed',
                    type: Boolean,
                },
            ],
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
        });

        var SingularRelationshipToAccessControlledClassAccessControlledByParameters = new ClassModel({
            className: 'SingularRelationshipToAccessControlledClassAccessControlledByParameters',
            accessControlled: false,
            updateControlled: false,
            attributes: [
                {
                    name: 'name',
                    type: String,
                },
            ],
            relationships: [
                {
                    name: 'singularRelationship',
                    toClass: 'AccessControlledClassAccessControlledByParameters',
                    singular: true,
                },
            ],
        });

        var NonSingularRelationshipToAccessControlledClassAccessControlledByParameters = new ClassModel({
            className: 'NonSingularRelationshipToAccessControlledClassAccessControlledByParameters',
            accessControlled: false,
            updateControlled: false,
            attributes: [
                {
                    name: 'name',
                    type: String,
                },
            ],
            relationships: [
                {
                    name: 'nonSingularRelationship',
                    toClass: 'AccessControlledClassAccessControlledByParameters',
                    singular: false,
                },
            ],
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
            attributes: [
                {
                    name: 'name',
                    type: String,
                },
            ],
            relationships: [
                {
                    name: 'updateControlledBy',
                    toClass: 'ClassControlsUpdateControlledSuperClass',
                    singular: true,
                },
            ],
        });

        // A class which is updateControlled by it's own boolean attribute. If the boolean is set to true, and it passes the 
        // its super class'es update filter, then the instance will be returned by update filter.
        var UpdateControlledSubClassOfUpdateControlledSuperClass = new ClassModel({
            className: 'UpdateControlledSubClassOfUpdateControlledSuperClass',
            accessControlled: false,
            updateControlled: true,
            updateControlMethod: async instance => { return instance.boolean },
            superClasses: [UpdateControlledSuperClass],
            attributes: [
                {
                    name: 'boolean',
                    type: Boolean
                },
            ],
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
            attributes: [
                {
                    name: 'string',
                    type: String,
                },
            ],
        });

        // A class which is updateControlled by it's own number attribute. If the number is greater than 0, and it passes all
        // it's super classes updatefilters, than an instance of this class will be returned by updateFilter().
        var UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass = new ClassModel({
            className: 'UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass',
            accessControlled: false, 
            updateControlled: true,
            discriminatorSuperClass: UpdateControlledDiscriminatedSuperClass,
            updateControlMethod: async instance => { return instance.number > 0 },
            attributes: [
                {
                    name: 'number',
                    type: Number,
                },
            ],
        });

        // A class which is used to secure another class. If an instance of this class has its 'allowed' attribute
        // set to true, than instances of UpdateControlledSuperClass related to this instance will pass the updateFilter.
        var ClassControlsUpdateControlledSuperClass = new ClassModel({
            className: 'ClassControlsUpdateControlledSuperClass',
            accessControlled: false,
            updateControlled: false,
            attributes: [
                {
                    name: 'allowed',
                    type: Boolean,
                },
            ],
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