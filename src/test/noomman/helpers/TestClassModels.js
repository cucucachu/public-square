require("@babel/polyfill");

const ClassModel = require('../../../dist/noomman/ClassModel');



// Create Class Models that will be used across tests.
{

    // Compare Classes
    {        
        var CompareClass1 = new ClassModel({
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
            attributes: [
                {
                    name: 'number',
                    type: Number,
                },
            ],
        });

        var TestClassWithBoolean = new ClassModel({
            className: 'TestClassWithBoolean',
            attributes: [
                {
                    name: 'boolean',
                    type: Boolean,
                },
            ],
        });

        var TestClassWithAllSimpleFields = new ClassModel({
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
                    name: 'dates',
                    type: Date,
                    list: true,
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
            className: 'SubClassOfSingularRelationshipClass',
            superClasses: [SingularRelationshipClass] 
        });

        var SubClassOfNonSingularRelationshipClass = new ClassModel({
            className: 'SubClassOfNonSingularRelationshipClass',
            superClasses: [NonSingularRelationshipClass] 
        });

    }

    // ReadControlled Classes
    {
        // A class which is readControlled by another instance. If that instance has a boolean attribute 'allowed' set to 
        // true, then the instance of this class can be viewed. 
        var ReadControlledSuperClass = new ClassModel({
            className: 'ReadControlledSuperClass',
            attributes: [
                {
                    name: 'name',
                    type: String,
                },
            ],
            relationships: [
                {
                    name: 'readControlledBy',
                    toClass: 'ClassControlsReadControlledSuperClass',
                    singular: true,
                },
            ],
            crudControls: {
                readControl: async instance => {
                    const readControlledByInstance = await instance.walk('readControlledBy')
                    return readControlledByInstance.allowed;
                },
            }
        });

        // A class which is readControlled by it's own boolean attribute. If the boolean is set to true, and it passes the 
        // its super class'es read filter, then the instance will be returned by read filter.
        var ReadControlledSubClassOfReadControlledSuperClass = new ClassModel({
            className: 'ReadControlledSubClassOfReadControlledSuperClass',
            superClasses: [ReadControlledSuperClass],
            attributes: [
                {
                    name: 'boolean',
                    type: Boolean,
                },
            ],
            crudControls: {
                readControl: async instance => { return instance.boolean },
            },
        });

        // A class which is readControlled by it's own string attribute. If the string matches 'readControlled', and it passes all
        // it's super classes readfilters, than an instance of this class will be returned by readFilter().
        var ReadControlledDiscriminatedSuperClass = new ClassModel({
            className: 'ReadControlledDiscriminatedSuperClass',
            discriminated: true,
            superClasses: [ReadControlledSubClassOfReadControlledSuperClass],
            attributes: [
                {
                    name: 'string',
                    type: String,
                },
            ],
            crudControls: {
                readControl: async instance => { return instance.string == 'readControlled' },
            },
        });

        // A class which is readControlled by it's own number attribute. If the number is greater than 0, and it passes all
        // it's super classes readfilters, than an instance of this class will be returned by readFilter().
        var ReadControlledSubClassOfReadControlledDiscriminatedSuperClass = new ClassModel({
            className: 'ReadControlledSubClassOfReadControlledDiscriminatedSuperClass',
            discriminatorSuperClass: ReadControlledDiscriminatedSuperClass,
            attributes: [
                {
                    name: 'number',
                    type: Number,
                },
            ],
            crudControls: {
                readControl: async instance => { 
                    return instance.number > 0 
                },
            }
        });

        // A class which is used to secure another class. If an instance of this class has its 'allowed' attribute
        // set to true, than instances of ReadControlledSuperClass related to this instance will pass the readFilter.
        var ClassControlsReadControlledSuperClass = new ClassModel({
            className: 'ClassControlsReadControlledSuperClass',
            attributes: [
                {
                    name: 'allowed',
                    type: Boolean,
                },
            ],
        });

        // A class which is readControlled by parameters passed into the readFilter method. If the two numbers add up to a 
        // positive number, and the boolean is true, than the instance will pass the read filter. 
        var ReadControlledClassReadControlledByParameters = new ClassModel({
            className: 'ReadControlledClassReadControlledByParameters',
            crudControls: {
                readControl: async (instance, numberA, numberB, boolean) => {
                    return (numberA + numberB > 0) && boolean;
                },
            },
        });

        var SingularRelationshipToReadControlledClassReadControlledByParameters = new ClassModel({
            className: 'SingularRelationshipToReadControlledClassReadControlledByParameters',
            attributes: [
                {
                    name: 'name',
                    type: String,
                },
            ],
            relationships: [
                {
                    name: 'singularRelationship',
                    toClass: 'ReadControlledClassReadControlledByParameters',
                    singular: true,
                },
            ],
        });

        var NonSingularRelationshipToReadControlledClassReadControlledByParameters = new ClassModel({
            className: 'NonSingularRelationshipToReadControlledClassReadControlledByParameters',
            attributes: [
                {
                    name: 'name',
                    type: String,
                },
            ],
            relationships: [
                {
                    name: 'nonSingularRelationship',
                    toClass: 'ReadControlledClassReadControlledByParameters',
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
            crudControls: {
                updateControl: async instance => {
                    let updateControlledByInstance =  await instance.walk('updateControlledBy');
                    return updateControlledByInstance.allowed;
                },
            }
        });

        // A class which is updateControlled by it's own boolean attribute. If the boolean is set to true, and it passes the 
        // its super class'es update filter, then the instance will be returned by update filter.
        var UpdateControlledSubClassOfUpdateControlledSuperClass = new ClassModel({
            className: 'UpdateControlledSubClassOfUpdateControlledSuperClass',
            superClasses: [UpdateControlledSuperClass],
            attributes: [
                {
                    name: 'boolean',
                    type: Boolean
                },
            ],
            crudControls: {
                updateControl: async instance => { return instance.boolean },
            },
        });

        // A class which is updateControlled by it's own string attribute. If the string matches 'updateControlled', and it passes all
        // it's super classes updatefilters, than an instance of this class will be returned by updateFilter().
        var UpdateControlledDiscriminatedSuperClass = new ClassModel({
            className: 'UpdateControlledDiscriminatedSuperClass',
            discriminated: true,
            superClasses: [UpdateControlledSubClassOfUpdateControlledSuperClass],
            attributes: [
                {
                    name: 'string',
                    type: String,
                },
            ],
            crudControls: {
                updateControl: async instance => { return instance.string == 'updateControlled' },
            }
        });

        // A class which is updateControlled by it's own number attribute. If the number is greater than 0, and it passes all
        // it's super classes updatefilters, than an instance of this class will be returned by updateFilter().
        var UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass = new ClassModel({
            className: 'UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass',
            discriminatorSuperClass: UpdateControlledDiscriminatedSuperClass,
            attributes: [
                {
                    name: 'number',
                    type: Number,
                },
            ],
            crudControls: {
                updateControl: async instance => { return instance.number > 0 },
            },
        });

        // A class which is used to secure another class. If an instance of this class has its 'allowed' attribute
        // set to true, than instances of UpdateControlledSuperClass related to this instance will pass the updateFilter.
        var ClassControlsUpdateControlledSuperClass = new ClassModel({
            className: 'ClassControlsUpdateControlledSuperClass',
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
            crudControls: {
                updateControl: async (instance, numberA, numberB, boolean) => {
                    return (numberA + numberB > 0) && boolean;
                },
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
    ReadControlledSuperClass,
    ReadControlledSubClassOfReadControlledSuperClass,
    ReadControlledDiscriminatedSuperClass,
    ReadControlledSubClassOfReadControlledDiscriminatedSuperClass,
    ClassControlsReadControlledSuperClass,
    ReadControlledClassReadControlledByParameters,
    SingularRelationshipToReadControlledClassReadControlledByParameters,
    NonSingularRelationshipToReadControlledClassReadControlledByParameters,
    UpdateControlledSuperClass, 
    UpdateControlledSubClassOfUpdateControlledSuperClass,
    UpdateControlledDiscriminatedSuperClass,
    UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass,
    ClassControlsUpdateControlledSuperClass,
    UpdateControlledClassUpdateControlledByParameters
}