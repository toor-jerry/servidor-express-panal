const express = require('express');

const app = express();


const appRoutes = require('./app');
const userRoutes = require('./user');
const loginRoutes = require('./login');
const chatRoutes = require('./chat');
const connectionRoutes = require('./connection').app;
const employmentRoutes = require('./employment');
const postulationRoutes = require('./postulation');
const settingRoutes = require('./setting');
const fqaRoutes = require('./fqa');
const searchRoutes = require('./search');
const uploadRoutes = require('./upload');
const imagesRoutes = require('./images');


// Routes
app.use('/API/user', userRoutes);
app.use('/API/login', loginRoutes);
app.use('/API/chat', chatRoutes);
app.use('/API/connection', connectionRoutes);
app.use('/API/employment', employmentRoutes);
app.use('/API/search', searchRoutes);
app.use('/API/postulation', postulationRoutes);
app.use('/API/setting', settingRoutes);
app.use('/API/fqa', fqaRoutes);
app.use('/API/upload', uploadRoutes);
app.use('/API/img', imagesRoutes);


module.exports = app;