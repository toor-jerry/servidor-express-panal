const express = require('express');
const _ = require('underscore');

const { checkToken, checkAdmin_Role, checkParticipantOnRoom, checkPrivilegesOnRoom } = require('../middlewares/auth');

const { Room } = require('../classes/room');

const app = express();

// ==========================
// Get all rooms
// ==========================
app.get('/', [checkToken, checkAdmin_Role], (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    Room.findAll(res, from, limit);

});

// ==========================
// Get by id
// ==========================
app.get('/:room', [checkToken, checkParticipantOnRoom], (req, res) => Room.findById(res, req.params.room));

// ==========================
// Update room 
// ==========================
app.put('/:room', [checkToken, checkParticipantOnRoom], (req, res) => Room.update(res, req.params.room, req.body));


// ==========================
// Create a room
// ==========================
app.post('/', checkToken, (req, res) => {

    body = req.body;

    let admins = [req.user._id];
    let participants;


    if (body.admins) {
        body.admins = body.admins.replace(/\s/g, "");
        admins = _.union(admins, body.admins.split(','));
    }

    if (body.participants) {
        body.participants = body.participants.replace(/\s/g, "");
        participants = _.union(participants, body.participants.split(','));
    }

    Room.create(res, {
        name: body.name,
        theme: body.theme,
        private: body.private,
        participants,
        admins
    });
});


// ==========================
// Create a room simple
// ==========================
app.post('/chat', checkToken, (req, res) =>
    Room.create(res, {
        name: req.body.name,
        theme: req.body.theme,
        private: true,
        participants: [req.user._id, req.body.contact]
    })
);

// ==========================
// Delete a room
// ==========================
app.delete('/:room', [checkToken, checkPrivilegesOnRoom], (req, res) => Room.delete(res, req.params.room));

// ==========================
// Delete a chat
// ==========================
app.delete('/chat/:room', [checkToken, checkParticipantOnRoom], (req, res) => Room.delete(res, req.params.room));


// ==========================
// Delete a chat
// ==========================
app.delete('/chat/:room', [checkToken, checkParticipantOnRoom], (req, res) => {
    Room.delete(res, req.params.room);
});

// ==========================
// Add participant at room
// ==========================
app.put('/add/participant/:room', [checkToken, checkPrivilegesOnRoom], (req, res) => {
    let body = req.body;
    let participants = req.query.participant;
    if (body.participants) {
        body.participants = body.participants.replace(/\s/g, "");
        participants = _.union(participants, body.participants.split(','));
    }
    Room.updateRoomAddParticipant(res, req.params.room, participants);
});

// ==========================
// Add admin at room
// ==========================
app.put('/add/admin/:room', [checkToken, checkPrivilegesOnRoom], (req, res) => {
    let body = req.body;
    let admins = req.query.admin;
    if (body.admins) {
        body.admins = body.admins.replace(/\s/g, "");
        admins = _.union(admins, body.admins.split(','));
    }
    Room.updateRoomAddAdmin(res, req.params.room, admins);
});


// ==========================
// Remove participant at room
// ==========================
app.delete('/remove/participant/:room', [checkToken, checkPrivilegesOnRoom], (req, res) => {
    let body = req.body;
    let data;

    if (body.participants) {
        body.participants = body.participants.replace(/\s/g, "");
        data = _.union(data, body.participants.split(','));
        console.log(data);
    }

    if (body.admins) {
        body.admins = body.admins.replace(/\s/g, "");
        data = _.union(data, body.admins.split(','));
    }
    data = _.union(data, [req.query.participant]);

    Room.updateRoomDeleteParticipant(res, req.params.room, data);
});


module.exports = app;