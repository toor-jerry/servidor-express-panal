const OfferModel = require('../models/offer');
const { response500, response400, response200, response201 } = require('../utils/utils');

class Offer {

    static findAll(res, from, limit) {
        OfferModel.find({})
            .skip(from)
            .limit(limit)
            .sort('duration')
            .exec((err, offers) => {

                if (err) return response500(res, err);

                OfferModel.countDocuments((err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: offers,
                        total: count
                    });

                });

            });
    }

    static findAllBy_USER_ROLE(res, from, limit) {
        OfferModel.find({})
            .or([{ role: 'USER_ROLE' }, { role: 'ALL' }])
            .skip(from)
            .limit(limit)
            .sort('duration')
            .exec((err, offers) => {

                if (err) return response500(res, err);

                OfferModel.countDocuments({ role: ['USER_ROLE', 'ALL'] }, (err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: offers,
                        total: count
                    });

                });

            });
    }

    static findAllBy_USER_PLATINO_ROLE(res, from, limit) {
        OfferModel.find({})
            .or([{ role: 'USER_PLATINO_ROLE' }, { role: 'ALL' }, { role: 'USER_PLATINO_ROLE__AND__ENTERPRISE_ROLE' }])
            .skip(from)
            .limit(limit)
            .sort('duration')
            .exec((err, offers) => {

                if (err) return response500(res, err);

                OfferModel.countDocuments({ role: ['USER_PLATINO_ROLE', 'USER_PLATINO_ROLE__AND__ENTERPRISE_ROLE', 'ALL'] }, (err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: offers,
                        total: count
                    });

                });

            });
    }

    static findAllBy_ENTERPRISE_ROLE(res, from, limit) {
        OfferModel.find({})
            .or([{ role: 'ENTERPRISE_ROLE' }, { role: 'ALL' }, { role: 'USER_PLATINO_ROLE__AND__ENTERPRISE_ROLE' }])
            .skip(from)
            .limit(limit)
            .sort('duration')
            .exec((err, offers) => {

                if (err) return response500(res, err);

                OfferModel.countDocuments({ role: ['ENTERPRISE_ROLE', 'USER_PLATINO_ROLE__AND__ENTERPRISE_ROLE', 'ALL'] }, (err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: offers,
                        total: count
                    });

                });

            });
    }

    static findById(res, id) {

        OfferModel.findById(id)
            .exec((err, offer) => {

                if (err) return response500(res, err);
                if (!offer) return response400(res, 'Offer not found.');

                response200(res, offer);
            });

    }


    static create(res, data) {

        let offer = new OfferModel(data);
        offer.save((err, offerCreated) => {
            if (err) return response500(res, err);
            if (!offerCreated) return response400(res, 'Could not create the offer.');

            response201(res, offerCreated);
        });

    }

    static delete(res, id) {

        OfferModel.findOneAndRemove({ _id: id }, (err, offerDeleted) => {

            if (err) return response500(res, err);
            if (!offerDeleted) return response400(res, 'Could not delete the offer.');

            response200(res, offerDeleted);

        });

    }
}


module.exports = {
    Offer
}