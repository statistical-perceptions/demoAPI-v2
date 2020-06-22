'use strict';

const express = require('express');
const mongoose = require('mongoose');
// use router to manage relative paths
const router = express.Router();

// establishing connection
var mongodb = require('../model/mongoURI');
var mongodbURI = mongodb.URI;
const conn = mongoose.createConnection(mongodbURI);

// '/' is based on /
router.route('/collections')
    .get((req, res) => {
        const db = conn.db;
        var col_names = [];
        db.listCollections().toArray(function(err, items) {
            items.forEach(function(item) {
                col_names.push(item["name"]);
            });
            if (err) {
                res.status(400).json(err);
            } else {
                res.json(col_names);
            };
        });
    });

module.exports = router;