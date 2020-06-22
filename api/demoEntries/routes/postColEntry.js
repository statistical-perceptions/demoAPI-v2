'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Entry = require('../model/demoEntry');

// establishing connection
var mongodb = require('../model/mongoURI');
var mongodbURI = mongodb.URI;
const conn = mongoose.createConnection(mongodbURI);

// '/' is based on /api/feedback
router.route('/:col')
    .post((req, res) => {
        const col_name = req.params.col;
        const coll = conn.collection(col_name);
        const entry = Entry(req.body);
        coll.insertOne(entry, function(err) {
            if (err) {
                res.status(400).json(err);
            };
            res.json(entry);
        });
    });

module.exports = router;