//............................................................//
//Loading required packages

const express = require('express');
const app = express(); //Object app of class express.

//const mysql = require('mysql');

// We are using morgan to get complete log of GET/POST or any other request
const morgan = require('morgan');

const bodyParser = require('body-parser')

// Refactor code into different files
const router = require('./routes/load.js')

// Middleware to parse and upload files to diskstorage
const multer = require('multer')

const path = require('path')

const fs = require('fs')
const directoryPath = path.join(__dirname,'uploads');
var list = [];

//..............................................................//

// Using different packages

app.use(router)

// Serving a static file
app.use(express.static('./public'))

app.use(bodyParser.urlencoded({extended: false}))

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

fs.readdir(directoryPath, function(err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    console.log(files.length);
    list.push(files);
    console.log(list);
    files.forEach(function (file) {
        //DO whatever is needed to be done with the file
        console.log(file);
    })
})


// localhost:3003
app.listen(3003, () => {
    console.log("Server is up and listening on 3003....");
});

// Nodemon is just a daemon service for nodejs node + daemon = nodemon