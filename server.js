const express = require('express');
const bodyParser = require('body-parser'); // with req.body
const cors = require('cors'); // front end needs this
const mongoose = require('mongoose');
const uriUtil = require('mongodb-uri');
const passport = require('passport');

// establishing connection
var mongodb = require('./config/mongoURI');
var mongodbURI = mongodb.URI;
// free sandbox version doesn't automatically provide mongooseURI, so format it
const mongooseURI = uriUtil.formatMongoose(mongodbURI);
const dbOptions = {};

const app = express();
app.use(bodyParser.json());
app.use(cors());

const hostname = 'localhost';
const dev_port = 5000;

// Change ENV to 'dev' for debugging and prod for deployment
var ENV = 'prod';

mongoose.connect(mongooseURI, dbOptions, (err) => {
  if (err) {
    console.log(err);
  };

  var server;

  if (ENV == 'prod') {
    var server = app.listen(process.env.PORT, function () {
      var port = server.address().port;
      console.log("App now running on port", port);
    });
  } else {
    var server = app.listen(dev_port, function () {
      // var port = server.address().port;
      console.log(`Server is running at http://${hostname}:${dev_port}`);
    });
  };
});

app.use(passport.initialize());
require('./config/passport')(passport);

app.get("/", (req, res) => {
  res.send("Use /api/feedback/collection_name/some_userID");
});

/**
 * Run ./api/actions/items/normalCurve.py and send back normalCurve config data
 * Refer to https://stackoverflow.com/questions/23450534/how-to-call-a-python-function-from-node-js
 */
app.post("/normalCurve", (req, res) => {
  var argArr = req.body.argArr;
  argArr.unshift('./api/actions/items/normalCurve.py');
  // console.log(argArr);
  
  const { spawn } = require('child_process');
  const pythonProcess = spawn('python', argArr);

  pythonProcess.stdout.on('data', function(data){
    // console.log(data);
    res.send(data);
  });
});

app.use('/api/feedback', require('./api/actions/routes/deleteCols'));
app.use('/api/feedback', require('./api/actions/routes/getCol'));
app.use('/api/feedback', require('./api/actions/routes/getColEntry'));
app.use('/api/feedback', require('./api/actions/routes/deleteColEntry'));
app.use('/api/feedback', require('./api/actions/routes/postColEntry'));
app.use('/api/feedback', require('./api/actions/routes/putColEntry'));
app.use('/api/feedback', require('./api/actions/routes/putColEntryItem'));
app.use('/api/feedback', require('./api/actions/routes/putColEntryPutItem'));
app.use('/api/feedback', require('./api/actions/routes/deleteColEntryDeleteItem'));
app.use('/api', require('./api/actions/routes/cols'));
app.use('/api', require('./api/actions/routes/users'));
app.use('/api', require('./api/actions/routes/createCol'));