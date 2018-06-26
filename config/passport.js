const JwtStrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('./database');
const keys = require('./keys');
const Email = require('../verify/email');

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secret;

module.exports = function(passport){
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.getUserById(jwt_payload.id, (err, user) => {
            if(err){
                return done(err,false);
            }

            if(user){
                return done(null, user);
            } else {
                return done(null, false)
            }
        });
    }));

    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL:`/users/google/callback`,
            proxy:true
        }, (accessToken, refreshToken, profile, done) => {
            // console.log(accessToken);
            // console.log(profile);
            const randPass = Math.floor((Math.random() * 100000) + 1) + 'a';
            const newUser = new User({
                googleID: profile.id,
                name: profile.name.givenName,
                username: `${profile.name.givenName}${profile.name.familyName}`,
                password: randPass,
                email: profile.emails[0].value,
                verified: false
            });
            User.getUserByEmail(newUser.email, (err, user) => {
                if(!user){
                    User.addUser(newUser, (err, user) => {
                        if(err){
                            return done(err, null);
                        } else {
                            const payload = {id: user._id, name: user.name} // Creat JWT Payload

                            const token = jwt.sign(payload, config.secret, {
                                expiresIn: 604800 // 1 week
                            });
            
                            const userAndToken = {
                                user,
                                token: 'Bearer ' + token
                            }
                            Email.sendMail('obscure-journey-42939.herokuapp.com', newUser.email, newUser._id, (err, msg) => {
                                console.log(msg);
                            });
                            return done(null, userAndToken);
                        }
                    })
                } else {
                    const payload = {id: user._id, name: user.name} // Creat JWT Payload

                    const token = jwt.sign(payload, config.secret, {
                        expiresIn: 604800 // 1 week
                    });
    
                    const userAndToken = {
                        user,
                        token: 'Bearer ' + token
                    }
                    return done(null, userAndToken)
                }
            })
        })
    )

    passport.serializeUser((userAndToken, done) => {
        done(null, userAndToken);
    });

    passport.deserializeUser((userAndToken, done) => {
        done(null, userAndToken);
    });
}