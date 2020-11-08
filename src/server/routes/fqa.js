const express = require('express');
const uuid = require('uuid');

const mdAuth = require('../middlewares/auth');

const app = express();

const { FQA } = require('../classes/fqa');
fqa = new FQA();
// ==========================
// Get all fqa
// ==========================
app.get('/', (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    fqa.findAll(from, limit, res);
    // FQA.find({})
    //     .skip(from)
    //     .limit(limit)
    //     .populate('user', 'name user email role')
    //     .exec((err, fqa) => {

    //         if (err) {
    //             return res.status(500).json({
    //                 ok: false,
    //                 message: 'Error charging fqa',
    //                 errors: err
    //             });
    //         }

    //         FQA.count({}, (err, count) => {

    //             if (err) {
    //                 return res.status(500).json({
    //                     ok: false,
    //                     message: 'Error count fqa',
    //                     errors: err
    //                 });
    //             }

    //             res.status(200).json({
    //                 ok: true,
    //                 fqa,
    //                 total: count
    //             });

    //         });

    //     });

});

// ==========================
// Update Question Add answer
// ==========================

// app.put('/:id', mdAuth.checkToken, (req, res) => {

//     const id = req.params.id;
//     const body = req.body;

//     FQA.findById(id, (err, fqa) => {

//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 message: 'Error find fqa',
//                 errors: err
//             });
//         }

//         if (!fqa) {
//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     message: 'FQA no exists!!',
//                     errors: {
//                         message: 'No exists a FQA whith id'
//                     }
//                 });
//             }
//         }

//         if (!body.question && !body.answer) {
//             return res.status(400).json({
//                 ok: false,
//                 message: 'No data'
//             });
//         }
//         if (body.question) {
//             fqa.question = {
//                 question: body.question,
//                 user: body._id
//             };
//         }
//         if (body.answer) {
//             fqa.answers.push({
//                 answer: body.answer,
//                 user: req.user._id
//             });
//         }

//         fqa.save((err, fqaUpdated) => {

//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     message: 'Error at update fqa',
//                     errors: err
//                 });
//             }

//             res.status(201).json({
//                 ok: true,
//                 fqa: fqaUpdated
//             });

//         });

//     });

// });

// // ==========================
// // Add answer
// // ==========================

// app.put('/answer/:id', mdAuth.checkToken, (req, res) => {

//     const id = req.params.id;
//     const body = req.body;

//     FQA.findById(id, (err, fqa) => {

//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 message: 'Error find fqa',
//                 errors: err
//             });
//         }

//         if (!fqa) {
//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     message: 'FQA no exists!!',
//                     errors: {
//                         message: 'No exists a FQA whith id'
//                     }
//                 });
//             }
//         }

//         if (!body.answer) {
//             res.status(400).json({
//                 ok: false,
//                 message: 'No data'
//             });
//         }

//         fqa.answers.push({
//             _id: uuid.v1(),
//             answer: body.answer,
//             user: req.user._id
//         });
//         fqa.save((err, fqaUpdated) => {

//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     message: 'Error at update fqa',
//                     errors: err
//                 });
//             }

//             res.status(201).json({
//                 ok: true,
//                 fqa: fqaUpdated
//             });

//         });




//     });

// });

// // ==========================
// // Edit answer
// // ==========================

// app.put('/answer/edit/:id', mdAuth.checkToken, (req, res) => {

//     const id = req.params.id;
//     const body = req.body;

//     FQA.findById(id, (err, fqa) => {

//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 message: 'Error find fqa',
//                 errors: err
//             });
//         }

//         if (!fqa) {
//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     message: 'FQA no exists!!',
//                     errors: {
//                         message: 'No exists a FQA whith id'
//                     }
//                 });
//             }
//         }

//         if (!body.answer) {
//             res.status(400).json({
//                 ok: false,
//                 message: 'No data'
//             });
//         }

//         fqa.answers.push({
//             answer: body.answer,
//             user: req.user._id
//         });
//         fqa.save((err, fqaUpdated) => {

//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     message: 'Error at update fqa',
//                     errors: err
//                 });
//             }

//             res.status(201).json({
//                 ok: true,
//                 fqa: fqaUpdated
//             });

//         });




//     });

// });

// // ==========================
// // Create a fqa
// // ==========================

// app.post('/', mdAuth.checkToken, (req, res) => {

//     const body = req.body;

//     let fqa = new FQA({
//         question: {
//             question: body.question,
//             user: req.user._id
//         },
//         answers: {
//             answer: body.answer,
//             user: req.user._id
//         }
//     });

//     fqa.save((err, fqaUpdated) => {

//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 message: 'Error at create fqa',
//                 errors: err
//             });
//         }

//         res.status(201).json({
//             ok: true,
//             fqa: fqaUpdated
//         });

//     });

// });


// // ==========================
// // Create a question
// app.put('/:id', mdAuth.checkToken, (req, res) => {

//     const id = req.params.id;
//     const body = req.body;

//     FQA.findById(id, (err, fqa) => {

//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 message: 'Error find fqa',
//                 errors: err
//             });
//         }

//         if (!fqa) {
//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     message: 'FQA no exists!!',
//                     errors: {
//                         message: 'No exists a FQA whith id'
//                     }
//                 });
//             }
//         }

//         if (!body.question && !body.answer) {
//             return res.status(400).json({
//                 ok: false,
//                 message: 'No data'
//             });
//         }
//         if (body.question) {
//             fqa.question = {
//                 question: body.question,
//                 user: body._id
//             };
//         }
//         if (body.answer) {
//             fqa.answers.push({
//                 answer: body.answer,
//                 user: req.user._id
//             });
//         }

//         fqa.save((err, fqaUpdated) => {

//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     message: 'Error at update fqa',
//                     errors: err
//                 });
//             }

//             res.status(201).json({
//                 ok: true,
//                 fqa: fqaUpdated
//             });

//         });

//     });

// });

// // ==========================
// // Add answer
// // ==========================

// app.put('/answer/:id', mdAuth.checkToken, (req, res) => {

//     const id = req.params.id;
//     const body = req.body;

//     FQA.findById(id, (err, fqa) => {

//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 message: 'Error find fqa',
//                 errors: err
//             });
//         }

//         if (!fqa) {
//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     message: 'FQA no exists!!',
//                     errors: {
//                         message: 'No exists a FQA whith id'
//                     }
//                 });
//             }
//         }

//         if (!body.answer) {
//             res.status(400).json({
//                 ok: false,
//                 message: 'No data'
//             });
//         }

//         fqa.answers.push({
//             _id: uuid.v1(),
//             answer: body.answer,
//             user: req.user._id
//         });
//         fqa.save((err, fqaUpdated) => {

//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     message: 'Error at update fqa',
//                     errors: err
//                 });
//             }

//             res.status(201).json({
//                 ok: true,
//                 fqa: fqaUpdated
//             });

//         });




//     });

// });

// // ==========================
// // Edit answer
// // ==========================

// app.put('/answer/edit/:id', mdAuth.checkToken, (req, res) => {

//     const id = req.params.id;
//     const body = req.body;

//     FQA.findById(id, (err, fqa) => {

//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 message: 'Error find fqa',
//                 errors: err
//             });
//         }

//         if (!fqa) {
//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     message: 'FQA no exists!!',
//                     errors: {
//                         message: 'No exists a FQA whith id'
//                     }
//                 });
//             }
//         }

//         if (!body.answer) {
//             res.status(400).json({
//                 ok: false,
//                 message: 'No data'
//             });
//         }

//         fqa.answers.push({
//             answer: body.answer,
//             user: req.user._id
//         });
//         fqa.save((err, fqaUpdated) => {

//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     message: 'Error at update fqa',
//                     errors: err
//                 });
//             }

//             res.status(201).json({
//                 ok: true,
//                 fqa: fqaUpdated
//             });

//         });




//     });

// });

// // ==========================
// // Create a fqa
// // ==========================

// app.post('/', mdAuth.checkToken, (req, res) => {

//     const body = req.body;

//     let fqa = new FQA({
//         question: {
//             question: body.question,
//             user: req.user._id
//         },
//         answers: {
//             answer: body.answer,
//             user: req.user._id
//         }
//     });

//     fqa.save((err, fqaUpdated) => {

//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 message: 'Error at create fqa',
//                 errors: err
//             });
//         }

//         res.status(201).json({
//             ok: true,
//             fqa: fqaUpdated
//         });

//     });

// });


// // ==========================
// // Create a question
// // ==========================

// app.post('/question', mdAuth.checkToken, (req, res) => {

//     const body = req.body;

//     let fqa = new FQA({
//         question: {
//             question: body.question,
//             user: req.user._id
//         }
//     });

//     fqa.save((err, fqaUpdated) => {

//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 message: 'Error at create fqa',
//                 errors: err
//             });
//         }

//         res.status(201).json({
//             ok: true,
//             fqa: fqaUpdated
//         });

//     });

// });

// // ==========================
// // Delete fqa by Id mdAuth.checkToken,
// // ==========================

// app.delete('/:id', (req, res) => {

//     const id = req.params.id;

//     FQA.findByIdAndRemove(id, (err, fqaDeleted) => {

//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 message: 'Error at delete fqa',
//                 errors: err
//             });
//         }

//         if (!fqaDeleted) {
//             return res.status(400).json({
//                 ok: false,
//                 message: 'Not deleted fqa',
//                 errors: {
//                     message: 'Not deleted fqa whitin Id'
//                 }
//             });
//         }

//     });


// });

// // ==========================
// // Delete answer
// // ==========================

// app.delete('/answer/:id_question/:id_answer', (req, res) => {

//     const id_question = req.params.id_question;
//     const id_answer = req.params.id_answer;

//     FQA.findById(id_question)
//         .exec((err, fqa) => {

//             if (err) {
//                 return res.status(500).json({
//                     ok: false,
//                     message: 'Error at delete answer',
//                     errors: err
//                 });
//             }

//             if (!fqa) {
//                 return res.status(400).json({
//                     ok: false,
//                     message: 'Not found fqa',
//                     errors: {
//                         message: 'Not found fqa'
//                     }
//                 });
//             }

//             fqa.answers = fqa.answers.pull({ _id: id_answer })

//             fqa.save((err, answerDeleted) => {

//                 if (err) {
//                     return res.status(400).json({
//                         ok: false,
//                         message: 'Error at delete answer',
//                         errors: err
//                     });
//                 }

//                 res.status(201).json({
//                     ok: true,
//                     answers: answerDeleted
//                 });

//             });

//         });


// });

// // ==========================

// app.post('/question', mdAuth.checkToken, (req, res) => {

//     const body = req.body;

//     let fqa = new FQA({
//         question: {
//             question: body.question,
//             user: req.user._id
//         }
//     });

//     fqa.save((err, fqaUpdated) => {

//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 message: 'Error at create fqa',
//                 errors: err
//             });
//         }

//         res.status(201).json({
//             ok: true,
//             fqa: fqaUpdated
//         });

//     });

// });

// // ==========================
// // Delete fqa by Id mdAuth.checkToken,
// // ==========================

// app.delete('/:id', (req, res) => {

//     const id = req.params.id;

//     FQA.findByIdAndRemove(id, (err, fqaDeleted) => {

//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 message: 'Error at delete fqa',
//                 errors: err
//             });
//         }

//         if (!fqaDeleted) {
//             return res.status(400).json({
//                 ok: false,
//                 message: 'Not deleted fqa',
//                 errors: {
//                     message: 'Not deleted fqa whitin Id'
//                 }
//             });
//         }

//     });


// });

// // ==========================
// // Delete answer
// // ==========================

// app.delete('/answer/:id_question/:id_answer', (req, res) => {

//     const id_question = req.params.id_question;
//     const id_answer = req.params.id_answer;

//     FQA.findById(id_question)
//         .exec((err, fqa) => {

//             if (err) {
//                 return res.status(500).json({
//                     ok: false,
//                     message: 'Error at delete answer',
//                     errors: err
//                 });
//             }

//             if (!fqa) {
//                 return res.status(400).json({
//                     ok: false,
//                     message: 'Not found fqa',
//                     errors: {
//                         message: 'Not found fqa'
//                     }
//                 });
//             }

//             fqa.answers = fqa.answers.pull({ _id: id_answer })

//             fqa.save((err, answerDeleted) => {

//                 if (err) {
//                     return res.status(400).json({
//                         ok: false,
//                         message: 'Error at delete answer',
//                         errors: err
//                     });
//                 }

//                 res.status(201).json({
//                     ok: true,
//                     answers: answerDeleted
//                 });

//             });

//         });


// });

module.exports = app;