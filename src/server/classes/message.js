const MessageModel = require('../models/message');
const { Upload } = require('../classes/upload');

const { response500, response400, response200, response201 } = require('../utils/utils');


class Message {

    static findAll(res, room, from, limit) {

        MessageModel.find({ room: room })
            .skip(from)
            .limit(limit)
            .populate('sender', 'name user thumbnail_photography')
            .exec((err, messages) => {

                if (err) return response500(res, err);

                MessageModel.countDocuments({ room: room }, (err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: messages,
                        total: count
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

    static create(res, data) {

        let message = new MessageModel(data);
        message.save((err, messageCreated) => {

            if (err) return response500(res, err);
            if (!messageCreated) return response400(res, 'Could not create the message.');

            response201(res, messageCreated);
        });

    }

    static delete(res, room, sender, id) {

        MessageModel.findOneAndRemove({ room: room, sender: sender, _id: id }, (err, messageDeleted) => {

            if (err) return response500(res, err);
            if (!messageDeleted) return response400(res, 'Could not delete the message.');

            if (messageDeleted.type === 'IMG' || messageDeleted.type === 'FILE') {

                let upload = new Upload();
                upload.deleteFile('messages', messageDeleted.message);
            }

            return response200(res, messageDeleted);
        });

    }

    static searchMessages = (room, regex, from = 0, limit = 10) => {

        return new Promise((resolve, reject) => {

            MessageModel.find({ room: room }, 'message date')
                .and({ 'message': regex })
                .skip(from)
                .limit(limit)
                .exec((err, messages) => {

                    if (err) reject(`Could not found ${regex} in messages.`, err);
                    else resolve(messages);

                });
        });
    };
}


module.exports = {
    Message
}