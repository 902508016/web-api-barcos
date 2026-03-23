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

// Routes ================================================
var marinheirosRoute = require('./routes/marinheirosRoute');
app.use('/api/marinheiros', marinheirosRoute);

// 404
app.get(/.*/, (req, res) => {
    res.status(404).send('Endpoint not found.');
});

// Server ================================================
var port = 8080;
app.listen(port);
console.log('\nUsing port ' + port);


module.exports = app;