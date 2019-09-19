
const moment = require('moment');

function testForError(functionName, expectedErrorMessage, functionToCall) {
    let errorThrown = false;

    try {
        functionToCall();
    }
    catch (error) {
        if (error.message != expectedErrorMessage) {
            throw new Error(
                functionName + ' threw an error, but not the expected one.\n' + 
                'expected: ' + expectedErrorMessage + '\n' + 
                'actual:   ' + error.message
            )
        }
        errorThrown = true;
    }

    if (!errorThrown)
        throw new Error(functionName + ' did not throw an error when it should have.');
}

function testForErrorRegex(functionName, expectedErrorMessage, expectedErrorRegex, functionToCall) {
    let errorThrown = false;

    try {
        functionToCall();
    }
    catch (error) {
        if (!expectedErrorRegex.test(error.message)) {
            throw new Error(
                functionName + ' threw an error, but not the expected one.\n' + 
                'expected: ' + expectedErrorMessage + '\n' + 
                'actual:   ' + error.message
            )
        }
        errorThrown = true;
    }

    if (!errorThrown)
        throw new Error(functionName + ' did not throw an error when it should have.');
}

async function testForErrorAsync(functionName, expectedErrorMessage, functionToCall) {
    let errorThrown = false;

    try {
        await functionToCall();
    }
    catch (error) {
        if (error.message != expectedErrorMessage) {
            throw new Error(
                functionName + ' threw an error, but not the expected one.\n' + 
                'expected: ' + expectedErrorMessage + '\n' + 
                'actual:   ' + error.message
            )
        }
        errorThrown = true;
    }

    if (!errorThrown)
        throw new Error(functionName + ' did not throw an error when it should have.');
}

function arraysEqual(array1, array2) {
    if (!Array.isArray(array1) || !Array.isArray(array2))
        throw new Error('arraysEqual() called with arguments which are not arrays.');
    
    if (array1.length !== array2.length)
        return false;

    for (const index in array1) {
        const value1 = array1[index];
        const value2 = array2[index];

        if (Array.isArray(value1)) {
            if (!arraysEqual(value1, value2))
                return false;
        }
        else if (value1 instanceof Date) {
            if (!moment(value1).isSame(value2))
                return false;
        }
        else if (typeof(value1) === 'object') {
            if (!objectsEqual(value1, value2)) 
                return false;
        }
        else if (value1 !== value2) {
            return false;
        }
    }

    return true;
}

function objectsEqual(object1, object2) {
    if (typeof(object1) !== 'object' || typeof(object2) !== 'object')
        return false;

    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (!arraysEqual(keys1, keys2))
        return false;

    for (const key of keys1) {
        const value1 = object1[key];
        const value2 = object2[key];

        if (Array.isArray(value1)) {
            if (!arraysEqual(value1, value2))
                return false;
        }
        else if (value1 instanceof Date) {
            if (!moment(value1).isSame(value2))
                return false;
        }
        else if (typeof(value1) === 'object') {
            if (!objectsEqual(value1, value2)) 
                return false;
        }
        else if (value1 !== value2) {
            return false;
        }
    }

    return true;
}

module.exports = {
    testForError,
    testForErrorRegex,
    testForErrorAsync,
    arraysEqual,
    objectsEqual,
}