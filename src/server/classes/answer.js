const AnswerModel = require('../models/answer');
const { response500, response400, response200, response201 } = require('../utils/utils');

class Answer {

    static findAll(res, from, limit) {

        AnswerModel.find({})
            .skip(from)
            .limit(limit)
            .populate('user', 'name last_name user role email thumbnail_photography')
            .populate({
                path: 'question',
                populate: { path: 'user', select: 'name user last_name role email thumbnail_photography' }
            })
            .exec((err, answers) => {

                if (err) return response500(res, err);

                AnswerModel.countDocuments((err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: answers,
                        total: count
                    });

                });

            });
    }

    static findById(res, id) {

        AnswerModel.findById(id)
            .populate('user', 'name last_name user role email thumbnail_photography')
            .exec((err, answer) => {

                if (err) return response500(res, err);
                if (!answer) return response400(res, 'Answer not found.');

                response200(res, answer);
            });

    }

    static findByQuestion(res, question, from, limit) {

        AnswerModel.find({ question: question })
            .skip(from)
            .limit(limit)
            .populate('user', 'name last_name user role email thumbnail_photography')
            .exec((err, answers) => {

                if (err) return response500(res, err);
                if (!answers) return response400(res, 'Answers not found.');

                AnswerModel.countDocuments({ question: question }, (err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: answers,
                        total: count
                    });
                });
            });

    }

    static create(res, data) {

        let answer = new AnswerModel(data);
        answer.save((err, answerCreated) => {

            if (err) return response500(res, err);
            if (!answerCreated) return response400(res, 'Could not create the answer.');

            response201(res, answerCreated);
        });

    }

    static update(res, id_answer, user, data) {

        AnswerModel.findOne({ _id: id_answer, user: user }, (err, answer) => {
            if (err) return response500(res, err);
            if (!answer) return response400(res, 'Answer not found.');

            answer.question = data.question;
            answer.user = data.user;
            answer.answer = data.answer;

            answer.save((err, answerUpdated) => {
                if (err) return response500(res, err);
                if (!answerUpdated) return response400(res, 'Could not update the answer.');
                response200(res, answerUpdated);
            });
        });
    }

    static delete(res, id_answer, user) {

        AnswerModel.findOneAndRemove({ _id: id_answer, user: user }, (err, answerDeleted) => {

            if (err) return response500(res, err);
            if (!answerDeleted) return response400(res, 'Could not delete the answer.');

            response200(res, answerDeleted);

        });

    }

    static searchAnswer = (regex, from = 0, limit = 10) => {

        return new Promise((resolve, reject) => {

            AnswerModel.find({}, 'answer createAt')
                ([{ 'answer': regex }])
                .skip(from)
                .limit(limit)
                .exec((err, answers) => {
                    if (err) reject('Error at find question.', err);
                    AnswerModel.countDocuments({})
                        .and([{ 'answer': regex }])
                        .exec((err, total) => {
                            if (err) reject('Error at find question.', err);
                            else resolve({
                                data: answers,
                                total
                            });
                        });
                });
        });
    }
}


module.exports = {
    Answer
}