'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Collection = require('../model/changeCol');
// use router to manage relative paths
const router = express.Router();

// '/' is based on /api/feedback
router.route('/')
    .get((req, res) => {
        const col = req.query.col;
        console.log(col);
        Collection.changeTo(col);
        const Entry = require('../model/demoEntry');
        // provide an object with find, you can specify what we want to find
        Entry.find({ }, (err, entries) => {
            if (err) {
                res.status(400).json(err);
            };
            res.json(entries);
        });
    });

module.exports = router;