
const InstanceSet = require('../dist/models/InstanceSet');



describe('InstanceSet Tests', () => {

    describe('Set Math Functions', () => {

        describe('Non static set math functions', () => {

            describe('InstanceSet.equals()', () => {
        
                it('Throws an error if argument is not an instance set', () => {
                    const setA = new InstanceSet([1, 2, '3', true]);
                    const setB = new Set([1, 2, '3', true]);
        
                    try {
                        setA.equals(setB);
                    }
                    catch (error) {
                        if (error.message != 'InstanceSet.equals() argument is not an InstanceSet.')
                            throw error;
                    }
                });

                it ('Two empty instance sets are equal', () => {
                    const setA = new InstanceSet();
                    const setB = new InstanceSet();
        
                    if (!setA.equals(setB))
                        throw new Error('Sets are not equal, but should be.');
                });
        
                it('Sets Are Equal', () => {
                    const setA = new InstanceSet([1, 2, '3', true]);
                    const setB = new InstanceSet([1, 2, '3', true]);
        
                    if (!setA.equals(setB))
                        throw new Error('Sets are not equal, but should be.');
                });
        
                it('Sets with same elements in different order are equal', () => {
                    const setA = new InstanceSet([1, 2, '3', true]);
                    const setB = new InstanceSet([1, '3', true, 2,]);
        
                    if (!setA.equals(setB))
                        throw new Error('Sets are not equal, but should be.');
                });
        
                it('Sets Are Different Lengths', () => {
                    const setA = new InstanceSet([1, 2, '3', true]);
                    const setB = new InstanceSet([1, 2, '3', true, false]);
        
                    if (setA.equals(setB))
                        throw new Error('Sets are equal, but should not be.');
                });
        
                it('Sets Are Have One Element Different', () => {
                    const setA = new InstanceSet([1, 2, '3', true]);
                    const setB = new InstanceSet([1, 2, '3', false]);
        
                    if (setA.equals(setB))
                        throw new Error('Sets are equal, but should not be.');
                });
        
            });
        
            describe('InstanceSet.difference()', () => {
                
                it('InstanceSet Difference', () => {
                    const setA = new InstanceSet([1, 2, 3]);
                    const setB = new InstanceSet([3, 4, 5]);
                    const expected = new InstanceSet([1, 2]);
        
                    const setsDifference = setA.difference(setB);
        
                    if (setsDifference.equals(expected))
                        return false;
                });
        
            });
        
            describe('InstanceSet.union()', () => {
                
                it('Union of two sets with no overlap in values.', () => {
                    const setA = new InstanceSet([1, 2, 3]);
                    const setB = new InstanceSet([4, 5, 6]);
                    const setC = new InstanceSet([1, 2, 3, 4, 5, 6]);
        
                    const combined = setA.union(setB);
                    if (!combined.equals(setC))
                        throw new Error(
                            'Union failed.\n' + 
                            ' Expected set ' + setC + '\n' + 
                            ' Actual set: ' + combined
                        )
                });
                
                it('Union of two sets with an overlapping value.', () => {
                    const setA = new InstanceSet([1, 2, 3]);
                    const setB = new InstanceSet([3, 4, 5]);
                    const setC = new InstanceSet([1, 2, 3, 4, 5]);
        
                    const combined = setA.union(setB);
                    if (!combined.equals(setC))
                        throw new Error(
                            'Union failed.\n' + 
                            ' Expected set ' + setC + '\n' +
                            ' Actual set: ' + combined
                        )
                });
                
                it('Union of two sets with all the same values.', () => {
                    const setA = new InstanceSet([1, 2, 3]);
                    const setB = new InstanceSet([1, 2, 3]);
                    const setC = new InstanceSet([1, 2, 3]);
        
                    const combined = setA.union(setB);
                    if (!combined.equals(setC))
                    throw new Error(
                        'Union failed.\n' + 
                        ' Expected set ' + setC + '\n' +
                        ' Actual set: ' + combined
                    )
                });
        
            });

        });

        describe('Static set math functions', () => {
    
            describe('InstanceSet.setsEqual()', () => {
        
                it('Sets Are Equal', () => {
                    const setA = new InstanceSet([1, 2, '3', true]);
                    const setB = new InstanceSet([1, 2, '3', true]);
        
                    if (!InstanceSet.setsEqual(setA, setB))
                        throw new Error('Sets are not equal, but should be.');
                    });
        
                it('Sets with same elements in different order are equal', () => {
                    const setA = new InstanceSet([1, 2, '3', true]);
                    const setB = new InstanceSet([1, '3', true, 2,]);
        
                    if (!InstanceSet.setsEqual(setA, setB))
                        throw new Error('Sets are not equal, but should be.');
                });
        
                it('Sets Are Different Lengths', () => {
                    const setA = new InstanceSet([1, 2, '3', true]);
                    const setB = new InstanceSet([1, 2, '3', true, false]);
        
                    if (InstanceSet.setsEqual(setA, setB))
                        throw new Error('Sets are equal, but should not be.');
                });
        
                it('Sets Are Have One Element Different', () => {
                    const setA = new InstanceSet([1, 2, '3', true]);
                    const setB = new InstanceSet([1, 2, '3', false]);
        
                    if (InstanceSet.setsEqual(setA, setB))
                        throw new Error('Sets are equal, but should not be.');
                });
        
            });
        
            describe('InstanceSet.setsDifference', () => {
                
                it('Set Difference', () => {
                    const setA = new InstanceSet([1, 2, 3]);
                    const setB = new InstanceSet([3, 4, 5]);
                    const expected = new InstanceSet([1, 2]);
        
                    const setsDifference = InstanceSet.setsDifference(setA, setB);
        
                    if (!InstanceSet.setsEqual(setsDifference, expected))
                        return false;
                });
        
            });

        });

    });

    describe('Functions Adding and Removing Elements', () => {

        describe('Non Static', () => {

            describe('InstanceSet.addFromIterable()', () => {

                it('Error thrown if argument is not iterable', () => {
                    const instanceSet = new InstanceSet();
                    const toAdd = 1;
                    const expectedErrorMessage = 'InstanceSet.addFromIterable() called with an argument which is not iterable.';
                    let passed = false;

                    try {
                        instanceSet.addFromIterable(toAdd);
                    }
                    catch (error) {
                        if (error.message != expectedErrorMessage) {
                            throw new Error(
                                'addFromIterable() threw an unexpected error message.\n' + 
                                ' expected: ' + expectedErrorMessage + '\n' + 
                                ' actual:   ' + error.message
                            );
                        }
                        else {
                            passed = true;
                        }
                    }

                    if (!passed)
                        throw new Error('addFromIterable() did not throw an error.');
                });

                it('Can add all elements from an empty array to an empty instance set.', () => {
                    const instanceSet = new InstanceSet();
                    const array = [];
                    const expectedSet = new InstanceSet([]);

                    instanceSet.addFromIterable(array);

                    if (!instanceSet.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + instanceSet
                        )
                });

                it('Can add all elements from an array to an empty instance set.', () => {
                    const instanceSet = new InstanceSet();
                    const array = [1, 2, 3];
                    const expectedSet = new InstanceSet([1, 2, 3]);

                    instanceSet.addFromIterable(array);

                    if (!instanceSet.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + instanceSet
                        )
                });

                it('Can add all elements from an array to a populated instance set. No overlap', () => {
                    const instanceSet = new InstanceSet([1, 2, 3]);
                    const array = [4, 5, 6];
                    const expectedSet = new InstanceSet([1, 2, 3, 4, 5, 6]);

                    instanceSet.addFromIterable(array);

                    if (!instanceSet.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + instanceSet
                        )
                });

                it('Can add all elements from an array to a populated instance set. Some elements overlap.', () => {
                    const instanceSet = new InstanceSet([1, 2, 3]);
                    const array = [3, 4, 5, 6];
                    const expectedSet = new InstanceSet([1, 2, 3, 4, 5, 6]);

                    instanceSet.addFromIterable(array);

                    if (!instanceSet.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + instanceSet
                        )
                });

                it('Can add all elements from an instanceSet to an empty instance set.', () => {
                    const instanceSet1 = new InstanceSet();
                    const instanceSet2 = new InstanceSet([1, 2, 3]);
                    const expectedSet = new InstanceSet([1, 2, 3]);

                    instanceSet1.addFromIterable(instanceSet2);

                    if (!instanceSet1.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + instanceSet1
                        )
                });

                it('Can add all elements from an instanceSet to a populated instance set. No overlap', () => {
                    const instanceSet1 = new InstanceSet([1, 2, 3]);
                    const instanceSet2 = new InstanceSet([4, 5, 6]);
                    const expectedSet = new InstanceSet([1, 2, 3, 4, 5, 6]);

                    instanceSet1.addFromIterable(instanceSet2);

                    if (!instanceSet1.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + instanceSet1
                        )
                });

                it('Can add all elements from an instanceSet to a populated instance set. Some elements overlap.', () => {
                    const instanceSet1 = new InstanceSet([1, 2, 3]);
                    const instanceSet2 = new InstanceSet([3, 4, 5, 6]);
                    const expectedSet = new InstanceSet([1, 2, 3, 4, 5, 6]);

                    instanceSet1.addFromIterable(instanceSet2);

                    if (!instanceSet1.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + instanceSet1
                        )
                });

            });

            describe('InstanceSet.removeFromIterable()', () => {

                it('Error thrown if argument is not iterable', () => {
                    const instanceSet = new InstanceSet();
                    const toRemove = 1;
                    const expectedErrorMessage = 'InstanceSet.removeFromIterable() called with an argument which is not iterable.';
                    let passed = false;

                    try {
                        instanceSet.removeFromIterable(toRemove);
                    }
                    catch (error) {
                        if (error.message != expectedErrorMessage) {
                            throw new Error(
                                'removeFromIterable() threw an unexpected error message.\n' + 
                                ' expected: ' + expectedErrorMessage + '\n' + 
                                ' actual:   ' + error.message
                            );
                        }
                        else {
                            passed = true;
                        }
                    }

                    if (!passed)
                        throw new Error('removeFromIterable() did not throw an error.');
                });

                it('Can remove elements given in an array.', () => {
                    const instanceSet = new InstanceSet([1, 2, 3]);
                    const toRemove = [2, 3];
                    const expectedSet = new InstanceSet([1]);

                    instanceSet.removeFromIterable(toRemove);

                    if (!instanceSet.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + instanceSet
                        )
                });

                it('Can remove elements given in an instance set.', () => {
                    const instanceSet = new InstanceSet([1, 2, 3]);
                    const toRemove = new InstanceSet([2, 3]);
                    const expectedSet = new InstanceSet([1]);

                    instanceSet.removeFromIterable(toRemove);

                    if (!instanceSet.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + instanceSet
                        )
                });

                it('No issue when attempting to remove elements that aren\t in the instance set.', () => {
                    const instanceSet = new InstanceSet([1, 2, 3]);
                    const toRemove = new InstanceSet([2, 3, 4, 5]);
                    const expectedSet = new InstanceSet([1]);

                    instanceSet.removeFromIterable(toRemove);

                    if (!instanceSet.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + instanceSet
                        )
                });

                it('No issue when attempting to remove elements twice.', () => {
                    const instanceSet = new InstanceSet([1, 2, 3]);
                    const toRemove = new InstanceSet([2, 3, 2, 3]);
                    const expectedSet = new InstanceSet([1]);

                    instanceSet.removeFromIterable(toRemove);

                    if (!instanceSet.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + instanceSet
                        )
                });

                it('No issue when called on an empty instance set.', () => {
                    const instanceSet = new InstanceSet();
                    const toRemove = new InstanceSet([2, 3, 2, 3]);
                    const expectedSet = new InstanceSet();

                    instanceSet.removeFromIterable(toRemove);

                    if (!instanceSet.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + instanceSet
                        )
                });

            });

        });

    });
    
});

