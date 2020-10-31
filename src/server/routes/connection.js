const express = require('express');

const mdAuth = require('../middlewares/auth');

const app = express();

const Connection = require('../models/connection');

// ==========================
// Get all connections
// ==========================
app.get('/', mdAuth.checkToken, (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    Connection.find({})
        .skip(from)
        .limit(limit)
        .exec((err, connections) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error charging connections',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                connections
            });
        });
});


// ==========================
// Create a connection
// ==========================

app.post('/', mdAuth.checkToken, (req, res) => {

    const body = req.body;
    registerConnection(body.user, req)
        .then(msg => {
            return res.status(201).json({
                ok: true,
                msg
            });
        })
        .catch(err => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error at save connection!!'
                });
            }
        });
});


// ==========================
// Delete connections
// ==========================

app.delete('/:id', mdAuth.checkToken, (req, res) => {

    const id = req.params.id;
    Connection.deleteMany({ user: id }, (err, status) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error at delete connections!!',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            status
        });

    });

});




const registerConnection = async(user, req) => {
    const ip_add = req.ip;
    const { 'user-agent': user_agent } = req.headers;
    const hostname = req.hostname;

    let conn = new Connection({
        user: user,
        user_agent: user_agent,
        ip_add: ip_add,
        hostname: hostname
    });

    conn.save((err, connectionSaved) => {

        if (err) {
            throw new Error('Error at create connection!!')
        } else {
            return connectionSaved;
        }

    });
}

module.exports = {
    app,
    registerConnection
};