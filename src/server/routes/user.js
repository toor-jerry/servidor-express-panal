const express = require('express');

const { User } = require('../classes/user');
const { checkToken, checkPrivileges, checkAdmin_Role } = require('../middlewares/auth');

const app = express();

// ==========================
// Get all users
// ==========================
app.get('/', [checkToken, checkAdmin_Role], (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    User.findAll(res, from, limit);
});

// ==========================
// Get all enterprises
// ==========================
app.get('/', checkToken, (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    User.findEnterprises(res, from, limit);
});

// ==========================
// Get all users
// ==========================
app.get('/', checkToken, (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    User.findUsers(res, from, limit);
});

// ==========================
// Get user by id
// ==========================
app.get('/byid', [checkToken, checkPrivileges], (req, res) => {
    const id = req.query.id || req.user._id;
    User.findById(res, id)
});

// ==========================
// Get user by id info basic
// ==========================
app.get('/user/info', checkToken, (req, res) => {
    const id = req.query.id || req.user._id;
    User.findByIdInfoBasic(res, id)
});


// ==========================
// Get all contacts of user
// ==========================
app.get('/contacts/byid', [checkToken, checkPrivileges], (req, res) => {
    const id = req.query.id || req.user._id;
    User.getContacts(res, id);
});

// ==========================
// Update user
// ==========================
app.put('/', [checkToken, checkPrivileges], (req, res) => {
    const id = req.query.id || req.user._id;
    User.update(res, id, req.body);
});


// ==========================
// Create a user
// ==========================
app.post('/', (req, res) => User.create(res, req.body));

// ==========================
// Update user - add contact
// ==========================

app.put('/contact', [checkToken, checkPrivileges], (req, res) => {
    const id = req.query.id || req.user._id;
    User.updateUserAddContact(res, id, req.body.contact);
});

// ==========================
// Update User - Delete contact
// ==========================
app.delete('/contact/:contact', [checkToken, checkPrivileges], (req, res) => {
    const id = req.query.id || req.user._id;
    User.updateUserDeleteContact(res, id, req.params.contact);
});


// ==========================
// Delete a user by Id
// ==========================

app.delete('/:id', [checkToken, checkPrivileges], (req, res) => User.delete(res, req.params.id));

module.exports = app;