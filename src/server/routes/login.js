const express = require('express');

const app = express();
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { Menu } = require('../classes/menu');

const { response403, response500, response400, createToken, response401, response200 } = require('../utils/utils');
const ConnectionModel = require('../models/connection');

const { io } = require('../app');
// Google
const CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const { checkToken } = require('../middlewares/auth');
// ==========================
// Renueva token
// ==========================
app.get('/new-token', checkToken, (req, res) => {
    return res.status(200).json({
        ok: true,
        token: createToken(req.user)
    });
});

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
                    return response400(res, 'Debe ingresar con su cuenta normal.');
                } else if (userDB.state === false) {
                    return response401(res, 'Su cuenta está desabilitada.');
                } else {
                    const token = createToken(userDB);



                    Menu.searchMenu(userDB.role)
                        .then(menu => {
                            if (menu) {
                                try {
                                    menu = JSON.parse(menu);
                                } catch (err) {
                                    console.log(err);
                                }
                            }
                            return res.status(200).json({
                                ok: true,
                                user: userDB,
                                token,
                                menu
                            });
                        })
                        .catch(err => {
                            return res.status(200).json({
                                ok: true,
                                user: userDB,
                                token,
                                menu: [],
                                error: 'Not found menu. ' + err.toString()
                            });
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

                    Menu.searchMenu(userDB.role)
                        .then(menu => {
                            if (menu) {
                                try {
                                    menu = JSON.parse(menu);
                                } catch (err) {
                                    console.log(err);
                                }
                            }
                            return res.status(200).json({
                                ok: true,
                                user: userDB,
                                token,
                                menu
                            });
                        })
                        .catch(err => {
                            return res.status(200).json({
                                ok: true,
                                user: userDB,
                                token,
                                menu: [],
                                error: 'Not found menu. ' + err.toString()
                            });
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
        }, '_id user password name last_name role email connections photography thumbnail_photography state seed credential')
        .exec((err, userDB) => {

            if (err)
                return response500(res, err, 'User not found.');

            if (!userDB)
                return response400(res, 'Usuario y/ó contraseña incorrectos.');

            if (!bcrypt.compareSync(body.password, userDB.password))
                return response400(res, 'Usuario y/ó contraseña incorrectos.');

            if (userDB.state === false) {
                return response401(res, 'Su cuenta se encuentra desabilitada.');
            }
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

            // io.in(userDB._id).clients((error, clients) => {
            //     if (error) throw error;
            //     if (clients.length === 0) {
            //         io.emit('new-conection', true);
            //     } else {
            //         io.to(userDB._id).emit('i-new-conection', clients.length);
            //     }
            // });
            Menu.searchMenu(userDB.role)
                .then(menu => {
                    if (menu) {
                        try {
                            menu = JSON.parse(menu);
                        } catch (err) {
                            console.log(err);
                        }
                    }
                    return res.status(200).json({
                        ok: true,
                        user: userDB,
                        token,
                        menu
                    });
                })
                .catch(err => {
                    return res.status(200).json({
                        ok: true,
                        user: userDB,
                        token,
                        menu: [],
                        error: 'Not found menu. ' + err.toString()
                    });
                });

        });
});



// ==========================
// Authentication local - Check password
// ==========================
app.post('/check-password', checkToken, (req, res) => {

    const password = req.body.password;
    if (!password)
        return response400(res, 'No password.');


    User.findById(req.user._id, '_id password')
        .exec((err, userDB) => {

            if (err)
                return response500(res, err, 'User not found.');

            if (!userDB)
                return response400(res, 'User not found.');

            if (userDB.state === false) {
                return response401(res, 'Su cuenta se encuentra desabilitada.');
            }
            if (!bcrypt.compareSync(password, userDB.password))
                return response400(res, 'Contraseña incorrecta.');

            response200(res, 'ok!')

        });
});


app.post('/check-user-exist', (req, res) => {

    const user = req.body.user;
    if (!user)
        return response400(res, 'No user.');


    User.findOne({ user: user })
        .exec((err, userDB) => {

            if (err)
                return response500(res, err, 'Error buscando..');

            if (!userDB)
                return response200(res, 'User not found.');

            response400(res, 'El usuario ya existe!!, elija otro por favor')

        });
});

module.exports = app;