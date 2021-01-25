const jwt = require('jsonwebtoken');
const { response401, response500 } = require('../utils/utils');
const RoomModel = require('../models/room');
const UserModel = require('../models/user');

// ==========================
// Verif token - Headers and url
// ==========================
const checkToken = (req, res, next) => {

    const token = req.get('Authorization') || req.query.Authorization;

    const payload = jwt.decode(token);
    if (!payload) {
        return response401(res, 'Token invalid!!');
    }
    UserModel.findById(payload.user._id, 'seed', (err, user) => {

        if (err) return response500(res, err);

        jwt.verify(token, process.env.SEED + user.seed, (err, decoded) => {

            if (err) return response401(res, 'Token invalid!!');

            req.user = decoded.user;
            next();
        });
    });
}

// ==========================
// Verif USER_PLATINO_ROLE
// ==========================
const checkUser_Platino_Role = (req, res, next) => {

    const user = req.user;

    if (req.user.role == 'USER_PLATINO_ROLE' || user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return response401(res);
    }
}


const checkEnterprise_Role = (req, res, next) => {

    const user = req.user;
    // if (user.role !== 'ENTERPRISE_ROLE') {
    //     return response401(res);
    // }

    if (req.params.id || req.query.id) {
        if (user._id === req.params.id || user.role == 'ENTERPRISE_ROLE' || user.role === 'ADMIN_ROLE') {
            next();
        } else {
            return response401(res);
        }
    } else {
        next();
    }
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
    if (req.params.id || req.query.id) {
        if ((user._id === req.params.id) || (user._id === req.query.id) || (user.role === 'ADMIN_ROLE')) {
            next();
        } else {
            return response401(res);
        }
    } else {
        next();
    }
}

// ==========================
// Verif participant in room
// ==========================
const checkParticipantOnRoom = (req, res, next) => {

    let id = req.params.room || req.query.room || req.body.room;

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
    checkEnterprise_Role,
    checkAdmin_Role,
    checkPrivileges,
    checkParticipantOnRoom,
    checkPrivilegesOnRoom,
    checkUser_Platino_Role
}