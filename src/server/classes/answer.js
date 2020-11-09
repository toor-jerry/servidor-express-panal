const AnswerModel = require('../models/answer');
const { response500, response400, response200, response201 } = require('../utils/utils');

class Answer {

    findAll(res, from, limit) {

        AnswerModel.find({})
            .skip(from)
            .limit(limit)
            .populate('user', 'name user role email chat_photography')
            .populate({
                path: 'question',
                populate: { path: 'user', select: 'name user role email chat_photography' }
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

    findById(res, id) {

        AnswerModel.findById(id)
            .exec((err, answer) => {

                if (err) return response500(res, err);
                if (!answer) return response400(res, 'Answer not found.');

                response200(res, answer);
            });

    }

    findByQuestion(res, question, from, limit) {

        AnswerModel.find({ question: question })
            .skip(from)
            .limit(limit)
            .populate('user', 'name user role email chat_photography')
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

    create(res, data) {

        let answer = new AnswerModel(data);
        answer.save((err, answerCreated) => {

            if (err) return response500(res, err);
            if (!answerCreated) return response400(res, 'Could not create the answer.');

            response201(res, answerCreated);
        });

    }

    update(res, id_answer, user, data) {

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

    delete(res, id_answer, user) {

        AnswerModel.findOneAndRemove({ _id: id_answer, user: user }, (err, answerDeleted) => {

            if (err) return response500(res, err);
            if (!answerDeleted) return response400(res, 'Could not delete the answer.');

            response200(res, answerDeleted);

        });

    }
}


module.exports = {
    Answer
}