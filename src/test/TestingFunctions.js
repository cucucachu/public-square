

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

module.exports = {
    testForError,
    testForErrorAsync,
}