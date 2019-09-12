
require("@babel/polyfill");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const database = require('../dist/models/database');
const ClassModel = require('../dist/models/ClassModel');
const Instance = require('../dist/models/Instance');
const InstanceSet = require('../dist/models/InstanceSet');
const TestClassModels = require('./TestClassModels');
const TestingFunctions = require('./TestingFunctions');
const testForError = TestingFunctions.testForError;
const testForErrorAsync = TestingFunctions.testForErrorAsync;

// Load all TestClassModels 
{
    // Compare Classes
    var CompareClass1 = TestClassModels.CompareClass1;
    var CompareClass2 = TestClassModels.CompareClass2;

    // Simple Classes
    var TestClassWithNumber = TestClassModels.TestClassWithNumber;
    var TestClassWithBoolean = TestClassModels.TestClassWithBoolean;
    var TestClassWithAllSimpleFields = TestClassModels.TestClassWithAllSimpleFields;

    // Validation Classes
    var AllFieldsRequiredClass = TestClassModels.AllFieldsRequiredClass;
    var AllFieldsInRequiredGroupClass = TestClassModels.AllFieldsInRequiredGroupClass;
    var AbstractClass = TestClassModels.AbstractClass;    var SuperClass = TestClassModels.SuperClass;

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
}

describe('InstanceSet Tests', () => {

    before(async () => {
        await database.connect();
    });

    after(() => {
        database.close();
    });


    describe('InstanceSet Constructor Tests', () => {

        describe('InstanceSet Constructor Validations', () => {
        
            it('Constructor throws an error first argument is not a ClassModel.', () => {
                const expectedErrorMessage = 'InstanceSet.constructor() first argument must be an instance of ClassModel.'
                testForError('new InstanceSet()', expectedErrorMessage, () => {
                    const instanceSet = new InstanceSet(1);
                });
            });
            
            it('Constructor throws an error if instances argument is not iterable.', () => {
                const expectedErrorMessage = 'instances argument must be iterable.';
                const instances = 1;
                testForError('new InstanceSet()', expectedErrorMessage, () => {
                    const instanceSet = new InstanceSet(TestClassWithNumber, instances);
                });
            });
            
            it('Constructor throws an error if instances argument is not an iterable of instances.', () => {
                const expectedErrorMessage = 'Illegal attempt to add something other than instances to an InstanceSet.'
                const instances = ['1', 2];
                testForError('new InstanceSet()', expectedErrorMessage, () => {
                    const instanceSet = new InstanceSet(TestClassWithNumber, instances);
                });
            });
            
            it('Constructor throws an error any instance is not an instance of the given ClassModel.', () => {
                const expectedErrorMessage = 'Illegal attempt to add instances of a different class to an InstanceSet.'
                const instance1 = new Instance(TestClassWithNumber);
                const instance2 = new Instance(TestClassWithBoolean);
                const instances = [instance1, instance2];
                testForError('new InstanceSet()', expectedErrorMessage, () => {
                    const instanceSet = new InstanceSet(TestClassWithNumber, instances);
                });
            });

        });

        describe('InstanceSet Constructor Creates an InstanceSet', () => {

            it('new InstanceSet() works on direct instances of the ClassModel', () => {
                const instance1 = new Instance(TestClassWithNumber);
                const instance2 = new Instance(TestClassWithNumber);
                const instances = [instance1, instance2];
                const instanceSet = new InstanceSet(TestClassWithNumber, instances);
            });

            it('new InstanceSet() works on with instances of a subclass of the ClassModel', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfDiscriminatedSubClassOfSuperClass);
                const instances = [instance1, instance2];
                const instanceSet = new InstanceSet(SuperClass, instances);
            });

            it('new InstanceSet() is created an has the given instances.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfDiscriminatedSubClassOfSuperClass);
                const instances = [instance1, instance2];
                const instanceSet = new InstanceSet(SuperClass, instances);

                if (!instanceSet.has(instance1) || !instanceSet.has(instance2) || !instanceSet.size == 2)
                    throw new Error('InstanceSet was created, but it does not contain the instances.');
            });

            it('new InstanceSet() sets the classModel property.', () => {
                const instanceSet = new InstanceSet(SuperClass);

                if (instanceSet.classModel !== SuperClass)
                    throw new Error('InstanceSet was created it\'s classModel property is not set.');
            });

            it('new InstanceSet() can create an empty InstanceSet.', () => {
                const instanceSet = new InstanceSet(SuperClass);

                if (instanceSet.size)
                    throw new Error('InstanceSet was created but is not empty.');
            });

            it('new InstanceSet() can accept an InstanceSet as an argument.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfDiscriminatedSubClassOfSuperClass);
                const instances = [instance1, instance2];
                const instanceSet1 = new InstanceSet(SuperClass, instances);
                const instanceSet2 = new InstanceSet(SuperClass, instanceSet1)

                if (!instanceSet2.has(instance1) || !instanceSet2.has(instance2) || !instanceSet2.size == 2)
                    throw new Error('InstanceSet was created, but it does not contain the instances.');
            });

        });

    });

    describe('Adding and Removing Instances from InstanceSets', () => {

        describe('InstanceSet.add()', () => {
    
            it('instanceSet.add() throws an error if argument is not an instance.', () => {
                const instanceSet = new InstanceSet(SuperClass);
                const expectedErrorMessage = 'Illegal attempt to add something other than instances to an InstanceSet.';
    
                testForError('instanceSet.add()', expectedErrorMessage, () => {
                    instanceSet.add(1);
                });
            });
    
            it('instanceSet.add() throws an error if argument is not an instance of the classModel of the InstanceSet.', () => {
                const instanceSet = new InstanceSet(SuperClass);
                const instance = new Instance(TestClassWithBoolean);
                const expectedErrorMessage = 'Illegal attempt to add instances of a different class to an InstanceSet.';
    
                testForError('instanceSet.add()', expectedErrorMessage, () => {
                    instanceSet.add(instance);
                });
            });
    
            it('instanceSet.add() does not change the instance set if no argument given.', () => {
                const instanceSet = new InstanceSet(SuperClass);
                instanceSet.add();
                if (instanceSet.size)
                    throw new Error('Instance.add() added something to the InstanceSet even though argument was undefined.');
            });
    
            it('instanceSet.add() does not change the instance set if instance == null.', () => {
                const instanceSet = new InstanceSet(SuperClass);
                instanceSet.add(null);
                if (instanceSet.size)
                    throw new Error('Instance.add() added something to the InstanceSet even though argument was null.');
            });
    
            it('instanceSet.add() can add an instance of the ClassModel of the InstanceSet', () => {
                const instanceSet = new InstanceSet(SuperClass);
                const instance = new Instance(SuperClass);
                
                instanceSet.add(instance);
    
                if (instanceSet.size != 1) 
                    throw new Error('instanceSet size is not 1.');
                if (!instanceSet.has(instance)) 
                    throw new Error('instanceSet does not contain instance.');
            });
    
            it('instanceSet.add() can add an instance of a subclass of the ClassModel of the InstanceSet', () => {
                const instanceSet = new InstanceSet(SuperClass);
                const instance = new Instance(SubClassOfSuperClass);
                
                instanceSet.add(instance);
    
                if (instanceSet.size != 1) 
                    throw new Error('instanceSet size is not 1.');
                if (!instanceSet.has(instance)) 
                    throw new Error('instanceSet does not contain instance.');
    
            });
    
            it('instanceSet.add() can be called multiple times.', () => {
                const instanceSet = new InstanceSet(SuperClass);
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                
                instanceSet.add(instance1);
    
                if (instanceSet.size != 1) 
                    throw new Error('instanceSet size is not 1.');
                if (!instanceSet.has(instance1)) 
                    throw new Error('instanceSet does not contain instance.');
                
                    instanceSet.add(instance2);
        
                    if (instanceSet.size != 2) 
                        throw new Error('instanceSet size is not 2.');
                    if (!instanceSet.has(instance2)) 
                        throw new Error('instanceSet does not contain instance.');
    
            });
    
            it('instanceSet.add() will not add the same instance twice', () => {
                const instanceSet = new InstanceSet(SuperClass);
                const instance = new Instance(SubClassOfSuperClass);
                
                instanceSet.add(instance);
    
                if (instanceSet.size != 1) 
                    throw new Error('instanceSet size is not 1.');
                if (!instanceSet.has(instance)) 
                    throw new Error('instanceSet does not contain instance.');
                
                instanceSet.add(instance);
    
                if (instanceSet.size != 1) 
                    throw new Error('instanceSet size is not 1.');
                if (!instanceSet.has(instance)) 
                    throw new Error('instanceSet does not contain instance.');
    
            });
    
            it('instanceSet.add() will not add the same instance twice', () => {
                const instance = new Instance(SubClassOfSuperClass);
                const instanceSet = new InstanceSet(SuperClass, [instance]);
                
                instanceSet.add(instance);
    
                if (instanceSet.size != 1) 
                    throw new Error('instanceSet size is not 1.');
                if (!instanceSet.has(instance)) 
                    throw new Error('instanceSet does not contain instance.');
                
                instanceSet.add(instance);
    
                if (instanceSet.size != 1) 
                    throw new Error('instanceSet size is not 1.');
                if (!instanceSet.has(instance)) 
                    throw new Error('instanceSet does not contain instance.');
    
            });
    
        });
    
        describe('InstanceSet.addInstances()', () => {
    
            it('instanceSet.addInstances() throws an error if given instances are not instances.', () => {
                const instanceSet = new InstanceSet(SuperClass);
                const expectedErrorMessage = 'Illegal attempt to add something other than instances to an InstanceSet.';
    
                testForError('instanceSet.addInstances()', expectedErrorMessage, () => {
                    instanceSet.addInstances([1]);
                });
            });
    
            it('instanceSet.addInstances() throws an error if argument is not iterable.', () => {
                const instanceSet = new InstanceSet(SuperClass);
                const instance = new Instance(SuperClass);
                const expectedErrorMessage = 'instances argument must be iterable.';
    
                testForError('instanceSet.addInstances()', expectedErrorMessage, () => {
                    instanceSet.addInstances(instance);
                });
            });
    
            it('instanceSet.addInstances() throws an error if given instances are not of the right ClassModel.', () => {
                const instanceSet = new InstanceSet(SuperClass);
                const instance = new Instance(TestClassWithBoolean);
                const expectedErrorMessage = 'Illegal attempt to add instances of a different class to an InstanceSet.';
    
                testForError('instanceSet.addInstances()', expectedErrorMessage, () => {
                    instanceSet.addInstances([instance]);
                });
            });
    
            it('instanceSet.addInstances() throws an error if any given instance is not of the right ClassModel.', () => {
                const instanceSet = new InstanceSet(SuperClass);
                const instance1 = new Instance(SuperClass);
                const instance2 = new Instance(TestClassWithBoolean);
                const expectedErrorMessage = 'Illegal attempt to add instances of a different class to an InstanceSet.';
    
                testForError('instanceSet.addInstances()', expectedErrorMessage, () => {
                    instanceSet.addInstances([instance1, instance2]);
                });
            });
    
            it('instanceSet.addInstances() will be unchanged if passed null.', () => {
                const instanceSet = new InstanceSet(SuperClass);
    
                instanceSet.addInstances(null);
    
                if (instanceSet.size)
                    throw new Error('Something was added to the InstanceSet.')
            });
    
            it('instanceSet.addInstances() will be unchanged if passed undefined.', () => {
                const instanceSet = new InstanceSet(SuperClass);
    
                instanceSet.addInstances();
    
                if (instanceSet.size)
                    throw new Error('Something was added to the InstanceSet.')
            });
    
            it('instanceSet.addInstances() will add instances to the set.', () => {
                const instanceSet = new InstanceSet(SuperClass);
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                
                instanceSet.addInstances([instance1, instance2]);
    
                if (instanceSet.size != 2 || !instanceSet.has(instance1) || !instanceSet.has(instance2))
                    throw new Error('Instances were not added to set.')
            });
    
            it('instanceSet.addInstances() will add instances when passed another InstanceSet.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instanceSet1 = new InstanceSet(SuperClass, [instance1, instance2]);
                const instanceSet2 = new InstanceSet(SuperClass);
                
                instanceSet2.addInstances(instanceSet1);
    
                if (instanceSet2.size != 2 || !instanceSet2.has(instance1) || !instanceSet2.has(instance2))
                    throw new Error('Instances were not added to set.')
            });
    
            it('instanceSet.addInstances() will not add the same instance twice', () => {
                const instanceSet = new InstanceSet(SuperClass);
                const instance = new Instance(SubClassOfSuperClass);
                
                instanceSet.addInstances([instance, instance]);
    
                if (instanceSet.size != 1 || !instanceSet.has(instance))
                    throw new Error('Instances were not added to set.')
            });
    
        });
    
        describe('InstanceSet.remove()', () => {
    
            it('instanceSet.remove() called with null does not affect the InstanceSet.', () => {
                const instance = new Instance(SuperClass);
                const instanceSet = new InstanceSet(SuperClass, [instance]);
                instanceSet.remove(null);
    
                if(instanceSet.size != 1 || !instanceSet.has(instance))
                    throw new Error('InstanceSet had instance removed.');
            });
    
            it('instanceSet.remove() called with undefined does not affect the InstanceSet.', () => {
                const instance = new Instance(SuperClass);
                const instanceSet = new InstanceSet(SuperClass, [instance]);
                instanceSet.remove();
    
                if(instanceSet.size != 1 || !instanceSet.has(instance))
                    throw new Error('InstanceSet had instance removed.');
            });
    
            it('instanceSet.remove() called on an empty InstanceSet does not affect the InstanceSet.', () => {
                const instance = new Instance(SuperClass);
                const instanceSet = new InstanceSet(SuperClass);
                instanceSet.remove(instance);
    
                if(instanceSet.size != 0 || instanceSet.classModel != SuperClass)
                    throw new Error('Something happened to the InstanceSet.');
            });
    
            it('instanceSet.remove() called on an InstanceSet with an Instance not in the InstanceSet does not affect the InstanceSet.', () => {
                const instance1 = new Instance(SuperClass);
                const instance2 = new Instance(SuperClass);
                const instanceSet = new InstanceSet(SuperClass, [instance1]);
                instanceSet.remove(instance2);
    
                if(instanceSet.size != 1 || !instanceSet.has(instance1))
                    throw new Error('InstanceSet had instance removed.');
    
            });
    
            it('instanceSet.remove() removes the given Instance from the InstanceSet.', () => {
                const instance = new Instance(SuperClass);
                const instanceSet = new InstanceSet(SuperClass);
                instanceSet.add(instance);
                instanceSet.remove(instance);
    
                if(instanceSet.size != 0 || instanceSet.has(instance))
                    throw new Error('Instance was not removed from InstanceSet.');
    
            });
    
            it('instanceSet.remove() called twice with the same instance removes the given Instance from the InstanceSet.', () => {
                const instance = new Instance(SuperClass);
                const instanceSet = new InstanceSet(SuperClass);
                instanceSet.add(instance);
                instanceSet.remove(instance);
                instanceSet.remove(instance);
    
                if(instanceSet.size != 0 || instanceSet.has(instance))
                    throw new Error('Instance was not removed from InstanceSet.');
            });
    
        });
    
        describe('InstanceSet.removeInstances()', () => {
    
            it('instanceSet.removeInstances() throws an error when passed an argument which is not iterable.', () => {
                const instance = new Instance(SuperClass);
                const instanceSet = new InstanceSet(SuperClass, [instance]);
                const expectedErrorMessage = 'instances argument must be iterable.';
                testForError('instanceSet.removeInstances()', expectedErrorMessage, () => {
                    instanceSet.removeInstances(instance);
                });
            });
    
            it('instanceSet.removeInstances() called with null does not affect the InstanceSet.', () => {
                const instance = new Instance(SuperClass);
                const instanceSet = new InstanceSet(SuperClass, [instance]);
                instanceSet.removeInstances(null);
    
                if(instanceSet.size != 1 || !instanceSet.has(instance))
                    throw new Error('InstanceSet had instance removed.');
            });
    
            it('instanceSet.removeInstances() called with undefined does not affect the InstanceSet.', () => {
                const instance = new Instance(SuperClass);
                const instanceSet = new InstanceSet(SuperClass, [instance]);
                instanceSet.removeInstances();
    
                if(instanceSet.size != 1 || !instanceSet.has(instance))
                    throw new Error('InstanceSet had instance removed.');
            });
    
            it('instanceSet.removeInstances() called on an empty InstanceSet does not affect the InstanceSet.', () => {
                const instance = new Instance(SuperClass);
                const instanceSet = new InstanceSet(SuperClass);
                instanceSet.removeInstances([instance]);
    
                if(instanceSet.size != 0 || instanceSet.classModel != SuperClass)
                    throw new Error('Something happened to the InstanceSet.');
            });
    
            it('instanceSet.removeInstances() called on an InstanceSet with Instances not in the InstanceSet does not affect the InstanceSet.', () => {
                const instance1 = new Instance(SuperClass);
                const instance2 = new Instance(SuperClass);
                const instance3 = new Instance(SuperClass);
                const instanceSet = new InstanceSet(SuperClass, [instance1]);
                instanceSet.removeInstances([instance2, instance3]);
    
                if(instanceSet.size != 1 || !instanceSet.has(instance1))
                    throw new Error('InstanceSet had instance removed.');
    
            });
    
            it('instanceSet.removeInstances() removes the given Instances from the InstanceSet.', () => {
                const instance1 = new Instance(SuperClass);
                const instance2 = new Instance(SuperClass);
                const instance3 = new Instance(SuperClass);
                const instances = [instance1, instance2, instance3]
                const instanceSet = new InstanceSet(SuperClass);
                instanceSet.addInstances(instances);
                instanceSet.removeInstances(instances);
    
                if(instanceSet.size != 0 || instanceSet.has(instance1) || instanceSet.has(instance2) || instanceSet.has(instance3))
                    throw new Error('Instance was not removed from InstanceSet.');
    
            });
    
            it('instanceSet.removeInstances() can be called with an InstanceSet as an argument.', () => {
                const instance1 = new Instance(SuperClass);
                const instance2 = new Instance(SuperClass);
                const instance3 = new Instance(SuperClass);
                const instances = [instance1, instance2, instance3]
                const instanceSet = new InstanceSet(SuperClass);
                instanceSet.addInstances(instances);
                instanceSet.removeInstances(instanceSet);
    
                if(instanceSet.size != 0 || instanceSet.has(instance1) || instanceSet.has(instance2) || instanceSet.has(instance3))
                    throw new Error('Instance was not removed from InstanceSet.');
    
            });
    
            it('instanceSet.removeInstances() called twice with the same instance removes the given Instance from the InstanceSet.', () => {
                const instance = new Instance(SuperClass);
                const instanceSet = new InstanceSet(SuperClass);
                instanceSet.add(instance);
                instanceSet.removeInstances([instance]);
                instanceSet.removeInstances([instance]);
    
                if(instanceSet.size != 0 || instanceSet.has(instance))
                    throw new Error('Instance was not removed from InstanceSet.');
            });
    
        });

    });

    describe('Set Math Methods', () => {

        describe('InstanceSet.equals()', () => {
    
            it('Two InstanceSets with the same instances are equal.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfDiscriminatedSubClassOfSuperClass);
                const instances = [instance1, instance2];
                const instanceSet1 = new InstanceSet(SuperClass, instances);
                const instanceSet2 = new InstanceSet(SuperClass, instances);
    
                if (!instanceSet1.equals(instanceSet2))
                    throw new Error('InstanceSets are not equal.\n' + 
                        'setA: ' + instanceSet1 + '\n' + 
                        'setB: ' + instanceSet2
                    );
            });
    
            it('Two InstanceSets with the same instances are equal even if they are different classes.', () => {
                const instance1 = new Instance(DiscriminatedSubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfDiscriminatedSubClassOfSuperClass);
                const instances = [instance1, instance2];
                const instanceSet1 = new InstanceSet(SuperClass, instances);
                const instanceSet2 = new InstanceSet(DiscriminatedSubClassOfSuperClass, instances);
    
                if (!instanceSet1.equals(instanceSet2))
                    throw new Error('InstanceSets are not equal.\n' + 
                        'setA: ' + instanceSet1 + '\n' + 
                        'setB: ' + instanceSet2
                    );
            });
    
            it('Empty Sets are equal.', () => {
                const instanceSet1 = new InstanceSet(SuperClass);
                const instanceSet2 = new InstanceSet(SuperClass);
    
                if (!instanceSet1.equals(instanceSet2))
                    throw new Error('InstanceSets are not equal.\n' + 
                        'setA: ' + instanceSet1 + '\n' + 
                        'setB: ' + instanceSet2
                    );
            });
    
            it('Two InstanceSets with the different instances of the same class are not equal.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instance3 = new Instance(SubClassOfSuperClass);
                const instance4 = new Instance(SubClassOfSuperClass);
                const instances1 = [instance1, instance2];
                const instances2 = [instance3, instance4];
                const instanceSet1 = new InstanceSet(SuperClass, instances1);
                const instanceSet2 = new InstanceSet(SuperClass, instances2);
    
                if (instanceSet1.equals(instanceSet2))
                    throw new Error('InstanceSets are equal.\n' + 
                        'setA: ' + instanceSet1 + '\n' + 
                        'setB: ' + instanceSet2
                    );
            });
    
            it('Two InstanceSets with the are not equal if one is a subset of the other.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instance3 = new Instance(SubClassOfSuperClass);
                const instances1 = [instance1, instance2, instance3];
                const instances2 = [instance1, instance2];
                const instanceSet1 = new InstanceSet(SuperClass, instances1);
                const instanceSet2 = new InstanceSet(SuperClass, instances2);
    
                if (instanceSet1.equals(instanceSet2))
                    throw new Error('InstanceSets are equal.\n' + 
                        'setA: ' + instanceSet1 + '\n' + 
                        'setB: ' + instanceSet2
                    );
            });
    
            it('Two InstanceSets with the are not equal if one is a subset of the other.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instance3 = new Instance(SubClassOfSuperClass);
                const instances1 = [instance1, instance2, instance3];
                const instances2 = [instance1, instance2];
                const instanceSet1 = new InstanceSet(SuperClass, instances2);
                const instanceSet2 = new InstanceSet(SuperClass, instances1);
    
                if (instanceSet1.equals(instanceSet2))
                    throw new Error('InstanceSets are equal.\n' + 
                        'setA: ' + instanceSet1 + '\n' + 
                        'setB: ' + instanceSet2
                    );
            });
    
        });
    
        describe('InstanceSet.difference()', () => {
    
            it('InstanceSet.difference() throws an error if passed something other than an instance set.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfDiscriminatedSubClassOfSuperClass);
                const instances = [instance1, instance2];
                const instanceSet = new InstanceSet(SuperClass, instances);
                const expectedErrorMessage = 'InstanceSet.difference() argument is not an InstanceSet.';
    
                testForError('instanceSet.difference()', expectedErrorMessage, () => {
                    instanceSet.difference(2);
                });
            });
    
            it('InstanceSet.difference() returns a new InstanceSet', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instances = [instance1, instance2];
                const instanceSet1 = new InstanceSet(SuperClass, instances);
                const instanceSet2 = new InstanceSet(SuperClass, instances);
                const difference = instanceSet1.difference(instanceSet2);
    
                if (!(difference instanceof InstanceSet))
                    throw new Error('difference did not return an InstanceSet.');
            });
    
            it('InstanceSet.difference() returns an empty InstanceSet when called with the same InstanceSet.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instances = [instance1, instance2];
                const instanceSet = new InstanceSet(SuperClass, instances);
    
                const difference = instanceSet.difference(instanceSet);
    
                if (difference.size)
                    throw new Error('difference returned an InstanceSet with instances in it.');
            });
    
            it('InstanceSet.difference() returns an empty InstanceSet when both InstanceSets are equal.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instances = [instance1, instance2];
                const instanceSet1 = new InstanceSet(SuperClass, instances);
                const instanceSet2 = new InstanceSet(SuperClass, instances);
                const difference = instanceSet1.difference(instanceSet2);
                
                if (difference.size)
                    throw new Error('difference returned an InstanceSet with instances in it.');
            });
    
            it('InstanceSet.difference() returns an InstanceSet Equal to the first InstanceSet when InstanceSets do not overlap.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instance3 = new Instance(SubClassOfSuperClass);
                const instance4 = new Instance(SubClassOfSuperClass);
                const instances1 = [instance1, instance2];
                const instances2 = [instance3, instance4];
                const instanceSet1 = new InstanceSet(SuperClass, instances1);
                const instanceSet2 = new InstanceSet(SuperClass, instances2);
                const difference = instanceSet1.difference(instanceSet2);
    
                if (!difference.equals(instanceSet1))
                    throw new Error('difference does not equal the first InstanceSet.');
            });
    
            it('InstanceSet.difference() returns an InstanceSet that is the difference of the two InstanceSets.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instance3 = new Instance(SubClassOfSuperClass);
                const instances1 = [instance1, instance2];
                const instances2 = [instance2, instance3];
                const instanceSet1 = new InstanceSet(SuperClass, instances1);
                const instanceSet2 = new InstanceSet(SuperClass, instances2);
                const difference = instanceSet1.difference(instanceSet2);
                const expected = new InstanceSet(SuperClass, [instance1]);
    
                if (!difference.equals(expected))
                    throw new Error('difference is not what is expected.');
            });
    
            it('InstanceSet.difference() works even when InstanceSets are for different ClassModels', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instance3 = new Instance(SubClassOfSuperClass);
                const instances1 = [instance1, instance2];
                const instances2 = [instance2, instance3];
                const instanceSet1 = new InstanceSet(SuperClass, instances1);
                const instanceSet2 = new InstanceSet(SubClassOfSuperClass, instances2);
                const difference = instanceSet1.difference(instanceSet2);
                const expected = new InstanceSet(SubClassOfSuperClass, [instance1]);
    
                if (!difference.equals(expected))
                    throw new Error('difference is not what is expected.');
            });
    
        });
    
        describe('InstanceSet.union()', () => {
    
            it('instanceSet.union() throws an error if argument is not an InstanceSet.', () => {
                const instanceSet = new InstanceSet(SuperClass);
                const expectedErrorMessage = 'instanceSet.union() called with argument which is not an InstanceSet';
                testForError('instanceSet.union()', expectedErrorMessage, () => {
                    instanceSet.union(1);
                });
            });
    
            it('Cannot Union two sets if second set constains instances of a ClassModel that is not the first InstanceSet\'s classModel.', () => {
                const instanceSet1 = new InstanceSet(SuperClass, [new Instance(SuperClass)]);
                const instanceSet2 = new InstanceSet(TestClassWithNumber, [new Instance(TestClassWithNumber)]);
                const expectedErrorMessage = 'Illegal attempt to add instances of a different class to an InstanceSet.';
    
                testForError('instanceSet.union()', expectedErrorMessage, () => {
                    instanceSet1.union(instanceSet2);
                });
            });
    
            it('instanceSet.union() returns an InstanceSet equal to the InstanceSet called with itself.', () => {
                const instanceSet = new InstanceSet(SuperClass, [new Instance(SuperClass)]);
                const union = instanceSet.union(instanceSet);
                if (!union.equals(instanceSet))
                    throw new Error('Union does not equal the original InstanceSet');
            });
    
            it('instanceSet.union() returns an InstanceSet equal to the InstanceSet called on if argument is null.', () => {
                const instanceSet = new InstanceSet(SuperClass, [new Instance(SuperClass)]);
                const union = instanceSet.union(null);
                if (!union.equals(instanceSet))
                    throw new Error('Union does not equal the original InstanceSet');
    
            });
    
            it('instanceSet.union() returns an InstanceSet equal to the InstanceSet called on if argument is undefined.', () => {
                const instanceSet = new InstanceSet(SuperClass, [new Instance(SuperClass)]);
                const union = instanceSet.union();
                if (!union.equals(instanceSet))
                    throw new Error('Union does not equal the original InstanceSet');
    
            });
    
            it('instanceSet.union() returns an InstanceSet.', () => {
                const instance1 = new Instance(SuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instanceSet1 = new InstanceSet(SuperClass, [instance1]);
                const instanceSet2 = new InstanceSet(SubClassOfSuperClass, [instance2]);
                const union = instanceSet1.union(instanceSet2);
                const expected = new InstanceSet(SuperClass, [instance1, instance2]);
    
                if (!union.equals(expected))
                    throw new Error('Union does not equal the expected InstanceSet');
            });
    
            it('instanceSet.union() returns an InstanceSet with the same classModel as the InstanceSet called on.', () => {
                const instance1 = new Instance(SuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instanceSet1 = new InstanceSet(SuperClass, [instance1]);
                const instanceSet2 = new InstanceSet(SubClassOfSuperClass, [instance2]);
                const union = instanceSet1.union(instanceSet2);
    
                if (union.classModel !== SuperClass) 
                    throw new Error('union returned an InstanceSet with an unexpected ClassModel.');
            });
    
        });

        describe('InstanceSet.intersection()', () => {
    
            it('InstanceSet.intersection() throws an error if passed something other than an instance set.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfDiscriminatedSubClassOfSuperClass);
                const instances = [instance1, instance2];
                const instanceSet = new InstanceSet(SuperClass, instances);
                const expectedErrorMessage = 'InstanceSet.intersection() argument is not an InstanceSet.';
    
                testForError('instanceSet.intersection()', expectedErrorMessage, () => {
                    instanceSet.intersection(2);
                });
            });
    
            it('InstanceSet.intersection() returns a new InstanceSet', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instances = [instance1, instance2];
                const instanceSet1 = new InstanceSet(SuperClass, instances);
                const instanceSet2 = new InstanceSet(SuperClass, instances);
                const intersection = instanceSet1.intersection(instanceSet2);
    
                if (!(intersection instanceof InstanceSet))
                    throw new Error('intersection did not return an InstanceSet.');
            });
    
            it('InstanceSet.intersection() returns a copy of the InstanceSet when called with the same InstanceSet.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instances = [instance1, instance2];
                const instanceSet = new InstanceSet(SuperClass, instances);
    
                const intersection = instanceSet.intersection(instanceSet);
    
                if (!intersection.equals(instanceSet))
                    throw new Error('intersection returned an InstanceSet which is different that the original InstanceSet.');
            });
    
            it('InstanceSet.intersection() returns an equal InstanceSet when both InstanceSets are equal.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instances = [instance1, instance2];
                const instanceSet1 = new InstanceSet(SuperClass, instances);
                const instanceSet2 = new InstanceSet(SuperClass, instances);
                const intersection = instanceSet1.intersection(instanceSet2);
    
                if (!intersection.equals(instanceSet1))
                    throw new Error('intersection returned an InstanceSet which is different that the original InstanceSet.');
            });
    
            it('InstanceSet.intersection() returns an empty InstanceSet when InstanceSets do not overlap.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instance3 = new Instance(SubClassOfSuperClass);
                const instance4 = new Instance(SubClassOfSuperClass);
                const instances1 = [instance1, instance2];
                const instances2 = [instance3, instance4];
                const instanceSet1 = new InstanceSet(SuperClass, instances1);
                const instanceSet2 = new InstanceSet(SuperClass, instances2);
                const intersection = instanceSet1.intersection(instanceSet2);
    
                if (intersection.size)
                    throw new Error('intersection has instances in it.');
            });
    
            it('InstanceSet.intersection() returns an InstanceSet that is the intersection of the two InstanceSets.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instance3 = new Instance(SubClassOfSuperClass);
                const instances1 = [instance1, instance2];
                const instances2 = [instance2, instance3];
                const instanceSet1 = new InstanceSet(SuperClass, instances1);
                const instanceSet2 = new InstanceSet(SuperClass, instances2);
                const intersection = instanceSet1.intersection(instanceSet2);
                const expected = new InstanceSet(SuperClass, [instance2]);
    
                if (!intersection.equals(expected))
                    throw new Error('intersection is not what is expected.');
            });
    
            it('InstanceSet.intersection() works even when InstanceSets are for different ClassModels', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instance3 = new Instance(SubClassOfSuperClass);
                const instances1 = [instance1, instance2];
                const instances2 = [instance2, instance3];
                const instanceSet1 = new InstanceSet(SuperClass, instances1);
                const instanceSet2 = new InstanceSet(SubClassOfSuperClass, instances2);
                const intersection = instanceSet1.intersection(instanceSet2);
                const expected = new InstanceSet(SubClassOfSuperClass, [instance2]);
    
                if (!intersection.equals(expected))
                    throw new Error('intersection is not what is expected.');
            });

        });

        describe('InstanceSet.symmetricDifference()', () => {
    
            it('InstanceSet.symmetricDifference() throws an error if passed something other than an instance set.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfDiscriminatedSubClassOfSuperClass);
                const instances = [instance1, instance2];
                const instanceSet = new InstanceSet(SuperClass, instances);
                const expectedErrorMessage = 'InstanceSet.symmetricDifference() argument is not an InstanceSet.';
    
                testForError('instanceSet.symmetricDifference()', expectedErrorMessage, () => {
                    instanceSet.symmetricDifference(2);
                });
            });
    
            it('InstanceSet.symmetricDifference() returns a new InstanceSet', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instances = [instance1, instance2];
                const instanceSet1 = new InstanceSet(SuperClass, instances);
                const instanceSet2 = new InstanceSet(SuperClass, instances);
                const symmetricDifference = instanceSet1.symmetricDifference(instanceSet2);
    
                if (!(symmetricDifference instanceof InstanceSet))
                    throw new Error('symmetricDifference did not return an InstanceSet.');
            });
    
            it('InstanceSet.symmetricDifference() returns an empty InstanceSet when called with the same InstanceSet.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instances = [instance1, instance2];
                const instanceSet = new InstanceSet(SuperClass, instances);
                const expected = new InstanceSet(SuperClass);
    
                const symmetricDifference = instanceSet.symmetricDifference(instanceSet);
    
                if (!symmetricDifference.equals(expected))
                    throw new Error('symmetricDifference returned an InstanceSet which is not empty.');
            });
    
            it('InstanceSet.symmetricDifference() returns an empty InstanceSet when both InstanceSets are equal.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instances = [instance1, instance2];
                const instanceSet1 = new InstanceSet(SuperClass, instances);
                const instanceSet2 = new InstanceSet(SuperClass, instances);
                const expected = new InstanceSet(SuperClass);
                const symmetricDifference = instanceSet1.symmetricDifference(instanceSet2);
    
                if (!symmetricDifference.equals(expected))
                    throw new Error('symmetricDifference returned an InstanceSet which is not empty.');
            });
    
            it('InstanceSet.symmetricDifference() returns the union of the two InstanceSets when InstanceSets do not overlap.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instance3 = new Instance(SubClassOfSuperClass);
                const instance4 = new Instance(SubClassOfSuperClass);
                const instances1 = [instance1, instance2];
                const instances2 = [instance3, instance4];
                const instanceSet1 = new InstanceSet(SuperClass, instances1);
                const instanceSet2 = new InstanceSet(SuperClass, instances2);
                const expected = instanceSet1.union(instanceSet2);
                const symmetricDifference = instanceSet1.symmetricDifference(instanceSet2);

                if (!symmetricDifference.equals(expected))
                    throw new Error('symmetricDifference returned an InstanceSet which is not the union of the two sets.');
            });
    
            it('InstanceSet.symmetricDifference() returns an InstanceSet that is the symmetricDifference of the two InstanceSets.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instance3 = new Instance(SubClassOfSuperClass);
                const instances1 = [instance1, instance2];
                const instances2 = [instance2, instance3];
                const instanceSet1 = new InstanceSet(SuperClass, instances1);
                const instanceSet2 = new InstanceSet(SuperClass, instances2);
                const symmetricDifference = instanceSet1.symmetricDifference(instanceSet2);
                const expected = new InstanceSet(SuperClass, [instance1, instance3]);
    
                if (!symmetricDifference.equals(expected))
                    throw new Error('symmetricDifference is not what is expected.');
            });
    
            it('InstanceSet.symmetricDifference() works even when InstanceSets are for different ClassModels', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfSuperClass);
                const instance3 = new Instance(SubClassOfSuperClass);
                const instances1 = [instance1, instance2];
                const instances2 = [instance2, instance3];
                const instanceSet1 = new InstanceSet(SuperClass, instances1);
                const instanceSet2 = new InstanceSet(SubClassOfSuperClass, instances2);
                const symmetricDifference = instanceSet1.symmetricDifference(instanceSet2);
                const expected = new InstanceSet(SuperClass, [instance1, instance3]);
    
                if (!symmetricDifference.equals(expected))
                    throw new Error('symmetricDifference is not what is expected.');
            });

        });

    });

    describe('ForEach, Map, Reduce, Filter', () => {

        describe('InstanceSet.forEach()', () => {

            it('forEach() used to build a new InstanceSet.', () => {
                const instance1 = new Instance(SuperClass);
                const instance2 = new Instance(SuperClass);
                const instances = [instance1, instance2];
                const instanceSet = new InstanceSet(SuperClass, instances);
                const newInstanceSet = new InstanceSet(SuperClass);

                instanceSet.forEach((instance) => {
                    newInstanceSet.add(instance);
                });

                if (!instanceSet.equals(newInstanceSet))
                    throw new Error('forEach did not work properly.');
                
            });

            it('forEach() used to filter an InstanceSet in place.', () => {
                const instance1 = new Instance(TestClassWithNumber);
                const instance2 = new Instance(TestClassWithNumber);
                instance1.number = 1;
                instance2.number = 2;
                const instances = [instance1, instance2];
                const instanceSet = new InstanceSet(TestClassWithNumber, instances);
                const expected = new InstanceSet(TestClassWithNumber, [instance1]);

                instanceSet.forEach((instance) => {
                    if (instance.number != 1)
                        instanceSet.remove(instance);
                });

                if (!instanceSet.equals(expected))
                    throw new Error('forEach did not work properly.');
                
            });

            it('forEach() used to set a property on each Instance in an InstanceSet.', () => {
                const instance1 = new Instance(TestClassWithNumber);
                const instance2 = new Instance(TestClassWithNumber);
                instance1.number = 1;
                instance2.number = 2;
                const instances = [instance1, instance2];
                const instanceSet = new InstanceSet(TestClassWithNumber, instances);

                instanceSet.forEach((instance) => {
                    instance.number = 3;
                });

                for (const instance of instanceSet) {
                    if (instance.number != 3)
                        throw new Error('properties were not changed.')
                }
                
            });

        });

        describe('InstanceSet.mapToInstanceSet(', () => {
    
            it('instanceSet.mapToInstanceSet() returns an InstanceSet.', () => {
                const instanceSet = new InstanceSet(SuperClass);
                const mapped = instanceSet.mapToInstanceSet(x => x);
                if (!(mapped instanceof InstanceSet))
                    throw new Error('instanceSet.mapToInstanceSet() returned something other than an InstanceSet.');
            });
    
            it('instanceSet.mapToInstanceSet() returns an InstanceSet with the same ClassModel as the InstanceSet it was called on.', () => {
                const instanceSet = new InstanceSet(SuperClass);
                const mapped = instanceSet.mapToInstanceSet(x => x);
                if (mapped.classModel !== SuperClass)
                    throw new Error('instanceSet.mapToInstanceSet() returned an InstanceSet with a different ClassModel.');
            });
    
            it('instanceSet.mapToInstanceSet() throws an error if callback returns something that isn\'t an instance.', () => {
                const instanceSet = new InstanceSet(SuperClass, [new Instance(SuperClass)]);
                const expectedErrorMessage = 'Illegal attempt to add something other than instances to an InstanceSet.';
    
                testForError('instanceSet.mapToInstanceSet()', expectedErrorMessage, () => {
                    instanceSet.mapToInstanceSet(x => x.id);
                });
            });
    
            it('instanceSet.mapToInstanceSet() throws an error if callback returns an instance of a different ClassModel.', () => {
                const instanceSet = new InstanceSet(SuperClass, [new Instance(SuperClass)]);
                const expectedErrorMessage = 'Illegal attempt to add instances of a different class to an InstanceSet.';
    
                testForError('instanceSet.mapToInstanceSet()', expectedErrorMessage, () => {
                    instanceSet.mapToInstanceSet(() => {
                        return new Instance(TestClassWithNumber);
                    });
                });
            });
    
            it('instanceSet.mapToInstanceSet() works properly.', () => {
                const instanceSet = new InstanceSet(SuperClass, [new Instance(SuperClass), new Instance(SubClassOfSuperClass)]);
                const mapped = instanceSet.mapToInstanceSet(x => x);
                if (!mapped.equals(instanceSet))
                    throw new Error('instanceSet.mapToInstanceSet() did not work as expected.');
            });
    
        });

        describe('InstanceSet.reduce()', () => {

        });

        describe('InstanceSet.filter()', () => {

        });

    });

    describe('ClassModel Methods', () => {

        describe('InstanceSet.save()', () => {

        });

        describe('InstanceSet.walk()', () => {

        });

    });

    describe('Miscellanious Methods', () => {

        describe('InstanceSet.getInstanceIds()', () => {
    
            it('getInstanceIds returns an array of string object ids.', () => {
                const instance1 = new Instance(SubClassOfSuperClass);
                const instance2 = new Instance(SubClassOfDiscriminatedSubClassOfSuperClass);
                const instances = [instance1, instance2];
                const instanceSet = new InstanceSet(SuperClass, instances);
                const expected = instances.map(instance => instance.id);
                const ids = instanceSet.getInstanceIds();
                if (ids.length != expected.length)
                    throw new Error('Wrong number of ids returned.');
                
                for (const id of expected) {
                    if (!ids.includes(id))
                        throw new Error('Array of ids is missing ' + id + '.');
                }
            });
    
            it('getInstanceIds called on an empty set returns an empty array.', () => {
                const instanceSet = new InstanceSet(SuperClass,);
                const ids = instanceSet.getInstanceIds();
    
                if (!Array.isArray(ids))
                    throw new Error('getInstanceIds() returned a non array.');
                
                if (ids.length)
                    throw new Error('getInstanceIds() returned a non empty array. ' + ids);
            });
    
        });

    })

});