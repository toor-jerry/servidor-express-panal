const MessageModel = require('../models/message');
const AnswerModel = require('../models/answer');
const { Upload } = require('../classes/upload');

const { response500, response400, response200, response201 } = require('../utils/utils');


class Message {

    static findAll(room, from, limit) {
        return new Promise((resolve, reject) => {

            MessageModel.find({ room: room })
                .skip(from)
                .limit(limit)
                .sort({ 'date': -1 })
                .populate('sender', 'name user thumbnail_photography')
                .exec((err, messages) => {

                    if (err) return reject({ code: 500, err });

                    MessageModel.countDocuments({ room: room }, (err, count) => {

                        if (err) return reject({ code: 500, err });

                        resolve({
                            messages,
                            total: count
                        });

                    });
                });
        });
    }

    static findById(res, room, id) {

        MessageModel.findById({ room: room, _id: id })
            .populate('sender', 'name user thumbnail_photography')
            .exec((err, message) => {

                if (err) return response500(res, err);
                if (!message) return response400(res, 'Message not found.');

                response200(res, message);
            });
    }

    static create(data) {
        return new Promise((resolve, reject) => {
            if (!data.message)
                return reject({ code: 400, err: 'No message.' });

            let message = new MessageModel(data);
            message.save((err, messageCreated) => {

                if (err) return reject({ code: 500, err });

                if (!messageCreated) return reject({ code: 400, err: 'Could not create the message.' });

                resolve({ data: messageCreated });
            });
        });
    }

    static delete(room, sender, id) {

        return new Promise((resolve, reject) => {

            if (!room)
                return reject({ code: 400, err: 'No room.' });

            if (!id)
                return reject({ code: 400, err: 'No message.' });

            MessageModel.findOneAndRemove({ room: room, sender: sender, _id: id }, (err, messageDeleted) => {

                if (err) return reject({ code: 500, err });
                if (!messageDeleted) return response400({ code: 500, msg: 'Could not delete the message.' });

                if (messageDeleted.type === 'IMG' || messageDeleted.type === 'FILE') {

                    let upload = new Upload();
                    upload.deleteFile('messages', messageDeleted.message);
                }

                resolve({ data: messageDeleted });
            });
        });
    }

    static searchMessages = (room, regex, from = 0, limit = 10) => {

        return new Promise((resolve, reject) => {

            MessageModel.find({ room: room })
                .or([{ 'message': regex }, { 'fileName': regex }])
                .skip(from)
                .limit(limit)
                .populate('sender', '_id name last_name user email thumbnail_photography')
                .exec((err, messages) => {
                    if (err) reject(`Could not found ${regex} in messages.`, err);
                    MessageModel.countDocuments({ room: room })
                        .or([{ 'message': regex }, { 'fileName': regex }])
                        .exec((err, total) => {
                            if (err) reject(`Could not found ${regex} in messages.`, err);
                            else resolve({
                                data: messages,
                                total
                            });
                        });
                });
        });
    };
}


module.exports = {
    Message
}