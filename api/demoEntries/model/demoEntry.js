// following code should be executed in strict mode
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const demoEntrySchema = new Schema({
    userID: { type: String, required: false},
    sliderVal: { type: String, required: false},
    q1: { type: String, required: false},
    q2: { type: String, required: false},
    q3: { type: String, required: false},
    username: { type: String, required: false},
    password: { type: String, required: false}});

// use Entry to reference our model in other files.
module.exports = mongoose.model('Entry', demoEntrySchema);