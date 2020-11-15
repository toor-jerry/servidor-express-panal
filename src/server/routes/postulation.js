const express = require('express');

const { checkToken, checkAdmin_Role } = require('../middlewares/auth');

const { Postulation } = require('../classes/postulation');

const app = express();

// ==========================
// Get all postulation
// ==========================
app.get('/', [checkToken, checkAdmin_Role], (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    Postulation.findAll(res, from, limit);

});

// ==========================
// Get postulation by id
// ==========================
app.get('/:postulation', checkToken, (req, res) => Postulation.findById(res, req.params.postulation));

// ==========================
// Create a postulation
// ==========================
app.post('/', checkToken, (req, res) =>
    Postulation.create(res, {
        employment: req.body.employment,
        user: req.user._id
    })
);

// ==========================
// Delete a employment by Id
// ==========================
app.delete('/:postulation', checkToken, (req, res) => Postulation.delete(res, req.params.postulation, req.user._id));

module.exports = app;