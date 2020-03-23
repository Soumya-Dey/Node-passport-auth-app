const express = require("express");
const bcrypt = require('bcryptjs');

const User = require("../models/User");

const router = express.Router();

router.get("/", (req, res) => res.send("welcome to users.js"));
router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));

// user registration handler
router.post("/register", (req, res) => {
    const { name, email, password, password2 } = req.body;

    let errors = []; // array for all the error messages

    // check if all fields are filled
    if (!name || !email || !password || !password2) {
        errors.push({
            msg: "Please fill in all the fields"
        });
    }

    // check for password match
    if (password !== password2) {
        errors.push({
            msg: "Passwords don't match"
        });
    }

    // check for password length
    if (password.length < 8) {
        errors.push({
            msg: "Password must be at least 8 characters long"
        });
    }

    // final check
    // id length of erorrs is > 0, then from contains errors
    // in that case re-render the register form with current values
    if (errors.length > 0) {
        res.render("register", {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // check passed
        User.findOne({ email: email }).then(user => {
            if (user) {
                // user alredy exists
                errors.push({
                    msg: 'email already exists'
                });

                res.render("register", {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else{
                // new User instance
                const newUser = new User({
                    name,
                    email,
                    password
                });

                // hash password with bcrypt
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;

                        // saving hashed password in place of plain text password
                        newUser.password = hash;

                        // save user to DB
                        newUser.save()
                        .then(user => {
                            // redirect to login page on successful registration
                            res.redirect('/users/login');
                            console.log('user saved');
                        })
                        .catch(err => console.log(err));
                    })
                });
            }
        });
    }
});

module.exports = router;
