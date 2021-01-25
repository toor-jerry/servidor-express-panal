const express = require('express');

const app = express();

const menuRoutes = require('./menu');
const userRoutes = require('./user');
const loginRoutes = require('./login');
const roomRoutes = require('./room');
const messageRoutes = require('./message');
const connectionRoutes = require('./connection');
const employmentRoutes = require('./employment');
const postulationRoutes = require('./postulation');
const themeRoutes = require('./theme');
const questionRoutes = require('./question');
const answerRoutes = require('./answer');
const searchRoutes = require('./search');
const uploadRoutes = require('./upload');
const filesRoutes = require('./files');
const downloadRoutes = require('./download');
const utilsRoutes = require('./utils');
const pdfRoutes = require('./pdf');
const offerRoutes = require('./offer');

// Routes
app.use('/API/menu', menuRoutes);
app.use('/API/user', userRoutes);
app.use('/API/login', loginRoutes);
app.use('/API/room', roomRoutes);
app.use('/API/message', messageRoutes);
app.use('/API/connection', connectionRoutes);
app.use('/API/employment', employmentRoutes);
app.use('/API/search', searchRoutes);
app.use('/API/postulation', postulationRoutes);
app.use('/API/theme', themeRoutes);
app.use('/API/question', questionRoutes);
app.use('/API/answer', answerRoutes);
app.use('/API/upload', uploadRoutes);
app.use('/API/file', filesRoutes);
app.use('/API/download', downloadRoutes);
app.use('/API/utils', utilsRoutes);
app.use('/API/pdf', pdfRoutes);
app.use('/API/offer', offerRoutes);

module.exports = app;