// following code should be executed in strict mode
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authEntrySchema = new Schema({
    username: { type: String, required: true},
    password: { type: String, required: true},
    date: { type: Date, default: Date.now }});

// use Entry to reference our model in other files.
module.exports = mongoose.model('User', authEntrySchema);