const express = require('express');
const _ = require('underscore');

const { io } = require('../app');

const { checkToken, checkAdmin_Role, checkParticipantOnRoom, checkPrivilegesOnRoom } = require('../middlewares/auth');

const { Room } = require('../classes/room');
const { Chat } = require('../classes/chat');

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
// Get all foros
// ==========================
app.get('/foroums', checkToken, (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    Room.findAllForos(from, limit)
        .then(resp => res.status(200).json({ data: resp }))
        .catch(err => res.status(500).json(err))
});

// ==========================
// Get all my foros
// ==========================
app.get('/my-foroums', checkToken, (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    Room.findAllMyForos(req.user._id, from, limit)
        .then(resp => res.status(200).json({ data: resp }))
        .catch(err => res.status(500).json(err))
});

// ==========================
// Count all foros and I
// ==========================
app.get('/count-foroums', checkToken, (req, res) =>
    Promise.all([
        Room.countMyForos(req.user._id),
        Room.countAllForos()
    ])
    .then(responses =>
        res.status(200)
        .json({
            data: {
                myForos: responses[0],
                allForos: responses[1]
            }
        })
    )
    .catch(err => res.status(500).json(err))
);
// ==========================
// Get and Count all foros 
// ==========================
app.get('/get-and-count-foroums', checkToken, (req, res) => {
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    Promise.all([
            Room.countMyForos(req.user._id),
            Room.findAllForos(from, limit)
        ])
        .then(responses =>
            res.status(200)
            .json({
                data: {
                    count: {
                        myForos: responses[0],
                    },
                    foros: responses[1],
                }
            })
        )
        .catch(err => res.status(500).json(err))
});


// ==========================
// Get by id
// ==========================
app.get('/:room', [checkToken, checkParticipantOnRoom], (req, res) => {
    Room.findById(req.params.room)
        .then(resp => res.status(200).json(resp))
        .catch(err =>
            res.status(err.code).json({
                msg: err.msg,
                err: err.err
            })
        )
});

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
        type: body.type,
        participants,
        admins
    });
});


// ==========================
// Create a room simple
// ==========================
app.post('/chat', checkToken, (req, res) =>
    Chat.createChat({
        name: req.body.name,
        theme: req.body.theme,
        private: true,
        participants: [req.user._id, req.body.contact],
        user: req.user._id,
        contact: req.body.contact
    })
    .then(resp => {
        io.in(req.user._id).emit('create-chat', resp);
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
// Delete a room
// ==========================
app.delete('/:room', [checkToken, checkPrivilegesOnRoom], (req, res) => Room.delete(res, req.params.room));

// ==========================
// Delete a chat
// ==========================
app.delete('/chat/:room', [checkToken, checkParticipantOnRoom], (req, res) =>
    Chat.deleteChat(req.params.room, req.user._id)
    .then(resp => {
        io.in(req.user._id).emit('delete-chat', resp);
        res.status(200).json(resp);
    })
    .catch(err => { res.status(err.code).json(err.err) })
);

// ==========================
// Delete a user chat
// ==========================
app.delete('/user-chat/:room', [checkToken, checkParticipantOnRoom], (req, res) =>
    Chat.deleteUserChat(req.params.room, req.user._id)
    .then(resp => {
        io.in(req.user._id).emit('delete-chat', resp);
        res.status(200).json(resp);
    })
    .catch(err => { res.status(err.code).json(err.err) })
);

// ==========================
// Search contacts on chat
// ==========================
app.get('/conversations/contacts', checkToken, (req, res) =>
    Chat.searchContactOnChats(req.user._id)
    .then(resp => {
        res.status(200).json(resp);
    })
    .catch(err => {
        console.log(err);
        res.status(err.code).json(err.err)
    })
);

// ==========================
// Search contacts on chat on id
// ==========================
app.get('/conversations/contacts-id', checkToken, (req, res) =>
    Chat.searchContactOnChatsOnlyId(req.user._id)
    .then(resp => {
        res.status(200).json(resp);
    })
    .catch(err => {
        console.log(err);
        res.status(err.code).json(err.err)
    })
);

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
// Get all request join
// ==========================
app.get('/request/all/:room', [checkToken, checkPrivilegesOnRoom], (req, res) => {
    Room.getJoinRequest(req.params.room)
        .then(resp => {
            res.status(200).json(resp);
        })
        .catch(err => {
            console.log(err);
            res.status(err.code).json(err.err)
        })
});

// ==========================
// Add request join
// ==========================
app.put('/request/join/:room', checkToken, (req, res) => {
    let body = req.body;
    let request = req.query.request;
    if (body.requests) {
        body.requests = body.requests.replace(/\s/g, "");
        request = _.union(request, body.requests.split(','));
    }
    Room.addRequest(res, req.params.room, request);
});

// ==========================
// Remove request join
// ==========================
app.delete('/request/remove/:room/:requestId', [checkToken, checkPrivilegesOnRoom], (req, res) => {
    Room.deleteRequest(res, req.params.room, req.params.requestId);
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
    data = _.union(data, [req.query.admin]);

    Room.updateRoomDeleteParticipant(res, req.params.room, data);
});


module.exports = app;