'use strict';

const express = require('express');
const mongoose = require('mongoose');
// const Collection = require('../model/changeCol');
// var Schema = mongoose.Schema;
// use router to manage relative paths
const router = express.Router();

// '/' is based on /api/feedback
router.route('/:col')
    .get((req, res) => {
        const col_name = req.params.col;
        // Collection.changeTo(col);
        // var Entry = require('../model/demoEntry');
        var Schema = mongoose.Schema;
        var demoEntrySchema = new Schema({
            userID: { type: String, required: false},
            sliderVal: { type: String, required: false},
            q1: { type: String, required: false},
            q2: { type: String, required: false},
            q3: { type: String, required: false}},
            { collection : col_name });
        var Entry = mongoose.model('Entry', demoEntrySchema);
        // provide an object with find, you can specify what we want to find
        Entry.find({}, (err, entries) => {
            if (err) {
                res.status(400).json(err);
            };
            res.json(entries);
        });
    });

module.exports = router;