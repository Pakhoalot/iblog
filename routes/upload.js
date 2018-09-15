const express = require('express');
const router = express.Router();
const multer = require('multer');
const cryptoRandomString = require('crypto-random-string');
const uploadConfig = require("../config/upload-config");
const path = require('path');

/* *************setting upload-config************** */
var storage = multer.diskStorage({
  destination: uploadConfig.destination,
  filename: function (req, file, cb) {
    //filename made of a random string and extname. 
    cb(null, cryptoRandomString(15) + path.extname(file.originalname))
  },

})

var upload = multer({
  storage: storage,
  limits: {
    fileSize: uploadConfig.fileSize,
    files: uploadConfig.files
  },
  fileFilter: (req, file, cb) => {
    let extname = path.extname(file.originalname);
    switch (extname) {
      case '.jpg':
        cb(null, true);
        break;
      case '.png':
        cb(null, true);
      case '.gif':
        cb(null, true);
      default:
        cb(null, false);
        break;
    }
  }
}).single('file');

router.post('/', (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      next(err);
    } else {
      res.json({
        "fieldname": req.file.fieldname,
        "originalname": req.file.originalname,
        "encoding": req.file.encoding,
        "mimetype": req.file.mimetype,
        "destination": req.file.destination.substr("./public".length),
        "filename": "6cb9d70684f3241.jpg",
        "path": req.file.path.substr("public".length),
      });
    }
  })
})

module.exports = router;
