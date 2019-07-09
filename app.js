//............................................................//
//Loading required packages

const express = require('express');
const app = express(); //Object app of class express.

const mysql = require('mysql');

// We are using morgan to get complete log of GET/POST or any other request
const morgan = require('morgan');

const bodyParser = require('body-parser')

//to refactor code into different files
const router = require('./routes/load.js')

//middleware to parse and upload files to diskstorage
const multer = require('multer')

//..............................................................//

// Using different packages

app.use(router)


//Serving a static file
app.use(express.static('./public'))

app.use(bodyParser.urlencoded({extended: false}))

//..............................................................//

// Establishing a connection pool with mysql database.

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'lamma_123G',
    database: 'batchmates'
})


//function to establish a connection with mysql database
function getConnection() {
    return pool
}
//................................................................//


//Creating a batchmate : POST
app.post('/batchmate_add', (req, res) => {
    console.log("Trying to add a new batchmate...")
    console.log("First name: " + req.body.create_first_name)
    console.log("Last Name: " + req.body.create_last_name)
    const id1 = req.body.create_id
    const firstName1 = req.body.create_first_name
    const lastName1 = req.body.create_last_name

    const queryString = "INSERT INTO names (id, firstName, secondName) VALUES (?, ?, ?)"
    getConnection().query(queryString, [id1, firstName1, lastName1], (err, results, fields) => {
        if (err) {
            console.log("Failed to add a new batchmate: " + err)
            res.sendStatus(500)
            return
        }
        console.log("Inserted a new user with id: ", id1);
        res.end()
    })
    //res.end()
})

//.................................................................//
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

// create an endpoint users and write some json in the response.
app.get("/users", (req, res) => {
    var user1 = {firstName: "Gaurav", lastName: "Kumar"}
    const user2 = {firstName: "Cristiano", lastName: "Ronaldo"}
    const user3 = {firstName: "Lionel", lastName: "Messi"}
    const user4 = {firstName: "Eden", lastName: "Hazard"}
    res.json([user1, user2, user3, user4]);
    //res.send("Nodemon auto updates when I save this file");
});

//..................................................................//
// localhost:3003
app.listen(3003, () => {
    console.log("Server is up and listening on 3003....");
});

// Nodemon is just a daemon service for nodejs node + daemon = nodemon