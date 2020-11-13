const jwt = require('jsonwebtoken');
const { response401, response500 } = require('../utils/utils');
const RoomModel = require('../models/room');

// ==========================
// Verif token - Headers
// ==========================

const checkToken = (req, res, next) => {

    const token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) return response401(res, 'Token invalid!!');

        req.user = decoded.user;
        next();
    });
}

// ==========================
// Verif token - URL
// ==========================

const checkTokenUrl = (req, res, next) => {

    const token = req.query.Authorization;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) return response401(res, 'Token invalid!!');
        req.user = decoded.user;
        next();

    });
}

// ==========================
// Verif ENTERPRISE_ROLE
// ==========================

const checkEnterprise_Role = (req, res, next) => {

    const user = req.user;

    if ((user.role === 'ENTERPRISE_ROLE' && user._id === req.params.id) || user.role === 'ADMIN_ROLE')
        next();
    else
        return response401(res);
}

// ==========================
// Verif ADMIN_ROLE
// ==========================
const checkAdmin_Role = (req, res, next) => {

    const user = req.user;

    if (user.role === 'ADMIN_ROLE')
        next();
    else
        return response401(res);
}

// ==========================
// Verif privileges
// ==========================
const checkPrivileges = (req, res, next) => {

    const user = req.user;
    if ((user._id === req.params.id) || (user._id === req.query.id) || (user.role === 'ADMIN_ROLE'))
        next();
    else return response401(res);
}

// ==========================
// Verif participant in room
// ==========================
const checkParticipantOnRoom = (req, res, next) => {

    let id = req.params.room || req.body.room;

    const user = req.user._id;
    RoomModel.findOne({ _id: id, $or: [{ admins: { $in: user } }, { participants: { $in: user } }] }, (err, room) => {
        if (err) return response500(res, err);
        if (!room) return response401(res);
        next();
    });
}

// ==========================
// Verif privileges on room
// ==========================
const checkPrivilegesOnRoom = (req, res, next) => {

    const user = req.user._id;
    RoomModel.findOne({ _id: req.params.room, admins: { $in: user } }, (err, room) => {
        if (err) return response500(res, err);
        if (!room) return response401(res);
        next();
    });
}

module.exports = {
    checkToken,
    checkTokenUrl,
    checkEnterprise_Role,
    checkAdmin_Role,
    checkPrivileges,
    checkParticipantOnRoom,
    checkPrivilegesOnRoom
}