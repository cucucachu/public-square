const ClassModel = require('../../../src/noomman/ClassModel');

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

        var SubClassOfDiscriminatedSuperClass = new ClassModel({
            className: 'SubClassOfDiscriminatedSuperClass',
            superClasses: [DiscriminatedSuperClass],
            useSuperClassCollection: true,
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
            superClasses: [DiscriminatedSubClassOfSuperClass],
            useSuperClassCollection: true,
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

        var TwoWayRelationshipClass1 = new ClassModel({
            className: 'TwoWayRelationshipClass1',
            attributes: [
                {
                    name: 'name',
                    type: String,
                },
            ],
            relationships: [
                {
                    name: 'oneToOne',
                    toClass: 'TwoWayRelationshipClass2',
                    singular: true,
                    mirrorRelationship: 'oneToOne',
                },
                {
                    name: 'oneToMany',
                    toClass: 'TwoWayRelationshipClass2',
                    singular: false,
                    mirrorRelationship: 'manyToOne',
                },
                {
                    name: 'manyToOne',
                    toClass: 'TwoWayRelationshipClass2',
                    singular: true,
                    mirrorRelationship: 'oneToMany',
                },
                {
                    name: 'manyToMany',
                    toClass: 'TwoWayRelationshipClass2',
                    singular: false,
                    mirrorRelationship: 'manyToMany',
                },
            ],
        });

        var TwoWayRelationshipClass2 = new ClassModel({
            className: 'TwoWayRelationshipClass2',
            attributes: [
                {
                    name: 'name',
                    type: String,
                },
            ],
            relationships: [
                {
                    name: 'oneToOne',
                    toClass: 'TwoWayRelationshipClass1',
                    singular: true,
                    mirrorRelationship: 'oneToOne',
                },
                {
                    name: 'oneToMany',
                    toClass: 'TwoWayRelationshipClass1',
                    singular: false,
                    mirrorRelationship: 'manyToOne',
                },
                {
                    name: 'manyToOne',
                    toClass: 'TwoWayRelationshipClass1',
                    singular: true,
                    mirrorRelationship: 'oneToMany',
                },
                {
                    name: 'manyToMany',
                    toClass: 'TwoWayRelationshipClass1',
                    singular: false,
                    mirrorRelationship: 'manyToMany',
                },
            ],
        });

        var ClassOwnsOtherClass = new ClassModel({
            className: 'ClassOwnsOtherClass',
            attributes: [
                {
                    name: 'name',
                    type: String,
                },
            ],
            relationships: [
                {
                    name: 'singular',
                    toClass: 'ClassOwnedByOtherClass',
                    singular: true,
                    owns: true,
                },
                {
                    name: 'nonSingular',
                    toClass: 'ClassOwnedByOtherClass',
                    singular: false,
                    owns: true,
                },
            ],
        });

        var ClassOwnedByOtherClass = new ClassModel({
            className: 'ClassOwnedByOtherClass',
            attributes: [
                {
                    name: 'name',
                    type: String,
                },
            ]
        });

    }

    // CreateControlled Classes
    {
        // A class which is createControlled by another instance. If that instance has a boolean attribute 'allowed' set to 
        // true, then the instance of this class can be viewed. 
        var CreateControlledSuperClass = new ClassModel({
            className: 'CreateControlledSuperClass',
            attributes: [
                {
                    name: 'name',
                    type: String,
                },
            ],
            relationships: [
                {
                    name: 'createControlledBy',
                    toClass: 'ClassControlsCreateControlledSuperClass',
                    singular: true,
                },
            ],
            crudControls: {
                createControl: async function() {
                    const relatedInstance = await this.createControlledBy;
                    if (!relatedInstance)
                        return false;
                    return relatedInstance.allowed;
                },
            }
        });

        // A class which is createControlled by it's own boolean attribute. If the boolean is set to true, and it passes the 
        // its super class'es create filter, then the instance will be returned by create filter.
        var CreateControlledSubClassOfCreateControlledSuperClass = new ClassModel({
            className: 'CreateControlledSubClassOfCreateControlledSuperClass',
            superClasses: [CreateControlledSuperClass],
            attributes: [
                {
                    name: 'boolean',
                    type: Boolean
                },
            ],
            crudControls: {
                createControl: function() { 
                    return this.boolean 
                },
            },
        });

        // A class which is createControlled by it's own string attribute. If the string matches 'createControlled', and it passes all
        // it's super classes createfilters, than an instance of this class will be returned by createFilter().
        var CreateControlledDiscriminatedSuperClass = new ClassModel({
            className: 'CreateControlledDiscriminatedSuperClass',
            superClasses: [CreateControlledSubClassOfCreateControlledSuperClass],
            attributes: [
                {
                    name: 'string',
                    type: String,
                },
            ],
            crudControls: {
                createControl:  function() {
                    return this.string == 'createControlled';
                },
            }
        });

        // A class which is createControlled by it's own number attribute. If the number is greater than 0, and it passes all
        // it's super classes createfilters, than an instance of this class will be returned by createFilter().
        var CreateControlledSubClassOfCreateControlledDiscriminatedSuperClass = new ClassModel({
            className: 'CreateControlledSubClassOfCreateControlledDiscriminatedSuperClass',
            superClasses: [CreateControlledDiscriminatedSuperClass],
            useSuperClassCollection: true,
            attributes: [
                {
                    name: 'number',
                    type: Number,
                },
            ],
            crudControls: {
                createControl: function() {
                    return this.number > 0;
                }
            },
        });

        // A class which is used to secure another class. If an instance of this class has its 'allowed' attribute
        // set to true, than instances of CreateControlledSuperClass related to this instance will pass the createFilter.
        var ClassControlsCreateControlledSuperClass = new ClassModel({
            className: 'ClassControlsCreateControlledSuperClass',
            attributes: [
                {
                    name: 'allowed',
                    type: Boolean,
                },
            ],
        });

        // A class which is createControlled by parameters passed into the createFilter method. If the two numbers add up to a 
        // positive number, and the boolean is true, than the instance will pass the create filter. 
        var CreateControlledClassCreateControlledByParameters = new ClassModel({
            className: 'CreateControlledClassCreateControlledByParameters',
            crudControls: {
                createControl: parameters => {
                    return (parameters.numberA + parameters.numberB > 0) && parameters.boolean;
                },
            },
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
                    required: true,
                },
            ],
            crudControls: {
                readControl: async function() {
                    return (await this.readControlledBy).allowed;
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
                readControl: function() {
                    return this.boolean;
                },
            },
        });

        // A class which is readControlled by it's own string attribute. If the string matches 'readControlled', and it passes all
        // it's super classes readfilters, than an instance of this class will be returned by readFilter().
        var ReadControlledDiscriminatedSuperClass = new ClassModel({
            className: 'ReadControlledDiscriminatedSuperClass',
            superClasses: [ReadControlledSubClassOfReadControlledSuperClass],
            attributes: [
                {
                    name: 'string',
                    type: String,
                },
            ],
            crudControls: {
                readControl: function() {
                    return this.string == 'readControlled';
                }
            },
        });

        // A class which is readControlled by it's own number attribute. If the number is greater than 0, and it passes all
        // it's super classes readfilters, than an instance of this class will be returned by readFilter().
        var ReadControlledSubClassOfReadControlledDiscriminatedSuperClass = new ClassModel({
            className: 'ReadControlledSubClassOfReadControlledDiscriminatedSuperClass',
            superClasses: [ReadControlledDiscriminatedSuperClass],
            useSuperClassCollection: true,
            attributes: [
                {
                    name: 'number',
                    type: Number,
                },
            ],
            crudControls: {
                readControl: function() {
                    return this.number > 0;
                }
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
                readControl: (readControlMethodParameters) => {
                    return (readControlMethodParameters.numberA + readControlMethodParameters.numberB > 0) && readControlMethodParameters.boolean;
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
                updateControl: async function() {
                    return (await this.updateControlledBy).allowed;
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
                updateControl: function() {
                    return this.boolean;
                }
            },
        });

        // A class which is updateControlled by it's own string attribute. If the string matches 'updateControlled', and it passes all
        // it's super classes updatefilters, than an instance of this class will be returned by updateFilter().
        var UpdateControlledDiscriminatedSuperClass = new ClassModel({
            className: 'UpdateControlledDiscriminatedSuperClass',
            superClasses: [UpdateControlledSubClassOfUpdateControlledSuperClass],
            attributes: [
                {
                    name: 'string',
                    type: String,
                },
            ],
            crudControls: {
                updateControl: function() {
                    return this.string === 'updateControlled';
                }
            }
        });

        // A class which is updateControlled by it's own number attribute. If the number is greater than 0, and it passes all
        // it's super classes updatefilters, than an instance of this class will be returned by updateFilter().
        var UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass = new ClassModel({
            className: 'UpdateControlledSubClassOfUpdateControlledDiscriminatedSuperClass',
            superClasses: [UpdateControlledDiscriminatedSuperClass],
            useSuperClassCollection: true,
            attributes: [
                {
                    name: 'number',
                    type: Number,
                },
            ],
            crudControls: {
                updateControl: function() {
                    return this.number > 0;
                },
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
            attributes: [
                {
                    name: 'name',
                    type: String,
                }
            ],
            crudControls: {
                updateControl: (updateControlMethodParameters) => {
                    return (updateControlMethodParameters.numberA + updateControlMethodParameters.numberB > 0) && updateControlMethodParameters.boolean;
                },
            },
        });
    }

    // DeleteControlled Classes
    {
        // A class which is deleteControlled by another instance. If that instance has a boolean attribute 'allowed' set to 
        // true, then the instance of this class can be viewed. 
        var DeleteControlledSuperClass = new ClassModel({
            className: 'DeleteControlledSuperClass',
            attributes: [
                {
                    name: 'name',
                    type: String,
                },
            ],
            relationships: [
                {
                    name: 'deleteControlledBy',
                    toClass: 'ClassControlsDeleteControlledSuperClass',
                    singular: true,
                },
            ],
            crudControls: {
                deleteControl: async function() {
                    return (await this.deleteControlledBy).allowed;
                },
            }
        });

        // A class which is deleteControlled by it's own boolean attribute. If the boolean is set to true, and it passes the 
        // its super class'es delete filter, then the instance will be returned by delete filter.
        var DeleteControlledSubClassOfDeleteControlledSuperClass = new ClassModel({
            className: 'DeleteControlledSubClassOfDeleteControlledSuperClass',
            superClasses: [DeleteControlledSuperClass],
            attributes: [
                {
                    name: 'boolean',
                    type: Boolean
                },
            ],
            crudControls: {
                deleteControl: function() {
                    return this.boolean;
                },
            },
        });

        // A class which is deleteControlled by it's own string attribute. If the string matches 'deleteControlled', and it passes all
        // it's super classes deletefilters, than an instance of this class will be returned by deleteFilter().
        var DeleteControlledDiscriminatedSuperClass = new ClassModel({
            className: 'DeleteControlledDiscriminatedSuperClass',
            superClasses: [DeleteControlledSubClassOfDeleteControlledSuperClass],
            attributes: [
                {
                    name: 'string',
                    type: String,
                },
            ],
            crudControls: {
                deleteControl: function() {
                    return this.string === 'deleteControlled';
                },
            }
        });

        // A class which is deleteControlled by it's own number attribute. If the number is greater than 0, and it passes all
        // it's super classes deletefilters, than an instance of this class will be returned by deleteFilter().
        var DeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClass = new ClassModel({
            className: 'DeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClass',
            superClasses: [DeleteControlledDiscriminatedSuperClass],
            useSuperClassCollection: true,
            attributes: [
                {
                    name: 'number',
                    type: Number,
                },
            ],
            crudControls: {
                deleteControl: function() {
                    return this.number > 0;
                },
            },
        });

        // A class which is used to secure another class. If an instance of this class has its 'allowed' attribute
        // set to true, than instances of DeleteControlledSuperClass related to this instance will pass the deleteFilter.
        var ClassControlsDeleteControlledSuperClass = new ClassModel({
            className: 'ClassControlsDeleteControlledSuperClass',
            attributes: [
                {
                    name: 'allowed',
                    type: Boolean,
                },
            ],
        });

        // A class which is deleteControlled by parameters passed into the deleteFilter method. If the two numbers add up to a 
        // positive number, and the boolean is true, than the instance will pass the delete filter. 
        var DeleteControlledClassDeleteControlledByParameters = new ClassModel({
            className: 'DeleteControlledClassDeleteControlledByParameters',
            crudControls: {
                deleteControl: parameters => {
                    return (parameters.numberA + parameters.numberB > 0) && parameters.boolean;
                },
            },
        });
    }

    // Validation Classes
    {

        var ValidationSuperClass = new ClassModel({
            className: 'ValidationSuperClass',
            attributes: [
                {
                    name: 'name',
                    type: String,
                },
                {
                    name: 'number',
                    type: Number,
                },
            ],
            validations: [
                function() {
                    if (this.number <= 0)
                        throw new Error('Number must be greater than 0.');
                },
                function() {
                    if (this.name === '')
                        throw new Error('Name cannot be empty.');
                },
            ],
        });

        var SubClassOfValidationSuperClass = new ClassModel({
            className: 'SubClassOfValidationSuperClass',
            superClasses: [ValidationSuperClass],
            validations: [
                function() {
                    if (this.number > 10) {
                        throw new Error('Number must be less than or equal to 10.');
                    }
                }
            ]
        });

        var ValidationDiscriminatedSuperClass = new ClassModel({
            className: 'ValidationDiscriminatedSuperClass',
            superClasses: [ValidationSuperClass],
            attributes: [
                {
                    name: 'boolean',
                    type: Boolean,
                    required: true,
                }
            ],
            validations: [
                function() {
                    if (!this.boolean) {
                        throw new Error('Boolean must be true.');
                    }
                }
            ]
        });

        var SubClassOfValidationDiscriminatedSuperClass = new ClassModel({
            className: 'SubClassOfValidationDiscriminatedSuperClass',
            superClasses: [ValidationDiscriminatedSuperClass],
            useSuperClassCollection: true,
            attributes: [
                {
                    name: 'boolean2',
                    type: Boolean,
                    required: true,
                }
            ],
            validations: [
                function() {
                    if (!this.boolean2) {
                        throw new Error('Boolean2 must be true.');
                    }
                }
            ],
        });

        var AsyncValidationClass = new ClassModel({
            className: 'AsyncValidationClass',
            relationships: [
                {
                    name: 'relatedInstance',
                    toClass: 'RelatedValidationClass',
                    singular: true,
                }
            ],
            validations: [
                async function() {
                    const related = await this.walk('relatedInstance');
                    if (related === null || !related.valid)
                        throw new Error('Related instance is not valid.');
                },
            ],
        });

        var RelatedValidationClass = new ClassModel({
            className: 'RelatedValidationClass',
            attributes: [
                {
                    name: 'valid',
                    type: Boolean,
                    required: true,
                },
            ],
        });
    }

    // Auditable Classes
    {
        var AuditableSuperClass = new ClassModel({
            className: 'AuditableSuperClass',
            superClasses: [AllAttributesAndRelationshipsClass],
            auditable: true,
            attributes: [
                {
                    name: 'name',
                    type: String,
                },
                {
                    name: 'updatedAt',
                    type: Date,
                },
            ],
        });

        var AuditableSubClass = new ClassModel({
            className: 'AuditableSubClass',
            superClasses: [AuditableSuperClass],
        });

        var AuditableDiscriminatedSubClass = new ClassModel({
            className: 'AuditableDiscriminatedSubClass',
            superClasses: [AuditableSuperClass],
            useSuperClassCollection: true,
        });
    }

    // Custom Static Method Classes
    {
        var StaticMethodClass = new ClassModel({
            className: 'StaticMethodClass',
            staticMethods: {
                sayHello: () => 'hello',
                sayClassName: function() {
                    return this.className;
                },
                customToString: function() {
                    return this.toString();
                },
                isInstanceOfThisClassCustom: function(instance) {
                    return this.isInstanceOfThisClass(instance);
                },
                findByIdCustom: async function(id) {
                    return this.findById(id);
                },
            }
        });
    }

    // Custom Non-Static Method Classes
    {
        var NonStaticMethodsClass = new ClassModel({
            className: 'NonStaticMethodsClass',
            attributes: [
                {
                    name: 'name',
                    type: String,
                },
                {
                    name: 'age',
                    type: Number,
                }
            ],
            relationships: [
                {
                    name: 'siblings',
                    singular: false,
                    toClass: 'NonStaticMethodsClass',
                    mirrorRelationship: 'siblings',
                }
            ],
            nonStaticMethods: {
                oldestSibling: async function() {
                    const siblings = await this.siblings;
                    let oldestSibling = this;
                    for (const sibling of siblings) {
                        if (sibling.age > oldestSibling.age) {
                            oldestSibling = sibling;
                        }
                    }
                    return oldestSibling.name;
                }
            }
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
    SubClassOfDiscriminatedSuperClass,
    DiscriminatedSubClassOfSuperClass,
    SubClassOfDiscriminatedSubClassOfSuperClass,
    SubClassOfSubClassOfSuperClass,
    SubClassOfAbstractSubClassOfSuperClass,
    SingularRelationshipClass,
    NonSingularRelationshipClass,
    SubClassOfSingularRelationshipClass,
    SubClassOfNonSingularRelationshipClass,
    TwoWayRelationshipClass1,
    TwoWayRelationshipClass2,
    ClassOwnsOtherClass,
    ClassOwnedByOtherClass,
    CreateControlledSuperClass, 
    CreateControlledSubClassOfCreateControlledSuperClass,
    CreateControlledDiscriminatedSuperClass,
    CreateControlledSubClassOfCreateControlledDiscriminatedSuperClass,
    ClassControlsCreateControlledSuperClass,
    CreateControlledClassCreateControlledByParameters,
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
    UpdateControlledClassUpdateControlledByParameters,
    DeleteControlledSuperClass, 
    DeleteControlledSubClassOfDeleteControlledSuperClass,
    DeleteControlledDiscriminatedSuperClass,
    DeleteControlledSubClassOfDeleteControlledDiscriminatedSuperClass,
    ClassControlsDeleteControlledSuperClass,
    DeleteControlledClassDeleteControlledByParameters,
    ValidationSuperClass,
    SubClassOfValidationSuperClass,
    ValidationDiscriminatedSuperClass,
    SubClassOfValidationDiscriminatedSuperClass,
    AsyncValidationClass,
    RelatedValidationClass,
    AuditableSuperClass,
    AuditableSubClass,
    AuditableDiscriminatedSubClass,
    StaticMethodClass,
    NonStaticMethodsClass,
}