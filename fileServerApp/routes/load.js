//Multiple files upload
const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
// const passport = require('passport')
// const url = require('url')
// const querystring = require('querystring')

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
   // var flag = false;
   // var i;
    var file; //the name of file to be downloaded
    var protocols = ["HART", "PROFIBUS", "PROFINET", "MODBUS"];
    var extensions = ["json", "zip", "xml", "bin"];

    var manufacturerId = req.param('manufacturerId'); // 0 -65536
    var deviceType = req.param('deviceType'); // 0 -255
    var deviceRevision = req.param('deviceRevision'); // 0 -255
    var protocolType = req.param('protocolType'); // HART, PROFIBUS, PROFINET, MODBUS
    var fileType = req.param('fileType');

//.......................................................    
    // for (i=0; i<4; i++) {
    //     if ( fileType != extensions[i] && fileType != undefined ){
    //         flag = true;
    //         break;
    //     }
    // }

    // for (i=0; i<4; i++) {
    //     if ( protocolType != protocols[i] && protocolType != undefined ){
    //         flag = true;
    //         break;
    //     }
    // }
//........................................................
    // if (typeof(manufacturerId) != "bigint"){
    //     flag = true;
    // }
    // if (typeof(deviceType) != "bigint"){
    //     flag = true;
    // }
    // if (typeof(deviceRevision) != "bigint"){
    //     flag = true;
    // }
//.........................................................
    // if ( manufacturerId > 65536 || manufacturerId < 0 ){
    //     flag = true;
    // }
    // if ( deviceType > 255 || deviceType < 0 ){
    //     flag = true;
    // }
    // if ( deviceRevision > 255 || deviceRevision < 0 ){
    //     flag = true;
    // }
//.........................................................
    // if(protocolType === undefined) {
    //     protocolType = 'HART';
    // }
    // if(fileType === undefined) {
    //     fileType = 'zip';
    // }
//.........................................................

    file = manufacturerId + "_" + deviceType + "_" + deviceRevision + "_" + protocolType + "." + fileType;

    console.log(file);
    console.log("\n");

    // To be verified: Error code handling
    
    // storing the file path in fileLocation.
    var fileLocation = path.join('./uploads',file);
    console.log(fileLocation);
    console.log(protocolType)
    res.download(fileLocation, file, function (err) {
        if (err) {
            console.log("Error 404. File Not Found");
            res.status(404).send(err);
        }
        // else if (!flag){
        //     console.log("Enter a Valid Value.");
        //     res.status(404).send(err);
        //     //error code and description in json
        //     // invalid input for flag = true
        //    // res.redirect('/');
        // }
            res.status(200).sendFile(file,{root:__dirname});
    });
    //flag = false;
});

//.............................................................
// REST Endpoint for a list of files in the uploads folder


module.exports = router