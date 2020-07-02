'use strict';

const express = require('express');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
// use router to manage relative paths
const router = express.Router();

// URI
var mongodb = require('../../../config/mongoURI');
var mongodbURI = mongodb.URI;

// '/' is based on /api/feedback
router.route('/:db/:col')
    .get((req, res) => {
        const db_name = req.params.db;
        const col_name = req.params.col;

        // Connecting to Atlas
        const atlas = mongodbURI + "/" + db_name 
            + '?retryWrites=true&w=majority';
        const client = new MongoClient(atlas, {useNewUrlParser: true});

        client.connect(err => {
            const db = client.db(db_name);
            const col = db.collection(col_name);

            // get names of databases
            db.executeDbAdminCommand({listDatabases:1})
                .then(res => {
                    const databases = res["databases"];
                    var db_names = [];
                    databases.forEach(function(database) {
                        db_names.push(database["name"]);
                    })
                    // console.log(db_names);
                }).catch(err => {console.log(err)});

            var col_names = [];
            col.find({}).toArray(function(errs, collection) {
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
            })
        })
    });

module.exports = router;