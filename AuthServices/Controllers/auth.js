// Copyright (C) Siemens AG 2018. All Rights Reserved. Confidential

//--------------------------------------------------------------------------- 
// File for authentication
//---------------------------------------------------------------------------
//
// The back end serices are divided into the following modules
//
//#####################################################
//
// 1) Bcrypting and hashing password 
// 2) Registering user with Jwt Token 
// 3) Login user and verifying the user
// 4) function to verify the Jwt Token
// 5) username Validation Function
//#####################################################

// Author:  PD AE-I , Amritha Baliga B Date: 13.09.2018  Vers.: 1.0
// Modified:  Amritha Baliga B Date: 07.01.2018 ,Introducing UserId
// Modified:  Amritha Baliga B Date: 31.01.2019 ,changing to different port
// Modified:  Amritha Baliga B Date: 31.01.2019 , Changing Bycrpt algorithm to crypto;
// Modified:  Amritha Baliga B Date: 4.06.2019 , Allowing only max 3 users login at a time;
// Modified:  Amritha Baliga B Date: 6.06.2019 , Expiring the tokens on Service restart
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var express = require('express');
var router = express.Router();
var db = require('../DB/dbconnector.js');
var crypto = require('crypto');
var constants = require('./constants.js')
var atob = require('atob');
var asyncLoop = require('node-async-loop');
var moment = require('moment');
var secretTokenKey;
var authObj = {
    secretTokenKey,
    deleteAllTokenDetails,
    router,
    // Function to check if authorization header has come with is with valid Jwt token 
    checkIfAuthenticated: (req, res, next) => {
        if (!req.header('Authorization')) {
            return res.status(401).send({
                message: 'Unauthorized , Missing Auth header'
            });
        }
        else {
            // extracting the token
            var token = req.header('Authorization').split(' ')[1];
            // verifying the token
            var verified = jwt.verify(token, authObj.secretTokenKey, function (err, decodedToken) {
                if (err) {
                    return res.status(401).send({
                        message: 'Unauthorized , Wrong token'
                    });
                }
                else {
                    if (!decodedToken) {
                        return res.status(401).send({
                            message: 'Unauthorized , Invalid Header'
                        });
                    }
                    else {
                        req.userId = decodedToken.userId;
                        next();
                    }

                }
            });
        }

    }
}
// hashing password
getCryptedPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
    return [salt, hash].join('$');
    next();
}
// Checking the password hash
function verifyHash(password, original) {
    const originalHash = original.split('$')[1];
    const salt = original.split('$')[0];
    const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
    return hash === originalHash
}


// Function to Register the user in to the application
router.post('/registeruser', (req, res) => {
    var user = {
        userId: req.body.userId,
        username: req.body.username,
        password: getCryptedPassword(constants.DEFAULT_PASSWORD),
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        role: req.body.role,
        scope: req.body.scope
    };
    // insert one row into the users table
    // isNewUser is passed as 1 by default to know he is a new user,not when logged in to application once
    db.run(`INSERT INTO usersdata(userId,userName,emailId,PhoneNumber,userRole,userScope,userPassword,isNewUser) VALUES(?,?,?,?,?,?,?,?)`,
        [user.userId, user.username, user.email, user.phonenumber, user.role, user.scope, user.password, 1],
        function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            return res.status(200).send({
                message: 'Unauthorized , Missing Auth header'
            });
        });
});

// // Function to authenticate user to login the application
router.post('/userlogin', (req, res) => {
    checkIfUserIdExits(req.body.userId, db).then((result) => {
        if (result) {
            var decodedPassword = atob(req.body.password);
            // verify the user given password with the stored password;
            if (verifyHash(decodedPassword, result.password) === true) {
                // Generating JWT token
                var jwtToken = jwt.sign({
                    userId: result.userId
                }, authObj.secretTokenKey, {
                        expiresIn: constants.EXPIRATION_TIME
                    });

                var loginSuccessObj = {
                    auth: true,
                    username: result.userName,
                    token: jwtToken,
                    accessRole: result.scope,
                    userId: result.userId,
                    isnewUser: result.isNewUser,
                    apiCode: null
                }
                var loginFailureObj = {
                    auth: false,
                    token: null,
                    code: null,
                    accessRole: null,
                    apiCode: null
                }
                ValidateUser(result.userId, result.userName, jwtToken).then(result => {
                    switch (result.code) {
                        case 2001:
                        case 2003: loginSuccessObj.apiCode = result;
                            res.status(200).send(loginSuccessObj);
                            break;
                        case 2002:
                        case 2004:
                        case 2005:
                        case 2000: loginFailureObj.apiCode = result;
                            res.status(500).send(loginFailureObj);
                            break;
                        default:
                            break;
                    }
                });
            } else { // if password doesnt match
                console.log('pasword Not matched')
                // invalid password
                res.status(500).send({
                    auth: false,
                    token: null,
                    accessRole: null,
                    apiCode: { code: 1002, message: 'pasword Not matched' }
                });
                return;
            }
        } else {
            // username invalid
            console.log('userId invalid');
            res.status(500).send({
                auth: false,
                token: null,
                accessRole: null,
                apiCode: { code: 1000, message: 'userId invalid' }
            });
            return;
        }
    });
});
function ValidateUser(userId, userName, currentToken) {
    return new Promise((resolve, reject) => {
        getloggedInUserTokenDetails().then((userTokenDetails) => {
            if (userTokenDetails !== undefined && userTokenDetails.length > 0) {
                discardExpiredTokens(userTokenDetails).then((res) => {
                    return res;
                }).then(res => {
                    //   if token is not expired then then check if the user is already logged in 
                    //   if he is already logged in then send him appropriate message.
                    return isUserAlreadyLoggedIn(userId).then(isUserLAreadyLoggedIn => {
                        return isUserLAreadyLoggedIn;
                    }).catch(err => {
                        console.log('Error in isUserAlreadyLoggedIn()', err.message);
                        throw err;
                    })
                }).then(isUserLAreadyLoggedIn => {
                    getLoggedInUserCount().then(usercount => {
                        console.log('isUserLAreadyLoggedIn', isUserLAreadyLoggedIn)
                        if (isUserLAreadyLoggedIn === true) {
                            resolve({ code: 2002, message: 'User is already logged in' });
                        } else if (usercount >= 0 && usercount < 3) {
                            InsertUserTokenRecord(userId, userName, currentToken);
                            resolve({ code: 2003, message: 'User is logged in' });
                        } else if (usercount === 3) {
                            resolve({ code: 2004, message: 'Maximum of only 3 users allowed.' });
                        } else {
                            resolve({ code: 2000, message: 'Issue UNKNOWN' });
                        }
                    }).catch(err => {
                        console.log('Error from getLoggedInUserCount', err.message);
                        throw err;
                    })
                }).catch(err => {
                    resolve({ code: 2000, message: err.message });
                });

            } else {
                // if table length is zero
                InsertUserTokenRecord(userId, userName, currentToken);
                resolve({ code: 2001, message: 'User Logged in as a First user' });
            }
        }).catch(err => {
            console.log('error from validateUser', err.message);
            resolve({ code: 2005, message: 'Error from getloggedInUserTokenDetails' });
        });
    })
}
function discardExpiredTokens(userTokenDetails) {
    return new Promise((resolve, reject) => {
        asyncLoop(userTokenDetails, function (tokenData, next) {
            const isTokenExpired = checkIfTokenIsExpired(tokenData.token);
            console.log('isTokenExpired', isTokenExpired);
            if (isTokenExpired === true) {
                discardExpiredTokenRecord(tokenData.userId).then(() => {
                    next();
                });
            } else {
                next();
            }
        }, function () {
            resolve({ status: 'Expired token Deleted' });
        });
    });
}
function getloggedInUserTokenDetails() {
    let sql = `SELECT id,userId,userName,token FROM usersTokenDetails;`
    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) {
                console.log('getloggedInUserTokenDetails', err.message);
                reject(err);
            }
            resolve(rows);
        });
    })
}
function checkIfTokenIsExpired(token) {
    // verifying the token
    var result = true;
    jwt.verify(token, authObj.secretTokenKey, function (err, decodedToken) {
        if (err) {
            result = true;
        } else {
            result = false;
        }
    });
    return result;
}
function discardExpiredTokenRecord(userId) {
    return new Promise((resolve, reject) => {
        let sql = `DELETE  FROM usersTokenDetails WHERE userId  = ?;`
        db.get(sql, [userId], (err, rows) => {
            if (err) {
                console.log('discardExpiredTokenRecord', err.message);
                // unsuccessful delete
                resolve(-1);
            }
            // successful delete
            resolve(1);
        });
    })
}
function InsertUserTokenRecord(userId, userName, currentToken) {
    var currentTimeStamp = moment().format('YYYY-MM-DD HH:mm:ss');
    db.run(`INSERT INTO usersTokenDetails(userId,userName,token,loginTimeStamp) VALUES(?,?,?,?)`,
        [userId, userName, currentToken, currentTimeStamp],
        function (err) {
            if (err) {
                console.log(err.message);
                return -1;
            }
            // get the last insert id
            return this.lastID;
        });
}
function isUserAlreadyLoggedIn(userId) {
    return new Promise((resolve, reject) => {
        var result = true;
        let sql = `SELECT COUNT(id) AS usercount FROM usersTokenDetails WHERE userId =?;`
        db.get(sql, [userId], (err, row) => {
            if (err) {
                console.log('isUserAlreadyLoggedIn', err.message);
                result = false;
            } else if (row.usercount > 0) {
                result = true;
            } else {
                result = false;
            }
            resolve(result);
        });
    });
}
function getLoggedInUserCount() {
    return new Promise((resolve, reject) => {
        var result = 0;
        let sql = `SELECT  COUNT(*) AS usercount FROM usersTokenDetails;`
        db.get(sql, (err, row) => {
            if (err) {
                console.log(' Error from getLoggedInUserCount', err.message);
                result = -1;
            }
            result = row.usercount;
            resolve(result);
        });
    });
}
function deleteAllTokenDetails() {
    return new Promise((resolve, reject) => {
        let sql = `DELETE  FROM usersTokenDetails;`
        db.run(sql, (err, rows) => {
            if (err) {
                console.log('DeleteAllTokenDetails', err.message);
                // unsuccessful delete
                resolve(-1);
            }
            // successful delete
            resolve(1);
        });
    })
}
//Function to check if the username exists or not in the usersData table
checkIfUserIdExits = (userId, db) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT  userId,userName,userPassword as password,username,userscope as scope,isNewUser FROM usersdata WHERE userId  = ?;`
        // first row only
        db.get(sql, [userId], (err, row) => {
            if (err) {
                return console.error('checkIfUserIdExits', err.message);
            }
            resolve(row);
        });
    });
};

// funvtion to check if the current password is correct or not
router.post('/isUserPasswordValid', (req, res) => {
    var decodedPassword = atob(req.body.password);
    var userId = req.body.userId, currentPassword = decodedPassword.trim();
    checkIfUserIdExits(userId, db).then((result) => {
        if (verifyHash(currentPassword, result.password) === true) {
            res.send(true); // password valid 
        } else {
            res.send(false); // password invalid 
        }
    });
});
// check if the user is logged in for the first time 
router.get('/isFirstTimeLogin', (req, res) => {
    var userId = req.query.userId;
    let sql = `SELECT isNewUser from UsersData WHERE UserId= ?`;
    // first row only
    db.get(sql, [userId], (err, row) => {
        if (err) {
            return console.error('isFirstTimeLogin', err.message);
        }
        res.send(row)
    });
});
router.post('/updateUserPassword', (req, res) => {
    var decodedPassword = atob(req.body.password);
    if (decodedPassword !== undefined && decodedPassword !== null && decodedPassword !== '') {
        const userData = { userId: req.body.userId, password: decodedPassword }
        changePassword(userData, res)
    } else {
        res.send(false);
    }
});
// Function to update the self details like phone number and emailId
router.post('/updateUserProfile', (req, res) => {
    let sql = 'UPDATE UsersData SET emailId=?,PhoneNumber=?,username=? WHERE userId=?';
    var inputData = [req.body.emailId, req.body.phoneNumber, req.body.userName, req.body.userId]
    db.run(sql, inputData, (err, rows) => {
        console.log('updated');
    });
    // if password is changed update that as well
    if (req.body.confirmPassword !== undefined && req.body.confirmPassword !== null && req.body.confirmPassword !== '') {
        const userData = { userId: req.body.userId, password: atob(req.body.confirmPassword) }
        changePassword(userData, res)
    } else {
        res.send(false);
    }

});
// Function to update the user password on password reset
changePassword = (userData, res) => {
    var hash = getCryptedPassword(userData.password);
    let sql = 'UPDATE UsersData SET userPassword=?,isNewUser=? WHERE userId=?';
    var inputData = [hash, 0, userData.userId];
    db.run(sql, inputData, (err, rows) => {
        if (err) {
            console.log(err);
        }
        console.log('password updated successfully')
    });
    res.send(true);
}
router.post('/logoutUser', (req, res) => {
    let sql = 'DELETE FROM usersTokenDetails WHERE userId =?';
    db.run(sql, [req.body.userId], (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).send({ message: err.message });
        }
    });
    res.send({ message: 'successful' });
});
router.post('/isUserExists', (req, res) => {
    let sql = 'SELECT Id FROM UsersData WHERE userId =?';
    db.get(sql, [req.body.userId], (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).send({ status: err.message });
        }
        console.log('rows', rows);
    });
    res.send({ status: '0' });
});
router.get('/checkIfTokenIsValid', (req, res) => {
    if (!req.header('Authorization')) {
        return res.status(401).send({
            message: 'Unauthorized , Missing Auth header'
        });
    }
    else {
        // extracting the token
        var token = req.header('Authorization').split(' ')[1];
        // verifying the token
        var verified = jwt.verify(token, authObj.secretTokenKey, function (err, decodedToken) {
            if (err) {
                console.log('Unauthorized Wrong token');
                return res.status(401).send({
                    message: 'Unauthorized , Wrong token'
                });
            }
            else {
                if (!decodedToken) {
                    console.log('Unauthorized , Invalid Header');
                    return res.status(401).send({
                        message: 'Unauthorized , Invalid Header'
                    });
                }
                else {
                    req.userId = decodedToken.userId;
                    console.log('token Valid');
                    return res.status(200).send({
                        message: 'token Valid'
                    });
                }

            }
        });
    }
});
// exporting the module to the main server.js
module.exports = authObj;