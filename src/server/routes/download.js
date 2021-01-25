const express = require('express');

const { checkToken, checkAdmin_Role } = require('../middlewares/auth');
const { Download } = require('../classes/download');


const app = express();

// ==========================
// Get all downloads
// ==========================
app.get('/', (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    Download.findAll(res, from, limit);
});

// ==========================
// Get download by Id
// ==========================
app.get('/:id', (req, res) => Download.findById(res, req.params.id));

// ==========================
// Get download by platform
// ==========================
app.get('/:platform/:architecture', (req, res) => Download.findByPlatform(res, req.params.platform, req.params.architecture));


// ==========================
// Create a download
// ==========================
app.post('/', [checkToken, checkAdmin_Role], (req, res) =>
    Download.create(res, {
        architecture: req.body.architecture,
        platform: req.body.platform,
        description: req.body.description,
        version: req.body.version,
        link: req.body.link,
        createAt: req.body.createAt
    })
);

// ==========================
// Update a download
// ==========================
app.put('/:id_download', [checkToken, checkAdmin_Role], (req, res) =>
    Download.update(res, req.params.id_download, {
        architecture: req.body.architecture,
        platform: req.body.platform,
        description: req.body.description,
        version: req.body.version,
        link: req.body.link,
        createAt: req.body.createAt
    })
);

// ==========================
// Delete download
// ==========================
app.delete('/:id_download', [checkToken, checkAdmin_Role], (req, res) =>
    Download.delete(res, req.params.id_download)
);

module.exports = app;