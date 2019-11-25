const moment = require('moment');

const Diffable = require('../../src/noomman/Diffable');
const Instance = require('../../src/noomman/Instance');
const InstanceSet = require('../../src/noomman/InstanceSet');
const SuperSet = require('../../src/noomman/SuperSet');
const database = require('../../src/noomman/database');

const TestClassModels = require('./helpers/TestClassModels');
const TestingFunctions = require('./helpers/TestingFunctions');
const testForError = TestingFunctions.testForError;
const arraysEqual = TestingFunctions.arraysEqual;
const objectsEqual = TestingFunctions.objectsEqual;
const testForErrorAsync = TestingFunctions.testForErrorAsync;

// Load Necessarry TestClassModels
{
    // Compare Classes
    var CompareClass1 = TestClassModels.CompareClass1;
    var CompareClass2 = TestClassModels.CompareClass2;

    // Simple Classes
    var AllAttributesAndRelationshipsClass = TestClassModels.AllAttributesAndRelationshipsClass;

    // Auditable Classes
    var AuditableSuperClass = TestClassModels.AuditableSuperClass;
    var AuditableSubClass = TestClassModels.AuditableSubClass
    var AuditableDiscriminatedSubClass = TestClassModels.AuditableDiscriminatedSubClass;

    // Relationship Classes
    var TwoWayRelationshipClass1 = TestClassModels.TwoWayRelationshipClass1;
    var TwoWayRelationshipClass2 = TestClassModels.TwoWayRelationshipClass2;
}

describe('Diffable Tests', () => {

    before(async () => {
        await database.connect();
    });

    after(() => {
        database.close();
    });

    describe('Constructor Tests', () => {

        it('Diffable is abstract and cannot be instanciated.', () => {
            const expectedErrorMessage = 'Diffable is an abstract class and should not be directly instantiated.';

            testForError('new Diffable()', expectedErrorMessage, () => {
                new Diffable();
            });
        });

    });

    describe('instance.diff()', () => {

        describe('Diff With Attribute Changes', () => {

            it('Updating attributes from null previous state.', () => {
                const instance = new Instance(AllAttributesAndRelationshipsClass);
                const assignObject = {
                    _id: database.ObjectId(),
                    string: 'yoyoyo',
                    strings: ['bob', 'is', 'your', 'uncle'],
                    boolean: true,
                    booleans: [true, false],
                    date: new Date(),
                    dates: [null, new Date()],
                    number: 15,
                    numbers: [0, 1, 0],
                }
                instance.assign(assignObject);
    
                const diff = instance.diff();
    
                if (!diff.$set) {
                    throw new Error('Diff is missing the $set object.');
                }
                if (Object.keys(diff.$set).length != 8) {
                    throw new Error('Diff has $set properties it shouldn\'t.');
                }
                if (diff.$set.string !== assignObject.string) {
                    throw new Error('Diff.$set is not correct.');
                }
                if (diff.$set.boolean !== assignObject.boolean) {
                    throw new Error('Diff.$set is not correct.');
                }
                if (diff.$set.number !== assignObject.number) {
                    throw new Error('Diff.$set is not correct.');
                }
                if (!moment(diff.$set.date).isSame(assignObject.date)) {
                    throw new Error('Diff.$set is not correct.');
                }
                if (!arraysEqual(diff.$set.booleans, assignObject.booleans)) {
                    throw new Error('Diff.$set is not correct.');
                }
                if (!arraysEqual(diff.$set.strings, assignObject.strings)) {
                    throw new Error('Diff.$set is not correct.');
                }
                if (!arraysEqual(diff.$set.numbers, assignObject.numbers)) {
                    throw new Error('Diff.$set is not correct.');
                }
                if (diff.$addToSet || diff.$pull || diff.$unset) {
                    throw new Error('Diff has an $unset, $addToSet, or $pull object when it shouldn\'t.');
                }
            });

            it('Updating attributes from previous value.', () => {
                const document = {
                    _id: database.ObjectId(),
                    string: 'yoyoyo',
                    strings: ['bob', 'is', 'your', 'uncle'],
                    boolean: true,
                    booleans: [true, false],
                    date: new Date(),
                    dates: [null, new Date()],
                    number: 15,
                    numbers: [0, 1, 0],
                }
                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                instance.assign({
                    string: 'yayaya',
                    booleans: [false, true],
                    date: new Date('1000-01-01'),
                    numbers: [1, 0, 1],
                });
    
                instance.strings = null;
                instance.number = undefined;
    
                const diff = instance.diff();
    
                if (!diff.$set) {
                    throw new Error('Diff is missing the $set object.');
                }
                if (!diff.$set.string || !diff.$set.date || !diff.$set.booleans || !diff.$set.numbers) {
                    throw new Error('Diff is missing at least one of the $set properties.');
                }
                if (Object.keys(diff.$set).length > 4) {
                    throw new Error('Diff has $set properties it shouldn\'t.');
                }
                if (!diff.$unset) {
                    throw new Error('Diff is missing the $unset object.');
                }
                if (!diff.$unset.strings || !diff.$unset.number) {
                    throw new Error('Diff is missing at least one of the $unset properties.');
                }
                if (Object.keys(diff.$unset).length > 2) {
                    throw new Error('Diff has $unset properties it shouldn\'t.');
                }
                if (diff.$addToSet || diff.$pull) {
                    throw new Error('Diff has an $addToSet or $pull object when it shouldn\'t.');
                }
            });
    
            it('Updating attributes from previous value.', () => {
                const document = {
                    _id: database.ObjectId(),
                    string: 'yoyoyo',
                    strings: ['bob', 'is', 'your', 'uncle'],
                    boolean: true,
                    booleans: [true, false],
                    date: new Date(),
                    dates: [null, new Date()],
                    number: 15,
                    numbers: [0, 1, 0],
                }
                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
    
                instance.strings = null;
                instance.number = undefined;
    
                const diff = instance.diff();
    
                if (!diff.$unset) {
                    throw new Error('Diff is missing the $unset object.');
                }
                if (!diff.$unset.strings || !diff.$unset.number) {
                    throw new Error('Diff is missing at least one of the $unset properties.');
                }
                if (!arraysEqual(diff.$unset.strings, ['bob', 'is', 'your', 'uncle'])) {
                    throw new Error('Diff has incorrect value for diff.$unset.strings.');
                }
                if (diff.$unset.number !== 15) {
                    throw new Error('Diff has incorrect value for diff.$unset.number');
                }
                if (diff.$set || diff.$addToSet || diff.$pull) {
                    throw new Error('Diff has a $set, $addToSet, or $pull object when it shouldn\'t.');
                }
            });
    
            it('Updating attributes. $set has correct values.', () => {
                const document = {
                    _id: database.ObjectId(),
                    string: 'yoyoyo',
                    strings: ['bob', 'is', 'your', 'uncle'],
                    boolean: true,
                    booleans: [true, false],
                    date: new Date(),
                    dates: [null, new Date()],
                    number: 15,
                    numbers: [0, 1, 0],
                }
                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                instance.assign({
                    string: 'yayaya',
                    booleans: [false, true],
                    date: new Date('1000-01-01'),
                    numbers: [1, 0, 1],
                });
    
                const diff = instance.diff();
    
                if (!diff.$set) {
                    throw new Error('Diff is missing the $set object.');
                }
                if (!diff.$set.string || !diff.$set.date || !diff.$set.booleans || !diff.$set.numbers) {
                    throw new Error('Diff is missing at least one of the $set properties.');
                }
                if (Object.keys(diff.$set).length > 4) {
                    throw new Error('Diff has $set properties it shouldn\'t.');
                }
                if (diff.$set.string !== 'yayaya') {
                    throw new Error('Diff has incorrect value for diff.$set.string.');
                }
                if (!arraysEqual(diff.$set.booleans, [false, true])) {
                    throw new Error('Diff has incorrect value for diff.$set.booleans.');
                }
                if (!moment(new Date('1000-01-01')).isSame(diff.$set.date)) {
                    throw new Error('Diff has incorrect value for diff.$set.date.');
                }
                if (!arraysEqual(diff.$set.numbers, [1, 0, 1])) {
                    throw new Error('Diff has incorrect value for diff.$set.numbers.');
                }
                if (diff.$addToSet || diff.$pull || diff.$unset) {
                    throw new Error('Diff has an $unset, $addToSet, or $pull object when it shouldn\'t.');
                }
            });
    
            it('Updating list attributes to empty leads to an $unset diff.', () => {
                const document = {
                    _id: database.ObjectId(),
                    string: 'yoyoyo',
                    strings: ['bob', 'is', 'your', 'uncle'],
                    boolean: true,
                    booleans: [true, false],
                    date: new Date(),
                    dates: [null, new Date()],
                    number: 15,
                    numbers: [0, 1, 0],
                }
                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                instance.assign({
                    strings: [],
                    booleans: [],
                    dates: [],
                    numbers: [],
                });
    
                const diff = instance.diff();
    
                if (!diff.$unset) {
                    throw new Error('Diff is missing the $unset object.');
                }
                if (!diff.$unset.strings || !diff.$unset.numbers || !diff.$unset.dates || !diff.$unset.booleans) {
                    throw new Error('Diff is missing at least one of the $unset properties.');
                }
                if (Object.keys(diff.$unset).length > 4) {
                    throw new Error('Diff has $unset properties it shouldn\'t.');
                }
                if (diff.$addToSet || diff.$pull || diff.$set) {
                    throw new Error('Diff has a $set, $addToSet, or $pull object when it shouldn\'t.');
                }
            });

        });

        describe('Diff With Singular Relationship Changes', () => {

            it('Setting relationship from null previous state.', () => {
                const newClass1Value = new Instance(CompareClass1);
                const instance = new Instance(AllAttributesAndRelationshipsClass);
                instance.assign({
                    class1: newClass1Value,
                });
    
                const diff = instance.diff();

                if (!diff.$set) {
                    throw new Error('Diff is missing one of the operations.');
                }
                if (!diff.$set.class1) {
                    throw new Error('Diff is missing property diff.$set.class1');
                }
                if (!diff.$set.class1.equals(newClass1Value._id)) {
                    throw new Error('Value for diff.$set.class1 is incorrect.');
                }
                if (diff.$unset || diff.$addToSet || diff.$pull) {
                    throw new Error('Diff contains extra operations.');
                }
            });

            it('Updating relationships, replacing values', () => {
                const oldClass1Value = database.ObjectId();
                const newClass1Value = new Instance(CompareClass1);
                const document = {
                    _id: database.ObjectId(),
                    class1: oldClass1Value,
                }
                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                instance.assign({
                    class1: newClass1Value,
                });
    
                const diff = instance.diff();

                if (!diff.$set) {
                    throw new Error('Diff is missing one of the operations.');
                }
                if (!diff.$set.class1) {
                    throw new Error('Diff is missing property diff.$set.class1');
                }
                if (!diff.$set.class1.equals(newClass1Value._id)) {
                    throw new Error('Value for diff.$set.class1 is incorrect.');
                }
                if (diff.$unset || diff.$addToSet || diff.$pull) {
                    throw new Error('Diff contains extra operations.');
                }
            });

            it('Removing relationship', () => {
                const oldClass1Value = database.ObjectId();
                const newClass1Value = null;
                const document = {
                    _id: database.ObjectId(),
                    class1: oldClass1Value,
                }
                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                instance.assign({
                    class1: newClass1Value,
                });
    
                const diff = instance.diff();

                if (!diff.$unset) {
                    throw new Error('Diff is missing one of the operations.');
                }
                if (!diff.$unset.class1) {
                    throw new Error('Diff is missing property diff.$set.class1');
                }
                if (!diff.$unset.class1.equals(oldClass1Value)) {
                    throw new Error('Value for diff.$unset.class1 is incorrect.');
                }
                if (diff.$set || diff.$addToSet || diff.$pull) {
                    throw new Error('Diff contains extra operations.');
                }
            });

        });

        describe('Diff With Non-Singular Relationship Changes', () => {

            it('Setting a non-singular relationship from null previous state.', () => {
                const newClass2sValue = new InstanceSet(CompareClass2, [new Instance(CompareClass2), new Instance(CompareClass2)]);
                const instance = new Instance(AllAttributesAndRelationshipsClass);
                instance.assign({
                    class2s: newClass2sValue,
                });
    
                const diff = instance.diff();

                if (!diff.$set) {
                    throw new Error('Diff is missing one of the operations.');
                }
                if (!diff.$set.class2s) {
                    throw new Error('Diff is missing property diff.$set.class2s');
                }
                if (!arraysEqual(newClass2sValue.getObjectIds(), diff.$set.class2s)) {
                    throw new Error('Value for diff.$set.class2s.$each is incorrect.');
                }
                if (diff.$unset || diff.$addToSet || diff.$pull) {
                    throw new Error('Diff contains extra operations.');
                }
            });

            it('Setting a non-singular relationship.', () => {
                const newClass2sValue = new InstanceSet(CompareClass2, [new Instance(CompareClass2), new Instance(CompareClass2)]);
                const document = {
                    _id: database.ObjectId(),
                }
                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                instance.assign({
                    class2s: newClass2sValue,
                });
    
                const diff = instance.diff();

                if (!diff.$set) {
                    throw new Error('Diff is missing one of the operations.');
                }
                if (!diff.$set.class2s) {
                    throw new Error('Diff is missing property diff.$set.class2s');
                }
                if (!arraysEqual(newClass2sValue.getObjectIds(), diff.$set.class2s)) {
                    throw new Error('Value for diff.$set.class2s.$each is incorrect.');
                }
                if (diff.$unset || diff.$addToSet || diff.$pull) {
                    throw new Error('Diff contains extra operations.');
                }
            });

            it('Un-setting a non-singular relationship.', () => {
                const oldClass2sValue =[new Instance(CompareClass2)._id, new Instance(CompareClass2)._id];
                const document = {
                    _id: database.ObjectId(),
                    class2s: oldClass2sValue,
                }
                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                instance.assign({
                    class2s: null,
                });
    
                const diff = instance.diff();

                if (!diff.$unset) {
                    throw new Error('Diff is missing one of the operations.');
                }
                if (!diff.$unset.class2s) {
                    throw new Error('Diff is missing property diff.$unset.class2s');
                }
                if (!arraysEqual(oldClass2sValue, diff.$unset.class2s)) {
                    throw new Error('Value for diff.$unset.class2s is incorrect.');
                }
                if (diff.$set || diff.$addToSet || diff.$pull) {
                    throw new Error('Diff contains extra operations.');
                }
            });

            it('Updating non-singular relationship, replacing values.', () => {
                const oldClass2sValue = [database.ObjectId(), database.ObjectId()];
                const newClass2sValue = new InstanceSet(CompareClass2, [new Instance(CompareClass2), new Instance(CompareClass2)]);
                const document = {
                    _id: database.ObjectId(),
                    class2s: oldClass2sValue,
                }
                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                instance.assign({
                    class2s: newClass2sValue,
                });
    
                const diff = instance.diff();

                if (!diff.$set) {
                    throw new Error('Diff is missing one of the operations.');
                }
                if (!diff.$set.class2s) {
                    throw new Error('Diff is missing property diff.$set.class2s');
                }
                if (!arraysEqual(newClass2sValue.getObjectIds(), diff.$set.class2s)) {
                    throw new Error('Value for diff.$set.class2s.$each is incorrect.');
                }
                if (diff.$unset || diff.$addToSet || diff.$pull) {
                    throw new Error('Diff contains extra operations.');
                }
            });

            it('Updating relationships. Adding one Instance and removing one Instance from a non-singular Relationship.', () => {
                const oldClass2Instance = new Instance(CompareClass2);
                const oldClass2sValue = [oldClass2Instance._id, database.ObjectId()];
                const newClass2sValue = new InstanceSet(CompareClass2, [oldClass2Instance, new Instance(CompareClass2)]);
                const document = {
                    _id: database.ObjectId(),
                    class2s: oldClass2sValue,
                }
                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                instance.assign({
                    class2s: newClass2sValue,
                });
    
                const diff = instance.diff();

                if (!diff.$set.class2s) {
                    throw new Error('Diff is missing property diff.$set.class2s');
                }
                if (!arraysEqual(diff.$set.class2s, newClass2sValue.getObjectIds())) {
                    throw new Error('Value for diff.$set.class2s is incorrect.');
                }
                if (diff.$unset || diff.$addToSet || diff.$pull) {
                    throw new Error('Diff contains extra operations.');
                }
            });

            it('Updating relationships. Adding one Instance to a non-singular Relationship.', () => {
                const oldClass2Instance = new Instance(CompareClass2);
                const oldClass2sValue = [oldClass2Instance._id];
                const newClass2sValue = new InstanceSet(CompareClass2, [oldClass2Instance, new Instance(CompareClass2)]);
                const document = {
                    _id: database.ObjectId(),
                    class2s: oldClass2sValue,
                }
                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                instance.assign({
                    class2s: newClass2sValue,
                });
    
                const diff = instance.diff();

                if (!diff.$addToSet.class2s) {
                    throw new Error('Diff is missing property diff.$addToSet.class2s');
                }
                if (!diff.$addToSet.class2s.equals([...newClass2sValue][1]._id)) {
                    throw new Error('Value for diff.$addToSet.class2s is incorrect.');
                }
                if (diff.$set || diff.$unset || diff.$pull) {
                    throw new Error('Diff contains extra operations.');
                }
            });

            it('Updating relationships. Adding two Instances to a non-singular Relationship.', () => {
                const oldClass2Instance = new Instance(CompareClass2);
                const oldClass2sValue = [oldClass2Instance._id];
                const newClass2sValue = new InstanceSet(CompareClass2, [oldClass2Instance, new Instance(CompareClass2), new Instance(CompareClass2)]);
                const document = {
                    _id: database.ObjectId(),
                    class2s: oldClass2sValue,
                }
                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                instance.assign({
                    class2s: newClass2sValue,
                });
    
                const diff = instance.diff();
                
                if (!diff.$addToSet.class2s) {
                    throw new Error('Diff is missing property diff.$addToSet.class2s');
                }
                if (!diff.$addToSet.class2s.$each) {
                    throw new Error('Diff is missing property diff.$addToSet.class2s.$each');
                }
                if (!arraysEqual(diff.$addToSet.class2s.$each, newClass2sValue.getObjectIds().slice(1))) {
                    throw new Error('Value for diff.$addToSet.class2s.$each is incorrect.');
                }
                if (diff.$unset || diff.$set || diff.$pull) {
                    throw new Error('Diff contains extra operations.');
                }
            });

            it('Updating relationships. Removing one Instance from a non-singular Relationship.', () => {
                const oldClass2Instance = new Instance(CompareClass2);
                const oldClass2sValue = [oldClass2Instance._id, new Instance(CompareClass2)._id];
                const newClass2sValue = new InstanceSet(CompareClass2, [oldClass2Instance]);
                const document = {
                    _id: database.ObjectId(),
                    class2s: oldClass2sValue,
                }
                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                instance.assign({
                    class2s: newClass2sValue,
                });
    
                const diff = instance.diff();
                
                if (!diff.$pull.class2s) {
                    throw new Error('Diff is missing property diff.$pull.class2s');
                }
                if (!diff.$pull.class2s.equals(oldClass2sValue[1])) {
                    throw new Error('Value for diff.$pull.class2s is incorrect.');
                }
                if (diff.$unset || diff.$set || diff.$addToSet) {
                    throw new Error('Diff contains extra operations.');
                }
            });

            it('Updating relationships. Removing two Instances from a non-singular Relationship.', () => {
                const oldClass2Instance = new Instance(CompareClass2);
                const oldClass2sValue = [oldClass2Instance._id, new Instance(CompareClass2)._id, new Instance(CompareClass2)._id];
                const newClass2sValue = new InstanceSet(CompareClass2, [oldClass2Instance]);
                const document = {
                    _id: database.ObjectId(),
                    class2s: oldClass2sValue,
                }
                const instance = new Instance(AllAttributesAndRelationshipsClass, document);
                instance.assign({
                    class2s: newClass2sValue,
                });
    
                const diff = instance.diff();
                
                if (!diff.$pull.class2s) {
                    throw new Error('Diff is missing property diff.$pull.class2s');
                }
                
                if (!diff.$pull.class2s.$in) {
                    throw new Error('Diff is missing property diff.$pull.class2s.$in');
                }
                if (!arraysEqual(diff.$pull.class2s.$in, oldClass2sValue.slice(1))) {
                    throw new Error('Value for diff.$pull.class2s.$in is incorrect.');
                }
                if (diff.$unset || diff.$set || diff.$addToSet) {
                    throw new Error('Diff contains extra operations.');
                }
            });

        });

        describe('Diff for Auditable Instances', () => {

            it('Diff for instance of auditable class model from document incriments revision.', () => {
                const document = {
                    _id: database.ObjectId(),
                    revision: 0,
                };
                const instance = new Instance(AuditableSuperClass, document);

                const diff = instance.diff();

                if (!diff.$set || diff.$set.revision !== 1) {
                    throw new Error('Diff did not set revision properly.');
                }
            });

            it('Diff for instance of auditable class model from document incriments revision.', () => {
                const document = {
                    _id: database.ObjectId(),
                    revision: 117,
                };
                const instance = new Instance(AuditableSubClass, document);

                const diff = instance.diff();

                if (!diff.$set || diff.$set.revision !== 118) {
                    throw new Error('Diff did not set revision properly.');
                }
            });

            it('Diff for non auditable instance does not set revision.', () => {
                const document = {
                    _id: database.ObjectId(),
                    revision: 117,
                };
                const instance = new Instance(AllAttributesAndRelationshipsClass, document);

                const diff = instance.diff();

                if (diff.$set && diff.$set.revision) {
                    throw new Error('Diff set the revision when it shouldn\'t have.');
                }
            });

        });

    });

    describe('instance.combineSetOperations()', () => {
        
        it('If no set operations, diff is unchanged.', () => {
            const instance = new Instance(TwoWayRelationshipClass1);
            const diff = {
                $set: {
                    oneToOne: database.ObjectId(),
                },
                $unset: {
                    manyToOne: database.ObjectId(),
                },
                $addToSet: {
                    oneToMany: database.ObjectId(),
                },
                $pull: {
                    oneToOne:{
                        $in: [database.ObjectId(), database.ObjectId()],
                    }
                },
            };

            const combined = instance.combineSetOperations(diff);
            
            if (!objectsEqual(diff, combined)) {
                throw new Error('Diff was changed.');
            }
        });
        
        it('AddToSet and Pull combined into a set operation, no other set operations.', () => {
            const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
            const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
            const relatedInstance3 = new Instance(TwoWayRelationshipClass2);

            const document = {
                _id: database.ObjectId(),
                oneToMany: [relatedInstance1._id]
            }
            
            const instance = new Instance(TwoWayRelationshipClass1, document);

            const diff = {
                $addToSet: {
                    oneToMany:{
                        $each: [relatedInstance2._id, relatedInstance3._id],
                    }
                },
                $pull: {
                    oneToMany: relatedInstance1._id,
                },
            };

            const combined = instance.combineSetOperations(diff);

            if (!combined.$set.oneToMany[0].equals(relatedInstance2._id)) {
                throw new Error('Operations not combined correctly.');
            }
            if (!combined.$set.oneToMany[1].equals(relatedInstance3._id)) {
                throw new Error('Operations not combined correctly.');
            }
            if (combined.$addToSet !== undefined || combined.$pull !== undefined) {
                throw new Error('Combined still contains $addToSet or $pull.');
            }
        });
        
        it('Combination works if ObjectIds are same ID but diferent objects.', () => {
            const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
            const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
            const relatedInstance3 = new Instance(TwoWayRelationshipClass2);

            const document = {
                _id: database.ObjectId(),
                oneToMany: [database.ObjectId(relatedInstance1._id.toHexString())]
            }
            
            const instance = new Instance(TwoWayRelationshipClass1, document);

            const diff = {
                $addToSet: {
                    oneToMany:{
                        $each: [relatedInstance2._id, relatedInstance3._id],
                    }
                },
                $pull: {
                    oneToMany: relatedInstance1._id,
                },
            };

            const combined = instance.combineSetOperations(diff);

            if (!combined.$set.oneToMany[0].equals(relatedInstance2._id)) {
                throw new Error('Operations not combined correctly.');
            }
            if (!combined.$set.oneToMany[1].equals(relatedInstance3._id)) {
                throw new Error('Operations not combined correctly.');
            }
            if (combined.$addToSet !== undefined || combined.$pull !== undefined) {
                throw new Error('Combined still contains $addToSet or $pull.');
            }
        });
        
        it('Combining pulling 2 instances and adding one. With Previous value', () => {
            const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
            const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
            const relatedInstance3 = new Instance(TwoWayRelationshipClass2);
            const relatedInstance4 = new Instance(TwoWayRelationshipClass2);

            const document = {
                _id: database.ObjectId(),
                oneToMany: [relatedInstance1._id, relatedInstance2._id],
            }
            
            const instance = new Instance(TwoWayRelationshipClass1, document);

            const diff = {
                $addToSet: {
                    oneToMany:{
                        $each: [relatedInstance3._id, relatedInstance4._id],
                    }
                },
                $pull: {
                    oneToMany: relatedInstance1._id,
                },
            };

            const combined = instance.combineSetOperations(diff);

            if (!combined.$set.oneToMany[0].equals(relatedInstance2._id)) {
                throw new Error('Operations not combined correctly.');
            }
            if (!combined.$set.oneToMany[1].equals(relatedInstance3._id)) {
                throw new Error('Operations not combined correctly.');
            }
            if (!combined.$set.oneToMany[2].equals(relatedInstance4._id)) {
                throw new Error('Operations not combined correctly.');
            }
            if (combined.$addToSet !== undefined || combined.$pull !== undefined) {
                throw new Error('Combined still contains $addToSet or $pull.');
            }
        });

    });

    describe('instance.relatedDiffs()', () => {

        describe('$set', () => {

            describe('One to One', () => {

                it('Setting a one to one relationship.', () => {
                    const relationship = 'oneToOne';
                    const mirrorRelationship = 'oneToOne';
                    const mirrorOperation = '$set';

                    const instance = new Instance(TwoWayRelationshipClass1);
                    const relatedInstance = new Instance(TwoWayRelationshipClass2);
                    instance[relationship] = relatedInstance;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

            });

            describe('One to Many', () => {

                it('Setting a one to many relationship, previously no value.', () => {
                    const relationship = 'oneToMany';
                    const mirrorRelationship = 'manyToOne';
                    const mirrorOperation = '$set';

                    const instance = new Instance(TwoWayRelationshipClass1);
                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1, relatedInstance2]);
                    instance[relationship] = relatedInstances;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance1.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance2.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

                it('Setting a one to many relationship, adding one instance and removing another.', () => {
                    const relationship = 'oneToMany';
                    const mirrorRelationship = 'manyToOne';
                    const mirrorOperation1 = '$unset';
                    const mirrorOperation2 = '$set';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance3 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance2, relatedInstance3]);

                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: [relatedInstance1._id, relatedInstance2._id],
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = relatedInstances;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance1.id][mirrorOperation1][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance3.id][mirrorOperation2][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

                it('Setting a one to many relationship, replacing one instance with another.', () => {
                    const relationship = 'oneToMany';
                    const mirrorRelationship = 'manyToOne';
                    const mirrorOperation1 = '$unset';
                    const mirrorOperation2 = '$set';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance3 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance3]);

                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: [relatedInstance1._id],
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = relatedInstances;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance1.id][mirrorOperation1][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance3.id][mirrorOperation2][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

                it('Setting a one to many relationship, replacing 2 instances with 2 instances.', () => {
                    const relationship = 'oneToMany';
                    const mirrorRelationship = 'manyToOne';
                    const mirrorOperation1 = '$unset';
                    const mirrorOperation2 = '$set';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance4 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance5 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance4, relatedInstance5]);

                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: [relatedInstance1._id, relatedInstance2._id],
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = relatedInstances;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance1.id][mirrorOperation1][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance2.id][mirrorOperation1][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance4.id][mirrorOperation2][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance5.id][mirrorOperation2][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

                it('Setting a one to many relationship, replacing 2 instances with 3 instances.', () => {
                    const relationship = 'oneToMany';
                    const mirrorRelationship = 'manyToOne';
                    const mirrorOperation1 = '$unset';
                    const mirrorOperation2 = '$set';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance3 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance4 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance5 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance3, relatedInstance4, relatedInstance5]);

                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: [relatedInstance1._id, relatedInstance2._id],
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = relatedInstances;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance1.id][mirrorOperation1][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance2.id][mirrorOperation1][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance3.id][mirrorOperation2][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance4.id][mirrorOperation2][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance5.id][mirrorOperation2][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

                it('Setting a one to many relationship, adding two instances and removing two instances.', () => {
                    const relationship = 'oneToMany';
                    const mirrorRelationship = 'manyToOne';
                    const mirrorOperation1 = '$unset';
                    const mirrorOperation2 = '$set';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance3 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance4 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance5 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance3, relatedInstance4, relatedInstance5]);

                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: [relatedInstance1._id, relatedInstance2._id, relatedInstance3._id],
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = relatedInstances;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance1.id][mirrorOperation1][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance2.id][mirrorOperation1][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance4.id][mirrorOperation2][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance5.id][mirrorOperation2][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

            });

            describe('Many to One', () => {

                it('Setting a many to one relationship.', () => {
                    const relationship = 'manyToOne';
                    const mirrorRelationship = 'oneToMany';
                    const mirrorOperation = '$addToSet';

                    const instance = new Instance(TwoWayRelationshipClass1);
                    const relatedInstance = new Instance(TwoWayRelationshipClass2);
                    instance[relationship] = relatedInstance;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

            });

            describe('Many to Many', () => {

                it('Setting a many to many relationship, no previous value.', () => {
                    const relationship = 'manyToMany';
                    const mirrorRelationship = 'manyToMany';
                    const mirrorOperation = '$addToSet';

                    const instance = new Instance(TwoWayRelationshipClass1);
                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1, relatedInstance2]);
                    instance[relationship] = relatedInstances;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance1.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance2.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

                it('Setting a many to many relationship, replacing a 1 instance with 1 instance.', () => {
                    const relationship = 'manyToMany';
                    const mirrorRelationship = 'manyToMany';
                    const mirrorOperation1 = '$pull';
                    const mirrorOperation2 = '$addToSet';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance5 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance5]);

                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: [relatedInstance1._id],
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = relatedInstances;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance1.id][mirrorOperation1][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance5.id][mirrorOperation2][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

                it('Setting a many to many relationship, replacing a 2 instances with 2 instances.', () => {
                    const relationship = 'manyToMany';
                    const mirrorRelationship = 'manyToMany';
                    const mirrorOperation1 = '$pull';
                    const mirrorOperation2 = '$addToSet';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance4 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance5 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance4, relatedInstance5]);

                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: [relatedInstance1._id, relatedInstance2._id],
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = relatedInstances;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance1.id][mirrorOperation1][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance2.id][mirrorOperation1][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance4.id][mirrorOperation2][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance5.id][mirrorOperation2][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

                it('Setting a many to many relationship, replacing a 3 instances with 2 instances.', () => {
                    const relationship = 'manyToMany';
                    const mirrorRelationship = 'manyToMany';
                    const mirrorOperation1 = '$pull';
                    const mirrorOperation2 = '$addToSet';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance3 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance4 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance5 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance4, relatedInstance5]);

                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: [relatedInstance1._id, relatedInstance2._id, relatedInstance3._id],
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = relatedInstances;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance1.id][mirrorOperation1][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance2.id][mirrorOperation1][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance3.id][mirrorOperation1][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance4.id][mirrorOperation2][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance5.id][mirrorOperation2][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

                it('Setting a many to many relationship, adding one instance, removing one instance.', () => {
                    const relationship = 'manyToMany';
                    const mirrorRelationship = 'manyToMany';
                    const mirrorOperation1 = '$pull';
                    const mirrorOperation2 = '$addToSet';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance3 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance5 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance3, relatedInstance5]);

                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: [relatedInstance1._id, relatedInstance3._id],
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = relatedInstances;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance1.id][mirrorOperation1][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance5.id][mirrorOperation2][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });
                
                it('Setting a many to many relationship, , adding two instances, removing two instances.', () => {
                    const relationship = 'manyToMany';
                    const mirrorRelationship = 'manyToMany';
                    const mirrorOperation1 = '$pull';
                    const mirrorOperation2 = '$addToSet';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance3 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance4 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance5 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance3, relatedInstance4, relatedInstance5]);

                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: [relatedInstance1._id, relatedInstance2._id, relatedInstance3._id],
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = relatedInstances;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance1.id][mirrorOperation1][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance2.id][mirrorOperation1][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance4.id][mirrorOperation2][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance5.id][mirrorOperation2][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

            });

        });

        describe('$unset', () => {

            describe('One to One', () => {

                it('Un-setting a one to one relationship.', () => {
                    const relationship = 'oneToOne';
                    const mirrorRelationship = 'oneToOne';
                    const mirrorOperation = '$unset';

                    const relatedInstance = new Instance(TwoWayRelationshipClass2);
                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: relatedInstance._id,
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = null;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

            });

            describe('One to Many', () => {

                it('Un-setting a one to many relationship.', () => {
                    const relationship = 'oneToMany';
                    const mirrorRelationship = 'manyToOne';
                    const mirrorOperation = '$unset';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1, relatedInstance2]);
                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: relatedInstances.getObjectIds(),
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = null;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance1.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance2.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

            });

            describe('Many to One', () => {

                it('Un-setting a many to one relationship.', () => {
                    const relationship = 'manyToOne';
                    const mirrorRelationship = 'oneToMany';
                    const mirrorOperation = '$pull';

                    const relatedInstance = new Instance(TwoWayRelationshipClass2);
                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: relatedInstance._id,
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = null;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

            });

            describe('Many to Many', () => {

                it('Un-setting a many to many relationship.', () => {
                    const relationship = 'manyToMany';
                    const mirrorRelationship = 'manyToMany';
                    const mirrorOperation = '$pull';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1, relatedInstance2]);
                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: relatedInstances.getObjectIds(),
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = null;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance1.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance2.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

            });

        });

        describe('$addToSet', () => {

            describe('One to Many', () => {

                it('Adding one instance to a one to many relationship.', () => {
                    const relationship = 'oneToMany';
                    const mirrorRelationship = 'manyToOne';
                    const mirrorOperation = '$set';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1, relatedInstance2]);
                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: [relatedInstance1._id],
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = relatedInstances;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance2.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

                it('Adding two instances to a one to many relationship.', () => {
                    const relationship = 'oneToMany';
                    const mirrorRelationship = 'manyToOne';
                    const mirrorOperation = '$set';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance3 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1, relatedInstance2, relatedInstance3]);
                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: [relatedInstance1._id],
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = relatedInstances;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance2.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance3.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

            });

            describe('Many to Many', () => {

                it('Adding one instance to a many to many relationship.', () => {
                    const relationship = 'manyToMany';
                    const mirrorRelationship = 'manyToMany';
                    const mirrorOperation = '$addToSet';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1, relatedInstance2]);
                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: [relatedInstance1._id],
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = relatedInstances;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance2.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

                it('Adding two instances to a many to many relationship.', () => {
                    const relationship = 'manyToMany';
                    const mirrorRelationship = 'manyToMany';
                    const mirrorOperation = '$addToSet';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance3 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1, relatedInstance2, relatedInstance3]);
                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: [relatedInstance1._id],
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = relatedInstances;

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance2.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance3.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

            });

        });

        describe('$pull', () => {

            describe('One to Many', () => {

                it('Removing one instance to a one to many relationship.', () => {
                    const relationship = 'oneToMany';
                    const mirrorRelationship = 'manyToOne';
                    const mirrorOperation = '$unset';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1, relatedInstance2]);
                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: relatedInstances.getObjectIds(),
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1]);

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance2.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

                it('Removing two instances from a one to many relationship.', () => {
                    const relationship = 'oneToMany';
                    const mirrorRelationship = 'manyToOne';
                    const mirrorOperation = '$unset';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance3 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1, relatedInstance2, relatedInstance3]);
                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: relatedInstances.getObjectIds(),
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1]);

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance2.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance3.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

            });

            describe('Many to Many', () => {

                it('Removing one instance to a many to many relationship.', () => {
                    const relationship = 'manyToMany';
                    const mirrorRelationship = 'manyToMany';
                    const mirrorOperation = '$pull';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1, relatedInstance2]);
                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: relatedInstances.getObjectIds(),
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1]);

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance2.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

                it('Removing two instances from a many to many relationship.', () => {
                    const relationship = 'manyToMany';
                    const mirrorRelationship = 'manyToMany';
                    const mirrorOperation = '$pull';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance3 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1, relatedInstance2, relatedInstance3]);
                    const document = {
                        _id: database.ObjectId(),
                        [relationship]: relatedInstances.getObjectIds(),
                    }
                    const instance = new Instance(TwoWayRelationshipClass1, document);
                    instance[relationship] = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1]);

                    const relatedDiffs = instance.relatedDiffs();

                    if (!relatedDiffs[relationship][relatedInstance2.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }

                    if (!relatedDiffs[relationship][relatedInstance3.id][mirrorOperation][mirrorRelationship].equals(instance._id)){
                        throw new Error('Related Diff is incorrect.');
                    }
                });

            });

        });

    });

    describe('instance.reducedRelatedDiffs()', () => {

        describe('Nothing To Combine', () => {

            it('Explicit diff given. Nothing to combine.', () => {
                const mirrorOperation = '$set';
                const relationship = 'oneToOne';
                const mirrorRelationship = 'oneToOne';

                const instance = new Instance(TwoWayRelationshipClass1);
                const relatedInstance = new Instance(TwoWayRelationshipClass2);

                const relatedDiff = {
                    [relationship]: {
                        [relatedInstance.id]: {
                            [mirrorOperation]: {
                                [mirrorRelationship]: instance._id,
                            }
                        }
                    }
                }

                const reduced = instance.reducedRelatedDiffs(relatedDiff);

                if (!reduced[relatedInstance.id][mirrorOperation][mirrorRelationship].equals(instance._id)) {
                    throw new Error('Reduced diff incorrect.');
                }
            });

            it('Explicit diff given. Nothing to combine. Two relationships', () => {
                const mirrorOperation = '$set';
                const relationship1 = 'oneToOne';
                const mirrorRelationship1 = 'oneToOne';
                const relationship2 = 'manyToOne';
                const mirrorRelationship2 = 'oneToMany';

                const instance = new Instance(TwoWayRelationshipClass1);
                const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                const relatedInstance2 = new Instance(TwoWayRelationshipClass2);

                const relatedDiff = {
                    [relationship1]: {
                        [relatedInstance1.id]: {
                            [mirrorOperation]: {
                                [mirrorRelationship1]: instance._id,
                            }
                        }
                    },
                    [relationship2]: {
                        [relatedInstance2.id]: {
                            [mirrorOperation]: {
                                [mirrorRelationship2]: instance._id,
                            }
                        }
                    }
                }

                const reduced = instance.reducedRelatedDiffs(relatedDiff);

                if (!reduced[relatedInstance1.id][mirrorOperation][mirrorRelationship1].equals(instance._id)) {
                    throw new Error('Reduced diff incorrect.');
                }

                if (!reduced[relatedInstance2.id][mirrorOperation][mirrorRelationship2].equals(instance._id)) {
                    throw new Error('Reduced diff incorrect.');
                }
            });
            
            it('Implicit reducedRelatedDiff()', () => {
                const relationship = 'oneToMany';
                const mirrorRelationship = 'manyToOne';
                const mirrorOperation1 = '$unset';
                const mirrorOperation2 = '$set';

                const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                const relatedInstance3 = new Instance(TwoWayRelationshipClass2);
                const relatedInstance4 = new Instance(TwoWayRelationshipClass2);
                const relatedInstance5 = new Instance(TwoWayRelationshipClass2);
                const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance3, relatedInstance4, relatedInstance5]);

                const document = {
                    _id: database.ObjectId(),
                    [relationship]: [relatedInstance1._id, relatedInstance2._id, relatedInstance3._id],
                }
                const instance = new Instance(TwoWayRelationshipClass1, document);
                instance[relationship] = relatedInstances;

                const reduced = instance.reducedRelatedDiffs();

                if (!reduced[relatedInstance1.id][mirrorOperation1][mirrorRelationship].equals(instance._id)){
                    throw new Error('Related Diff is incorrect.');
                }

                if (!reduced[relatedInstance2.id][mirrorOperation1][mirrorRelationship].equals(instance._id)){
                    throw new Error('Related Diff is incorrect.');
                }

                if (!reduced[relatedInstance4.id][mirrorOperation2][mirrorRelationship].equals(instance._id)){
                    throw new Error('Related Diff is incorrect.');
                }

                if (!reduced[relatedInstance5.id][mirrorOperation2][mirrorRelationship].equals(instance._id)){
                    throw new Error('Related Diff is incorrect.');
                }
            });

        });

        describe('Combining Diffs', () => {

            it('Explicit diff given. Combining two relationships with same operator.', () => {
                const mirrorOperation = '$set';
                const relationship1 = 'oneToOne';
                const mirrorRelationship1 = 'oneToOne';
                const relationship2 = 'manyToOne';
                const mirrorRelationship2 = 'oneToMany';

                const instance = new Instance(TwoWayRelationshipClass1);
                const relatedInstance1 = new Instance(TwoWayRelationshipClass2);

                const relatedDiff = {
                    [relationship1]: {
                        [relatedInstance1.id]: {
                            [mirrorOperation]: {
                                [mirrorRelationship1]: instance._id,
                            }
                        }
                    },
                    [relationship2]: {
                        [relatedInstance1.id]: {
                            [mirrorOperation]: {
                                [mirrorRelationship2]: instance._id,
                            }
                        }
                    }
                }

                const reduced = instance.reducedRelatedDiffs(relatedDiff);

                if (!reduced[relatedInstance1.id][mirrorOperation][mirrorRelationship1].equals(instance._id)) {
                    throw new Error('Reduced diff incorrect.');
                }

                if (!reduced[relatedInstance1.id][mirrorOperation][mirrorRelationship2].equals(instance._id)) {
                    throw new Error('Reduced diff incorrect.');
                }
            });

            it('Explicit diff given. Combining two operations.', () => {
                const mirrorOperation1 = '$set';
                const mirrorOperation2 = '$addToSet';
                const relationship1 = 'oneToOne';
                const mirrorRelationship1 = 'oneToOne';
                const relationship2 = 'oneToMany';
                const mirrorRelationship2 = 'manyToOne';

                const instance = new Instance(TwoWayRelationshipClass1);
                const relatedInstance1 = new Instance(TwoWayRelationshipClass2);

                const relatedDiff = {
                    [relationship1]: {
                        [relatedInstance1.id]: {
                            [mirrorOperation1]: {
                                [mirrorRelationship1]: instance._id,
                            }
                        }
                    },
                    [relationship2]: {
                        [relatedInstance1.id]: {
                            [mirrorOperation2]: {
                                [mirrorRelationship2]: instance._id,
                            }
                        }
                    }
                }

                const reduced = instance.reducedRelatedDiffs(relatedDiff);

                if (!reduced[relatedInstance1.id][mirrorOperation1][mirrorRelationship1].equals(instance._id)) {
                    throw new Error('Reduced diff incorrect.');
                }

                if (!reduced[relatedInstance1.id][mirrorOperation2][mirrorRelationship2].equals(instance._id)) {
                    throw new Error('Reduced diff incorrect.');
                }
            });

            it('Implicit reducedRelatedDiff(). Combining two relationships with same operator.', () => {
                const relationship1 = 'manyToMany';
                const mirrorRelationship1 = 'manyToMany';
                const mirrorOperation1 = '$addToSet';
                const relationship2 = 'manyToOne';
                const mirrorRelationship2 = 'oneToMany';
                const mirrorOperation2 = '$addToSet';

                const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1, relatedInstance2]);

                const instance = new Instance(TwoWayRelationshipClass1);
                instance[relationship1] = relatedInstances;
                instance[relationship2] = relatedInstance2;

                const reduced = instance.reducedRelatedDiffs();

                if (!reduced[relatedInstance1.id][mirrorOperation1][mirrorRelationship1].equals(instance._id)){
                    throw new Error('Related Diff is incorrect.');
                }

                if (!reduced[relatedInstance2.id][mirrorOperation1][mirrorRelationship1].equals(instance._id)){
                    throw new Error('Related Diff is incorrect.');
                }

                if (!reduced[relatedInstance2.id][mirrorOperation2][mirrorRelationship2].equals(instance._id)){
                    throw new Error('Related Diff is incorrect.');
                }
            });

            it('Implicit reducedRelatedDiff(). Combining two operators for one related instance.', () => {
                const relationship1 = 'oneToMany';
                const mirrorRelationship1 = 'manyToOne';
                const mirrorOperation1 = '$set';
                const relationship2 = 'manyToOne';
                const mirrorRelationship2 = 'oneToMany';
                const mirrorOperation2 = '$addToSet';

                const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1, relatedInstance2]);

                const instance = new Instance(TwoWayRelationshipClass1);
                instance[relationship1] = relatedInstances;
                instance[relationship2] = relatedInstance2;

                const reduced = instance.reducedRelatedDiffs();

                if (!reduced[relatedInstance1.id][mirrorOperation1][mirrorRelationship1].equals(instance._id)){
                    throw new Error('Related Diff is incorrect.');
                }

                if (!reduced[relatedInstance2.id][mirrorOperation1][mirrorRelationship1].equals(instance._id)){
                    throw new Error('Related Diff is incorrect.');
                }

                if (!reduced[relatedInstance2.id][mirrorOperation2][mirrorRelationship2].equals(instance._id)){
                    throw new Error('Related Diff is incorrect.');
                }
            });

        });

    });

    describe('Diffable.combineMultipleReducedDiffs()', () => {

        describe('Many to One Relationships', () => {

            describe('$addToSet', () => {

                it('Two diffs setting many to one relationship to same instance.', () => {
                    const relationship = 'manyToOne';
                    const mirrorRelationship = 'oneToMany';
                    const operator = '$addToSet';
                    const spreadOperator = '$each';
                    const instance1 = new Instance(TwoWayRelationshipClass1);
                    const instance2 = new Instance(TwoWayRelationshipClass1);
                    const relatedInstance = new Instance(TwoWayRelationshipClass2);
    
                    instance1[relationship] = relatedInstance;
                    instance2[relationship] = relatedInstance;
    
                    const diff1 = instance1.relatedDiffs();
                    const diff2 = instance2.relatedDiffs();
                    const combinedDiff = Diffable.combineMultipleReducedDiffs([diff1, diff2]);

                    console.log(JSON.stringify(combinedDiff, null, 2));
    
                    if (!combinedDiff[relatedInstance.id][operator][mirrorRelationship][spreadOperator][0].equals(instance1._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                    if (!combinedDiff[relatedInstance.id][operator][mirrorRelationship][spreadOperator][1].equals(instance2._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                });
    
                it('One diff setting many to one relationship to same instance.', () => {
                    const relationship = 'manyToOne';
                    const mirrorRelationship = 'oneToMany';
                    const operator = '$addToSet';
                    const spreadOperator = '$each';
                    const instance1 = new Instance(TwoWayRelationshipClass1);
                    const relatedInstance = new Instance(TwoWayRelationshipClass2);
    
                    instance1[relationship] = relatedInstance;
    
                    const diff1 = instance1.relatedDiffs();
                    const combinedDiff = Diffable.combineMultipleReducedDiffs([diff1]);
    
                    if (!combinedDiff[relatedInstance.id][operator][mirrorRelationship].equals(instance1._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                });
    
                it('Three diffs setting many to one relationship to same instance.', () => {
                    const relationship = 'manyToOne';
                    const mirrorRelationship = 'oneToMany';
                    const operator = '$addToSet';
                    const spreadOperator = '$each';
                    const instance1 = new Instance(TwoWayRelationshipClass1);
                    const instance2 = new Instance(TwoWayRelationshipClass1);
                    const instance3 = new Instance(TwoWayRelationshipClass1);
                    const relatedInstance = new Instance(TwoWayRelationshipClass2);
    
                    instance1[relationship] = relatedInstance;
                    instance2[relationship] = relatedInstance;
                    instance3[relationship] = relatedInstance;
    
                    const diff1 = instance1.relatedDiffs();
                    const diff2 = instance2.relatedDiffs();
                    const diff3 = instance3.relatedDiffs();
                    const combinedDiff = Diffable.combineMultipleReducedDiffs([diff1, diff2, diff3]);
    
                    if (!combinedDiff[relatedInstance.id][operator][mirrorRelationship][spreadOperator][0].equals(instance1._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                    if (!combinedDiff[relatedInstance.id][operator][mirrorRelationship][spreadOperator][1].equals(instance2._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                    if (!combinedDiff[relatedInstance.id][operator][mirrorRelationship][spreadOperator][2].equals(instance3._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                });

            });

            describe('$pull', () => {

                it('Two diffs unsetting many to one relationship from same instance.', () => {
                    const relationship = 'manyToOne';
                    const mirrorRelationship = 'oneToMany';
                    const operator = '$pull';
                    const spreadOperator = '$in';
                    const relatedInstance = new Instance(TwoWayRelationshipClass2);

                    const document1 = {
                        _id : database.ObjectId(),
                        [relationship]: relatedInstance._id,
                    }
                    const document2 = {
                        _id : database.ObjectId(),
                        [relationship]: relatedInstance._id,
                    }

                    const instance1 = new Instance(TwoWayRelationshipClass1, document1);
                    const instance2 = new Instance(TwoWayRelationshipClass1, document2);
    
                    instance1[relationship] = null;
                    instance2[relationship] = null;
    
                    const diff1 = instance1.relatedDiffs();
                    const diff2 = instance2.relatedDiffs();
                    const combinedDiff = Diffable.combineMultipleReducedDiffs([diff1, diff2]);
    
                    if (!combinedDiff[relatedInstance.id][operator][mirrorRelationship][spreadOperator][0].equals(instance1._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                    if (!combinedDiff[relatedInstance.id][operator][mirrorRelationship][spreadOperator][1].equals(instance2._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                });

                it('One diff unsetting many to one relationship from instance.', () => {
                    const relationship = 'manyToOne';
                    const mirrorRelationship = 'oneToMany';
                    const operator = '$pull';
                    const relatedInstance = new Instance(TwoWayRelationshipClass2);

                    const document1 = {
                        _id : database.ObjectId(),
                        [relationship]: relatedInstance._id,
                    }

                    const instance1 = new Instance(TwoWayRelationshipClass1, document1);
    
                    instance1[relationship] = null;
    
                    const diff1 = instance1.relatedDiffs();
                    const combinedDiff = Diffable.combineMultipleReducedDiffs([diff1]);
    
                    if (!combinedDiff[relatedInstance.id][operator][mirrorRelationship].equals(instance1._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                });

            });

        });

        describe('Many to Many Relationships', () => {

            describe('$addToSet', () => {

                it('Two diffs setting many to many relationship to same instance set.', () => {
                    const relationship = 'manyToMany';
                    const mirrorRelationship = 'manyToMany';
                    const operator = '$addToSet';
                    const spreadOperator = '$each';
                    const instance1 = new Instance(TwoWayRelationshipClass1);
                    const instance2 = new Instance(TwoWayRelationshipClass1);
                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1, relatedInstance2]);
    
                    instance1[relationship] = relatedInstances;
                    instance2[relationship] = relatedInstances;
    
                    const diff1 = instance1.relatedDiffs();
                    const diff2 = instance2.relatedDiffs();
                    const combinedDiff = Diffable.combineMultipleReducedDiffs([diff1, diff2]);
    
                    if (!combinedDiff[relatedInstance1.id][operator][mirrorRelationship][spreadOperator][0].equals(instance1._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                    if (!combinedDiff[relatedInstance1.id][operator][mirrorRelationship][spreadOperator][1].equals(instance2._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                    if (!combinedDiff[relatedInstance2.id][operator][mirrorRelationship][spreadOperator][0].equals(instance1._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                    if (!combinedDiff[relatedInstance2.id][operator][mirrorRelationship][spreadOperator][1].equals(instance2._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                });
    
                it('Two diffs setting many to many relationship to overlapping instance sets.', () => {
                    const relationship = 'manyToMany';
                    const mirrorRelationship = 'manyToMany';
                    const operator = '$addToSet';
                    const spreadOperator = '$each';
                    const instance1 = new Instance(TwoWayRelationshipClass1);
                    const instance2 = new Instance(TwoWayRelationshipClass1);
                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance3 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances1 = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1, relatedInstance2]);
                    const relatedInstances2 = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance2, relatedInstance3]);
    
                    instance1[relationship] = relatedInstances1;
                    instance2[relationship] = relatedInstances2;
    
                    const diff1 = instance1.relatedDiffs();
                    const diff2 = instance2.relatedDiffs();
                    const combinedDiff = Diffable.combineMultipleReducedDiffs([diff1, diff2]);
    
                    if (!combinedDiff[relatedInstance1.id][operator][mirrorRelationship].equals(instance1._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                    if (!combinedDiff[relatedInstance2.id][operator][mirrorRelationship][spreadOperator][0].equals(instance1._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                    if (!combinedDiff[relatedInstance2.id][operator][mirrorRelationship][spreadOperator][1].equals(instance2._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                    if (!combinedDiff[relatedInstance3.id][operator][mirrorRelationship].equals(instance2._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                });

            });

            describe('$pull', () => {

                it('Two diffs setting many to many relationship to same instance set.', () => {
                    const relationship = 'manyToMany';
                    const mirrorRelationship = 'manyToMany';
                    const operator = '$pull';
                    const spreadOperator = '$in';
                    
                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1, relatedInstance2]);

                    const document1 = {
                        _id: database.ObjectId(),
                        [relationship]: relatedInstances.getObjectIds(),
                    }
                    const document2 = {
                        _id: database.ObjectId(),
                        [relationship]: relatedInstances.getObjectIds(),
                    }

                    const instance1 = new Instance(TwoWayRelationshipClass1, document1);
                    const instance2 = new Instance(TwoWayRelationshipClass1, document2);
    
                    instance1[relationship] = null;
                    instance2[relationship] = null;
    
                    const diff1 = instance1.relatedDiffs();
                    const diff2 = instance2.relatedDiffs();
                    const combinedDiff = Diffable.combineMultipleReducedDiffs([diff1, diff2]);
    
                    if (!combinedDiff[relatedInstance1.id][operator][mirrorRelationship][spreadOperator][0].equals(instance1._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                    if (!combinedDiff[relatedInstance1.id][operator][mirrorRelationship][spreadOperator][1].equals(instance2._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                    if (!combinedDiff[relatedInstance2.id][operator][mirrorRelationship][spreadOperator][0].equals(instance1._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                    if (!combinedDiff[relatedInstance2.id][operator][mirrorRelationship][spreadOperator][1].equals(instance2._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                });
    
                it('Two diffs unsetting many to many relationship with overlapping instance sets.', () => {
                    const relationship = 'manyToMany';
                    const mirrorRelationship = 'manyToMany';
                    const operator = '$pull';
                    const spreadOperator = '$in';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance3 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances1 = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1, relatedInstance2]);
                    const relatedInstances2 = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance2, relatedInstance3]);
                    
                    const document1 = {
                        _id: database.ObjectId(),
                        [relationship]: relatedInstances1.getObjectIds(),
                    }
                    const document2 = {
                        _id: database.ObjectId(),
                        [relationship]: relatedInstances2.getObjectIds(),
                    }
                    const instance1 = new Instance(TwoWayRelationshipClass1, document1);
                    const instance2 = new Instance(TwoWayRelationshipClass1, document2);
                    instance1[relationship] = null;
                    instance2[relationship] = null;
    
                    const diff1 = instance1.relatedDiffs();
                    const diff2 = instance2.relatedDiffs();
                    const combinedDiff = Diffable.combineMultipleReducedDiffs([diff1, diff2]);
    
                    if (!combinedDiff[relatedInstance1.id][operator][mirrorRelationship].equals(instance1._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                    if (!combinedDiff[relatedInstance2.id][operator][mirrorRelationship][spreadOperator][0].equals(instance1._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                    if (!combinedDiff[relatedInstance2.id][operator][mirrorRelationship][spreadOperator][1].equals(instance2._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                    if (!combinedDiff[relatedInstance3.id][operator][mirrorRelationship].equals(instance2._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                });
    
                it('Two diffs, one replacing, one pulling.', () => {
                    const relationship = 'manyToMany';
                    const mirrorRelationship = 'manyToMany';
                    const operator = '$pull';
                    const spreadOperator = '$in';

                    const relatedInstance1 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance2 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstance3 = new Instance(TwoWayRelationshipClass2);
                    const relatedInstances1 = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance1, relatedInstance2]);
                    const relatedInstances2 = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance2, relatedInstance3]);
                    
                    const document1 = {
                        _id: database.ObjectId(),
                        [relationship]: relatedInstances1.getObjectIds(),
                    }
                    const document2 = {
                        _id: database.ObjectId(),
                        [relationship]: relatedInstances2.getObjectIds(),
                    }
                    const instance1 = new Instance(TwoWayRelationshipClass1, document1);
                    const instance2 = new Instance(TwoWayRelationshipClass1, document2);
                    instance1[relationship] = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance3]);
                    instance2[relationship] = new InstanceSet(TwoWayRelationshipClass2, [relatedInstance2]);;
    
                    const diff1 = instance1.relatedDiffs();
                    const diff2 = instance2.relatedDiffs();
                    const combinedDiff = Diffable.combineMultipleReducedDiffs([diff1, diff2]);
    
                    if (!combinedDiff[relatedInstance1.id][operator][mirrorRelationship].equals(instance1._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                    if (!combinedDiff[relatedInstance2.id][operator][mirrorRelationship].equals(instance1._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                    if (!combinedDiff[relatedInstance3.id][operator][mirrorRelationship].equals(instance2._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                    if (!combinedDiff[relatedInstance3.id].$addToSet[mirrorRelationship].equals(instance1._id)) {
                        throw new Error('Combined diff is not correct.');
                    }
                });

            });

        });

    });

    describe('instance.saveAuditEntry()', () => {

        after(async () => {
            await AuditableSuperClass.clear();
            database.clearCollection('audit_' + AuditableSuperClass.collection);
        });

        it('If ClassModel is not auditable, error thrown.', async () => {
            const instance = new Instance(AllAttributesAndRelationshipsClass);
            const expectedErrorMessage = 'instance.saveAuditEntry() called on an Instance of a non-auditable ClassModel.';
            await testForErrorAsync('instance.saveAuditEntry()', expectedErrorMessage, async () => {
                return instance.saveAuditEntry();
            });
        });

        it('If Instance has never been saved to databse, error thrown.', async () => {
            const instance = new Instance(AuditableSuperClass);
            const expectedErrorMessage = 'instance.saveAuditEntry() called on an new Instance.';
            instance.assign({
                name: 'newAuditableInstance',
                updatedAt: new Date('1000-01-01'),
            });

            await testForErrorAsync('instance.saveAuditEntry', expectedErrorMessage, async () => {
                return instance.saveAuditEntry();
            });
        });

        it('If Instance has no changes, error thrown.', async () => {
            const instance = new Instance(AuditableSuperClass);
            const expectedErrorMessage = 'instance.saveAuditEntry() called on an Instance with no changes.';
            instance.assign({
                name: 'newAuditableInstance',
                updatedAt: new Date('1000-01-01'),
            });
            await instance.save();

            await testForErrorAsync('instance.saveAuditEntry', expectedErrorMessage, async () => {
                return instance.saveAuditEntry();
            });
        });

        it('Audit entry saved properly.', async () => {
            const instance = new Instance(AuditableSuperClass);
            instance.assign({
                name: 'newAuditableInstance',
                updatedAt: new Date('1000-01-01'),
            });
            await instance.save();

            instance.updatedAt = new Date();
            await instance.saveAuditEntry();

            const auditEntry = await database.findOne('audit_' + AuditableSuperClass.collection, {
                forInstance: instance._id,
            });

            if (!auditEntry) {
                throw new Error('Audit entry was not saved.');
            }
            if (!auditEntry.changes || !auditEntry.changes.set || !moment(auditEntry.changes.set.updatedAt).isSame(new Date('1000-01-01'))) {
                throw new Error('Audit entry changes were not saved.');
            }
        });

    });

    describe('instance.applyChanges()', () => {

        describe('instance.validateChanges()', () => {

            it('Invalid Operator', () => {
                const expectedErrorMessage = 'Invalid update operator: $notAnOperator.';
                const instance = new Instance(AuditableSuperClass);
                const changes = {
                    $notAnOperator: {
                        boolean: true,
                    },
                };

                testForError('instance.validateChanges()', expectedErrorMessage, () => {
                    instance.validateChanges(changes);
                });

            });

            it('Operator set to something other than an object.', () => {
                const expectedErrorMessage = 'Operator set to something other than an object.';
                const instance = new Instance(AuditableSuperClass);
                const changes = {
                    $set: true,
                };

                testForError('instance.validateChanges()', expectedErrorMessage, () => {
                    instance.validateChanges(changes);
                });

            });

            it('Operator with empty object.', () => {
                const expectedErrorMessage = 'Operator with empty object.';
                const instance = new Instance(AuditableSuperClass);
                const changes = {
                    $unset: {},
                };

                testForError('instance.validateChanges()', expectedErrorMessage, () => {
                    instance.validateChanges(changes);
                });

            });

            it('Cannot perform multiple operations on the same property.', () => {
                const expectedErrorMessage = 'Cannot perform multiple operations an the same attribute or relationship.';
                const instance = new Instance(AuditableSuperClass);
                const changes = {
                    $set: {
                        boolean: true,
                    },
                    $unset: {
                        boolean: true,
                    }
                };

                testForError('instance.validateChanges()', expectedErrorMessage, () => {
                    instance.validateChanges(changes);
                });

            });

            it('Property is not an attribute or relationship.', () => {
                const expectedErrorMessage = 'Attempt to update a property which is not an attribute or relationship.';
                const instance = new Instance(AuditableSuperClass);
                const changes = {
                    $set: {
                        hello: true,
                    }
                };

                testForError('instance.validateChanges()', expectedErrorMessage, () => {
                    instance.validateChanges(changes);
                });

            });

            it('Using $addToSet or $pull on a property which is not a non-singular relationship.', () => {
                const expectedErrorMessage = 'Attempt to use $addToSet,$pull, on an attribute or singular relationship.';
                const instance = new Instance(AuditableSuperClass);
                const changes = {
                    $addToSet: {
                        class1: new Instance(CompareClass2)._id,
                    }
                };

                testForError('instance.validateChanges()', expectedErrorMessage, () => {
                    instance.validateChanges(changes);
                });

            });

            it('Adding an array using $addToSet without using $each.', () => {
                const expectedErrorMessage = 'Attempt to add an array using $addToSet without using \'$each\'.';
                const instance = new Instance(AuditableSuperClass);
                const changes = {
                    $addToSet: {
                        class2s: [new Instance(CompareClass2)._id, new Instance(CompareClass2)._id]
                    }
                };

                testForError('instance.validateChanges()', expectedErrorMessage, () => {
                    instance.validateChanges(changes);
                });

            });

            it('Using $pull to remove an array without $in.', () => {
                const expectedErrorMessage = 'Attempt to remove an array using $pull without using \'$in\'.';
                const instance = new Instance(AuditableSuperClass);
                const changes = {
                    $pull: {
                        class2s: [new Instance(CompareClass2)._id, new Instance(CompareClass2)._id]
                    }
                };

                testForError('instance.validateChanges()', expectedErrorMessage, () => {
                    instance.validateChanges(changes);
                });

            });

            it('Using $each with $pull', () => {
                const expectedErrorMessage = 'Attempt to use \'$each\' with a $pull operator. Use \'$in\' instead.';
                const instance = new Instance(AuditableSuperClass);
                const changes = {
                    $pull: {
                        class2s: {
                            $each: [new Instance(CompareClass2)._id, new Instance(CompareClass2)._id],
                        },
                    }
                };

                testForError('instance.validateChanges()', expectedErrorMessage, () => {
                    instance.validateChanges(changes);
                });

            });

            it('Using $addToSet and $each without an array.', () => {
                const expectedErrorMessage = 'Attempt to use $addToSet and $each without an Array value.';
                const instance = new Instance(AuditableSuperClass);
                const changes = {
                    $addToSet: {
                        class2s: {
                            $each: new Instance(CompareClass2)._id,
                        },
                    },
                };

                testForError('instance.validateChanges()', expectedErrorMessage, () => {
                    instance.validateChanges(changes);
                });

            });

            it('Using $in with $addToSet', () => {
                const expectedErrorMessage = 'Attempt to use \'$in\' with a $addToSet operator. Use \'$each\' instead.';
                const instance = new Instance(AuditableSuperClass);
                const changes = {
                    $addToSet: {
                        class2s: {
                            $in: [new Instance(CompareClass2)._id, new Instance(CompareClass2)._id],
                        },
                    }
                };

                testForError('instance.validateChanges()', expectedErrorMessage, () => {
                    instance.validateChanges(changes);
                });

            });

            it('Using $pull and $in without an array.', () => {
                const expectedErrorMessage = 'Attempt to use $pull and $in without an Array value.';
                const instance = new Instance(AuditableSuperClass);
                const changes = {
                    $pull: {
                        class2s: {
                            $in: new Instance(CompareClass2)._id,
                        },
                    },
                };

                testForError('instance.validateChanges()', expectedErrorMessage, () => {
                    instance.validateChanges(changes);
                });

            });

        });

        describe('$set', () => {

            it('Setting a singular attribute.', () => {
                const instance = new Instance(AuditableSuperClass);
                const date = new Date();
                instance.applyChanges({
                    $set: {
                        name:  'name',
                        number: 1,
                        boolean: false,
                        string: 'hello',
                        date: date,
                    },
                });

                if (instance.name !== 'name' || instance.number !== 1 || 
                        instance.boolean !== false || instance.string !== 'hello' || 
                        instance.date !== date) {
                    throw new Error('Not all fields were set.');
                }

            });

            it('Setting a non-singular attribute.', () => {
                const instance = new Instance(AuditableSuperClass);
                const dates = [new Date(), new Date()];
                instance.applyChanges({
                    $set: {
                        name: 'name',
                        numbers: [0, 2, 1],
                        booleans: [],
                        strings: ['hello', 'goodbye', ''],
                        dates: dates,
                    },
                });

                if (!arraysEqual(instance.numbers, [0, 2, 1])) {
                    throw new Error('Numbers was not set correctly.');
                }

                if (!arraysEqual(instance.booleans, [])) {
                    throw new Error('Booleans was not set correctly.');
                }

                if (!arraysEqual(instance.strings, ['hello', 'goodbye', ''])) {
                    throw new Error('Strings was not set correctly.');
                }

                if (!arraysEqual(instance.dates, dates)) {
                    throw new Error('Dates was not set correctly.');
                }

            });

            it('Setting a singular relationship.', async () => {
                const instance = new Instance(AuditableSuperClass);
                const class1 = new Instance(CompareClass1);

                instance.applyChanges({
                    $set: {
                        class1: class1._id,
                    }
                });

                if (instance.currentState.class1 !== class1._id) {
                    throw new Error('Relationship not set.');
                }
            });

            it('Setting a non-singular relationship.', () => {
                const instance = new Instance(AuditableSuperClass);
                const class2s = new InstanceSet(CompareClass2, [new Instance(CompareClass2), new Instance(CompareClass2)]);

                instance.applyChanges({
                    $set: {
                        class2s: class2s.getObjectIds(),
                    }
                });

                if (!arraysEqual(instance.currentState.class2s, class2s.getObjectIds())) {
                    throw new Error('Relationship not set.');
                }

            });

        });

        describe('$unset', () => {

            it('Un-setting a singular attribute.', () => {
                const instance = new Instance(AuditableSuperClass);
                instance.boolean = true;

                instance.applyChanges({
                    $unset: {
                        boolean: true,
                    }
                });

                if (instance.boolean !== null) {
                    throw new Error('Attribute not unset.');
                }
            });

            it('Un-setting a non-singular attribute.', () => {
                const instance = new Instance(AuditableSuperClass);
                instance.booleans = [true, false, null];

                instance.applyChanges({
                    $unset: {
                        booleans: [true, false, null],
                    }
                });

                if (!Array.isArray(instance.booleans) || instance.booleans.length !== 0) {
                    throw new Error('Attribute not unset.');
                }

            });

            it('Un-setting a singular relationship.', async () => {
                const instance = new Instance(AuditableSuperClass);
                const class1 = new Instance(CompareClass1);

                instance.class1 = class1;

                instance.applyChanges({
                    $unset: {
                        class1,
                    }
                });

                if ((await instance.class1) !== null || instance.currentState.class1 != null) {
                    throw new Error('Relationship not unset.');
                }
            });

            it('Un-setting a non-singular relationship.', async () => {
                const instance = new Instance(AuditableSuperClass);
                const class2s = new InstanceSet(CompareClass2, [new Instance(CompareClass2), new Instance(CompareClass2)]);

                instance.class2s = class2s;

                instance.applyChanges({
                    $unset: {
                        class2s,
                    }
                });

                if (!(await instance.class2s).equals(new InstanceSet(CompareClass2))) {
                    throw new Error('Relationship not unset.');
                }

            });

        });

        describe('$addToSet', () => {

            it('Adding one ObjectId to a non-singular relationship.', async () => {
                const instance = new Instance(AuditableSuperClass);
                const class2sOriginal = new InstanceSet(CompareClass2, [new Instance(CompareClass2), new Instance(CompareClass2)]);
                const instanceToAdd = new Instance(CompareClass2);
                const class2sUpdated = new InstanceSet(CompareClass2, class2sOriginal);
                class2sUpdated.add(instanceToAdd);

                instance.class2s = class2sOriginal;

                instance.applyChanges({
                    $addToSet: {
                        class2s: instanceToAdd._id,
                    }
                });

                if (!arraysEqual(instance._class2s, class2sUpdated.getObjectIds())) {
                    throw new Error('Instance not added to related set.');
                }
            });

            it('Adding multiple ObjectIds to a non-singular relationship.', () => {
                const instance = new Instance(AuditableSuperClass);
                const class2sOriginal = new InstanceSet(CompareClass2, [new Instance(CompareClass2), new Instance(CompareClass2)]);
                const instancesToAdd = new InstanceSet(CompareClass2, [new Instance(CompareClass2), new Instance(CompareClass2)]);
                const class2sUpdated = new InstanceSet(CompareClass2, class2sOriginal);
                class2sUpdated.addInstances(instancesToAdd);

                instance.class2s = class2sOriginal;

                instance.applyChanges({
                    $addToSet: {
                        class2s: {
                            $each: instancesToAdd.getObjectIds(),
                        },
                    }
                });

                if (!arraysEqual(instance._class2s, class2sUpdated.getObjectIds())) {
                    throw new Error('Instance not added to related set.');
                }

            });

        });

        describe('$pull', () => {

            it('Removing one ObjectId from a non-singular relationship.', () => {
                const instance = new Instance(AuditableSuperClass);
                const instanceToRemove = new Instance(CompareClass2);
                const class2sOriginal = new InstanceSet(CompareClass2, [instanceToRemove, new Instance(CompareClass2)]);
                const class2sUpdated = new InstanceSet(CompareClass2, class2sOriginal);
                class2sUpdated.remove(instanceToRemove);

                instance.class2s = class2sOriginal;

                instance.applyChanges({
                    $pull: {
                        class2s: instanceToRemove._id,
                    }
                });

                if (!arraysEqual(instance._class2s, class2sUpdated.getObjectIds())) {
                    throw new Error('Instance not added to related set.');
                }
            });

            it('Removing multiple ObjectIds from a non-singular relationship.', () => {
                const instance = new Instance(AuditableSuperClass);
                const instancesToRemove = new InstanceSet(CompareClass2, [new Instance(CompareClass2), new Instance(CompareClass2)]);
                const class2sOriginal = new InstanceSet(CompareClass2, [new Instance(CompareClass2)]);
                class2sOriginal.addInstances(instancesToRemove);
                const class2sUpdated = new InstanceSet(CompareClass2, class2sOriginal);
                class2sUpdated.removeInstances(instancesToRemove);

                instance.class2s = class2sOriginal;

                instance.applyChanges({
                    $pull: {
                        class2s: {
                            $in: instancesToRemove.getObjectIds(),
                        },
                    }
                });

                if (!arraysEqual(instance._class2s, class2sUpdated.getObjectIds())) {
                    throw new Error('Instance not added to related set.');
                }

            });

        });

    });

    describe('instance.revertToRevision()', () => {

        after(async () => {
            await AllAttributesAndRelationshipsClass.clear();
            await AuditableSuperClass.clear();
            await database.clearCollection('audit_' + AuditableSuperClass.collection);
        });

        describe('Validations', () => {

            it('Calling revertToRevision() on an instance of a non-auditable class throws an error.', async () => {
                const expectedErrorMessage = 'instance.revertToRevision() called on an instance of a non-auditable class model.';
                const instance = new Instance(AllAttributesAndRelationshipsClass);
                instance.assign({
                    boolean: true,
                });
                await instance.save();
    
                instance.number = 1;
                await instance.save();
    
                await testForErrorAsync('instance.revertToRevision()', expectedErrorMessage, async () => {
                    return instance.revertToRevision(0);
                });
            });

        });

        describe('One Revision', () => {

            describe('Singular Attributes', () => {

                it('Reverting an instance after replacing values.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    instance.assign({
                        boolean: false,
                        number: 0,
                        string: 'a',
                        date: new Date('2000-01-01'),
                    });
                    await instance.save();
                    instance.assign({
                        boolean: true,
                        number: 1,
                        string: 'b',
                        date: new Date('2000-01-02'),
                    });
                    await instance.save();

                    await instance.revertToRevision(0);

                    if (instance.boolean !== false || instance.number !== 0 || instance.string !== 'a' || !moment(new Date('2000-01-01')).isSame(instance.date)) {
                        throw new Error('Instance was not reverted.');
                    }
                });

                it('Reverting an instance after unsetting values.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    instance.assign({
                        boolean: false,
                        number: 0,
                        string: 'a',
                        date: new Date('2000-01-01'),
                    });
                    await instance.save();
                    instance.assign({
                        boolean: null,
                        number: null,
                        string: undefined,
                    });
                    delete instance.date;
                    await instance.save();

                    await instance.revertToRevision(0);

                    if (instance.boolean !== false || instance.number !== 0 || instance.string !== 'a' || !moment(new Date('2000-01-01')).isSame(instance.date)) {
                        throw new Error('Instance was not reverted.');
                    }
                });

                it('Reverting an instance after setting values.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    await instance.save();
                    instance.assign({
                        boolean: false,
                        number: 0,
                        string: 'a',
                        date: new Date('2000-01-01'),
                    });
                    await instance.save();
                    await instance.revertToRevision(0);

                    if (instance.boolean !== null || instance.number !== null || instance.string !== null || instance.date !== null) {
                        throw new Error('Instance was not reverted.');
                    }
                });

                it('Reverting an instance after replacing values. Instance pulled from database.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    instance.assign({
                        boolean: false,
                        number: 0,
                        string: 'a',
                        date: new Date('2000-01-01'),
                    });
                    await instance.save();
                    instance.assign({
                        boolean: true,
                        number: 1,
                        string: 'b',
                        date: new Date('2000-01-02'),
                    });
                    await instance.save();

                    const instanceFromDatabase = await AuditableSuperClass.findById(instance._id);

                    await instanceFromDatabase.revertToRevision(0);

                    if (instanceFromDatabase.boolean !== false 
                        || instanceFromDatabase.number !== 0 
                        || instanceFromDatabase.string !== 'a' 
                        || !moment(new Date('2000-01-01')).isSame(instanceFromDatabase.date)) {
                        throw new Error('Instance was not reverted.');
                    }
                });
    
            });

            describe('List Attributes', () => {

                it('Reverting an instance after replacing values.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    instance.assign({
                        booleans: [false, true],
                        numbers: [0, 1],
                        strings: ['a', 'b', 'c'],
                        dates: [new Date('2000-01-01')],
                    });
                    await instance.save();
                    instance.assign({
                        booleans: [true, false],
                        numbers: [0, 1, 2],
                        strings: ['b', 'c'],
                        dates: [new Date('2000-01-01'), new Date('2000-01-02')],
                    });
                    await instance.save();

                    await instance.revertToRevision(0);

                    if (!arraysEqual(instance.booleans, [false, true]) 
                        || !arraysEqual(instance.numbers, [0, 1]) 
                        || !arraysEqual(instance.strings, ['a', 'b', 'c']) 
                        || !arraysEqual(instance.dates, [new Date('2000-01-01')])) {
                        throw new Error('Instance was not reverted.');
                    }
                });

                it('Reverting an instance after setting values.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    await instance.save();
                    instance.assign({
                        booleans: [true, false],
                        numbers: [0, 1, 2],
                        strings: ['b', 'c'],
                        dates: [new Date('2000-01-01'), new Date('2000-01-02')],
                    });
                    await instance.save();

                    await instance.revertToRevision(0);

                    if (!arraysEqual(instance.booleans, []) 
                        || !arraysEqual(instance.numbers, []) 
                        || !arraysEqual(instance.strings, []) 
                        || !arraysEqual(instance.dates, [])) {
                        throw new Error('Instance was not reverted.');
                    }
                });

                it('Reverting an instance after unsetting values.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    instance.assign({
                        booleans: [true, false],
                        numbers: [0, 1, 2],
                        strings: ['b', 'c'],
                        dates: [new Date('2000-01-01'), new Date('2000-01-02')],
                    });
                    await instance.save();
                    instance.assign({
                        booleans: null,
                        numbers: [],
                        strings: undefined,
                    });
                    delete instance.dates;
                    await instance.save();

                    await instance.revertToRevision(0);

                    if (!arraysEqual(instance.booleans, [true, false]) 
                        || !arraysEqual(instance.numbers, [0, 1, 2]) 
                        || !arraysEqual(instance.strings, ['b', 'c']) 
                        || !arraysEqual(instance.dates, [new Date('2000-01-01'), new Date('2000-01-02')])) {
                        throw new Error('Instance was not reverted.');
                    }
                });
    
            });

            describe('Singular Relationships', () => {

                it('Reverting an instance after replacing values.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    const class1 = new Instance(CompareClass1);
                    instance.assign({
                        class1: class1,
                    });
                    await instance.save();
                    instance.assign({
                        class1: new Instance(CompareClass1),
                    });
                    await instance.save();

                    await instance.revertToRevision(0);

                    if (!instance._class1.equals(class1._id)) {
                        throw new Error('Instance was not reverted.');
                    }
                });

                it('Reverting an instance after setting values.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    await instance.save();
                    instance.assign({
                        class1: new Instance(CompareClass1),
                    });
                    await instance.save();

                    await instance.revertToRevision(0);

                    if (!instance._class1 == null) {
                        throw new Error('Instance was not reverted.');
                    }
                });

                it('Reverting an instance after unsetting values.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    const class1 = new Instance(CompareClass1);
                    instance.assign({
                        class1: class1,
                    });
                    await instance.save();
                    instance.assign({
                        class1: null,
                    });
                    await instance.save();

                    await instance.revertToRevision(0);

                    if (!instance._class1.equals(class1._id)) {
                        throw new Error('Instance was not reverted.');
                    }
                });
    
            });

            describe('Non-Singular Relationships', () => {

                it('Reverting an instance after replacing relationship values.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    const class2s = new InstanceSet(CompareClass2, [new Instance(CompareClass2), new Instance(CompareClass2)]);
                    instance.assign({
                        class2s: class2s,
                    });
                    await instance.save();
                    instance.assign({
                        class2s: new InstanceSet(CompareClass2, [new Instance(CompareClass2), new Instance(CompareClass2)]),
                    });
                    await instance.save();

                    await instance.revertToRevision(0);

                    if (!arraysEqual(instance._class2s, class2s.getObjectIds())) {
                        throw new Error('Instance was not reverted.');
                    }
                });

                it('Reverting an instance after setting relationship.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    const class2s = new InstanceSet(CompareClass2, [new Instance(CompareClass2), new Instance(CompareClass2)]);

                    await instance.save();
                    instance.assign({
                        class2s: class2s,
                    });
                    await instance.save();

                    await instance.revertToRevision(0);

                    if (!arraysEqual(instance._class2s, [])) {
                        throw new Error('Instance was not reverted.');
                    }
                });

                it('Reverting an instance after unsetting relationship.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    const class2s = new InstanceSet(CompareClass2, [new Instance(CompareClass2), new Instance(CompareClass2)]);
                    instance.assign({
                        class2s: class2s,
                    });
                    await instance.save();
                    instance.assign({
                        class2s: null,
                    });
                    await instance.save();

                    await instance.revertToRevision(0);

                    if (!arraysEqual(instance._class2s, class2s.getObjectIds())) {
                        throw new Error('Instance was not reverted.');
                    }
                });

                it('Reverting an instance after adding an instance to relationship.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    const class2s = new InstanceSet(CompareClass2, [new Instance(CompareClass2), new Instance(CompareClass2)]);
                    const class2sAfter = new InstanceSet(CompareClass2, class2s);
                    class2sAfter.add(new Instance(CompareClass2));

                    instance.assign({
                        class2s: class2s,
                    });
                    await instance.save();

                    instance.assign({
                        class2s: class2sAfter,
                    });
                    await instance.save();

                    await instance.revertToRevision(0);
                
                    if (!arraysEqual(instance._class2s, class2s.getObjectIds())) {
                        throw new Error('Instance was not reverted.');
                    }
                });

                it('Reverting an instance after adding two instances to relationship.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    const class2s = new InstanceSet(CompareClass2, [new Instance(CompareClass2), new Instance(CompareClass2)]);
                    const class2sAfter = new InstanceSet(CompareClass2, class2s);
                    class2sAfter.addInstances([new Instance(CompareClass2), new Instance(CompareClass2)]);

                    instance.assign({
                        class2s: class2s,
                    });
                    await instance.save();

                    instance.assign({
                        class2s: class2sAfter,
                    });
                    await instance.save();

                    await instance.revertToRevision(0);
                
                    if (!arraysEqual(instance._class2s, class2s.getObjectIds())) {
                        throw new Error('Instance was not reverted.');
                    }
                });

                it('Reverting an instance after removing an instance from relationship.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    const class2s = new InstanceSet(CompareClass2, [
                        new Instance(CompareClass2),
                        new Instance(CompareClass2),
                        new Instance(CompareClass2),
                        new Instance(CompareClass2)
                    ]);
                    const class2sAfter = new InstanceSet(CompareClass2, class2s);
                    class2sAfter.removeInstances([[...class2s][0]]);

                    instance.assign({
                        class2s: class2s,
                    });
                    await instance.save();

                    instance.assign({
                        class2s: class2sAfter,
                    });
                    await instance.save();

                    await instance.revertToRevision(0);

                    const relationshipSet = new SuperSet(instance._class2s.map(x => x.toString()));
                    const expectedSet = new SuperSet(class2s.getInstanceIds());
                
                    if (!relationshipSet.equals(expectedSet)) {
                        throw new Error('Instance was not reverted.');
                    }
                });

                it('Reverting an instance after removing two instances from relationship.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    const class2s = new InstanceSet(CompareClass2, [
                        new Instance(CompareClass2),
                        new Instance(CompareClass2),
                        new Instance(CompareClass2),
                        new Instance(CompareClass2)
                    ]);
                    const class2sAfter = new InstanceSet(CompareClass2, class2s);
                    class2sAfter.removeInstances([[...class2s][0], [...class2s][1]]);

                    instance.assign({
                        class2s: class2s,
                    });
                    await instance.save();

                    instance.assign({
                        class2s: class2sAfter,
                    });
                    await instance.save();

                    await instance.revertToRevision(0);

                    const relationshipSet = new SuperSet(instance._class2s.map(x => x.toString()));
                    const expectedSet = new SuperSet(class2s.getInstanceIds());
                
                    if (!relationshipSet.equals(expectedSet)) {
                        throw new Error('Instance was not reverted.');
                    }
                });
    
            });
            
        });

        describe('Multiple Revisions', () => {

            describe('Singular Attributes', () => {

                it('Reverting an instance to original after two revisions.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    instance.assign({
                        boolean: false,
                        number: 0,
                        string: 'a',
                        date: new Date('2000-01-01'),
                    });
                    await instance.save();

                    instance.assign({
                        boolean: null,
                        number: null,
                        string: 'b',
                        date: new Date('2000-01-02'),
                    });
                    await instance.save();

                    instance.assign({
                        boolean: true,
                        number: 1,
                        string: 'c',
                        date: new Date('2000-01-03'),
                    });
                    await instance.save();

                    await instance.revertToRevision(0);

                    if (instance.boolean !== false || instance.number !== 0 || instance.string !== 'a' || !moment(new Date('2000-01-01')).isSame(instance.date)) {
                        throw new Error('Instance was not reverted.');
                    }
                });

                it('Reverting an instance 2 revisions after three revisions.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    instance.assign({
                        boolean: false,
                        number: 0,
                        string: 'a',
                        date: new Date('2000-01-01'),
                    });
                    await instance.save();

                    instance.assign({
                        boolean: null,
                        number: null,
                        string: 'b',
                        date: new Date('2000-01-02'),
                    });
                    await instance.save();

                    instance.assign({
                        boolean: true,
                        number: 1,
                        string: 'c',
                        date: new Date('2000-01-03'),
                    });
                    await instance.save();

                    instance.assign({
                        boolean: true,
                        number: 3,
                        string: 'd',
                        date: new Date('2000-01-04'),
                    });
                    await instance.save();

                    await instance.revertToRevision(1);

                    if (instance.boolean !== null || instance.number !== null || instance.string !== 'b' || !moment(new Date('2000-01-02')).isSame(instance.date)) {
                        throw new Error('Instance was not reverted.');
                    }
                });

            });

            describe('List Attributes', () => {
    
                it('Reverting an instance to original after two revisions.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    instance.assign({
                        booleans: [false, true],
                        numbers: [0, 1],
                        strings: ['a', 'b', 'c'],
                        dates: [new Date('2000-01-01')],
                    });
                    await instance.save();
                    
                    instance.assign({
                        booleans: null,
                        numbers: [0, 1, 2, 3, 4],
                        strings: null,
                        dates: [new Date('2000-01-05'), new Date('2000-01-07')],
                    });
                    await instance.save();
                    
                    instance.assign({
                        booleans: [true, false],
                        numbers: [0, 1, 2],
                        strings: ['b', 'c'],
                        dates: [new Date('2000-01-01'), new Date('2000-01-02')],
                    });
                    await instance.save();

                    await instance.revertToRevision(0);

                    if (!arraysEqual(instance.booleans, [false, true]) 
                        || !arraysEqual(instance.numbers, [0, 1]) 
                        || !arraysEqual(instance.strings, ['a', 'b', 'c']) 
                        || !arraysEqual(instance.dates, [new Date('2000-01-01')])) {
                        throw new Error('Instance was not reverted.');
                    }
                });
    
                it('Reverting an instance two revisions after three revisions.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    instance.assign({
                        booleans: [false, true],
                        numbers: [0, 1],
                        strings: ['a', 'b', 'c'],
                        dates: [new Date('2000-01-01')],
                    });
                    await instance.save();
                    
                    instance.assign({
                        booleans: null,
                        numbers: [0, 1, 2, 3, 4],
                        strings: null,
                        dates: [new Date('2000-01-05'), new Date('2000-01-07')],
                    });
                    await instance.save();
                    
                    instance.assign({
                        booleans: [true, false],
                        numbers: [0, 1, 2],
                        strings: ['b', 'c'],
                        dates: [new Date('2000-01-01'), new Date('2000-01-02')],
                    });
                    await instance.save();
                    
                    instance.assign({
                        booleans: [true, false, true],
                        numbers: [],
                        strings: ['b', 'c', 'd', 'e'],
                        dates: [new Date('2000-01-02')],
                    });
                    await instance.save();

                    await instance.revertToRevision(1);

                    if (!arraysEqual(instance.booleans, []) 
                        || !arraysEqual(instance.numbers, [0, 1, 2, 3, 4]) 
                        || !arraysEqual(instance.strings, []) 
                        || !arraysEqual(instance.dates, [new Date('2000-01-05'), new Date('2000-01-07')])) {
                        throw new Error('Instance was not reverted.');
                    }
                });

            });

            describe('Singular Relationships', () => {
    
                it('Reverting an instance to original after two revisions.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    const class1 = new Instance(CompareClass1);
                    instance.assign({
                        class1: class1,
                    });
                    await instance.save();
                    
                    instance.assign({
                        class1: new Instance(CompareClass1),
                    });
                    await instance.save();
                    
                    instance.assign({
                        class1: new Instance(CompareClass1),
                    });
                    await instance.save();

                    await instance.revertToRevision(0);

                    if (!instance._class1.equals(class1._id)) {
                        throw new Error('Instance was not reverted.');
                    }
                });
    
                it('Reverting an instance two revisions after three revisions.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    const class1 = new Instance(CompareClass1);
                    instance.assign({
                        class1: new Instance(CompareClass1),
                    });
                    await instance.save();

                    instance.assign({
                        class1: class1,
                    });
                    await instance.save();
                    
                    instance.assign({
                        class1: new Instance(CompareClass1),
                    });
                    await instance.save();
                    
                    instance.assign({
                        class1: new Instance(CompareClass1),
                    });
                    await instance.save();

                    await instance.revertToRevision(1);

                    if (!instance._class1.equals(class1._id)) {
                        throw new Error('Instance was not reverted.');
                    }
                });

            });

            describe('Non-Singular Relationships', () => {
    
                it('Reverting an instance to original after two revisions.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    const class2s = new InstanceSet(CompareClass2, [new Instance(CompareClass2), new Instance(CompareClass2)]);
                    const class2s2 = new InstanceSet(CompareClass2, class2s);
                    class2s2.addInstances([new Instance(CompareClass2), new Instance(CompareClass2)]);
                    const class2s3 = new InstanceSet(CompareClass2, class2s2);
                    class2s3.removeInstances([[...class2s][0]]);

                    instance.assign({
                        class2s: class2s,
                    });
                    await instance.save();

                    instance.assign({
                        class2s: class2s2,
                    });
                    await instance.save();

                    instance.assign({
                        class2s: class2s3,
                    });
                    await instance.save();

                    await instance.revertToRevision(0);
                
                    const relationshipSet = new SuperSet(instance._class2s.map(x => x.toString()));
                    const expectedSet = new SuperSet(class2s.getInstanceIds());
                
                    if (!relationshipSet.equals(expectedSet)) {
                        throw new Error('Instance was not reverted.');
                    }
                });
    
                it('Reverting an instance to original after two revisions.', async() => {
                    const instance = new Instance(AuditableSuperClass);
                    const class2s = new InstanceSet(CompareClass2, [new Instance(CompareClass2), new Instance(CompareClass2)]);
                    const class2s2 = new InstanceSet(CompareClass2, class2s);
                    class2s2.addInstances([new Instance(CompareClass2), new Instance(CompareClass2)]);
                    const class2s3 = new InstanceSet(CompareClass2, class2s2);
                    class2s3.removeInstances([[...class2s][0]]);
                    const class2s4 = new InstanceSet(CompareClass2);

                    instance.assign({
                        class2s: class2s,
                    });
                    await instance.save();

                    instance.assign({
                        class2s: class2s2,
                    });
                    await instance.save();

                    instance.assign({
                        class2s: class2s3,
                    });
                    await instance.save();

                    instance.assign({
                        class2s: class2s4,
                    });
                    await instance.save();

                    await instance.revertToRevision(1);
                
                    const relationshipSet = new SuperSet(instance._class2s.map(x => x.toString()));
                    const expectedSet = new SuperSet(class2s2.getInstanceIds());
                
                    if (!relationshipSet.equals(expectedSet)) {
                        throw new Error('Instance was not reverted.');
                    }
                });

            });
            
        });

    });

});