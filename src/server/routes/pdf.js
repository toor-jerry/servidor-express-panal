const express = require('express');
const { checkToken } = require('../middlewares/auth');

const { PDF } = require('../classes/pdf');
const { pdf } = require('../classes/pdf2');
const fs = require('fs');
const path = require('path');
const { response404 } = require('../utils/utils');
const app = express();

app.get('/', checkToken, (req, res) => {
    PDF.generatePDF(req.user._id)
        .then(fileName => {
            const pathPdf = path.resolve(__dirname, `../../../uploads/cv/${ fileName }`);


            if (fs.existsSync(pathPdf)) {
                res.set({
                    "Content-Type": "application/pdf"
                });
                // res.sendFile(pathPdf);
                res.status(201).json({ ok: true, data: fileName })

            } else {
                response404(res);
            }
        })
        .catch(err => res.status(err.code).json(err.err));
});
// app.get('/', checkToken, (req, res) => {
//     pdf(req, res)
// });



module.exports = app;