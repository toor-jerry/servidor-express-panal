const express = require('express');

const { Menu } = require('../classes/menu');
const { checkToken, checkAdmin_Role } = require('../middlewares/auth');

const app = express();

// ==========================
// Get all menus
// ==========================
app.get('/', [checkToken, checkAdmin_Role], (req, res) => Menu.findAll(res));

// ==========================
// Get menu by id
// ==========================
app.get('/:menu', [checkToken, checkAdmin_Role], (req, res) => Menu.findById(res, req.params.menu));

// ==========================
// Create a menu
// ==========================
app.post('/', [checkToken, checkAdmin_Role], (req, res) => Menu.create(res, req.body));

// ==========================
// Update menu
// ==========================
app.put('/:menu', [checkToken, checkAdmin_Role], (req, res) =>
    Menu.update(res, req.params.menu, req.body)
);

// ==========================
// Delete a user by Id
// ==========================
app.delete('/:menu', [checkToken, checkAdmin_Role], (req, res) =>
    Menu.delete(res, req.params.menu)
);

module.exports = app;