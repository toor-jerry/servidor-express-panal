const express = require('express');

const jwt = require('jsonwebtoken');
const mdAuth = require('../middlewares/auth');

const Employment = require('../models/employment');
const FQA = require('../models/fqa');
const User = require('../models/user');
const Chat = require('../models/chat');

const app = express();


// ==========================
// Search employments - no-auth
// ==========================

app.get('/no-auth/:search', (req, res) => {

    const search = req.params.search;
    const regex = new RegExp(search, 'i');

    searchEmployments(regex)
        .then(employments => {
            res.status(200).json({
                ok: true,
                employments
            });
        })
        .catch(err => {
            res.status(400).json({
                ok: true,
                err
            });
        });
});

// ==========================
// Search by colection
// ==========================

app.get('/specific/:colection/:search', (req, res) => {

    const search = req.params.search;
    const regex = new RegExp(search, 'i');
    const colection = req.params.colection;
    const conversation = req.query.conversation;
    console.log(conversation);
    var promise;

    switch (colection) {
        case 'employments':
            promise = searchEmployments(regex);
        case 'users':
            promise = searchUsers(regex);
            break;
        case 'chat':
            promise = searchChat(regex, conversation);
            break;
        case 'fqas':
            promise = searchFQAs(regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                message: 'Find types: employments, users, fqas and chat',
                error: { message: 'Invalid colection!' }
            });
            break;
    }

    promise.then(data => {

        res.status(200).json({
            ok: true,
            [colection]: data
        });

    }).catch(err => {

        res.status(400).json({
            ok: false,
            err
        });

    });

});


// ==========================
// Get all search
// ==========================
app.get('/all/:search', (req, res) => {

    const search = req.params.search;
    const regex = new RegExp(search, 'i');

    Promise.all([
            searchEmployments(regex),
            searchFQAs(regex),
            searchUsers(regex)
        ])
        .then(responses => {

            res.status(200).json({
                ok: true,
                Employments: responses[0],
                FQAs: responses[1],
                Users: responses[2]
            });

        })
        .catch(err => {
            res.status(400).json({
                ok: true,
                err
            });
        });
});

// ==========================
// Search Employments
// ==========================

const searchEmployments = async(regex) => {

    return new Promise((resolve, reject) => {

        Employment.find({}, 'name salary vacancy_numbers enterprise')
            .populate('enterprise', 'name')
            .or([{
                    'name': regex
                },
                {
                    'description': regex
                }
            ])
            .exec((err, employments) => {

                if (err) {
                    reject('Error at find employment', err);
                } else {
                    resolve(employments);
                }
            });
    });
};

// ==========================
// Search Users
// ==========================

const searchUsers = (regex) => {

    return new Promise((resolve, reject) => {

        User.find({}, 'name last_name user')
            .and({
                'role': {
                    $ne: 'ADMIN_ROLE'
                }
            })
            .or([{
                'name': regex
            }, {
                'last_name': regex
            }, {
                'user': regex
            }, {
                'email': regex
            }])
            .exec((err, users) => {

                if (err) {
                    reject('Error at find user', err);
                } else {
                    resolve(users);
                }
            });
    });
};

// ==========================
// Search FQAs
// ==========================

const searchFQAs = (regex) => {

    return new Promise((resolve, reject) => {

        FQA.find({}, 'question answer')
            .or([{
                'question': regex
            }, {
                'answer': regex
            }])
            .exec((err, fqas) => {

                if (err) {
                    reject('Error at find fqa', err);
                } else {
                    resolve(fqas);
                }
            });
    });
};

// ==========================
// Search chat
// ==========================

const searchChat = (regex, conversation) => {

    return new Promise((resolve, reject) => {

        if (!conversation) {
            reject('Bad request, conversation null');
        }

        Chat.find({ id_conversation: conversation, message: regex })
            .and({ status: { $ne: 'DELETED' } })
            .exec((err, messages) => {

                if (err) {
                    reject('Error at find chat', err);
                } else {
                    resolve(messages);
                }
            });
    });
};


module.exports = app;