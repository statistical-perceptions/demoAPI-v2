'use strict';

const express = require('express');
const mongoose = require('mongoose');
var Entry = require('../model/demoEntry');
// use router to manage relative paths
const router = express.Router();

// '/' is based on /api/feedback
router.route('/')
    .get((req, res) => {
        // provide an object with find, you can specify what we want to find
        Entry.find({}, (err, entries) => {
            if (err) {
                res.status(400).json(err);
            };
            res.json(entries);
        });
    });

module.exports = router;