'use strict';

const express = require('express');
const mongoose = require('mongoose');
// use router to manage relative paths
const router = express.Router();

// establishing connection
var mongodb = require('../model/mongoURI');
var mongodbURI = mongodb.URI;
const conn = mongoose.createConnection(mongodbURI);
const db = conn.db;

// '/' is based on /api/feedback
router.route('/:col')
    .get((req, res) => {
        const col_name = req.params.col;
        // db.listCollections().toArray(function(err, items) {
        //     console.log(items);
        // })
        // console.log(db.listCollections);

        const coll = conn.collection(col_name);
        // console.log(coll);
        coll.find().toArray(function(err, collection) {
            if (err) {
                res.status(400).json(err);
            };
            res.json(collection);   
        });
    });

module.exports = router;