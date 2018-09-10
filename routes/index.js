const express = require('express');
const router = express.Router();
const path = require('path');
const async = require('async');
const tool = require('../utility/tool');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {title: "helloworld"});
});

module.exports = router;
