const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongoURI = require("../../../config/mongoURI");
const mongoDB = mongoURI.URI;
const conn = mongoose.createConnection(mongoDB);
const coll = conn.collection('register');

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../model/authEntry");

router.route('/register')
    .post((req, res) => {
        const { errors, isValid } = validateRegisterInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        };

        // potential place for an error. .then
        coll.findOne({ username: req.body.username }).then(user => {
            if (user) {
                return res.status(400).json({ message: "Username already exists" });
            } else {
                const newUser = new User({
                    username: req.body.username,
                    password: req.body.password
                });

                // encrypt password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        coll.insertOne(newUser, function(err) {
                            if (err) {
                                res.status(400).json(err);
                            } else {
                                res.json(newUser);
                            };
                        });
                    });
                });
            };
        });
    });


router.route('/login')
    .post((req, res) => {
        const { errors, isValid } = validateLoginInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        };

        const username = req.body.username;
        const password = req.body.password;

        coll.findOne({ username }).then(user => {
            if (!user) {
                return res.status(404).json({ message: "Username not found" });
            };

            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    // User matched
                    // Create JWT Payload
                    const payload = {
                        id: user.id.$oid,
                        username: user.username
                    };

                    jwt.sign(payload, keys.secretOrKey,
                        {
                          expiresIn: 31556926 // 1 year in seconds
                        },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            });
                        }
                    );
                } else {
                    return res
                        .status(400)
                        .json({ message: "Password incorrect" });
                };
            });
        });
    });

module.exports = router;