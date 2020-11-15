const express = require('express');

const { checkToken, checkParticipantOnRoom } = require('../middlewares/auth');


const { Employment } = require('../classes/employment');
const { User } = require('../classes/user');
const { Room } = require('../classes/room');
const { Question } = require('../classes/question');
const { Answer } = require('../classes/answer');
const { Message } = require('../classes/message');

const { response200, response500, response400 } = require('../utils/utils');

const app = express();

// ==========================
// Search employments - no-auth
// ==========================
app.get('/no-auth/:search', (req, res) => {

    const search = req.params.search;
    const regex = new RegExp(search, 'i');

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    Employment.searchEmployments(regex, from, limit)
        .then(employments => response200(res, employments))
        .catch(err => response500(res, err.toString()));
});

// ==========================
// Search messages
// ==========================
app.get('/messages/:room/:search', [checkToken, checkParticipantOnRoom], (req, res) => {

    const room = req.params.room;
    const search = req.params.search;
    const regex = new RegExp(search, 'i');

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    Message.searchMessages(room, regex, from, limit)
        .then(messages => response200(res, messages))
        .catch(err => response500(res, err.toString()));
});

// ==========================
// Search by colection
// ==========================
app.get('/specific/:colection/:search', checkToken, (req, res) => {

    const search = req.params.search;
    const regex = new RegExp(search, 'i');
    const colection = req.params.colection;

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    switch (colection) {
        case 'employments':
            promise = Employment.searchEmployments(regex, from, limit);
            break;
        case 'users':
            promise = User.searchUsers(regex, from, limit);
            break;
        case 'room':
            promise = Room.searchRoom(regex, from, limit);
            break;
        case 'questions':
            promise = Question.searchQuestion(regex, from, limit)
            break;
        case 'answers':
            promise = Answer.searchAnswer(regex, from, limit)
            break;
        default:
            return response400(res, 'Invalid types: employments, users, questions, answers, and room');
    }

    promise.then(data =>
        res.status(200).json({
            ok: true,
            [colection]: data
        })
    ).catch(err => response400(res, undefined, err.toString()));

});


// ==========================
// Get all search
// ==========================
app.get('/all/:search', checkToken, (req, res) => {

    const search = req.params.search;
    const regex = new RegExp(search, 'i');

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    Promise.all([
            Employment.searchEmployments(regex, from, limit),
            User.searchUsers(regex, from, limit),
            Room.searchRoom(regex, from, limit),
            Question.searchQuestion(regex, from, limit),
            Answer.searchAnswer(regex, from, limit)
        ])
        .then(responses => {

            res.status(200).json({
                ok: true,
                employments: responses[0],
                users: responses[1],
                room: responses[2],
                quesions: responses[3],
                answers: responses[4],
            });

        })
        .catch(err => response400(res, undefined, err.toString()));
});


module.exports = app;