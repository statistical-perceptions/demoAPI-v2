'use strict';

const express = require('express');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
// use router to manage relative paths
const router = express.Router();

// establishing connection
var mongodb = require('../../../config/mongoURI');
var mongodbURI = mongodb.URI;

// '/' is based on /api
router.route('/:db/createCol/:newCol')
    .post((req, res) => {
        const db_name = req.params.db;
        const new_col = req.params.newCol;

        const atlas = mongodbURI + "/" + db_name 
            + '?retryWrites=true&w=majority';
        const client = new MongoClient(atlas, {useNewUrlParser: true});
        
        client.connect(e => {
            const db = client.db(db_name);
            db.listCollections().toArray(function(err, items) {
                var col_names = [];
                items.forEach(function(item) {
                    col_names.push(item["name"]);
                });
                if (col_names.includes(new_col)) {
                    res.json({ message: `Collection: (${new_col}) already exists.`})
                } else {
                    db.createCollection(new_col, function(err) {
                        if (err) {
                            res.status(400).json(err);
                        } else {
                            res.json({ message: `Successfully created ${new_col}`})
                        }
                    })
                }
            });
        })        
    });

module.exports = router;