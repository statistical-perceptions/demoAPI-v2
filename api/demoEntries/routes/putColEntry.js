'use strict';

const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;

// establishing connection
var mongodb = require('../../../config/mongoURI');
var mongodbURI = mongodb.URI;

// '/' is based on /api/feedback
router.route('/:db/:col/:key-:value')
  .put((req, res) => {
    const db_name = req.params.db;
    const col_name = req.params.col;
    const key = req.params.key;
    const value = req.params.value;

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

              if (value_array.includes(value)) {
                col.findOneAndUpdate(query, { $set: req.body }, (err, entry) => {
                  if (err) {
                    res.status(400).json(err);
                    client.close();
                  } else {
                    res.json({
                      message: `Entry with identifier ` +
                        `{${key}: ${value}} updated.`
                    });
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
        } else {
          res.json({ message: "Collection not found." });
          client.close();
        };
      });
    })

    // const coll = conn.collection(col_name);
    // const userID = req.params.userID;
    // var ID_array = [];
    // coll.find({}).toArray(function(err, items) {
    //     items.forEach(function(item) {
    //         ID_array.push(item["userID"]);
    //     });
    //     // note that { userID } is simplified from { userID:userID }
    //     coll.findOneAndUpdate({ userID }, { $set: req.body }, function(err) {
    //         if (err) {
    //             res.status(400).json(err);
    //         };
    //         if (ID_array.includes(userID)) {
    //             res.json({ message: `Entry with userID (${userID}) updated.` });
    //         } else {
    //             res.json({ message: `Entry with userID (${userID}) not found in collection (${col_name})` });
    //         };
    //     });
    // });
  });

module.exports = router;