'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Entry = require('../model/demoEntry');
// use router to manage relative paths
const router = express.Router();

// '/' is based on /api/feedback
router.route('/:userID')
    .get((req, res) => {
        const userID = req.params.userID;
        Entry.findOne({ userID }, (err, entry) => {
            if (err) {
                res.status(400).json(err);
            };
            if (!entry) {
                res.status(404).json({ message: 'Entry not found.'});
            };
            res.json({entry});
        });
    });

module.exports = router;