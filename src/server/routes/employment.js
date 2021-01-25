const express = require('express');

const { Employment } = require('../classes/employment');

const { checkToken, checkEnterprise_Role } = require('../middlewares/auth');
const { io } = require('../app');

const app = express();

// ==========================
// Get all employments no-auth
// ==========================
app.get('/no-auth', (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    let params_populate = 'name';

    Employment.findAll(res, params_populate, from, limit, false);

});

// ==========================
// Get all employments (employments, social service and professional practices)
// whitout postulations
// ==========================
app.get('/', checkToken, (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    let params_populate = 'name email role domicile description photography';

    Employment.findAll(res, params_populate, req.user._id, from, limit, true);

});

// ==========================
// Get all employments
// whitout postulations
// ==========================
app.get('/employments-whitout-postulations', checkToken, (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    let params_populate = 'name email role domicile description photography';

    Employment.findOnlyEmployments(res, params_populate, req.user._id, from, limit, true);

});


// ==========================
// Get all society service
// whitout postulations
// ==========================
app.get('/society-service-whitout-postulations', checkToken, (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    let params_populate = 'name email role domicile description photography';

    Employment.findSocialServiceWhitouthPostulations(res, params_populate, req.user._id, from, limit, true);

});

// ==========================
// Get all professional practice
// whitout postulations
// ==========================
app.get('/professional-practice-whitout-postulations', checkToken, (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    let params_populate = 'name email role domicile description photography';

    Employment.findProfessionalPracticeWhitouthPostulations(res, params_populate, req.user._id, from, limit, true);

});

// ==========================
// Get employment by id
// ==========================
app.get('/:id', checkToken, (req, res) => Employment.findById(res, req.params.id));

// ==========================
// Get employments by enterprise
// ==========================
app.get('/enterprise/all', checkToken, (req, res) => {

    id = req.query.id || req.user._id;
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    Employment.findByEnterprise(res, id, from, limit);
});

// ==========================
// Get social service
// ==========================
app.get('/social/service', checkToken, (req, res) => {
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    Employment.findSocialService(res, from, limit);
});

// ==========================
// Get profesional practices
// ==========================
app.get('/profesional/practices', checkToken, (req, res) => {
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    Employment.findProfesionalPractices(res, from, limit);
});

// ==========================
// Update employment
// ==========================
app.put('/:id', [checkToken, checkEnterprise_Role], (req, res) => Employment.update(res, req.params.id, req.user._id, req.body));

// ==========================
// Create a employment 
// ==========================
app.post('/', [checkToken, checkEnterprise_Role], (req, res) => {

    let body = req.body;
    body.enterprise = req.user._id;
    Employment.create(body)
        .then(resp => {
            res.status(201).json(resp);
            io.emit('new-employment', resp);
        })
        .catch(err => { res.status(err.code).json(err.err) });
});

// ==========================
// Count social service 
// ==========================
app.get('/count/social-service', checkToken, (req, res) => {

    Employment.countSocietyService(req.user._id)
        .then(resp => res.status(200).json(resp))
        .catch(err => { res.status(err.code).json(err.err) });
});

// ==========================
// Count professional practice 
// ==========================
app.get('/count/professional-practice', checkToken, (req, res) => {

    Employment.countProfessionalPractice(req.user._id)
        .then(resp => res.status(200).json(resp))
        .catch(err => { res.status(err.code).json(err.err) });
});

// ==========================
// Delete a employment by Id 
// ==========================
app.delete('/:employment', [checkToken, checkEnterprise_Role], (req, res) => Employment.delete(res, req.params.employment, req.user._id));

module.exports = app;