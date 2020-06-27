const express = require('express');
const bodyParser = require('body-parser'); // with req.body
const cors = require('cors'); // front end needs this
const mongoose = require('mongoose');
const uriUtil = require('mongodb-uri');

// establishing connection
var mongodb = require('./api/demoEntries/model/mongoURI');
var mongodbURI = mongodb.URI;
// free sandbox version doesn't automatically provide mongooseURI, so format it
const mongooseURI = uriUtil.formatMongoose(mongodbURI);
const dbOptions = {};

const app = express();
app.use(bodyParser.json());
app.use(cors());

const hostname = 'localhost';
const dev_port = 3000;

var ENV = 'prod';

mongoose.connect(mongooseURI, dbOptions, (err) => {
    if (err) {
        console.log(err);
    };

    var server;

    if (ENV == 'prod') {
        var server = app.listen(process.env.PORT, function() {
            var port = server.address().port;
            console.log("App now running on port", port);
        });
    } else {
        var server = app.listen(dev_port, function() {
            // var port = server.address().port;
            console.log(`Server is running at http://${hostname}:${dev_port}`);
        });
    };
});

const conn = mongoose.createConnection(mongodbURI);

app.get("/", (req, res) => {
    res.send("Use /api/feedback/collection_name/some_userID");
});

app.use('/api/feedback', require('./api/demoEntries/routes/getCol'));
app.use('/api/feedback', require('./api/demoEntries/routes/getColEntry'));
app.use('/api/feedback', require('./api/demoEntries/routes/deleteColEntry'));
app.use('/api/feedback', require('./api/demoEntries/routes/postColEntry'));
app.use('/api/feedback', require('./api/demoEntries/routes/putColEntry'));
app.use('/api', require('./api/demoEntries/routes/cols'));