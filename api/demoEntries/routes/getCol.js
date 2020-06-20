'use strict';

const express = require('express');
const mongoose = require('mongoose');
// const Collection = require('../model/changeCol');
// var Schema = mongoose.Schema;
// use router to manage relative paths
const router = express.Router();

const mongodbURI = 'mongodb://user:p123456@ds263248.mlab.com:63248/heroku_5qkz777p'
const conn = mongoose.createConnection(mongodbURI);

// '/' is based on /api/feedback
router.route('/:col')
    .get((req, res) => {
        const col_name = req.params.col;
        const coll = conn.collection(col_name);
        coll.find().toArray(function(err, collection) {
            if (err) {
                res.status(400).json(err);
            };
            res.json(collection);
        });
    });

module.exports = router;