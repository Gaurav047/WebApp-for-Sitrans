//...............................................................//
// It will contain all of the Batchmate related routes
const express = require('express')
const router = express.Router()
const mysql = require('mysql')

//...............................................................//

// Endpoint messages : GET
router.get('/messages', (req, res) => {
    console.log("show me all the messages...")
    res.end()
})
//...............................................................//

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

//.................................................................//

//Endpoint = batchmates : GET
router.get('/batchmates', (req, res) => {
    //console.log("Fetching data from id:" + req.params.id)

    const connection = getConnection()

    //const userId = req.params.id
    const queryString = "SELECT * FROM names"
    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query from batchmates:" + err)
            //req.sendStatus(500)
            return
        }
        console.log("I think we fetched batchmates successfully")
        res.json(rows)
    })
})

//..................................................................//

// endpoint for GET on mysql server.
router.get('/batchmates/:id', (req, res) => {
    console.log("Fetching data from id:" + req.params.id)

    const connection = getConnection()

    const userId = req.params.id
    const queryString = "SELECT * FROM names WHERE id = ?"
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query from batchmates:" + err)
            //req.sendStatus(500)
            return
        }

        console.log("I think we fetched batchmates successfully")
        res.json(rows)
    })
})

//...................................................................//

module.exports = router

