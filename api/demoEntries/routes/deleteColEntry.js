'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// establishing connection
var mongodb = require('../model/mongoURI');
var mongodbURI = mongodb.URI;
const conn = mongoose.createConnection(mongodbURI);

// '/' is based on /api/feedback
router.route('/:col/:userID')
    .delete((req, res) => {
        const col_name = req.params.col;
        const userID = req.params.userID;   
        const coll = conn.collection(col_name);
        coll.findOneAndDelete({ userID }, (err, entry) => {
            if (err) {
                res.status(400).json(err);
            };
            if (!userID) {
                res.status(404).json({ message: 'Entry not found.' });
            };
            res.json({ message: `Entry with userID: ${userID} deleted.`});
        });
    });

module.exports = router;