const express = require('express');

const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Connection = require('../routes/connection').registerConnection;

// Google
const CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

// ==========================
// Auth google
// ==========================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    /* const userid = payload['sub']; */
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    return {
        name: payload.name,
        last_name: payload.family_name,
        email: payload.email,
        photography: payload.picture,
        google: true,
        email_verified: payload.email_verified
    }
}

app.post('/google', async(req, res) => {

    const token = req.body.token;

    const googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                message: 'Token no valid!',
                err: e
            });
        });

    User.findOne({
            user: googleUser.email
        })
        .exec((err, userDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error finding users',
                    errors: err
                });
            }

            if (userDB) {
                if (userDB.google === false) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Debe usar su autenticación normal',
                        errors: err
                    });
                } else {
                    const token = jwt.sign({
                        user: userDB
                    }, process.env.SEED, {
                        expiresIn: process.env.TOKEN_EXPIRATION
                    });

                    res.status(200).json({
                        ok: true,
                        user: userDB,
                        token
                    });
                }
            } else {
                // User not exist!!
                const user = new User();
                user.name = googleUser.name;
                user.last_name = googleUser.last_name;
                user.email = googleUser.email;
                user.user = googleUser.email;
                user.photography = googleUser.photography;
                user.google = true;
                user.email_verified = googleUser.email_verified;
                user.password = ':V';

                user.save((err, userDB) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'Error saved users',
                            errors: err
                        });
                    }
                    const token = jwt.sign({
                        user: userDB
                    }, process.env.TOKEN_EXPIRATION, {
                        expiresIn: process.env.TOKEN_EXPIRATION
                    });

                    res.status(200).json({
                        ok: true,
                        user: userDB,
                        token
                    });
                });
            }
        });

});

// ==========================
// Authentication local
// ==========================

app.post('/', (req, res) => {

    const body = req.body;

    User.findOne({
            user: body.user
        }, '_id user password name last_name role connections')
        .exec((err, userDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error finding users',
                    errors: err
                });
            }

            if (!userDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'Credentials invalid - email',
                    errors: err
                });
            }

            if (!bcrypt.compareSync(body.password, userDB.password)) {
                return res.status(400).json({
                    ok: false,
                    message: 'Credentials invalid - password',
                    errors: err
                });
            }

            // Create token!! 
            // userDB.password = ':V';
            const token = jwt.sign({
                user: userDB
            }, process.env.SEED, {
                expiresIn: process.env.TOKEN_EXPIRATION
            });

            Connection(userDB._id, req);

            res.status(200).json({
                ok: true,
                user: userDB,
                token
            });

        });


});



module.exports = app;