var express = require('express');
var router = express.Router();

router.use('/auth', require('./auth/index.js'));
router.use('/search', require('./search/index.js'));
router.use('/fav', require('./fav/favorite.js'));

module.exports = router;
