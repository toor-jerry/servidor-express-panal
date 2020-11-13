const express = require('express');

const { checkToken, checkParticipantOnRoom } = require('../middlewares/auth');

const { Message } = require('../classes/message');

const app = express();

message = new Message();

// ==========================
// Get all messages
// ==========================
app.get('/:room', [checkToken, checkParticipantOnRoom], (req, res) => {

    const room = req.params.room;
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    message.findAll(res, room, from, limit);
});


// ==========================
// Get message by id
// ==========================
app.get('/:room/:message', [checkToken, checkParticipantOnRoom], (req, res) => {

    const room = req.params.room;
    const id = req.params.message;

    message.findById(res, room, id);
});


// ==========================
// Create a message
// ==========================
app.post('/', [checkToken, checkParticipantOnRoom], (req, res) =>
    message.create(res, {
        room: req.body.room,
        sender: req.user._id,
        message: req.body.message
    })
);


// ==========================
// Delete message
// ==========================
app.delete('/:room/:message', [checkToken, checkParticipantOnRoom], (req, res) =>
    message.delete(res, req.params.room, req.user._id, req.params.message)
);


module.exports = app;