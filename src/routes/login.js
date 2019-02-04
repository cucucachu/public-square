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

module.exports = router;