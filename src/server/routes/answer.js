const express = require('express');

const { checkToken } = require('../middlewares/auth');
const { Answer } = require('../classes/answer');


const app = express();

// ==========================
// Get all answers
// ==========================
app.get('/', (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    Answer.findAll(res, from, limit);
});

// ==========================
// Get all answers question
// ==========================
app.get('/question/:id', (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    const question = req.params.id;
    Answer.findByQuestion(res, question, from, limit);
});

// ==========================
// Get answer by Id
// ==========================
app.get('/:id', (req, res) => Answer.findById(res, req.params.id));

// ==========================
// Create a answer
// ==========================

app.post('/', checkToken, (req, res) =>
    Answer.create(res, {
        question: req.body.question,
        answer: req.body.answer,
        user: req.user._id
    })
);

// ==========================
// Update a answer
// ==========================
app.put('/:id_answer', checkToken, (req, res) =>
    Answer.update(res, req.params.id_answer, req.user._id, {
        question: req.body.question,
        answer: req.body.answer,
        user: req.user._id
    })
);

// ==========================
// Delete answer
// ==========================
app.delete('/:id_answer', checkToken, (req, res) =>
    Answer.delete(res, req.params.id_answer, req.user._id)
);

module.exports = app;