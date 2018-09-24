var express = require('express');
var router = express.Router();

router.use('/', require('./search.js'));
router.use('/here', require('./here.js'));

module.exports = router;