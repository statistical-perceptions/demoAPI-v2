'use strict';

const express = require('express');
// const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const router = express.Router();

// establishing connection
var mongodb = require('../../../config/mongoURI');
var mongodbURI = mongodb.URI;
// const conn = mongoose.createConnection(mongodbURI);

// '/' is based on /api/feedback
router.route('/:db/:col/:key-:value')
  .delete((req, res) => {
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
            col.findOneAndDelete(query, (err, entry) => {
              if (err) {
                res.status(400).json(err);
              } else {
                res.json({
                  message: `Entry with identifier ` +
                    `{${key}: ${value}} deleted.`
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
    })
  });

module.exports = router;

// const col_name = req.params.col;
// const userID = req.params.userID;   
// const coll = conn.collection(col_name);
// var ID_array = [];
// coll.find({}).toArray(function(err, items) {
//     items.forEach(function(item) {
//         ID_array.push(item["userID"]);
//     });
//     coll.findOneAndDelete({ userID }, (err, entry) => {
//         if (err) {
//             res.status(400).json(err);
//         };
//         if (ID_array.includes(userID)) {
//             res.json({ message: `Entry with userID: ${userID} deleted.`});
//         } else {
//             res.json({ message: `Entry with userID (${userID}) not found in collection (${col_name})`});
//         };
//     });
// });