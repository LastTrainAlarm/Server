var express = require('express');
var router = express.Router();

router.use('/', require('./search.js'));
module.exports = router;
