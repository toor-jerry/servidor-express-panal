// Requires
require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const cors = require('cors');
const cajaSanitizer = require('express-caja-sanitizer');


// Initialization vars
const app = express();
const server = http.createServer(app);

// Cors
app.use(cors());
app.disable('x-powered-by');
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", '*');
    res.header('X-Frame-Options', 'ALLOWALL');
    res.header("Access-Control-Allow-Methods", 'DELETE', 'PUT', 'GET', 'POST', 'OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin', 'X-Requested-With', 'X-API-KEY', 'Content-Type', 'Accept', 'Authorization', 'Access-Control-Allow-Request-Method');
    res.header('content-type: application/json; charset=utf-8');
    next();
});

//Temp
const morgan = require('morgan');
app.use(morgan('dev'));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.json());

// Satinitizer
app.use(cajaSanitizer());

// Static files
app.use(express.static(path.resolve(__dirname, '../public')));

// io
module.exports.io = socketIO(server, {
    cors: {
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling']
});
require('./sockets/socket');

// Routes
app.use(require('./routes/index'));


// Database connection
require('./DataBase/connection');


// Listen petitions
server.listen(process.env.PORT, (err) => {
    if (err) throw new Error(err);

    console.log(`Server on port ${process.env.PORT}: \x1b[36monline\x1b[0m`);
});