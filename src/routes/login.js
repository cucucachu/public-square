const express = require('express');
const router  = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LoginController = require('../controllers/LoginController');

const jwtSecret = '7YBRAKBUICHNZL487562OYUIHOTNQCIUUCNHZHUFBWCER943765';

/* POST login. */
router.post('/', function (request, response, next) {
    passport.authenticate('local', {session: false}, (error, userAccount, info) => {
        if (error) {
            response.status(401).json({
                message: error.message
            });
        }
        else if (!userAccount) {
            response.status(401).json({
                message: info.message
            });
        }
        else {
            LoginController.createAuthToken(userAccount).then(
                (newAuthToken) => {
                    let jwtPayload = {
                        authToken: newAuthToken._id,
                        userAccount: userAccount._id,
                        person: userAccount.person
                    }
        
                    const token = jwt.sign(jwtPayload, jwtSecret);
                    response.json({token});
                },
                (error) => {
                    response.json({
                        error: error.message
                    })
                }
            );
        }
    })(request, response);
});

router.post('/createAccount', function(request, response) {
    LoginController.createUserAccount(request.body).then(
        (userAndAccount) => {
            response.json(
                {
                    message: 'Person and Account Created',
                    person: userAndAccount.person,
                    userAccount: userAndAccount.userAccount
                }
            );
        },
        (error) => {
            response.json({error: error.message});
        }
    );
});

router.post('/deleteAccount', function(request, response) {
    LoginController.deleteUserAccount(request.body.email).then(
        (successMessage) => {
            response.json({
                message: successMessage,
            });
        },
        (error) => {
            response.json({
                error: error.message
            });
        }
    );
});

module.exports = router;