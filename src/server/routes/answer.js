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
app.get('/:id', (req, res) => answer.findById(res, req.params.id));

// ==========================
// Create a answer
// ==========================

app.post('/', checkToken, (req, res) =>
    answer.create(res, {
        question: req.body.question,
        answer: req.body.answer,
        user: req.user._id
    })
);

// ==========================
// Update a answer
// ==========================
app.put('/:id_answer', checkToken, (req, res) =>
    answer.update(res, req.params.id_answer, req.user._id, {
        question: req.body.question,
        answer: req.body.answer,
        user: req.user._id
    })
);

// ==========================
// Delete answer
// ==========================
app.delete('/:id_answer', checkToken, (req, res) =>
    answer.delete(res, req.params.id_answer, req.user._id)
);

module.exports = app;