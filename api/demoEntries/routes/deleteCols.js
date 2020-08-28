'use strict';

const express = require('express');
// const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const router = express.Router();

// establishing connection
var mongodb = require('../../../config/mongoURI');
var mongodbURI = mongodb.URI;
// const conn = mongoose.createConnection(mongodbURI);

// use this route to drop all collections of a study (deployed experiments)
// '/' is based on /api/feedback
// option can be either one or all
router.route('/:db/:option')
  .delete((req, res) => {
    const db_name = req.params.db;

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
          const option = req.params.option;
          switch (option) {
            case "one":
              const colName = req.body.colName;
              if (col_names.includes(colName)) {
                db.dropCollection(colName);
                res.json({ deletedCol: colName });
                client.close();
              } else {
                res.json({ message: "colName not found in database." });
                client.close();
              }
              break;
            case "all":
              const studyName = req.body.studyName;
              const colls = col_names.filter(name => name.includes("-"));
              const studyCols = colls.filter(name => 
                name.split("-")[0] == studyName)
              studyCols.forEach(name => db.dropCollection(name));
              res.json({ deletedCols: studyCols });
              client.close();
              break;
            default:
              res.json({ message: "Option can either be one or all." });
              client.close();
          };
        };
      });
    })
  });

module.exports = router;