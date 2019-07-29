
// Copyright (C) Siemens AG 2018. All Rights Reserved. Confidential

//--------------------------------------------------------------------------- 
// This module is used to connect to the module database.
//
//#####################################################

// Author:  PD AE-I , Lavish Thomas Date: 15.01.2018  Vers.: 1.0

var sqlite3 = require('sqlite3');
var path = require('path');

var db = new sqlite3.Database(path.join(__dirname, 'db.db'), (err) => {
// var db = new sqlite3.Database("C:\\Users\\Z003XD9H\\hart.db", (err) => {
    if (err)
        console.log("auth DB connection Failed", err.message);
    else
        console.log("auth(cryto) Connected to database");
});

module.exports = db;
