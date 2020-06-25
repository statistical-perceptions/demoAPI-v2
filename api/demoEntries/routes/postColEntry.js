'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
// const Entry = require('../model/demoEntry');

// establishing connection
var mongodb = require('../model/mongoURI');
var mongodbURI = mongodb.URI;
const conn = mongoose.createConnection(mongodbURI);

// '/' is based on /api/feedback
router.route('/:col')
    .post((req, res) => {
        const col_name = req.params.col;
        const db = conn.db;
        const coll = conn.collection(col_name);
        // const entry = Entry(req.body);
        const entry = req.body;
        var col_names = [];
        coll.insertOne(entry, function(err) {
            db.listCollections().toArray(function(err, items) {
                items.forEach(function(item) {
                    col_names.push(item["name"]);
                });
                if (err) {
                    res.status(400).json(err);
                };
                if (col_names.includes(col_name)) {
                    res.json(entry);
                } else {
                    res.json({ message: `Collection (${col_name}) not found.` });
                };
            });
        });
    });

module.exports = router;