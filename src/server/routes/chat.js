const express = require('express');
const uuid = require('uuid');

const { checkToken } = require('../middlewares/auth');

const app = express();

const Chat = require('../models/chat');

// ==========================
// Get all chats
// ==========================
app.get('/', checkToken, (req, res) => {

    Chat.find({}, (err, chat) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error charging chat',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            chat
        });

    });

});

// ==========================
// Update chat 
// ==========================

app.put('/:id', checkToken, (req, res) => {

    const id = req.params.id;
    const body = req.body;

    Chat.findById(id, (err, chat) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error find chat',
                errors: err
            });
        }

        if (!chat) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Chat no exists!!',
                    errors: { message: 'No exists a Chat whith id' }
                });
            }
        }

        chat.id_conversation = body.id_conversation;
        chat.sender = body.sender;
        chat.receiver = body.receiver;
        chat.message = body.message;
        chat.status = body.status;


        chat.save((err, chatUpdated) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error at update chat',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                chat: chatUpdated
            });

        });

    });

});


// ==========================
// Create a chat
// ==========================

app.post('/', checkToken, (req, res) => {

    let chat = new Chat({
        id_conversation: uuid.v1(),
        participants: req.user._id
    });

    chat.save((err, chatUpdated) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error at create chat',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            chat: chatUpdated
        });

    });

});

// ==========================
// Add participant at chat
// ==========================

app.put('/:id_chat/:participant', checkToken, (req, res) => {

    const id = req.params.id_chat;
    const participant = req.params.participant;

    Chat.findByIdAndUpdate(id, { $addToSet: { participants: participant } })
        .populate('participants', 'name last_name user email')
        .exec((err, participants) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error adding participant!!',
                    errors: err
                });
            }

            if (!participants) {
                return res.status(400).json({
                    ok: false,
                    message: 'Not add participant',
                    errors: { message: 'Not add participant' }
                });
            }

            res.status(200).json({
                ok: true,
                participants
            });
        });

});



// ==========================
// Remove participant at chat
// ==========================

app.delete('/:id_chat/:participant', checkToken, (req, res) => {

    const id = req.params.id_chat;
    const participant = req.params.participant;
    Chat.findByIdAndUpdate(id, { $pull: { participants: participant } })
        .populate('participants', 'name last_name user email')
        .exec((err, participants) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error delete participant!!',
                    errors: err
                });
            }

            if (!participants) {
                return res.status(400).json({
                    ok: false,
                    message: 'Not remove participant',
                    errors: { message: 'Not remove participant' }
                });
            }

            res.status(200).json({
                ok: true,
                participants
            });

        });
});
// ==========================
// Delete a chat
// ==========================

app.delete('/:id', checkToken, (req, res) => {

    const id = req.params.id;

    Chat.findByIdAndRemove(id, (err, chatDeleted) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error at delete chat',
                errors: err
            });
        }

        if (!chatDeleted) {
            return res.status(400).json({
                ok: false,
                message: 'Not deleted chat',
                errors: { message: 'Not deleted chat whitin Id' }
            });
        }

        res.status(200).json({
            ok: true,
            chat: chatDeleted
        });

    });


});

module.exports = app;