'use strict';

const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;

// establishing connection
var mongodb = require('../../../config/mongoURI');
var mongodbURI = mongodb.URI;

// '/' is based on /api/feedback
router.route('/:db/:col')
    .post((req, res) => {
        const db_name = req.params.db;
        const col_name = req.params.col;
        const entry = req.body;

        // Connecting to Atlas
        const atlas = mongodbURI + "/" + db_name 
        + '?retryWrites=true&w=majority';
        const client = new MongoClient(atlas, {useNewUrlParser: true});

        client.connect(err => {
            const db = client.db(db_name);
            const col = db.collection(col_name);

            db.listCollections().toArray(function(err, items) {
                var col_names = [];
                items.forEach(function(item) {
                    col_names.push(item["name"]);
                })
                if (col_names.includes(col_name)) {
                    col.insertOne(entry, function(err) {
                        if (err) {
                            res.status(400).json(err);
                        } else {
                            res.json(entry);
                        }
                    })
                } else {
                    db.createCollection(col_name);
                    const new_col = db.collection(col_name);
                    new_col.insertOne(entry, function(err) {
                        if (err) {
                            res.status(400).json(err);
                        } else {
                            res.json(entry)
                        }
                    })
                };
            });
        });
    });

module.exports = router;