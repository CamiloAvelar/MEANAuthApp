const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
var nodemailer = require("nodemailer");

const User = require('../models/user');
const Email = require('../verify/email');

//Register
router.post('/register', (req, res, next) => {
    const host = req.get('host');

    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        verified: false
    });

    User.addUser(newUser, (err, user) => {
        if(err){
           res.json({success: false, msg:'Failed to register user'});
        } else {
            res.json({success: true, msg:'User registered'});
        }
    });

    Email.sendMail(host, newUser.email, newUser._id, (err, msg) => {
        console.log(msg);
    });

});

//Verify
router.get('/verify', (req, res, next) => {
    const userId = req.query.id;

    User.getUserById(userId, (err, user) => {
        if (!user) {
            return res.json({success: false, msg: 'User Not Found'});
        } else {
            User.verifyUser(userId, (err, user) => {
                if(err) throw err;
                return res.json({ success: true, msg: 'User verified'});
            });
        }
    });
});

//Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'User Not Found'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){

                const payload = {id: user._id, name: user.name} // Creat JWT Payload

                const token = jwt.sign(payload, config.secret, {
                    expiresIn: 604800 // 1 week
                });

                res.json({
                    success: true,
                    token: 'Bearer '+token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                return res.json({success: false, msg: 'Wrong password'});
            }
        });
    })
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json({user: req.user});
});

module.exports = router;