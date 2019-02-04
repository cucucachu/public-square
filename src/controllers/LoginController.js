const UserAccount = require('../models/Modules/User/UserAccount');
const User = require('../models/Modules/User/User');
const AuthToken = require('../models/Modules/User/AuthToken');

const createAuthToken = async function(userAccount) {
    if (userAccount == null)
        throw new Error('LoginController.refreshToken() called with null parameter.');

    let currentAuthToken = await UserAccount.walk(userAccount, 'authToken');

    if (currentAuthToken) {
        await AuthToken.deleteInstance(currentAuthToken);
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