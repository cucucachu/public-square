const express = require('express');
const router  = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LoginController = require('../controllers/LoginController');

const jwtSecret = '7YBRAKBUICHNZL487562OYUIHOTNQCIUUCNHZHUFBWCER943765';

/* POST login. */
router.post('/', function (req, res, next) {
    passport.authenticate('local', {session: false}, (error, userAccount, info) => {
        if (error || !userAccount) {
            res.status(401).json({
                message: 'Invalid Email and/or Password'
            });
        }

        else {
            LoginController.createAuthToken(userAccount).then(
                (newAuthToken) => {
                    let jwtPayload = {
                        authToken: newAuthToken._id,
                        userAccount: userAccount._id,
                        user: userAccount.user
                    }
        
                    const token = jwt.sign(jwtPayload, jwtSecret);
                    res.json({token});
                }
            );
        }
    })(req, res);
});

router.post('/createAccount', function(request, response) {
    LoginController.createUserAccount(request.body).then(
        (userAndAccount) => {
            response.json(
                {
                    message: 'User and Account Created',
                    user: userAndAccount.user,
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