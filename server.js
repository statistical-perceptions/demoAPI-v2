const express = require('express');
const bodyParser  = require('body-parser'); // with req.body
const cors = require('cors'); // front end needs this
const mongoose = require('mongoose');
const uriUtil = require('mongodb-uri');

const mongodbURI = 'mongodb://user:p123456@ds263248.mlab.com:63248/heroku_5qkz777p'
// free sandbox version doesn't automatically provide mongooseURI, so format it
const mongooseURI = uriUtil.formatMongoose(mongodbURI);
const dbOptions = {};

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(mongooseURI, dbOptions, (err) => {
    if (err) {
        console.log(err);
    };
    // console.log(`Server is running on http://${hostname}:${port}`);
    var server = app.listen(process.env.PORT, function () {
        var port = server.address().port;
        console.log("App now running on port", port);
      });
});

app.get("/", (req, res) => {
    res.send("Use /api/feedback to GET or POST.\n" +  
    "Use /api/feedback/:userID (example: /api/feedback/test03) to "+ 
    "GET specific userID, PUT or DELTE.");
    return res.redirect('/api/feedback');
});

app.use('/api/feedback', require('./api/demoEntries/routes/postEntry'));
app.use('/api/feedback', require('./api/demoEntries/routes/getEntry'));
app.use('/api/feedback', require('./api/demoEntries/routes/getSpecificEntry'));
app.use('/api/feedback', require('./api/demoEntries/routes/deleteEntry'));
app.use('/api/feedback', require('./api/demoEntries/routes/putEntry'));

