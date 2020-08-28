'use strict';

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const router = express.Router();

// URI
var mongodb = require('../../../config/mongoURI');
var mongodbURI = mongodb.URI;

// '/' is based on /api/feedback
router.route('/:db/:col/:key-:value')
  .get((req, res) => {
    const db_name = req.params.db;
    const col_name = req.params.col;
    const key = req.params.key;
    const value = req.params.value;

    const atlas = mongodbURI + "/" + db_name
      + '?retryWrites=true&w=majority'
    const client = new MongoClient(atlas, { useNewUrlParser: true });

    client.connect(e => {
      const db = client.db(db_name);
      const col = db.collection(col_name);

      // need to add collection doesn't exist safeguard

      var query = {};
      query[key] = value;

      var key_array = [];

      col.find({}).toArray(function (err, items) {
        // getting all the keys from each entry
        items.forEach(function (item) {
          for (var k in item) key_array.push(k)
        });

        var value_array = [];

        if (key_array.includes(key)) {
          items.forEach(function (item) {
            value_array.push(item[key])
          })

          if (value_array.includes(value)) {
            col.findOne(query, (err, entry) => {
              if (err) {
                res.status(400).json(err);
                client.close();
              } else {
                res.json(entry);
                client.close();
              }
            })
          } else {
            res.json({ message: "Value not found" });
            client.close();
          }
        } else {
          res.json({ message: "Key not found" });
          client.close();
        };
      });
    })
  });

module.exports = router;