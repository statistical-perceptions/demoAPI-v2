const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uriUtil = require('mongodb-uri');

const mongodb = require("../../../config/mongoURI");
const mongodbURI = mongodb.URI;
const atlas = mongodbURI + '/register?retryWrites=true&w=majority'
const mongooseURI = uriUtil.formatMongoose(atlas);
const db = mongoose.createConnection(mongooseURI);
const coll = db.collection('credentials');

const key = require("../../../config/key");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../model/authEntry");

// '/' is based on '/api'
router.route('/register')
  .post((req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    };

    // create a new database for this user
    const newDB_URI = mongodbURI + '/' + req.body.username
      + '?retryWrites=true&w=majority'
    const newDB_mongooseURI = uriUtil.formatMongoose(newDB_URI);
    const new_db = mongoose.createConnection(newDB_mongooseURI);

    new_db.createCollection("info");
    new_db.createCollection("itemData");

    coll.findOne({ username: req.body.username }).then(user => {
      if (user) {
        return res.status(400).json({ userExists: "Username already exists" });
      } else {
        const newUser = new User({
          username: req.body.username,
          password: req.body.password
        });

        // col_name = req.body.username + "-col"
        // db.createCollection(col_name);

        // encrypt password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            coll.insertOne(newUser, function (err) {
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
        return res.status(404).json({ userNotFound: "Username not found" });
      };

      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            // id: user.id.$oid,
            id: user._id,
            username: user.username
          };

          jwt.sign(payload, key.secretOrKey,
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
            .json({ pwdIncorrect: "Password incorrect" });
        };
      });
    });
  });

module.exports = router;