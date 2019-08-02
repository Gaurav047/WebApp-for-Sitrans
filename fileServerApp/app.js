//............................................................//
//Loading required packages

const express = require('express');
const app = express(); //Object app of class express.

// We are using morgan to get complete log of GET/POST or any other request
const morgan = require('morgan');

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))
// Refactor code into different files
const router = require('./routes/load.js')

// Middleware to parse and upload files to diskstorage
const multer = require('multer')

const path = require('path')

const fs = require('fs')

// enable CORS
var allowCrossDomain = function (req, res, next) {
    // has to be changed to specific port -- AB
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept');
    if (req.method === "OPTIONS")
        res.sendStatus(200);
    else
        next();
}
app.use(allowCrossDomain);
const directoryPath = path.join(__dirname,'/uploads');

//..............................................................//
//Some Useful Variables for the /lists endpoint 
var list = [];
var list_parsed = [];
var list_parsed2 = [];
var list_parsed3 = [];

//..............................................................//

// Using different packages

app.use('/load',router)

// Serving a static file
app.use(express.static('./public'))
//onFileChang


//..............................................................//

// combined mode will show us the full log.
// short mode will show us concise log.

app.use(morgan('combined'));

//.................................................................//

// Root endpoint

app.get("/", (req, res) => {    
    console.log("Responding to root route");
    res.send("Hello from ROOT");
});

//.................................................................//
//A GET endpoint for the list of filenames in uploads folder

fs.readdir(directoryPath, function(err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    //console.log(files.length);
    var i =1;
    files.forEach(function (file) {
        //DO whatever is needed to be done with the file
        //Parsing the FileName
        count = 0;
        list_parsed = file.split("_");
        ///console.log(list_parsed);
        list_parsed2 = file.split(".");
        list_parsed3 = list_parsed[3].split('.');
        //console.log(list_parsed3);
        //console.log(list_parsed2)
        list.push({serialNo: i, manufacturerId: list_parsed[0], deviceType: list_parsed[1], deviceRevision: list_parsed[2], protocolType: list_parsed3[0], fileType: list_parsed2[1]});
        //console.log(list)
        i=i+1;
    })
    console.log(list);
})

app.get('/api/v1/fileserver/lists', (req, res) => {
    console.log("Fetching the name of files in uploads directory.");
    res.send(list);
});
//......................................................................

// localhost:3003
app.listen(3003, () => {
    console.log("Server is up and listening on 3003....");
});

// Nodemon is just a daemon service for nodejs node + daemon = nodemon