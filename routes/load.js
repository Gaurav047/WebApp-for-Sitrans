//Multiple files upload
const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const passport = require('passport')
const url = require('url')
const querystring = require('querystring')

const LocalStrategy = require('passport-local').Strategy

const router = express.Router()

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname); //Renaming the uploaded file
    }
});
var upload = multer({ storage : storage }).array('file',2);

router.get('/upload', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

router.post('/api/v1/fileserver', function(req, res){
    upload(req, res, function(err) {
        console.log(req.body);
        console.log(req.files);
        if (err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

//define a route to download a file and parse the url.
router.get('/api/v1/fileserver',(req, res) => {
    var file; //the name of file to be downloaded
    
    var manufacturer_id = req.param('manufacturer_id'); // 0 -65536
    var deviceType = req.param('deviceType'); // 0 -255
    var devicerevision = req.param('devicerevision'); // 0 -255
    var protocol = req.param('protocol'); // HART, PROFIBUS, PROFINET, MODBUS
    var fileType = req.param('fileType');
    
    if(protocol === undefined) {
        protocol = 'HART';
    }
    if(fileType === undefined) {
        fileType = 'zip';
    }

    file = manufacturer_id + "_" + deviceType + "_" + devicerevision + "_" + protocol + "." + fileType;

    console.log(file);
    console.log("\n");

    // TODO: Error code handling
    
    // storing the file path in fileLocation.
    var fileLocation = path.join('./uploads',file);
    console.log(fileLocation);
    
    res.download(fileLocation, file);
});

//define a route to download a file.
//router.get('/api/v1/fileserver/:file(*)',(req, res) => {
//    var file = req.params.file;  
//    var fileLocation = path.join('./uploads',file);
//    console.log(fileLocation);
//    res.download(fileLocation, file);
//});



module.exports = router

// Admin Authentication

//define a User Authentication function for a authentication based login endpoint

passport.use(new LocalStrategy(
    function(username, password, done) {
        username.findOne ({ username: username }, function(err,user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.'});
            }

            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect Password.'});
            }

            return done(null, user);
        });
    }
));

// Route for authentication

router.get('/login', function(req, res) {
    res.sendFile(__dirname + "/auth.html");
});

router.post('/login', passport.authenticate('local',
                    { successRedirect: '/upload',
                     failureRedirect: '/login',
                      failureFlash: true })
            );
