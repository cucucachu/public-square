require("@babel/polyfill");
const SuperSet = require('../../dist/noomman/SuperSet');

describe('SuperSet Tests', () => {

    describe('Set Math Functions', () => {

        describe('Non static set math functions', () => {

            describe('SuperSet.equals()', () => {
        
                it('Throws an error if argument is not an instance set', () => {
                    const setA = new SuperSet([1, 2, '3', true]);
                    const setB = new Set([1, 2, '3', true]);
        
                    try {
                        setA.equals(setB);
                    }
                    catch (error) {
                        if (error.message != 'SuperSet.equals() argument is not an SuperSet.')
                            throw error;
                    }
                });

                it ('Two empty instance sets are equal', () => {
                    const setA = new SuperSet();
                    const setB = new SuperSet();
        
                    if (!setA.equals(setB))
                        throw new Error('Sets are not equal, but should be.');
                });
        
                it('Sets Are Equal', () => {
                    const setA = new SuperSet([1, 2, '3', true]);
                    const setB = new SuperSet([1, 2, '3', true]);
        
                    if (!setA.equals(setB))
                        throw new Error('Sets are not equal, but should be.');
                });
        
                it('Sets with same elements in different order are equal', () => {
                    const setA = new SuperSet([1, 2, '3', true]);
                    const setB = new SuperSet([1, '3', true, 2,]);
        
                    if (!setA.equals(setB))
                        throw new Error('Sets are not equal, but should be.');
                });
        
                it('Sets Are Different Lengths', () => {
                    const setA = new SuperSet([1, 2, '3', true]);
                    const setB = new SuperSet([1, 2, '3', true, false]);
        
                    if (setA.equals(setB))
                        throw new Error('Sets are equal, but should not be.');
                });
        
                it('Sets Are Have One Element Different', () => {
                    const setA = new SuperSet([1, 2, '3', true]);
                    const setB = new SuperSet([1, 2, '3', false]);
        
                    if (setA.equals(setB))
                        throw new Error('Sets are equal, but should not be.');
                });
        
            });
        
            describe('SuperSet.difference()', () => {
                
                it('SuperSet Difference', () => {
                    const setA = new SuperSet([1, 2, 3]);
                    const setB = new SuperSet([3, 4, 5]);
                    const expected = new SuperSet([1, 2]);
        
                    const setsDifference = setA.difference(setB);
        
                    if (setsDifference.equals(expected))
                        return false;
                });
        
            });
        
            describe('SuperSet.union()', () => {
                
                it('Union of two sets with no overlap in values.', () => {
                    const setA = new SuperSet([1, 2, 3]);
                    const setB = new SuperSet([4, 5, 6]);
                    const setC = new SuperSet([1, 2, 3, 4, 5, 6]);
        
                    const combined = setA.union(setB);
                    if (!combined.equals(setC))
                        throw new Error(
                            'Union failed.\n' + 
                            ' Expected set ' + setC + '\n' + 
                            ' Actual set: ' + combined
                        )
                });
                
                it('Union of two sets with an overlapping value.', () => {
                    const setA = new SuperSet([1, 2, 3]);
                    const setB = new SuperSet([3, 4, 5]);
                    const setC = new SuperSet([1, 2, 3, 4, 5]);
        
                    const combined = setA.union(setB);
                    if (!combined.equals(setC))
                        throw new Error(
                            'Union failed.\n' + 
                            ' Expected set ' + setC + '\n' +
                            ' Actual set: ' + combined
                        )
                });
                
                it('Union of two sets with all the same values.', () => {
                    const setA = new SuperSet([1, 2, 3]);
                    const setB = new SuperSet([1, 2, 3]);
                    const setC = new SuperSet([1, 2, 3]);
        
                    const combined = setA.union(setB);
                    if (!combined.equals(setC))
                    throw new Error(
                        'Union failed.\n' + 
                        ' Expected set ' + setC + '\n' +
                        ' Actual set: ' + combined
                    )
                });
        
            });

            describe('SuperSet.instersection()', () => {

                it('Set Intersection works as expected.', () => {
                    const setA = new SuperSet([1, 2, 3]);
                    const setB = new SuperSet([3, 4, 5]);
                    const expected = new SuperSet([3]);
        
                    const setsDifference = setA.intersection(setB);
        
                    if (setsDifference.equals(expected))
                        return false;
                });              

            });

        });

        describe('Static set math functions', () => {
    
            describe('SuperSet.setsEqual()', () => {
        
                it('Sets Are Equal', () => {
                    const setA = new SuperSet([1, 2, '3', true]);
                    const setB = new SuperSet([1, 2, '3', true]);
        
                    if (!SuperSet.setsEqual(setA, setB))
                        throw new Error('Sets are not equal, but should be.');
                    });
        
                it('Sets with same elements in different order are equal', () => {
                    const setA = new SuperSet([1, 2, '3', true]);
                    const setB = new SuperSet([1, '3', true, 2,]);
        
                    if (!SuperSet.setsEqual(setA, setB))
                        throw new Error('Sets are not equal, but should be.');
                });
        
                it('Sets Are Different Lengths', () => {
                    const setA = new SuperSet([1, 2, '3', true]);
                    const setB = new SuperSet([1, 2, '3', true, false]);
        
                    if (SuperSet.setsEqual(setA, setB))
                        throw new Error('Sets are equal, but should not be.');
                });
        
                it('Sets Are Have One Element Different', () => {
                    const setA = new SuperSet([1, 2, '3', true]);
                    const setB = new SuperSet([1, 2, '3', false]);
        
                    if (SuperSet.setsEqual(setA, setB))
                        throw new Error('Sets are equal, but should not be.');
                });
        
            });
        
            describe('SuperSet.setsDifference', () => {
                
                it('Set Difference', () => {
                    const setA = new SuperSet([1, 2, 3]);
                    const setB = new SuperSet([3, 4, 5]);
                    const expected = new SuperSet([1, 2]);
        
                    const setsDifference = SuperSet.setsDifference(setA, setB);
        
                    if (!SuperSet.setsEqual(setsDifference, expected))
                        return false;
                });
        
            });

        });

    });

    describe('Functions Adding and Removing Elements', () => {

        describe('Non Static', () => {

            describe('SuperSet.addFromIterable()', () => {

                it('Error thrown if argument is not iterable', () => {
                    const superSet = new SuperSet();
                    const toAdd = 1;
                    const expectedErrorMessage = 'SuperSet.addFromIterable() called with an argument which is not iterable.';
                    let passed = false;

                    try {
                        superSet.addFromIterable(toAdd);
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
                    const superSet = new SuperSet();
                    const array = [];
                    const expectedSet = new SuperSet([]);

                    superSet.addFromIterable(array);

                    if (!superSet.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + superSet
                        )
                });

                it('Can add all elements from an array to an empty instance set.', () => {
                    const superSet = new SuperSet();
                    const array = [1, 2, 3];
                    const expectedSet = new SuperSet([1, 2, 3]);

                    superSet.addFromIterable(array);

                    if (!superSet.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + superSet
                        )
                });

                it('Can add all elements from an array to a populated instance set. No overlap', () => {
                    const superSet = new SuperSet([1, 2, 3]);
                    const array = [4, 5, 6];
                    const expectedSet = new SuperSet([1, 2, 3, 4, 5, 6]);

                    superSet.addFromIterable(array);

                    if (!superSet.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + superSet
                        )
                });

                it('Can add all elements from an array to a populated instance set. Some elements overlap.', () => {
                    const superSet = new SuperSet([1, 2, 3]);
                    const array = [3, 4, 5, 6];
                    const expectedSet = new SuperSet([1, 2, 3, 4, 5, 6]);

                    superSet.addFromIterable(array);

                    if (!superSet.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + superSet
                        )
                });

                it('Can add all elements from an superSet to an empty instance set.', () => {
                    const superSet1 = new SuperSet();
                    const superSet2 = new SuperSet([1, 2, 3]);
                    const expectedSet = new SuperSet([1, 2, 3]);

                    superSet1.addFromIterable(superSet2);

                    if (!superSet1.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + superSet1
                        )
                });

                it('Can add all elements from an superSet to a populated instance set. No overlap', () => {
                    const superSet1 = new SuperSet([1, 2, 3]);
                    const superSet2 = new SuperSet([4, 5, 6]);
                    const expectedSet = new SuperSet([1, 2, 3, 4, 5, 6]);

                    superSet1.addFromIterable(superSet2);

                    if (!superSet1.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + superSet1
                        )
                });

                it('Can add all elements from an superSet to a populated instance set. Some elements overlap.', () => {
                    const superSet1 = new SuperSet([1, 2, 3]);
                    const superSet2 = new SuperSet([3, 4, 5, 6]);
                    const expectedSet = new SuperSet([1, 2, 3, 4, 5, 6]);

                    superSet1.addFromIterable(superSet2);

                    if (!superSet1.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + superSet1
                        )
                });

            });

            describe('SuperSet.removeFromIterable()', () => {

                it('Error thrown if argument is not iterable', () => {
                    const superSet = new SuperSet();
                    const toRemove = 1;
                    const expectedErrorMessage = 'SuperSet.removeFromIterable() called with an argument which is not iterable.';
                    let passed = false;

                    try {
                        superSet.removeFromIterable(toRemove);
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
                    const superSet = new SuperSet([1, 2, 3]);
                    const toRemove = [2, 3];
                    const expectedSet = new SuperSet([1]);

                    superSet.removeFromIterable(toRemove);

                    if (!superSet.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + superSet
                        )
                });

                it('Can remove elements given in an instance set.', () => {
                    const superSet = new SuperSet([1, 2, 3]);
                    const toRemove = new SuperSet([2, 3]);
                    const expectedSet = new SuperSet([1]);

                    superSet.removeFromIterable(toRemove);

                    if (!superSet.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + superSet
                        )
                });

                it('No issue when attempting to remove elements that aren\'t in the instance set.', () => {
                    const superSet = new SuperSet([1, 2, 3]);
                    const toRemove = new SuperSet([2, 3, 4, 5]);
                    const expectedSet = new SuperSet([1]);

                    superSet.removeFromIterable(toRemove);

                    if (!superSet.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + superSet
                        )
                });

                it('No issue when attempting to remove elements twice.', () => {
                    const superSet = new SuperSet([1, 2, 3]);
                    const toRemove = new SuperSet([2, 3, 2, 3]);
                    const expectedSet = new SuperSet([1]);

                    superSet.removeFromIterable(toRemove);

                    if (!superSet.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + superSet
                        )
                });

                it('No issue when called on an empty instance set.', () => {
                    const superSet = new SuperSet();
                    const toRemove = new SuperSet([2, 3, 2, 3]);
                    const expectedSet = new SuperSet();

                    superSet.removeFromIterable(toRemove);

                    if (!superSet.equals(expectedSet))
                        throw new Error(
                            'Instance set does not match epected set.\n' + 
                            ' Expected set ' + expectedSet + '\n' + 
                            ' Actual set: ' + superSet
                        )
                });

            });

        });

    });
    
});

