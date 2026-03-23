// Middleware to use for all requests ====================

var express = require('express');
var router = express.Router();
router.use(function (req, res, next) {
console.log(req.method + ' : ' + req.url + '\n' + JSON.stringify(req.body));
next();
});
module.exports = router;