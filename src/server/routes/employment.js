const express = require('express');

const _ = require('underscore');

const { checkToken, checkEnterprise_Role } = require('../middlewares/auth');

const app = express();

const Employment = require('../models/employment');

// ==========================
// Get all employments no-auth
// ==========================
app.get('/no-auth', (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    Employment.find({})
        .skip(from)
        .limit(limit)
        .sort('dateCreate')
        .populate('enterprise', 'name')
        .exec((err, employments) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error charging employments',
                    errors: err
                });
            }

            Employment.estimatedDocumentCount({}, (err, employmentsTotal) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error count employments',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    employments,
                    total: employmentsTotal
                });
            });

        });

});


// ==========================
// Get all employments
// ==========================
app.get('/', checkToken, (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    Employment.find({})
        .skip(from)
        .limit(limit)
        .populate('enterprise', 'name email role domicile description photography')
        .exec((err, employments) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error charging employments',
                    errors: err
                });
            }

            Employment.estimatedDocumentCount({}, (err, employmentsTotal) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error count employments',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    employments,
                    total: employmentsTotal
                });
            });

        });

});

// ==========================
// Update employment 
// ==========================

app.put('/:id', [checkToken, checkEnterprise_Role], (req, res) => {

    const id = req.params.id;
    const body = _.pick(req.body, ['name', 'enterprise', 'salary', 'horary', 'workable_days', 'description', 'vacancy_numbers', 'domicile', 'requeriments']);

    Employment.findByIdAndUpdate(id, body, { new: true }, (err, employmentUpdated) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error find employment',
                errors: err
            });
        }

        if (!employmentUpdated) {
            return res.status(400).json({
                ok: false,
                message: 'Employment no exists!!',
                errors: { message: 'No exists a employment whith id' }
            });
        }
        res.status(201).json({
            ok: true,
            employment: employmentUpdated
        });
    });

});


// ==========================
// Create a employment 
// ==========================

app.post('/', [checkToken, checkEnterprise_Role], (req, res) => {

    const body = req.body;
    Employment.count({ id_enterprise: body.id_enterprise, name: body.name }, (err, employmentFind) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error find employment',
                errors: err
            });
        }

        if (employmentFind) {
            return res.status(400).json({
                ok: false,
                message: 'Employment exists!!',
                errors: { message: 'Exists employment' }
            });
        }


        let employment = new Employment({
            name: body.name,
            salary: body.salary,
            enterprise: body.enterprise,
            horary: body.horary,
            workable_days: body.workable_days,
            description: body.description,
            vacancy_numbers: body.vacancy_numbers,
            domicile: body.domicile,
            requeriments: body.requeriments
        });

        employment.save((err, employmentSaved) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error at create employment',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                empleoyment: employmentSaved
            });

        });

    });

});

// ==========================
// Delete a employment by Id 
// ==========================

app.delete('/:id', [checkToken, checkEnterprise_Role], (req, res) => {

    const id = req.params.id;

    Employment.findByIdAndRemove(id, (err, employmentDeleted) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error at delete employment',
                errors: err
            });
        }

        if (!employmentDeleted) {
            return res.status(400).json({
                ok: false,
                message: 'Not delete employment',
                errors: { message: 'Not delete employment whitin Id' }
            });
        }

        res.status(200).json({
            ok: true,
            empleoyment: employmentDeleted
        });

    });


});

module.exports = app;