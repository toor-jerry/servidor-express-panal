const express = require('express');

const { checkToken, checkAdmin_Role } = require('../middlewares/auth');

const { Postulation } = require('../classes/postulation');

const app = express();
const postulation = new Postulation();

// ==========================
// Get all postulation
// ==========================
app.get('/', [checkToken, checkAdmin_Role], (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    postulation.findAll(res, from, limit);

});

// ==========================
// Get postulation by id
// ==========================
app.get('/:postulation', checkToken, (req, res) => postulation.findById(res, req.params.postulation));

// ==========================
// Create a postulation
// ==========================
app.post('/', checkToken, (req, res) =>
    postulation.create(res, {
        employment: req.body.employment,
        user: req.user._id
    })
);

// ==========================
// Delete a employment by Id
// ==========================
app.delete('/:postulation', checkToken, (req, res) => postulation.delete(res, req.params.postulation, req.user._id));

module.exports = app;