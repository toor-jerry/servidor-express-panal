const express = require('express');
const fileUpload = require('express-fileupload');

const { Upload } = require('../classes/upload');
const { Message } = require('../classes/message');

const { checkToken, checkPrivileges, checkParticipantOnRoom } = require('../middlewares/auth');

const { response400, response500, generateRandomFileName } = require('../utils/utils');


const app = express();

// default options (req.files <- todo lo que viene)
app.use(fileUpload());

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

    // Custom file name
    const id_user = req.user._id;
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
                return Upload.uploadPhotography(res, id_user, nameFile);

            if (type === 'cv')
                return Upload.uploadCV(res, id_user, nameFile);

            if (type === 'credential')
                return Upload.uploadCredential(res, id_user, nameFile);
        });

    }
});

app.put('/file/:type', [checkToken, checkPrivileges], (req, res) => {

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
    const file = req.files.file;
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
    Message.create(res, {
        room: req.body.room,
        sender: req.user._id,
        message: nameFile,
        type: 'IMG'
    });

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

        Message.create(res, {
            room: req.body.room,
            sender: req.user._id,
            message: nameFile,
            type: 'FILE'
        });
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