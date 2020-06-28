const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongoURI = require("../model/mongoURI");
const mongoDB = mongoURI.URI;
const conn = mongoose.createConnection(mongoDB);

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

        const coll = conn.collection('register');

        

        User.findOne({ username: req.body.username }).then(user => {
            if (user) {
              return res.status(400).json({ message: "Username already exists" });
            } else {
                const newUser = new User({
                    username: req.body.usernmae,
                    password: req.body.password
                });
            };
        });
    });

module.exports = router;