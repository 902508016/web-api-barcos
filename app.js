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

//Enable CORS for all routes
const cors = require('cors');
app.use(cors());

// Routes ================================================
// ================ MARINHEIROS ENDPOINTS ================
var marinheirosRoute = require('./routes/marinheirosRoute');
app.use('/api/marinheiros', marinheirosRoute);
// ================ BARCOS ENDPOINTS ====================
var barcosRoute = require('./routes/barcosRoute');
app.use('/api/barcos', barcosRoute);
// ================ RESERVAS ENDPOINTS ====================
var reservasRoute = require('./routes/reservasRoute');
app.use('/api/reservas', reservasRoute);

// 404
app.get(/.*/, (req, res) => {
    res.status(404).send('Endpoint not found.');
});

// Server ================================================
var port = 8080;
app.listen(port);
console.log('\nUsing port ' + port);


module.exports = app;