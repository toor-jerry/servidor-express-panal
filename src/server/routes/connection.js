const express = require('express');

const { checkToken, checkPrivileges } = require('../middlewares/auth');

const app = express();

const { Connection } = require('../classes/connection');


// ==========================
// Get all connections by user
// ==========================
app.get('/', [checkToken, checkPrivileges], (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    const id = req.query.id || req.user._id;

    Connection.findAll(res, id, from, limit);

});


// ==========================
// Create a connection
// ==========================

app.post('/', [checkToken, checkPrivileges], (req, res) => {

    const user = req.query.id || req.user._id;
    const { 'user-agent': user_agent } = req.headers;

    Connection.create(res, {
        user,
        user_agent,
        ip_add: req.ip,
        hostname: req.hostname
    });
});


// ==========================
// Delete connections
// ==========================
app.delete('/', [checkToken, checkPrivileges], (req, res) => {

    const user = req.query.id || req.user._id;
    Connection.delete(res, user);

});

module.exports = app;