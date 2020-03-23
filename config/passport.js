const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

// exporting the function with passport parameter
module.exports = function(passport) {
    // passport middleware
    passport.use(
        new LocalStrategy(
            { usernameField: "email" },
            (email, password, done) => {
                // match user with email from DB
                User.findOne({ email: email })
                    .then(user => {
                        // if no user with that email exists
                        if (!user)
                            return done(null, false, {
                                message: "That email is not registered"
                            });

                        // match password
                        bcrypt.compare(
                            password,
                            user.password,
                            (err, isMatched) => {
                                if (err) throw err;

                                if (isMatched) {
                                    return done(null, true);
                                } else {
                                    return done(null, false, {
                                        message: "Password is incorrect"
                                    });
                                }
                            }
                        );
                    })
                    .catch(err => console.log(err));
            }
        )
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};
