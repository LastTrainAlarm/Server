var express = require('express');
var router = express.Router();

router.use('/', require('./favorite.js'));

module.exports = router;