const express = require('express');
const { checkToken } = require('../middlewares/auth');
const path = require('path');
const fs = require('fs');

const { response404 } = require('../utils/utils');

const app = express();

app.get('/:colection/:img', checkToken, (req, res) => {

    const colection = req.params.colection;
    const img = req.params.img;

    const pathImg = path.resolve(__dirname, `../../../uploads/${ colection }/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        response404(res);
    }

});

module.exports = app;