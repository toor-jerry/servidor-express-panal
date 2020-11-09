const express = require('express');

const { User } = require('../classes/user');
const { checkToken, checkPrivileges } = require('../middlewares/auth');

const app = express();

const user = new User();

// ==========================
// Get all users
// ==========================
app.get('/', checkToken, (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    user.findAll(res, from, limit);
});

// ==========================
// Get user by id
// ==========================
app.get('/:id', checkToken, (req, res) => user.findById(res, req.params.id));

// ==========================
// Get all contacts of user
// ==========================
app.get('/contacts/byid', [checkToken, checkPrivileges], (req, res) => {
    const id = req.query.id || req.user._id;
    user.getContacts(res, id);
});

// ==========================
// Update user
// ==========================
app.put('/', [checkToken, checkPrivileges], (req, res) => {
    const id = req.query.id || req.user._id;
    user.update(res, id, req.body);
});


// ==========================
// Create a user
// ==========================
app.post('/', (req, res) => user.create(res, req.body));

// ==========================
// Update user - add contact
// ==========================

app.put('/contact', [checkToken, checkPrivileges], (req, res) => {
    const id = req.query.id || req.user._id;
    user.updateUserAddContact(res, id, req.body.contact);
});

// ==========================
// Update User - Delete contact
// ==========================
app.delete('/contact/:contact', [checkToken, checkPrivileges], (req, res) => {
    const id = req.query.id || req.user._id;
    user.updateUserDeleteContact(res, id, req.params.contact);
});


// ==========================
// Delete a user by Id
// ==========================

app.delete('/:id', [checkToken, checkPrivileges], (req, res) => user.delete(res, req.params.id));

module.exports = app;