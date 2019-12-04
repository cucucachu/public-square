/*
 * NoommanErrors
 * Defines a number of custom Errors for use in Noomman code.
 */

 

/*
 * Class NoommanError
 * Extends Error
 * An Error which is thrown by a noomman method or function.
 *    Extended by all other noomman Errors.
 */
class NoommanError extends Error {

    /* 
     * constructor()
     * Creates an instance of NoommanError.
     * Returns
     * - NoommanError - The NoommanError created.
     */
    constructor(message) {
        super(message);
    }
}

/*
 * Class NoommanValidationError
 * Extends Error
 * An Error which is thrown when an Instance does not conform to the 
 *    requirements defined by the schema of its ClassModel.
 */
class NoommanValidationError extends NoommanError {

    /* 
     * constructor()
     * Creates an instance of NoommanValidationError.
     * Returns
     * - NoommanValidationError - The NoommanValidationError created.
     */
    constructor(message) {
        super(message);
    }
}

/*
 * Class NoommanSaveError
 * Extends Error
 * An Error which is thrown when attempting to save an Instance
 *    which has been deleted, stripped of sensitive attribute, 
 *    or when an Instance fails a createControl or updateControl
 *    method.
 */
class NoommanSaveError extends NoommanError {

    /* 
     * constructor()
     * Creates an instance of NoommanSaveError.
     * Returns
     * - NoommanSaveError - The NoommanSaveError created.
     */
    constructor(message) {
        super(message);
    }
}

/*
 * Class NoommanDeleteError
 * Extends Error
 * An Error which is thrown when attempting to delete an Instance
 *    which has not been saved, or when an Instance fails a deleteControl method.
 */
class NoommanDeleteError extends NoommanError {

    /* 
     * constructor()
     * Creates an instance of NoommanDeleteError.
     * Returns
     * - NoommanDeleteError - The NoommanDeleteError created.
     */
    constructor(message) {
        super(message);
    }
}

/*
 * Class NoommanArgumentError
 * Extends Error
 * An Error which is thrown when a noomman method is called
 *    with invalid arguments.
 */
class NoommanArgumentError extends NoommanError {

    /* 
     * constructor()
     * Creates an instance of NoommanArgumentError.
     * Returns
     * - NoommanArgumentError - The NoommanArgumentError created.
     */
    constructor(message) {
        super(message);
    }
}

/*
 * Class NoommanClassModelError
 * Extends Error
 * An Error which is thrown when a ClassModel is functionally invalid, or a 
 *    ClassModel method is called on a ClassModel that the method would not 
 *    function for.
 */
class NoommanClassModelError extends NoommanError {

    /* 
     * constructor()
     * Creates an instance of NoommanClassModelError.
     * Returns
     * - NoommanClassModelError - The NoommanClassModelError created.
     */
    constructor(message) {
        super(message);
    }
}

/*
 * Class NoommanConstructorError
 * Extends Error
 * An Error which is thrown when a noomman class constructor recieves invalid arguments.
 */
class NoommanConstructorError extends NoommanError {

    /* 
     * constructor()
     * Creates an instance of NoommanConstructorError.
     * Returns
     * - NoommanConstructorError - The NoommanConstructorError created.
     */
    constructor(message) {
        super(message);
    }
}

/*
 * Class NoommanNotImplementedError
 * Extends Error
 * An Error which is thrown when a method is called, and that method is 
 *    intentionally not implemented. This is usually the case when a class
 *    extends another class, but needs to disallow a particular inherrited
 *    method.
 */
class NoommanNotImplementedError extends NoommanError {

    /* 
     * constructor()
     * Creates an instance of NoommanNotImplementedError.
     * Returns
     * - NoommanNotImplementedError - The NoommanNotImplementedError created.
     */
    constructor(message) {
        super(message);
    }
}

module.exports = {
    NoommanError,
    NoommanValidationError,
    NoommanSaveError,
    NoommanDeleteError,
    NoommanArgumentError,
    NoommanClassModelError,
    NoommanConstructorError,
    NoommanNotImplementedError,
}