const express = require('express');

const { checkToken } = require('../middlewares/auth');
const { Answer } = require('../classes/answer');


const app = express();

const answer = new Answer();

// ==========================
// Get all answers
// ==========================
app.get('/', (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    answer.findAll(res, from, limit);
});

// ==========================
// Get all answers question
// ==========================
app.get('/question/:id', (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    const question = req.params.id;
    answer.findByQuestion(res, question, from, limit);
});

// ==========================
// Get answer by Id
// ==========================
app.get('/:id', (req, res) => {

    const id = req.params.id;
    answer.findById(res, id);
});

// ==========================
// Create a answer
// ==========================

app.post('/', checkToken, (req, res) => {

    let body = req.body;
    answer.create(res, {
        question: body.question,
        answer: body.answer,
        user: req.user._id
    });

});

// ==========================
// Update a answer
// ==========================
app.put('/:id', checkToken, (req, res) => {

    const id_answer = req.params.id;
    const user = req.user._id;
    let body = req.body;
    answer.update(res, id_answer, user, {
        question: body.question,
        answer: body.answer,
        user: req.user._id
    });

});

// ==========================
// Delete answer
// ==========================
app.delete('/:id', checkToken, (req, res) => {

    const id_answer = req.params.id;
    const user = req.user._id;
    answer.delete(res, id_answer, user);

});

module.exports = app;