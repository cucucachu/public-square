const express = require('express');
const router  = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

const jwtSecret = '7YBRAKBUICHNZL487562OYUIHOTNQCIUUCNHZHUFBWCER943765';

/* POST login. */
router.post('/login', function (req, res, next) {
    passport.authenticate('local', {session: false}, (error, userAccountId, info) => {
        if (error || !userAccountId) {
            if (error)
                console.log('error: ' + error);
            res.status(401).json({
                message: 'Invalid Email and/or Password',
                userAccountId   : userAccount
            });
        }

        else {
            req.login(userAccountId, {session: false}, (error) => {
                if (error) {
                    res.send(error);
                }
                let jwtPayload = {
                    userAccountId: userAccountId
                }
                console.log('second part');
                // generate a signed son web token with the contents of userAccount object and return it in the response
                const token = jwt.sign(userAccountId, jwtSecret);
                res.json({userAccountId, token});
            });
        }
    })(req, res);
});

module.exports = router;