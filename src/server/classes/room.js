const _ = require('underscore');

const RoomModel = require('../models/room');
const MessageModel = require('../models/message');
const { Upload } = require('../classes/upload');

const { response500, response400, response200, response201 } = require('../utils/utils');

class Room {

    static findAll(res, from, limit) {

        RoomModel.find({})
            .skip(from)
            .limit(limit)
            .exec((err, rooms) => {

                if (err) return response500(res, err);

                RoomModel.countDocuments((err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: rooms,
                        total: count
                    });

                });
            });
    }

    static findById(res, id) {

        RoomModel.findById(id)
            .populate('participants', 'user name thumbnail_photography')
            .populate('admins', 'user name thumbnail_photography')
            .exec((err, room) => {

                if (err) return response500(res, err);
                if (!room) return response400(res, 'Room not found.');

                response200(res, room);
            });

    }

    static create(res, data) {
        let room = new RoomModel(data);

        room.save((err, roomCreated) => {
            if (err) return response500(res, err);
            if (!roomCreated) return response400(res, 'Could not create the room.');

            response201(res, roomCreated);
        });
    }

    static update(res, id, data) {

        RoomModel.findById(id, (err, room) => {
            if (err) return response500(res, err);
            if (!room) return response400(res, 'Room not found.');

            room = _.extend(room, _.pick(data, ['name', 'theme', 'private']));

            room.save((err, roomUpdated) => {
                if (err) return response500(res, err);
                if (!roomUpdated) return response400(res, 'Could not update the room.');
                response200(res, roomUpdated);
            });
        });
    }

    static delete(res, room) {

        RoomModel.findByIdAndDelete(room, (err, roomDeleted) => {
            if (err) return response500(res, err);
            if (!roomDeleted) return response400(res, 'Could not delete the room.');

            let upload = new Upload();

            MessageModel.find({ room: room, $or: [{ type: 'IMG' }, { type: 'FILE' }] }, (err, messagess) => {
                if (err) return response500(res, err, 'Could not found the messagess.');

                for (const message of messagess) {
                    upload.deleteFile('messages', message.message);
                }
            });
            MessageModel.deleteMany({ room: room }, (err, result) => {
                if (err) return response500(res, err, 'Could not delete the messagess.');
                return res.status(200).json({
                    ok: true,
                    data: roomDeleted,
                    totalDeleted: result.deletedCount
                });
            });
        });
    }

    static updateRoomAddParticipant(res, room, participant) {

        RoomModel.findByIdAndUpdate(room, { $addToSet: { participants: participant } }, { new: true })
            .populate('participants', 'name last_name email')
            .exec((err, room) => {
                if (err)
                    return response500(res, err);

                if (!room)
                    return response400(res, 'Could not add the participant.');

                return response201(res, room.participants);
            });
    }

    static updateRoomAddAdmin(res, room, admin) {

        RoomModel.findByIdAndUpdate(room, { $addToSet: { admins: admin } }, { new: true })
            .populate('admins', 'name last_name email')
            .exec((err, room) => {
                if (err)
                    return response500(res, err);

                if (!room)
                    return response400(res, 'Could not add the admins.');

                return response201(res, room.admins);
            });
    }

    static updateRoomDeleteParticipant(res, room, user) {

        RoomModel.findByIdAndUpdate(room, { $pullAll: { participants: user, admins: user } }, { new: true })
            .populate('participants', 'name last_name email')
            .populate('admins', 'name last_name email')
            .exec((err, room) => {
                if (err)
                    return response500(res, err);

                if (!room)
                    return response400(res, 'Could not remove the user of room.');

                return res.status(200).json({
                    ok: true,
                    data: {
                        participants: room.participants,
                        admins: room.admins
                    }
                });
            });
    }

    static searchRoom = (regex) => {

        return new Promise((resolve, reject, from = 0, limit = 10) => {

            RoomModel.find({ private: false }, 'name')
                .and([{ 'name': regex }])
                .skip(from)
                .limit(limit)
                .exec((err, rooms) => {

                    if (err) {
                        reject('Error at find room', err);
                    } else {
                        resolve(rooms);
                    }
                });
        });
    };

}

module.exports = {
    Room
}