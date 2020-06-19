'use strict';

const express = require('express');
const mongoose = require('mongoose');
// const Collection = require('../model/changeCol');
const Schema = mongoose.Schema;
// use router to manage relative paths
const router = express.Router();

// '/' is based on /api/feedback
router.route('/:col')
    .get((req, res) => {
        var col = req.params.col;
        const generalSchema = new Schema({
            userID: { type: String, required: true},
            sliderVal: { type: String, required: true},
            q1: { type: String, required: false},
            q2: { type: String, required: false},
            q3: { type: String, required: false}},
            { collection : col });
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