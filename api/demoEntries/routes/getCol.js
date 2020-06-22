'use strict';

const express = require('express');
const mongoose = require('mongoose');
// use router to manage relative paths
const router = express.Router();

// establishing connection
var mongodb = require('../model/mongoURI');
var mongodbURI = mongodb.URI;
const conn = mongoose.createConnection(mongodbURI);

// '/' is based on /api/feedback
router.route('/:col')
    .get((req, res) => {
        const col_name = req.params.col;
        const db = conn.db;
        const coll = conn.collection(col_name);
        var col_names = [];
        coll.find().toArray(function(err, collection) {
            db.listCollections().toArray(function(err, items) {
                items.forEach(function(item) {
                    col_names.push(item["name"]);
                });
                if (err) {
                    res.status(400).json(err);
                };
                if (col_names.includes(col_name)) {
                    res.json(collection);   
                } else {
                    res.json({ message: `Collection (${col_name}) not found.` });
                };
            });
        });
    });

module.exports = router;