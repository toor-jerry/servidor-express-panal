const QuestionModel = require('../models/question');
const AnswerModel = require('../models/answer');

const { response500, response400, response200, response201 } = require('../utils/utils');

class Question {

    static findAll(res, from, limit) {

        QuestionModel.find({})
            .skip(from)
            .limit(limit)
            .sort('question')
            .populate('user', 'name last_name user role email thumbnail_photography')
            .exec((err, questions) => {

                if (err) return response500(res, err);

                QuestionModel.countDocuments((err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: questions,
                        total: count
                    });

                });

            });
    }

    static findById(res, id) {

        QuestionModel.findById(id)
            .populate('user', 'name last_name user email role thumbnail_photography')
            .exec((err, question) => {

                if (err) return response500(res, err);
                if (!question) return response400(res, 'Question not found.');

                response200(res, question);
            });

    }

    static create(res, data) {

        let question = new QuestionModel(data);
        question.save((err, questionCreated) => {

            if (err) return response500(res, err);
            if (!questionCreated) return response400(res, 'Could not create the question.');

            response201(res, questionCreated);
        });

    }

    static update(res, id_question, user, data) {

        QuestionModel.findOne({ _id: id_question, user: user }, (err, questionDB) => {
            if (err) return response500(res, err);
            if (!questionDB) return response400(res, 'Not found question.');

            questionDB.question = data.question;
            questionDB.user = data.user;

            questionDB.save((err, questionUpdated) => {
                if (err) return response500(res, err);
                if (!questionUpdated) return response400(res, 'Could not update the question.');
                response200(res, questionUpdated);
            });
        });
    }

    static delete(res, id_question, user) {

        QuestionModel.findOneAndRemove({ _id: id_question, user: user }, (err, questionDeleted) => {

            if (err) return response500(res, err);
            if (!questionDeleted) return response400(res, 'Could not delete the question.');

            AnswerModel.deleteMany({ question: id_question }, (err, result) => {
                if (err) return response500(res, err, 'Could not delete the answers.');
                return res.status(200).json({
                    ok: true,
                    data: questionDeleted,
                    totalDeleted: result.deletedCount
                });
            });


        });

    }

    static searchQuestion = (regex, from = 0, limit = 10) => {

        return new Promise((resolve, reject) => {

            QuestionModel.find({}, 'question createAt')
                .and([{ 'question': regex }])
                .skip(from)
                .limit(limit)
                .exec((err, questions) => {

                    if (err) reject('Error at find question.', err);

                    QuestionModel.countDocuments({})
                        .and([{ 'question': regex }])
                        .exec((err, total) => {
                            if (err) reject('Error at find question.', err);
                            else resolve({
                                data: questions,
                                total
                            });
                        });
                });
        });
    };
}


module.exports = {
    Question
}