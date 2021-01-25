const express = require('express');
const fileUpload = require('express-fileupload');

const { Upload } = require('../classes/upload');
const { Message } = require('../classes/message');
const { Room } = require('../classes/room');
const { io } = require('../app');

const UserModel = require('../models/user');
const { checkToken, checkPrivileges, checkParticipantOnRoom, checkAdmin_Role } = require('../middlewares/auth');

const { response400, response500, generateRandomFileName } = require('../utils/utils');


const app = express();

// default options (req.files <- todo lo que viene)
app.use(fileUpload());

// ==========================
// Upload asset img
// ==========================
app.post('/asset/img', [checkToken, checkAdmin_Role], (req, res) => {

    if (!req.files) return response400(res, 'No data.');

    // Name file
    const file = req.files.img;
    const splitName = file.name.split('.');
    const fileExtention = splitName[splitName.length - 1];

    // Extentions valid
    const extentionsValid = ['png', 'jpg', 'gif', 'jpeg'];

    if (extentionsValid.indexOf(fileExtention) < 0) {
        return errorExtensions(res, extentionsValid, fileExtention);
    }

    const nameFile = file.name;

    // Move file
    const path = `./src/public/assets/${nameFile}`;
    // Size file
    if (file.size > 500000) {
        Upload.uploadAssetImg(res, file.data, nameFile, true);
    } else {
        Upload.uploadAssetImg(res, file.data, nameFile);
    }
});

// ==========================
// Delete asset img
// ==========================
app.delete('/asset/img/:nameFile', [checkToken, checkAdmin_Role], (req, res) =>
    Upload.deleteAssetImg(res, req.params.nameFile)
);

app.put('/img/:type', [checkToken, checkPrivileges], (req, res) => {

    const type = req.params.type;

    // Types files
    const typesValids = ['cv', 'photography', 'credential'];

    if (!req.files) return response400(res, 'No data.');
    if (typesValids.indexOf(type) < 0) return response400(res, 'Type file no valid! ' + typesValids);

    // Name file
    const file = req.files.img;
    const splitName = file.name.split('.');
    const fileExtention = splitName[splitName.length - 1];

    // Extentions valid
    const extentionsValid = ['png', 'jpg', 'gif', 'jpeg'];

    if (extentionsValid.indexOf(fileExtention) < 0)
        return errorExtensions(res, extentionsValid, fileExtention);

    let id_user;
    // Custom file name
    if (type === 'photography') {
        id_user = req.query.id || req.user._id;
    } else {
        id_user = req.user._id;
    }
    const nameFile = generateRandomFileName(id_user, fileExtention);
    // Move file
    const path = generatePathUploads(type, nameFile);
    // Size file
    if (type === 'photography' && file.size > 900000) {

        Upload.uploadPhotography(res, id_user, file.data, nameFile, true);

    } else {
        file.mv(path, err => {

            if (err) return response500(res, err);

            if (type === 'photography')
                return Upload.uploadPhotography(res, id_user, file.data, nameFile);

            if (type === 'cv')
                return Upload.uploadCV(res, id_user, nameFile);

            if (type === 'credential')
                return Upload.uploadCredential(res, id_user, nameFile);
        });

    }
});

app.put('/file/:type', checkToken, (req, res) => {

    const type = req.params.type;

    // Types files
    const typesValids = ['cv', 'credential'];

    if (!req.files) return response400(res, 'No data.');
    if (typesValids.indexOf(type) < 0) return response400(res, 'Type file no valid! ' + typesValids);

    // Name file
    const file = req.files.file;
    const splitName = file.name.split('.');
    const fileExtention = splitName[splitName.length - 1];

    // Extentions valid
    const extentionsValid = ['pdf', 'doc', 'docx', 'docm', 'odt', 'rtf', 'csv', 'xlsx', 'xlsm', 'odsm', 'pps', 'ppt', 'ppsx', 'pptx', 'ppsm', 'pptm', 'potxm', 'odp'];

    if (extentionsValid.indexOf(fileExtention) < 0)
        return errorExtensions(res, extentionsValid, fileExtention);

    // Custom file name
    const id_user = req.user._id;
    const nameFile = generateRandomFileName(id_user, fileExtention);
    // Move file
    const path = generatePathUploads(type, nameFile);

    file.mv(path, err => {

        if (err) return response500(res, err);

        if (type === 'cv')
            return Upload.uploadCV(res, id_user, nameFile);

        if (type === 'credential')
            return Upload.uploadCredential(res, id_user, nameFile);
    });

});

// ==========================
// CHAT
// ==========================
app.post('/img/chat', [checkToken, checkParticipantOnRoom], (req, res) => {

    if (!req.files) return response400(res, 'No data.');

    // Name file
    const file = req.files.img;
    const splitName = file.name.split('.');

    const fileExtention = splitName[splitName.length - 1];

    // Extentions valid
    const extentionsValid = ['png', 'jpg', 'gif', 'jpeg'];


    if (extentionsValid.indexOf(fileExtention) < 0)
        return errorExtensions(res, extentionsValid, fileExtention);

    // Custom file name
    const id_user = req.user._id;
    const nameFile = generateRandomFileName(id_user, fileExtention);
    // Move file
    const path = generatePathUploads('messages', nameFile);


    if (file.size > 900000) {

        Upload.resizeImage(file.data, 'messages', nameFile);
    } else {

        file.mv(path, err => {

            if (err) return response500(res, err);

        });
    }
    let room = req.body.room || req.query.room;
    Message.create({
            room: room,
            sender: req.user._id,
            message: nameFile,
            type: 'IMG',
            fileName: file.name
        })
        .then(resp => {
            res.status(201).json({ data: resp.data, _idTemp: req.query._idTemp });
            Room.findById(room)
                .then(res => {
                    let data = res.data;
                    let participants = data.participants;
                    let admins = data.admins;
                    if (participants.length > 0) {
                        participants.forEach(participant => {
                            if (participant._id != id_user) {
                                io.in(participant._id + '').emit('new-message', { msg: resp.data, infoUser: req.user });
                            }
                        });
                    }

                    if (admins.length > 0) {
                        admins.forEach(admin => {
                            if (admin._id !== id_user) {
                                io.in(admin._id + '').emit('new-message', { msg: resp.data, infoUser: req.user });
                            }
                        });
                    }

                })
                .catch(err => console.log('Error on send notification "new message"', err))
        })
        .catch(err =>
            res.status(err.code).json({
                msg: err.msg,
                err: err.err
            })
        )

});

app.post('/file/chat', [checkToken, checkParticipantOnRoom], (req, res) => {

    if (!req.files) return response400(res, 'No data.');
    // Name file
    const file = req.files.file;
    const splitName = file.name.split('.');
    const fileExtention = splitName[splitName.length - 1];
    // Extentions valid
    const extentionsValid = ['pdf', 'doc', 'docx', 'txt', 'docm', 'odt', 'rtf', 'csv', 'xlsx', 'xlsm', 'odsm', 'pps', 'ppt', 'ppsx', 'pptx', 'ppsm', 'pptm', 'potxm', 'odp'];

    if (extentionsValid.indexOf(fileExtention) < 0)
        return errorExtensions(res, extentionsValid, fileExtention);

    // Custom file name
    const id_user = req.user._id;
    const nameFile = generateRandomFileName(id_user, fileExtention);
    // Move file
    const path = generatePathUploads('messages', nameFile);

    file.mv(path, err => {
        if (err) return response500(res, err);
        let room = req.body.room || req.query.room;

        Message.create({
                room: room,
                sender: req.user._id,
                message: nameFile,
                type: 'FILE',
                fileName: file.name
            }).then(resp => {
                res.status(201).json({ data: resp.data, _idTemp: req.query._idTemp });
                Room.findById(room)
                    .then(res => {
                        let data = res.data;
                        let participants = data.participants;
                        let admins = data.admins;
                        if (participants.length > 0) {
                            participants.forEach(participant => {
                                if (participant._id != id_user) {
                                    io.in(participant._id + '').emit('new-message', { msg: resp.data, infoUser: req.user });
                                }
                            });
                        }

                        if (admins.length > 0) {
                            admins.forEach(admin => {
                                if (admin._id !== id_user) {
                                    io.in(admin._id + '').emit('new-message', { msg: resp.data, infoUser: req.user });
                                }
                            });
                        }

                    })
                    .catch(err => console.log('Error on send notification "new message"', err))
            })
            .catch(err =>
                res.status(err.code).json({
                    msg: err.msg,
                    err: err.err
                })
            )
    });

});


app.delete('/:type', [checkToken, checkPrivileges], (req, res) => {
    let user = req.user._id;
    let type = req.params.type;

    const typesValids = ['cv', 'photography', 'credential'];
    if (typesValids.indexOf(type) < 0) return response400(res, 'Type file no valid! ' + typesValids);

    if (type === 'photography')
        return Upload.deletePhotography(res, user);

    if (type === 'cv')
        return Upload.deleteCV(res, user);

    if (type === 'credential')
        return Upload.deleteCredential(res, user);
});

const errorExtensions = (res, extentionsValid, fileExtention) =>
    res.status(400).json({
        ok: false,
        message: 'Extention invalid!',
        errors: {
            message: 'Extentions valids: ' + extentionsValid.join(', '),
            ext: fileExtention
        }
    });

const generatePathUploads = (dirName, fileName) => `./uploads/${dirName}/${fileName}`;


module.exports = app;