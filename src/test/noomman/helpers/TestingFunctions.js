
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

function testForErrorMutex(functionName, expectedErrorMessage, expectedErrorMutex, functionToCall) {
    let errorThrown = false;

    try {
        functionToCall();
    }
    catch (error) {
        if (!expectedErrorMutex.test(error.message)) {
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

function arrayEquals(array1, array2, message='') {
    if (!Array.isArray(array1) || !Array.isArray(array2))
        throw new Error('arrayEquals() called with arguments which are not arrays.');
    
    if (array1.length !== array2.length)
        return false;

    for (const item of array1)
        if (!array2.includes(item))
            return false;

    return true;
}

module.exports = {
    testForError,
    testForErrorMutex,
    testForErrorAsync,
    arrayEquals,
}