// Copyright (C) Siemens AG 2018. All Rights Reserved. Confidential
//---------------------------------------------------------------------------
// This service consists of all the device related API's
//#####################################################

// Author:  PD AE-I , Lavish Thomas Date: 13.12.2018  Vers.: 1.0
const port = 5005
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var auth = require('./Controllers/auth.js');
var user = require('./Controllers/userController.js');

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
app.use(bodyParser.json());
app.use('/auth', auth.router);
app.use('/user', user.router);
app.listen(port, () => {
    console.log(`UM listening on port ${port}!`);
    auth.secretTokenKey = [...Array(15)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    auth.deleteAllTokenDetails().then(res => {
        console.log('Delete User Token Details', res);
    })
});

module.exports = app;

