// Requires
require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

// Initialization vars
const app = express();
const server = http.createServer(app);

//Temp
const morgan = require('morgan');
app.use(morgan('dev'));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.json());

// Static files
app.use(express.static(path.resolve(__dirname, '../public')));

// io
module.exports.io = socketIO(server);
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