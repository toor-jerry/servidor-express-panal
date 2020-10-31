const express = require('express');

const fileUpload = require('express-fileupload');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const mdAuth = require('../middlewares/auth');

const app = express();

const User = require('../models/user');
const Chat = require('../models/chat');

const SIZE_PHOTOGRAPHY = require('../config/config').SIZE_PHOTOGRAPHY;
const SIZE_CHAT_PHOTOGRAPHY = require('../config/config').SIZE_CHAT_PHOTOGRAPHY;

// default options (req.files <- todo lo que viene)
app.use(fileUpload());

app.put('/:type', mdAuth.checkToken, (req, res) => {

    const type = req.params.type;

    // Types files
    const typesValids = ['cv', 'photography', 'credential'];

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No data',
            errors: {
                message: 'No files were upload.'
            }
        });
    }

    if (typesValids.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Type file no valid!',
            errors: {
                message: 'Type file no valid! ' + typesValids
            }
        });
    }

    // Name file
    const file = req.files.img;
    const splitName = file.name.split('.');
    const fileExtention = splitName[splitName.length - 1];

    // Extentions valid
    const extentionsValid = ['png', 'jpg', 'gif', 'jpeg'];

    if (extentionsValid.indexOf(fileExtention) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Extention invalid!',
            errors: {
                message: 'Extentions valids: ' + extentionsValid.join(', '),
                ext: fileExtention
            }
        });
    }


    // Custom file name
    const id_user = req.user._id;
    const nameFile = `${ id_user }-${uuid.v1()}.${fileExtention}`;
    // Move file
    const path = `./uploads/${ type }/${ nameFile }`;
    // Size file
    if (type === 'photography' && file.size > 900000) {

        uploadPhotography(id_user, file.data, nameFile, res, true);

    } else {
        file.mv(path, err => {

            if (err) {
                //borrar file
                return res.status(500).json({
                    ok: false,
                    message: 'Error at move file',
                    errors: err
                });
            }

            uploadByType(type, id_user, nameFile, file.data, res);
        });

    }


});

// ==========================
// Custom photography
// ==========================

const uploadPhotography = (id_user, img, nameFile, res, resize = false) => {
    User.findById(id_user, (err, user) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error at find user',
                errors: err
            });
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'User not found',
                errors: {
                    message: 'User not found'
                }
            });
        }

        // Delte old images
        if (user.photography !== nameFile) {
            const pathOld = path.resolve(__dirname, `../uploads/photography/${user.photography}`);
            if (fs.existsSync(pathOld)) {
                fs.unlinkSync(pathOld);
            }
        }
        if (user.chat_photography !== nameFile) {
            const pathOld = './uploads/photographyChat/' + user.chat_photography;
            if (fs.existsSync(pathOld)) {
                fs.unlinkSync(pathOld);
            }
        }
        if (resize) {
            sharp(img)
                .resize({
                    width: SIZE_PHOTOGRAPHY
                })
                .toFile('./uploads/photography/' + nameFile)
                .catch(err => console.log('Err ' + err));
        }

        sharp(img)
            .resize({
                width: SIZE_CHAT_PHOTOGRAPHY
            })
            .toFile('./uploads/photographyChat/' + nameFile)
            .catch(err => console.log('Err ' + err));

        user.photography = nameFile;
        user.chat_photography = nameFile;

        user.save((err, userUpdated) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error at updated user',
                    errors: err
                });
            }

            user.password = ':)';

            return res.status(200).json({
                ok: true,
                message: 'Photografy updated successfull',
                user: userUpdated
            });

        });

    });
}


// ==========================
// Upload images
// ==========================

const uploadByType = (type, id_user, nameFile, img, res) => {

    /***************************
     * Upload photography
     ***************************/
    if (type === 'photography') {
        uploadPhotography(id_user, img, nameFile, res);
    }
    /***************************
     * Upload CV
     ***************************/
    if (type === 'cv') {

        User.findById(id_user, (err, user) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error at find user',
                    errors: err
                });
            }

            if (!user) {
                return res.status(400).json({
                    ok: false,
                    message: 'User not found',
                    errors: {
                        message: 'User not found'
                    }
                });
            }
            // If exists cv, trash cv old
            if (user.cv !== nameFile) {
                const pathOld = './uploads/cv/' + user.cv;
                if (fs.existsSync(pathOld)) {
                    fs.unlinkSync(pathOld);
                }
            }

            user.cv = nameFile;

            user.save((err, userUpdated) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error at updated user',
                        errors: err
                    });
                }

                user.password = ':)';

                return res.status(200).json({
                    ok: true,
                    message: 'CV updated successfull',
                    user: userUpdated
                });

            });

        });

    }

    /***************************
     * Upload credential
     ***************************/

    if (type === 'credential') {

        User.findById(id_user, (err, user) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error at find user',
                    errors: err
                });
            }

            if (!user) {
                return res.status(400).json({
                    ok: false,
                    message: 'User not found',
                    errors: {
                        message: 'User not found'
                    }
                });
            }
            // If exists cv, trash cv old
            if (user.credential !== nameFile) {
                const pathOld = './uploads/credential/' + user.credential;
                if (fs.existsSync(pathOld)) {
                    fs.unlinkSync(pathOld);
                }
            }

            user.credential = nameFile;

            user.save((err, userUpdated) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error at updated user',
                        errors: err
                    });
                }

                user.password = ':)';

                return res.status(200).json({
                    ok: true,
                    message: 'Credential updated successfull',
                    user: userUpdated
                });

            });

        });

    }



}

module.exports = app;