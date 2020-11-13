const ConnectionModel = require('../models/connection');

const { response500, response400, response200, response201 } = require('../utils/utils');


class Connection {

    findAll(res, user, from, limit) {

        ConnectionModel.find({ user: user })
            .skip(from)
            .limit(limit)
            .exec((err, connections) => {

                if (err) return response500(res, 'Not found connections.');

                ConnectionModel.countDocuments({ user: user }, (err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: connections,
                        total: count
                    });
                });
            });
    }

    findById(res, id) {

        ConnectionModel.findById(id)
            .populate('user', 'name user email role chat_photography')
            .exec((err, connection) => {

                if (err) return response500(res, err);
                if (!connection) return response400(res, 'Connection not found.');

                response200(res, connection);
            });

    }

    create(res, data) {

        let connection = new ConnectionModel(data);
        connection.save((err, connectionCreated) => {

            if (err) return response500(res, err);
            if (!connectionCreated) return response400(res, 'Could not create the connection.');

            response201(res, connectionCreated);
        });

    }

    delete(res, user) {

        ConnectionModel.deleteMany({ user: user }, (err, result) => {

            if (err) return response500(res, err);
            if (!result) return response400(res, 'Could not delete the connections.');

            return res.status(200).json({
                ok: true,
                totalDeleted: result.deletedCount
            });

        });

    }
}


module.exports = {
    Connection
}