// following code should be executed in strict mode
'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Entry = require('../model/demoEntry');
// use router to manage relative paths
const router = express.Router();

// '/' is based on /api/feedback
router.route('/')
    .post((req, res) => {
        const entry = new Entry(req.body);
        entry.save((err, entry) => {
            if (err) {
                res.status(400).json(err);
            }
            res.json(entry);
        });
    });

module.exports = router;
