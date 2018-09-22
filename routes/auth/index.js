var express = require('express');
var router = express.Router();

router.use('/', require('./signup.js'));
// router.use('/test', require('./test.js'));

module.exports = router;
