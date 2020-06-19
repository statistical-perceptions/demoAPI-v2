'use strict';

const express = require('express');
const mongoose = require('mongoose');
// const Collection = require('../model/changeCol');
const Schema = mongoose.Schema;
// use router to manage relative paths
const router = express.Router();

// '/' is based on /api/feedback
router.route('/')
    .get((req, res) => {
        const reqBody = req.body;
        var theKeys = Object.keys(reqBody);
        var col_name = reqBody[theKeys[0]];
        const generalSchema = new Schema({ collection : col_name });
        // Collection.changeTo(col);
        // var Entry = require('../model/demoEntry');
        // provide an object with find, you can specify what we want to find
        generalSchema.find({}, (err, entries) => {
            if (err) {
                res.status(400).json(err);
            };
            res.json(entries);
        });
    });

module.exports = router;