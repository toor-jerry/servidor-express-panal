const express = require('express');

const { Theme } = require('../classes/theme');
const { checkToken, checkPrivileges, checkAdmin_Role } = require('../middlewares/auth');

const app = express();

// ==========================
// Get all theme
// ==========================
app.get('/', (req, res) => Theme.findAll(res));

// ==========================
// Update theme
// ==========================
app.put('/:id', checkToken, (req, res) =>
    Theme.update(res, req.params.id, req.body)
);

// ==========================
// Create a theme
// ==========================
app.post('/default', [checkToken, checkAdmin_Role], (req, res) =>
    Theme.create(res, {
        bg: req.body.bg,
        navbar: req.body.navbar,
        navbarBg: req.body.navbarBg,
        workArea: req.body.workArea,
        breadCrumb: req.body.breadCrumb,
        sideBar: req.body.sideBar,
        custom: false
    })
);

// ==========================
// Create a theme
// ==========================
app.post('/', checkToken, (req, res) =>
    Theme.createUpdateUSer(res, req.user._id, {
        bg: req.body.bg,
        navbar: req.body.navbar,
        navbarBg: req.body.navbarBg,
        workArea: req.body.workArea,
        breadCrumb: req.body.breadCrumb,
        sideBar: req.body.sideBar
    })
);

// ==========================
// Delete a employment by
// ==========================
app.delete('/:id', checkToken, (req, res) => Theme.delete(res, req.params.id, req.user._id));

module.exports = app;