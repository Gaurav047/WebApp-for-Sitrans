// Copyright (C) Siemens AG 2018. All Rights Reserved. Confidential

//--------------------------------------------------------------------------- 
// File for authentication
//---------------------------------------------------------------------------
//
// The back end serices are divided into the following modules
//
//#####################################################
//
// 1) Fetch all the existing user details
// 2) Update the userdatails
// 3) Update the self details (only phone number and email)
// 4) Deleting the users
// 5) check if the user exists w.r.t username
//#####################################################

// Author:  PD AE-I , Amritha Baliga B Date: 31.01.2019  Vers.: 1.0
// Modified:  Amritha Baliga B Date: 31.01.2019 Vers.: 2.0 ,changing to different port

var express = require('express');
var router = express.Router();
var auth = require('./auth.js');
var db = require('../DB/dbconnector.js');
var asyncLoop = require('node-async-loop');
var userObj = {
    router
}
// Function to get the userdetails from the usersData table
router.get('/usersdetail', auth.checkIfAuthenticated, (req, res) => {
    let sql = `SELECT DISTINCT userId,username,emailId,userRole as role ,userScope as scope ,phonenumber FROM usersdata
           ORDER BY userId`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows)
    });
});

// Function to delete users from the database
router.post('/deleteUsers', auth.checkIfAuthenticated, (req, res) => {
    var result = req.body;
    asyncLoop(result, function (item, next) {
        let sql1 = "DELETE FROM usersdata WHERE userId = ?";
        let sql2 = "DELETE FROM usersTokenDetails WHERE userId = ?";
        db.run(sql1, item.userId, (err) => {
            if (err) {
                next(err);
                return console.error('err from deleteUsers from usersdata', err.message);
            }
            console.log('executed1');
            db.run(sql2,item.userId, (err) => {
                if (err) {
                    next(err);
                    return console.error('err from deleteUsers from usersTokenDetails', err.message);
                }
                next();
                console.log('executed2');
            });

        })
    }, function (err) {
        if (err) {
            console.error('Error: ' + err.message);
            res.status.send({ status: err.message });
        }
        res.send({ status: 'Deleted Successfully' });
    });
});

// Function to get the user data w.r.t username
router.get('/getUserByUserId', (req, res) => {
    var userId = req.query.userId;
    let sql = `SELECT userId,username  FROM usersdata where userId = ?`;
    // first row only
    db.get(sql, [userId], (err, row) => {
        if (err) {
            return console.error('getUserByUserId', err.message);
        }
        res.send(row)
    });
});

// Function to update user details from grid
router.post('/updateUsersDetail', auth.checkIfAuthenticated, (req, res) => {
    console.log('updateUsersDetail', req.body)
    var listToUpdate = req.body;
    listToUpdate.forEach(element => {
        let sql = 'UPDATE UsersData SET userRole=?,userScope=? WHERE userId=?';
        var inputData = [element.role, element.scope, element.userId]
        db.run(sql, inputData, (err, rows) => {
            console.log('updated all given row');
        });
    });
    res.send(req.body);
});

router.get('/getUserProfileByUserId', (req, res) => {
    let sql = `SELECT userId,userName,emailId,userRole as role ,userScope as scope ,phonenumber,emailId FROM usersdata
    WHERE userId =?`;
    db.all(sql, [req.query.userId], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows)
    });
});
// exporting the userObj to make it available in server.js
module.exports = userObj;