require('dotenv').config();
const express = require('express');
const router  = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const jwt      = require('jsonwebtoken');
const passport = require('passport');


/* POST login. */
router.post('/login', function (req, res, next) {
    passport.authenticate('local', {session: false}, (err, user, info) => {
		/*handle where there is error or no user in database*/
		if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user   : user
            });
        }
		/*user login is successful, sign a token and return it to the user*/
        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }

            const token = jwt.sign(user.toJSON(), process.env.TOKEN_SECRET);

            return res.json({user, token});
        });
    })
    (req, res, next);

});

module.exports = router;