const express = require('express');

const jwt = require('jsonwebtoken');

const mdAuth = require('../middlewares/auth');

const app = express();

const Postulation = require('../models/postulation');

// ==========================
// Get all postulation
// ==========================
app.get('/', (req, res) => {

    Postulation.find({}, (err, postulation) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error charging postulation',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                postulation
            });

        });

});

// ==========================
// Update postulation  mdAuth.checkToken,
// ==========================

app.put('/:id', (req, res) => {

    const id = req.params.id;
    const body = req.body;

    Postulation.findById( id, (err, postulation) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error find postulation',
                errors: err
            });
        }

        if ( !postulation ) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Postulation no exists!!',
                    errors: { message: 'No exists a Postulation whith id' }
                });
            }
        }

        postulation.employment = body.employment;
        postulation.user = body.user;
        

        postulation.save( (err, postulationUpdated) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error at update postulation',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                postulation: postulationUpdated
            });

        });

    });
    
});


// ==========================
// Create a postulation mdAuth.checkToken,
// ==========================

app.post('/',  (req, res) => {
    
    const body = req.body;

    let postulation = new Postulation({
            employment: body.employment,
            user: body.user
    });
    
    postulation.save( (err, postulationUpdated) => {
    
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error at create postulation',
                    errors: err
                });
            }
    
            res.status(201).json({
                ok: true,
                postulation: postulationUpdated
            });
    
        });

});

// ==========================
// Delete a employment by Id mdAuth.checkToken,
// ==========================

app.delete('/:id',  (req, res) => {

    const id = req.params.id;

    Postulation.findByIdAndRemove(id, (err, postulationDeleted) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error at delete postulation',
                errors: err
            });
        }

        if ( !postulationDeleted ) {
            return res.status(400).json({
                ok: false,
                message: 'Not deleted postulation',
                errors: { message: 'Not deleted postulation whitin Id' }
            });
        }
    
        res.status(200).json({
            ok: true,
            postulation: postulationDeleted 
        });

    });


});

module.exports = app;