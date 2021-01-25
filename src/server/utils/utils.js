const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const response200 = (res, data = undefined) => {
    return res.status(200).json({
        ok: true,
        data
    });
}

const response201 = (res, data = undefined) => {
    return res.status(201).json({
        ok: true,
        data
    });
}

const response400 = (res, message = undefined, err = undefined) => {
    return res.status(400).json({
        ok: false,
        message: message || 'Bad Request.',
        errors: err
    });
}

const response401 = (res, message = undefined, err = undefined) => {
    return res.status(401).json({
        ok: false,
        message: message || 'Unauthorized.',
        errors: err
    });
}

const response403 = (res, message = undefined, err = undefined) => {
    return res.status(403).json({
        ok: false,
        message: message || 'Forbidden.',
        errors: err
    });
}

const response404 = (res, message = undefined, err = undefined) => {
    return res.status(404).json({
        ok: false,
        message: message || 'Not Found.',
        errors: err
    });
}

const response500 = (res, err, message = undefined) => {
    return res.status(500).json({
        ok: false,
        message: message || 'Internal Server Error',
        errors: err
    });
}

const createToken = (data) => {
    return jwt.sign({
        user: data
    }, process.env.SEED + data.seed, {
        expiresIn: process.env.TOKEN_EXPIRATION
    });
}

const generateRandomFileName = (id_user, fileExtention) => `${ id_user }-${uuid.v1()}.${fileExtention}`;


module.exports = {
    response200,
    response201,
    response400,
    response401,
    response403,
    response404,
    response500,
    createToken,
    generateRandomFileName
}