var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('error/INVALID_ARGUMENT', { title: 'INVALID_ARGUMENT' });
});

router.get('/', function(req, res, next) {
    res.render('error/MISSING_ARGUMENT', { title: 'MISSING_ARGUMENT' });
});

router.get('/', function(req, res, next) {
    res.render('error/UNKNOWN_ERROR', { title: 'UNKNOWN_ERROR' });
});

module.exports = router;
