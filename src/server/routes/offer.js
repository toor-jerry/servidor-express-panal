const express = require('express');

const { Offer } = require('../classes/offer');
const { checkToken, checkAdmin_Role, checkUser_Platino_Role, checkEnterprise_Role } = require('../middlewares/auth');

const app = express();

// ==========================
// Get all offers
// ==========================
app.get('/', [checkToken, checkAdmin_Role], (req, res) => {
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    Offer.findAll(res, from, limit)
});

// ==========================
// Get all offers by USER_ROLE
// ==========================
app.get('/by-USER_ROLE', checkToken, (req, res) => {
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    Offer.findAllBy_USER_ROLE(res, from, limit)
});

// ==========================
// Get all offers by USER_PLATINO_ROLE
// ==========================
app.get('/by-USER_PLATINO_ROLE', [checkToken, checkUser_Platino_Role], (req, res) => {
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    Offer.findAllBy_USER_PLATINO_ROLE(res, from, limit)
});

// ==========================
// Get all offers by ENTERPRISE_ROLE
// ==========================
app.get('/by-ENTERPRISE_ROLE', [checkToken, checkEnterprise_Role], (req, res) => {
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    Offer.findAllBy_ENTERPRISE_ROLE(res, from, limit)
});

// ==========================
// Get offer by id
// ==========================
app.get('/:offer', checkToken, (req, res) => Offer.findById(res, req.params.offer));

// ==========================
// Create a offer
// ==========================
app.post('/', [checkToken, checkAdmin_Role], (req, res) => Offer.create(res, req.body));

// ==========================
// Delete a offer by Id
// ==========================
app.delete('/:offer', [checkToken, checkAdmin_Role], (req, res) =>
    Offer.delete(res, req.params.offer)
);

module.exports = app;