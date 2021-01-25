const express = require('express');

const { checkToken, checkPrivileges } = require('../middlewares/auth');

const app = express();

const { Question } = require('../classes/question');

question = new Question();
// ==========================
// Get all questions
// ==========================
app.get('/', (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    Question.findAll(res, from, limit);
});

// ==========================
// Get question by Id
// ==========================
app.get('/:id_question', (req, res) => Question.findById(res, req.params.id_question));

// ==========================
// Create a question
// ==========================

app.post('/', checkToken, (req, res) =>
    Question.create(res, {
        question: req.body.question,
        user: req.user._id
    })
);

// ==========================
// Update a question
// ==========================
app.put('/:id_question', [checkToken, checkPrivileges], (req, res) =>
    Question.update(res, req.params.id_question, req.user._id, {
        question: req.body.question,
        user: req.user._id
    })
);

// ==========================
// Delete question
// ==========================
app.delete('/:question', [checkToken, checkPrivileges], (req, res) =>
    Question.delete(res, req.params.question, req.user._id)
);

module.exports = app;