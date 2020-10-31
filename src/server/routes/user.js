const express = require('express');

const bcrypt = require('bcryptjs');

const { checkToken, checkPrivileges } = require('../middlewares/auth');

const app = express();

const User = require('../models/user');

// ==========================
// Get all users
// ==========================

app.get('/', checkToken, (req, res) => {

    // User.find({}, 'user name last_name role')
    User.find({}, 'user name last_name role contacts')
        .exec((err, users) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error charging users',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                users
            });

        });

});

// ==========================
// Get all contacts of user
// ==========================

app.get('/contact/:id', [checkToken, checkPrivileges], (req, res) => {

    const id = req.params.id;

    User.findById(id, 'contacts')
        .populate('contacts', 'user name last_name email')
        .exec((err, contacts) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error charging user',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                contacts: contacts.contacts
            });

        });

});

// ==========================
// Update user
// ==========================

app.put('/:id', [checkToken, checkPrivileges], (req, res) => {

    const id = req.params.id;
    const body = req.body;

    User.findById(id, (err, user) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error find user',
                errors: err
            });
        }

        if (!user) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'User no exists!!',
                    errors: { message: 'No exists a user whith id' }
                });
            }
        }

        user.name = body.name;
        user.last_name = body.last_name;
        user.email = body.email;
        user.role = body.role;
        user.domicile = body.domicile;
        user.nacionality = body.nacionality;
        user.gender = body.gender;
        user.date_birth = body.date_birth;
        user.speciality = body.speciality;
        user.professional_titles = body.professional_titles;
        user.last_job = body.last_job;
        user.description = body.description;

        user.whatsapp = body.whatsapp;
        user.movil_phone = body.movil_phone;
        user.telephone = body.telephone;
        user.facebook = body.facebook;
        user.twitter = body.twitter;
        user.instagram = body.instagram;
        user.youtube_channel = body.youtube_channel;
        user.blog_personal = body.blog_personal;
        user.page_web = body.page_web;
        user.location = body.location;
        user.role = body.role;
        user.rfc = body.rfc;
        user.state = body.state;
        user.save((err, userUpdated) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error at update user',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                user: userUpdated
            });

        });

    });

});


// ==========================
// Create a user
// ==========================
app.post('/', (req, res) => {

    const body = req.body;
    // delete body.password;

    let user = new User({
        name: body.name,
        last_name: body.last_name,
        user: body.user,
        email: body.email,
        domicile: body.domicile,
        nacionality: body.nacionality,
        password: bcrypt.hashSync(body.password, 10),
        gender: body.gender,
        date_birth: body.date_birth,
        speciality: body.speciality,
        professional_titles: body.professional_titles,
        last_job: body.last_job,
        description: body.description,
        photography: body.photography,
        cv: body.cv,
        credential: body.credential,
        chat_photography: body.chat_photography,
        whatsapp: body.whatsapp,
        movil_phone: body.movil_phone,
        telephone: body.telephone,
        facebook: body.facebook,
        twitter: body.twitter,
        instagram: body.instagram,
        youtube_channel: body.youtube_channel,
        blog_personal: body.blog_personal,
        page_web: body.page_web,
        location: body.location,
        role: body.role,
        rfc: body.rfc,
        state: body.state
    });

    user.save((err, userSaved) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error at create user',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            user: userSaved
        });

    });

});

// ==========================
// Update user - add contact
// ==========================

app.put('/contact/:id', [checkToken, checkPrivileges], (req, res) => {

    const id = req.params.id;
    const contact = req.body.contact;

    Promise.all([
            updateUserAddContact(id, contact),
            updateUserAddContact(contact, id)
        ])
        .then(responses => {
            return res.status(200).json({
                ok: true,
                user: responses[0],
                contact: responses[1]
            });
        })
        .catch(err => {
            return res.status(400).json({
                ok: false,
                message: err
            });
        });
});

// ==========================
// Update User - Delete contact
// ==========================

app.delete('/contact/:id/:contact', [checkToken, checkPrivileges], (req, res) => {

    const id = req.params.id;
    const contact = req.params.contact;

    Promise.all([
            updateUserDeleteContact(id, contact),
            updateUserDeleteContact(contact, id)
        ])
        .then(responses => {
            return res.status(200).json({
                ok: true,
                user: responses[0],
                contact: responses[1]
            });
        })
        .catch(err => {
            return res.status(400).json({
                ok: false,
                message: err
            });
        });
});

// ==========================
// Delete a user by Id
// ==========================

app.delete('/:id', [checkToken, checkPrivileges], (req, res) => {

    const id = req.params.id;

    User.findByIdAndRemove(id, (err, userDeleted) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error at delete user',
                errors: err
            });
        }

        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                message: 'Not delete user',
                errors: { message: 'Not delete user whitin Id' }
            });
        }

        res.status(200).json({
            ok: true,
            user: userDeleted
        });

    });


});

const updateUserAddContact = (id, contact) => {
    return new Promise((resolve, reject) => {

        User.findByIdAndUpdate(id, { $addToSet: { contacts: contact } }, { new: true })
            .populate('contacts', 'name last_name user email')
            .exec((err, user) => {
                if (err)
                    return reject({ message: 'Error encontrando usuario', err });

                if (!user)
                    return reject('User no exists!!');

                return resolve(user.contacts);
            });
    });
}

const updateUserDeleteContact = (id, contact) => {
    return new Promise((resolve, reject) => {

        User.findByIdAndUpdate(id, { $pull: { contacts: contact } }, { new: true })
            .populate('contacts', 'name last_name user email')
            .exec((err, user) => {
                if (err)
                    return reject({ message: 'Error delete contact', err });

                if (!user)
                    return reject('User no exists!!');

                return resolve(user.contacts);
            });
    });
}

module.exports = app;