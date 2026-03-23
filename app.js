// Express ===============================================
var express = require('express');
var app = express();

// Parser ================================================
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded( {extended: true }) );
app.use(bodyParser.json());

// Middleware ============================================
var mWare=require('./middleware');
app.use(mWare);

// Server ================================================
var port = 8080;
app.listen(port);
console.log('\nUsing port ' + port);


module.exports = app;