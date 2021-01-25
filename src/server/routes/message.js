const express = require('express');

const { io } = require('../app');

const { checkToken, checkParticipantOnRoom } = require('../middlewares/auth');

const { Message } = require('../classes/message');
const { Room } = require('../classes/room');

const app = express();

// ==========================
// Get all messages
// ==========================
app.get('/:room', [checkToken, checkParticipantOnRoom], (req, res) => {

    const room = req.params.room;
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    Promise.all([
            Message.findAll(room, from, limit),
            Room.findById(room)
        ])
        .then(responses =>
            res.status(201).json({
                ok: true,
                data: {
                    messages: responses[0],
                    room: responses[1]
                }
            })
        )
        .catch(err => {
            res.status(err.code).json({
                msg: err.msg,
                err: err.err
            })
        })
});

// ==========================
// Get all messages whitout room
// ==========================
app.get('/whitout-room/:room', [checkToken, checkParticipantOnRoom], (req, res) => {

    const room = req.params.room;
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    Message.findAll(room, from, limit)
        .then(data => {
            res.status(200).json({
                ok: true,
                data: {
                    messages: data.messages,
                    total: data.total
                }
            })
        })
        .catch(err => {
            res.status(err.code).json({ msg: err.msg, err: err.err })
        })
});


// ==========================
// Get message by id
// ==========================
app.get('/:room/:message', [checkToken, checkParticipantOnRoom], (req, res) => {

    const room = req.params.room;
    const id = req.params.message;

    Message.findById(res, room, id);
});

// ==========================
// Create a message chat simple
// ==========================
app.post('/chat', [checkToken, checkParticipantOnRoom], (req, res) => {

    Message.create({
            room: req.body.room,
            sender: req.user._id,
            message: req.body.message
        })
        .then(resp => {

            io.in(req.body.contact._id).emit('new-message', { msg: resp.data, infoUser: req.body.sender });
            res.status(201).json(resp);
        })
        .catch(err => {
            console.log(err);
            res.status(err.code).json({
                msg: err.msg,
                err: err.err
            })
        })
});

// ==========================
// Create a message
// ==========================
app.post('/', [checkToken, checkParticipantOnRoom], (req, res) =>
    Message.create({
        room: req.body.room,
        sender: req.user._id,
        message: req.body.message
    })
    .then(resp => {
        if (req.body.participants) {
            req.body.participants.forEach(participant => {
                console.log(participant);
                console.log(participant._id);
                if (participant._id !== req.user._id) {
                    io.in(participant._id).emit('new-message', resp);
                }
            });

        }
        res.status(201).json(resp);
    })
    .catch(err => {

        res.status(err.code).json({
            msg: err.msg,
            err: err.err
        })
    })
);

// ==========================
// Delete message
// ==========================
app.delete('/:room/:message', [checkToken, checkParticipantOnRoom], (req, res) =>

    Message.delete(req.params.room, req.user._id, req.params.message)
    .then(resp => {
        io.in(req.body.room).emit('delete-message', resp);
        res.status(200).json(resp);
    })
    .catch(err => {
        res.status(err.code).json({
            msg: err.msg,
            err: err.err
        })
    })
);


module.exports = app;