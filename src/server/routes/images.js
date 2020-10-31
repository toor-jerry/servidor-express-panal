const express = require('express');
const { checkTokenUrl } = require('../middlewares/auth');
const path = require('path');
const fs = require('fs');

const app = express();

app.get('/:colection/:img', checkTokenUrl, (req, res) => {

    const colection = req.params.colection;
    const img = req.params.img;

    const pathImg = path.resolve(__dirname, `../uploads/${ colection }/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        res.status(404).json({
            ok: false,
            message: 'Not found image!!'
        });
    }


});

module.exports = app;