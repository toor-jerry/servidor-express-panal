const express = require('express');

const { User } = require('../classes/user');
const { checkToken, checkPrivileges, checkAdmin_Role } = require('../middlewares/auth');

const app = express();

// ==========================
// Get all users
// ==========================
app.get('/all', [checkToken, checkAdmin_Role], (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    User.findAll(res, from, limit);
});

// ==========================
// Get all enterprises
// ==========================
app.get('/enterprises', checkToken, (req, res) => {

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
app.get('/byid', checkToken, (req, res) => {
    const id = req.query.id || req.user._id;
    User.findById(res, id)
});

// ==========================
// Get user by id
// ==========================
app.get('/my-info', checkToken, (req, res) => User.findById(res, req.user._id));

// ==========================
// Get user by id info basic
// ==========================
app.get('/user/info', checkToken, (req, res) => {
    const id = req.query.id || req.user._id;
    User.findByIdInfoBasic(res, id)
});

// ==========================
// Search contacts
// ==========================
app.get('/search/contact/:contact', checkToken, (req, res) => {
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    User.findContacts(res, req.user._id, req.params.contact, from, limit)
});

// ==========================
// Get conversations
// ==========================
app.get('/conversations', checkToken, (req, res) => {
    User.getConversationsChatSimple(req.user._id)
        .then(resp => res.status(200).json({ data: resp.data }))
        .catch(err => { res.status(err.code).json(err.err) });
});

// ==========================
// Get notifications
// ==========================
app.get('/notifications', checkToken, (req, res) => {
    User.getNotifications(res, req.user._id)
});

// ==========================
// Get all contacts of user
// ==========================
app.get('/contacts/byid', [checkToken, checkPrivileges], (req, res) => {
    const id = req.query.id || req.user._id;
    User.getContacts(id)
        .then(resp => {
            res.status(201).json(resp);
            // io.emit('new-employment', resp);
        })
        .catch(err => { res.status(err.code).json(err.err) });
});

// ==========================
// Get all contacts of user (only id)
// ==========================
app.get('/contacts-id/byid', [checkToken, checkPrivileges], (req, res) => {
    const id = req.query.id || req.user._id;
    User.getContactsOnlyId(id)
        .then(resp => {
            res.status(201).json(resp);
        })
        .catch(err => { res.status(err.code).json(err.err) });
});

// ==========================
// Update user
// ==========================
app.put('/', [checkToken, checkPrivileges], (req, res) => {
    const id = req.query.id || req.user._id;
    User.update(res, id, req.user.role, req.body);
});


// ==========================
// Create a user
// ==========================
app.post('/', (req, res) =>
    User.create(req.body)
    .then(resp => res.status(201).json(resp))
    .catch(err => {
        res.status(err.code).json({
            msg: err.msg,
            err: err.err
        })
    }));

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
app.delete('/:id', [checkToken, checkPrivileges], (req, res) => {
    const list = req.query.list || false;
    const search = req.query.search || false;
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    const exp = req.query.regex;
    let regex;
    if (search) {
        try {
            regex = new RegExp(exp.trim(), 'i');
        } catch (err) {
            return res.status(400).json({
                message: 'Bad request.',
                err: err.toString()
            });
        }
    }

    User.delete(res, req.params.id, list, from, limit, search, regex);
});


module.exports = app;