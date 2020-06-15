// const http = require('http');
const express = require('express');
const bodyParser  = require('body-parser'); // with req.body
const cors = require('cors'); // front end needs this

const hostname = 'localhost'; // connect to mongodb database later
const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(cors());

let demoData = require('./data');

// GET
app.get('/api/feedback', (req, res) => {
    if (!demoData) {
        res.status(404).json({message : 'No demoData found'});
    }
    res.json(demoData);
})

// GET single entry
app.get('/api/feedback/:userID', (req, res) => {
    const requestID = req.params.userID;
    // filter down:
    // demoEntry is an array with 1 element
    let demoEntry = demoData.filter(demoEntry => {
        return demoEntry.userID == requestID;
    })
    // handle error
    if (!demoEntry) {
        res.status(404).json({message : 'No demoEntry found'});
    }
    res.json(demoData);
    // returning the only element in the array
    res.json(demoEntry[0])
})

// POST


app.listen(port, hostname, () => {
    console.log(`Server is running on http://${hostname}:${port}`)
});

