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
router.route('/:db/collections')
  .get((req, res) => {
    const db_name = req.params.db;

    const atlas = mongodbURI + "/" + db_name
      + '?retryWrites=true&w=majority';
    const client = new MongoClient(atlas, { useNewUrlParser: true });

    client.connect(e => {
      const db = client.db(db_name);
      db.listCollections().toArray(function (err, items) {
        var col_names = [];
        items.forEach(function (item) {
          col_names.push(item["name"]);
        });
        if (err) {
          res.status(400).json(err);
        } else {
          res.json(col_names);
        };
      });
    })
  });

module.exports = router;