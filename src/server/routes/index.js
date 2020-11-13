const express = require('express');

const app = express();

const userRoutes = require('./user');
const loginRoutes = require('./login');
const roomRoutes = require('./room');
const messageRoutes = require('./message');
const connectionRoutes = require('./connection');
const employmentRoutes = require('./employment');
const postulationRoutes = require('./postulation');
const settingRoutes = require('./setting');
const questionRoutes = require('./question');
const answerRoutes = require('./answer');
const searchRoutes = require('./search');
const uploadRoutes = require('./upload');
const imagesRoutes = require('./images');


// Routes
app.use('/API/user', userRoutes);
app.use('/API/login', loginRoutes);
app.use('/API/room', roomRoutes);
app.use('/API/message', messageRoutes);
app.use('/API/connection', connectionRoutes);
app.use('/API/employment', employmentRoutes);
app.use('/API/search', searchRoutes);
app.use('/API/postulation', postulationRoutes);
app.use('/API/setting', settingRoutes);
app.use('/API/question', questionRoutes);
app.use('/API/answer', answerRoutes);
app.use('/API/upload', uploadRoutes);
app.use('/API/img', imagesRoutes);


module.exports = app;