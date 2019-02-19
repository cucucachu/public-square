const UserAccount = require('../models/Modules/User/UserAccount');
const Person = require('../models/Modules/User/Person');
const AuthToken = require('../models/Modules/User/AuthToken');
const hasher = require('password-hash');

const createUserAccount = async function(parameters) {
    let emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    let minPasswordLength = 8;

    if (parameters.email === null || !emailRegex.test(parameters.email))
        throw new Error('createUserAccount(): invalid email. ' + parameters.email);
    
    if (parameters.password == null || typeof(parameters.password) != 'string' || parameters.password.length < minPasswordLength) 
        throw new Error('createUserAccount(): invalid password. ' + parameters.password);

    if (parameters.city == null || parameters.state == null || parameters.country == null)
        throw new Error('createUserAccount(): city, state, and country are required.');

    if (!parameters.firstName || !parameters.lastName)
        throw new Error('createUserAccount(): first and last name are required.');
    
    let existingAccountForEmail = await UserAccount.findOne({email: parameters.email});

    if (existingAccountForEmail) 
        throw new Error('createUserAccount(): An account already exists with the given email. ' + existingAccountForEmail._id + ', ' + parameters.email);

    let userAccount = UserAccount.create();
    let person = Person.create();

    userAccount.email = parameters.email;
    userAccount.passwordHash = hasher.generate(parameters.password);
    userAccount.person = person._id;

    person.firstName = parameters.firstName;
    person.lastName = parameters.lastName;
    person.middleName = parameters.middleName;
    person.userAccount = userAccount._id;

    let userAccountPromise = UserAccount.save(userAccount);
    let personPromise = Person.save(person);

    await userAccountPromise;
    await personPromise;

    userAccount.passwordHash = null;

    return {
        person: person,
        userAccount: userAccount
    };
    
}

/*
 *  Deletes a user and the related user account.
 *  @parm email - the email of the user account to delete.
 */
const deleteUserAccount = async function(email) {
    if (email == null)
        throw new Error('invalid call, LoginController.deleteUserAndAccount(email)')

    let userAccount = await UserAccount.findOne({email: email});

    if (userAccount == null)
        throw new Error('No user account for email ' + email);
    
    let person = await UserAccount.walk(userAccount, 'person');

    let deletePersonPromise = Person.delete(person);
    let deleteUserAccountPromise = UserAccount.delete(userAccount);


    await deletePersonPromise;
    await deleteUserAccountPromise;

    return 'Person and User Account deleted for User Account with email ' + email;
}

const createAuthToken = async function(userAccount) {

    if (userAccount == null)
        throw new Error('LoginController.refreshToken() called with null parameter.');
    
    let currentAuthToken = await UserAccount.walk(userAccount, 'authToken');

    if (currentAuthToken) {
        await AuthToken.delete(currentAuthToken);
    }

    let newAuthToken = AuthToken.create();
    let expiration = new Date();
    expiration.setDate(expiration.getDate() + 1);

    newAuthToken.createdAt = new Date();
    newAuthToken.expiresAt = expiration;
    newAuthToken.userAccount = userAccount;

    await AuthToken.save(newAuthToken);

    userAccount.authToken = newAuthToken;
    await UserAccount.save(userAccount);

    return newAuthToken;
}

const verifyAuthToken = async function(authTokenId) {
    let authToken = await AuthToken.findById(authTokenId);

    if (authToken == null)
        throw new Error('Could not find authentification token ' + authTokenId + '.');

    if (authToken.expiresAt < new Date())
        throw new Error('Authentification Token is expired.');
    
    return authToken;
}

module.exports.createAuthToken = createAuthToken;
module.exports.verifyAuthToken = verifyAuthToken;
module.exports.createUserAccount = createUserAccount;
module.exports.deleteUserAccount = deleteUserAccount;