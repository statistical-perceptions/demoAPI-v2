// this request is for putting demographics link to an experiment config info 
// on the config study page

'use strict';

const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;

// establishing connection
var mongodb = require('../../../config/mongoURI');
var mongodbURI = mongodb.URI;

// '/' is based on /api/feedback
// key value pair identifies the specific document
// user/info/studyName-test/experiments/exptName-expt1
router.route('/:db/:col/:key-:value/:index/:key2-:value2/:infoType')
  .put((req, res) => {
    const db_name = req.params.db;
    const col_name = req.params.col;
    const key = req.params.key;
    const value = req.params.value;
    const key2 = req.params.key2;
    const value2 = req.params.value2;
    const infoType = req.params.infoType;

    // Connecting to Atlas
    const atlas = mongodbURI + "/" + db_name
      + '?retryWrites=true&w=majority';
    const client = new MongoClient(atlas, { useNewUrlParser: true });

    client.connect(err => {
      const db = client.db(db_name);
      const col = db.collection(col_name);

      db.listCollections().toArray(function (err, items) {
        var col_names = [];
        items.forEach(function (item) {
          col_names.push(item["name"]);
        })
        if (col_names.includes(col_name)) {
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

              const index = req.params.index;

              if (value_array.includes(value)) {
                const setKey = index + ".$[elem]." + infoType;
                const filterKey = "elem." + key2;
                col.findOneAndUpdate(
                  {},
                  { $set: { [setKey] : req.body[infoType] } },
                  {
                    multi: true,
                    arrayFilters: [{ [filterKey]: { $eq: value2 } }]
                  },
                  (err, info) => {
                    if (err) {
                      // res.status(400).json(err);
                      res.json({ message: "Something went wrong" })
                    } else {
                      res.json({
                        message: `Entry with identifier ` +
                          `{${key}: ${value}, ${key2}: ${value2}} updated with new ${infoType}.`
                      })
                    }
                  })
              } else {
                res.json({ message: "Value not found" })
              }
            } else (
              res.json({ message: "Key not found" })
            );
          });
        } else {
          res.json({ message: "Collection not found." });
        };
      })
    })
  });

module.exports = router;