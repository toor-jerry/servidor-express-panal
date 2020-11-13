const express = require('express');

const app = express();
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const { response403, response500, response400, createToken } = require('../utils/utils');
const ConnectionModel = require('../models/connection');

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
            return response403(res, 'Token invalid!!');
        });

    User.findOne({
            user: googleUser.email
        })
        .exec((err, userDB) => {

            if (err)
                return response500(res, err, 'User not found.');

            if (userDB) {
                if (userDB.google === false) {
                    return response400(res, 'You must use your normal authentication.');
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
                    const token = createToken(userDB);

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

            if (err)
                return response500(res, err, 'User not found.');

            if (!userDB)
                return response400(res, 'Credentials invalid');

            if (!bcrypt.compareSync(body.password, userDB.password))
                return response400(res, 'Credentials invalid');

            // Create token!! 
            const token = createToken(userDB);

            if (userDB.connections) {
                const { 'user-agent': user_agent } = req.headers;
                let connection = new ConnectionModel({
                    user: userDB._id,
                    user_agent,
                    ip_add: req.ip,
                    hostname: req.hostname
                });
                connection.save((err, connectionCreated) => {
                    if (err) console.log("Error al intentar guardar conxión en la DB.");
                    if (!connectionCreated) console.log("No se pudo guardar en la DB la conexión.");
                });
            }

            res.status(200).json({
                ok: true,
                user: userDB,
                token
            });

        });


});



module.exports = app;