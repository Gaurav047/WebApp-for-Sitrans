//Multiple files upload
const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')

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

//define a route to download a file
router.get('/download/:file(*)',(req, res) => {
    var file = req.params.file;
    var fileLocation = path.join('./uploads',file);
    console.log(fileLocation);
    res.download(fileLocation, file);
});

module.exports = router