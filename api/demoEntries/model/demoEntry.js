// following code should be executed in strict mode
'use strict';

const mongoose = require('mongoose');
var Collection = require('./changeCol');
// use Schema
const Schema = mongoose.Schema;

const demoEntrySchema = new Schema({
    userID: { type: String, required: true},
    sliderVal: { type: String, required: true},
    q1: { type: String, required: false},
    q2: { type: String, required: false},
    q3: { type: String, required: false}},
    { collection : "entries"});

// use Entry to reference our model in other files.
module.exports = mongoose.model('Entry', demoEntrySchema);