// const http = require('http');
const express = require('express');
const bodyParser  = require('body-parser'); // with req.body
const cors = require('cors'); // front end needs this
const mongoose = require('mongoose');
const uriUtil = require('mongodb-uri');
const hostname = 'localhost'; // connect to mongodb database later
const port = 3000;

const mongodbURI = 'mongodb://user:p123456@ds263248.mlab.com:63248/heroku_5qkz777p'
// free sandbox version doesn't automatically provide mongooseURI, so format it
const mongooseURI = uriUtil.formatMongoose(mongodbURI);
const dbOptions = {};

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api/feedback', require('./api/demoEntries/routes/postEntry'));

app.listen(port, hostname, () => {
    // connect to mongoose
    mongoose.connect(mongooseURI, dbOptions, (err) => {
        if (err) {
            console.log(err);
        }
        console.log(`Server is running on http://${hostname}:${port}`);
    });
});

