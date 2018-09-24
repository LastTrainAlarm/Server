var express = require('express');
var router = express.Router();

router.use('/', require('./signup.js'));
router.use('/login', require('./login.js'));

module.exports = router;
