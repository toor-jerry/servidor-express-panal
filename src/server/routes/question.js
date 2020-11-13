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
    question.findAll(res, from, limit);
});

// ==========================
// Get question by Id
// ==========================
app.get('/:id_question', (req, res) => question.findById(res, req.params.id_question));

// ==========================
// Create a question
// ==========================

app.post('/', checkToken, (req, res) =>
    question.create(res, {
        question: req.body.question,
        user: req.user._id
    })
);

// ==========================
// Update a question
// ==========================
app.put('/:id_question', [checkToken, checkPrivileges], (req, res) =>
    question.update(res, req.params.id_question, req.user._id, {
        question: body.question,
        user: req.user._id
    })
);

// ==========================
// Delete question
// ==========================
app.delete('/:id', [checkToken, checkPrivileges], (req, res) =>
    question.delete(res, req.params.id, req.user._id)
);

module.exports = app;