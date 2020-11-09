const express = require('express');

const { checkToken } = require('../middlewares/auth');

const app = express();

const { Question } = require('../classes/question');

question = new Question();
// ==========================
// Get all questions
// ==========================
app.get('/', (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    question.findAll(res, from, limit);
});

// ==========================
// Get question by Id
// ==========================
app.get('/:id', (req, res) => {

    const id = req.params.id;
    question.findById(res, id);
});

// ==========================
// Create a question
// ==========================

app.post('/', checkToken, (req, res) => {

    let body = req.body;
    question.create(res, {
        question: body.question,
        user: req.user._id
    });

});

// ==========================
// Update a question
// ==========================
app.put('/:id', checkToken, (req, res) => {

    const id_question = req.params.id;
    const user = req.user._id;
    let body = req.body;
    question.update(res, id_question, user, {
        question: body.question,
        user: req.user._id
    });

});

// ==========================
// Delete question
// ==========================
app.delete('/:id', checkToken, (req, res) => {

    const id_question = req.params.id;
    const user = req.user._id;
    question.delete(res, id_question, user);

});

module.exports = app;