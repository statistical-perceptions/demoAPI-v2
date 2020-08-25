'use strict';

const express = require('express');
// const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const router = express.Router();

// establishing connection
var mongodb = require('../../../config/mongoURI');
var mongodbURI = mongodb.URI;
// const conn = mongoose.createConnection(mongodbURI);

// use this route to drop collections (deployed experiments)
// '/' is based on /api/feedback
router.route('/:db')
  .delete((req, res) => {
    const db_name = req.params.db;
    const studyName = req.body.studyName;

    const atlas = mongodbURI + "/" + db_name
      + '?retryWrites=true&w=majority'
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
          const colls = col_names.filter(name => name.includes("-"));
          const studyCols = colls.filter(name => 
            name.split("-")[0] == studyName)
          studyCols.forEach(name => db.dropCollection(name));
          res.json({ deletedCols: studyCols });
        };
      });
    })
  });

module.exports = router;