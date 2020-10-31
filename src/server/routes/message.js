const express = require('express');

const mdAuth = require('../middlewares/auth');

const app = express();

const Message = require('../models/message');

// ==========================
// Get all messages
// ==========================
app.get('/:id_conversation', mdAuth.checkToken, (req, res) => {

    const id_conversation = req.params.id_conversation;
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    Contact.find({ id_conversation: id_conversation })
        .skip(from)
        .limit(limit)
        .exec((err, messages) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error charging messages',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                messages
            });
        });
});


// ==========================
// Create a message
// ==========================

app.post('/', mdAuth.checkToken, (req, res) => {

    const body = req.body;

    let message = new Message({
        id_conversation: body.id_conversation,
        sender: body.sender,
        message: body.message
    });

    conn.save((err, messageSaved) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error create msg',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            message: messageSaved
        });
    });
});


// ==========================
// Delete message
// ==========================

app.delete('/:id', mdAuth.checkToken, (req, res) => {

    const id = req.params.id;

    Message.deleteOne(id, (err, status) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error at delete message!!',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            status
        });

    });

});


module.exports = app;