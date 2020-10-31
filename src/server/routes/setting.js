const express = require('express');

const jwt = require('jsonwebtoken');

const mdAuth = require('../middlewares/auth');

const app = express();

const Setting = require('../models/setting');

// ==========================
// Get all setting
// ==========================
app.get('/', (req, res) => {

    Setting.find({}, (err, setting) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error charging setting',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                setting
            });

        });

});

// ==========================
// Update setting  mdAuth.checkToken,
// ==========================

app.put('/:id', (req, res) => {

    const id = req.params.id;
    const body = req.body;

    Setting.findById( id, (err, setting) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error find setting',
                errors: err
            });
        }

        if ( !setting ) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Setting no exists!!',
                    errors: { message: 'No exists a Setting whith id' }
                });
            }
        }

        setting.bg = body.bg;
        setting.navbar = body.navbar;
        setting.navbarBg = body.navbarBg;
        setting.workArea = body.workArea;
        setting.breadCrumb = body.breadCrumb;
        setting.sideBar = body.sideBar;
        setting.custom = body.custom;
        

        setting.save( (err, settingUpdated) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error at update setting',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                setting: settingUpdated
            });

        });

    });
    
});


// ==========================
// Create a setting mdAuth.checkToken,
// ==========================

app.post('/',  (req, res) => {
    
    const body = req.body;

    let setting = new Setting({
        bg: body.bg,
        navbar: body.navbar,
        navbarBg: body.navbarBg,
        workArea: body.workArea,
        breadCrumb: body.breadCrumb,
        sideBar: body.sideBar,
        custom: body.custom
    });
    
    setting.save( (err, settingUpdated) => {
    
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error at create setting',
                    errors: err
                });
            }
    
            res.status(201).json({
                ok: true,
                setting: settingUpdated
            });
    
        });

});

// ==========================
// Delete a employment by Id mdAuth.checkToken,
// ==========================

app.delete('/:id',  (req, res) => {

    const id = req.params.id;

    Setting.findByIdAndRemove(id, (err, settingDeleted) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error at delete setting',
                errors: err
            });
        }

        if ( !settingDeleted ) {
            return res.status(400).json({
                ok: false,
                message: 'Not deleted setting',
                errors: { message: 'Not deleted setting whitin Id' }
            });
        }
    
        res.status(200).json({
            ok: true,
            setting: settingDeleted 
        });

    });


});

module.exports = app;