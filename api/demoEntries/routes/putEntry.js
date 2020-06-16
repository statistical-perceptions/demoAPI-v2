'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Entry = require('../model/demoEntry');
// use router to manage relative paths
const router = express.Router();

// '/' is based on /api/feedback
router.route('/:userID')
    .put((req, res) => {
        // userID constant must match the json key we want to identify
        const userID = req.params.userID;
        Entry.findOneAndUpdate({ userID }, req.body,
            // we want the newly updated data back
            { new: true },
            // entry here will be newly updated
            (err, entry) => {
                if (err) {
                    res.status(400).json(err);
                };
                if (!entry) {
                    res.status(404).json({ message: 'Entry not found.'});
                };
                res.json(entry);
            });
    });

module.exports = router;