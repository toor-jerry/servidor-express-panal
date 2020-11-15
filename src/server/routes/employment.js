const express = require('express');

const { Employment } = require('../classes/employment');

const { checkToken, checkEnterprise_Role } = require('../middlewares/auth');

const app = express();
const employment = new Employment();


// ==========================
// Get all employments no-auth
// ==========================
app.get('/no-auth', (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    let params_populate = 'name';

    Employment.findAll(res, params_populate, from, limit);

});


// ==========================
// Get all employments
// ==========================
app.get('/', checkToken, (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    let params_populate = 'name email role domicile description photography';

    Employment.findAll(res, params_populate, from, limit);

});

// ==========================
// Get employment by id
// ==========================
app.get('/:id', checkToken, (req, res) => Employment.findById(res, req.params.id));


// ==========================
// Update employment
// ==========================
app.put('/:id', [checkToken, checkEnterprise_Role], (req, res) => Employment.update(res, req.params.id, req.user._id, req.body));

// ==========================
// Create a employment 
// ==========================
app.post('/', [checkToken, checkEnterprise_Role], (req, res) => {

    let body = req.body;
    body.enterprise = req.user._id;
    Employment.create(res, body);
});

// ==========================
// Delete a employment by Id 
// ==========================
app.delete('/:employment', [checkToken, checkEnterprise_Role], (req, res) => Employment.delete(res, req.params.employment, req.user._id));

module.exports = app;