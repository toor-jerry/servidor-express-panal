const MessageModel = require('../models/message');

const { response500, response400, response200, response201 } = require('../utils/utils');

class Message {

    findAll(res, room, from, limit) {

        MessageModel.find({ room: room })
            .skip(from)
            .limit(limit)
            .populate('sender', 'name user thumbnail_photography')
            .exec((err, messages) => {

                if (err) return response500(res, err);

                MessageModel.countDocuments((err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: messages,
                        total: count
                    });

                });

            });
    }

    findById(res, room, id) {

        MessageModel.findById({ room: room, _id: id })
            .populate('sender', 'name user thumbnail_photography')
            .exec((err, message) => {

                if (err) return response500(res, err);
                if (!message) return response400(res, 'Message not found.');

                response200(res, message);
            });
    }

    create(res, data) {

        let message = new MessageModel(data);
        message.save((err, messageCreated) => {

            if (err) return response500(res, err);
            if (!messageCreated) return response400(res, 'Could not create the message.');

            response201(res, messageCreated);
        });

    }

    delete(res, room, sender, id) {

        MessageModel.findOneAndRemove({ room: room, sender: sender, _id: id }, (err, messageDeleted) => {

            if (err) return response500(res, err);
            if (!messageDeleted) return response400(res, 'Could not delete the message.');
            return response200(res, messageDeleted);
        });

    }
}


module.exports = {
    Message
}