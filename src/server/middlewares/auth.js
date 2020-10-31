const jwt = require('jsonwebtoken');


// ==========================
// Verif token - Headers
// ==========================

exports.checkToken = (req, res, next) => {

    const token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Token invalid!!',
                errors: err
            });
        }

        req.user = decoded.user;

        next();

    });
}

// ==========================
// Verif token - URL
// ==========================

exports.checkTokenUrl = (req, res, next) => {

    const token = req.query.Authorization;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Token invalid!!',
                errors: err
            });
        }

        req.user = decoded.user;

        next();

    });
}

// ==========================
// Verif ENTERPRISE_ROLE
// ==========================

exports.checkEnterprise_Role = (req, res, next) => {

    const user = req.user;

    if ((user.role === 'ENTERPRISE_ROLE' && user._id === req.params.id) || user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'User no auth'
            }
        });
    }
}

// ==========================
// Verif privileges
// ==========================

exports.checkPrivileges = (req, res, next) => {

    const user = req.user;

    if (user._id === req.params.id || user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'User no auth'
            }
        });
    }
}


// ==========================
// Verif ADMIN_ROLE
// ==========================

exports.checkAdmin_Role = (req, res, next) => {

    const user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'User no auth'
            }
        });
    }
}