const _ = require('underscore');
const PostulationModel = require('../models/postulation');

const { response500, response400, response200, response201 } = require('../utils/utils');

class Postulation {

    static findAll(res, from, limit) {

        PostulationModel.find({})
            .skip(from)
            .limit(limit)
            .populate({
                path: 'employment',
                populate: { path: 'user', select: 'name user role email thumbnail_photography' }
            })
            .populate('user', 'name username email')
            .exec((err, postulations) => {

                if (err) return response500(res, err);

                PostulationModel.countDocuments((err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: postulations,
                        total: count
                    });

                });

            });
    }

    static findByEmployments(res, user, from, limit) {

        PostulationModel.find({ user: user })
            .skip(from)
            .limit(limit)
            .populate({
                path: 'employment',
                populate: { path: 'user', select: 'name user role email thumbnail_photography' }
            })
            .exec((err, postulations) => {
                if (err) return response500(res, err);

                let postulationsTmp = [];
                _.filter(postulations, (post) => {
                    if (post.employment.type === 'JOB_OFFER') {
                        postulationsTmp.push(post.employment)
                    }
                });
                res.status(200).json({
                    ok: true,
                    data: postulationsTmp,
                    total: postulationsTmp.length
                });

            });

    }

    static findBySocietyService(res, user, from, limit) {

        PostulationModel.find({ user: user })
            .populate({
                path: 'employment',
                populate: { path: 'user', select: 'name user role email thumbnail_photography' }
            })
            .exec((err, postulations) => {
                if (err) return response500(res, err);

                let postulationsTmp = [];
                _.filter(postulations, (post) => {
                    if (post.employment.type === 'SOCIETY_SERVICE') {
                        postulationsTmp.push(post.employment)
                    }
                });
                res.status(200).json({
                    ok: true,
                    data: postulationsTmp,
                    total: postulationsTmp.length
                });

            });

    }

    static findByProfessionalService(res, user, from, limit) {

        PostulationModel.find({ user: user })
            .populate({
                path: 'employment',
                populate: { path: 'user', select: 'name user role email thumbnail_photography' }
            })
            .exec((err, postulations) => {
                if (err) return response500(res, err);

                let postulationsTmp = [];
                _.filter(postulations, (post) => {
                    if (post.employment.type === 'PROFESSIONAL_PRACTICES') {
                        postulationsTmp.push(post.employment)
                    }
                });
                res.status(200).json({
                    ok: true,
                    data: postulationsTmp,
                    total: postulationsTmp.length
                });

            });

    }

    static findAllByUser(res, user, from, limit) {

        PostulationModel.find({ user: user })
            .skip(from)
            .limit(limit)
            .populate({
                path: 'employment',
                populate: { path: 'user', select: 'name user role email thumbnail_photography' }
            })
            .exec((err, postulations) => {

                if (err) return response500(res, err);

                PostulationModel.countDocuments((err, count) => {

                    if (err) return response500(res, err);
                    let postulationsTmp = [];
                    _.filter(postulations, (post) => {
                        postulationsTmp.push(post.employment)
                    });
                    res.status(200).json({
                        ok: true,
                        data: postulationsTmp,
                        total: count
                    });

                });

            });
    }


    static findById(res, id) {

        PostulationModel.findById(id)
            .populate({
                path: 'employment',
                populate: { path: 'user', select: 'name user role email thumbnail_photography' }
            })
            .populate('user', 'name username email')
            .exec((err, postulation) => {

                if (err) return response500(res, err);
                if (!postulation) return response400(res, 'Postulation not found.');

                response200(res, postulation);
            });

    }

    static create(res, data) {
        PostulationModel.findOne({ employment: data.employment, user: data.user }, (err, postulationDB) => {
            if (err) return response500(res, err);
            if (postulationDB) return response400(res, 'You alredy postulate.');

            let postulation = new PostulationModel(data);
            postulation.save((err, postulationCreated) => {

                if (err) return response500(res, err);
                if (!postulationCreated) return response400(res, 'Could not create the postulation.');

                response201(res, postulationCreated);
            });

        });
    }

    static delete(res, id_postulation, user) {

        PostulationModel.findOneAndRemove({ _id: id_postulation, user: user }, (err, postulationDeleted) => {

            if (err) return response500(res, err);
            if (!postulationDeleted) return response400(res, 'Could not delete the postulation.');

            response200(res, postulationDeleted);

        });

    }
}


module.exports = {
    Postulation
}