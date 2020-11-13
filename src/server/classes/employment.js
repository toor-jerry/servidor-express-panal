const _ = require('underscore');
const EmploymentModel = require('../models/employment');
const PostulationModel = require('../models/postulation');

const { response500, response400, response200, response201 } = require('../utils/utils');

class Employment {

    findAll(res, params_populate, from, limit) {

        EmploymentModel.find({})
            .skip(from)
            .limit(limit)
            .sort('dateCreate')
            .populate('enterprise', params_populate)
            .exec((err, employments) => {

                if (err) return response500(res, err);

                EmploymentModel.countDocuments((err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: employments,
                        total: count
                    });

                });

            });
    }

    findById(res, id) {

        EmploymentModel.findById(id)
            .populate('enterprise', 'name email role domicile description photography')
            .exec((err, employment) => {

                if (err) return response500(res, err);
                if (!employment) return response400(res, 'Employment not found.');

                response200(res, employment);
            });

    }

    create(res, data) {
        let body = _.pick(data, ['name', 'enterprise', 'salary', 'horary', 'workable_days', 'description', 'vacancy_numbers', 'domicile', 'requeriments', 'dateLimit']);

        let employment = new EmploymentModel(body);
        employment.save((err, employmentCreated) => {

            if (err) return response500(res, err);
            if (!employmentCreated) return response400(res, 'Could not create the employment.');

            response201(res, employmentCreated);
        });

    }

    update(res, id_employment, enterprise, data) {

        EmploymentModel.findOne({ _id: id_employment, enterprise: enterprise }, (err, employment) => {
            if (err) return response500(res, err);
            if (!employment) return response400(res, 'Employment not found.');

            employment = _.extend(employment, _.pick(data, ['name', 'enterprise', 'salary', 'horary', 'workable_days', 'description', 'vacancy_numbers', 'domicile', 'requeriments', 'dateLimit']));

            employment.save((err, employmentUpdated) => {
                if (err) return response500(res, err);
                if (!employmentUpdated) return response400(res, 'Could not update the employment.');
                response200(res, employmentUpdated);
            });
        });
    }

    delete(res, id_employment, enterprise) {

        EmploymentModel.findOneAndRemove({ _id: id_employment, enterprise: enterprise }, (err, employmentDeleted) => {

            if (err) return response500(res, err);
            if (!employmentDeleted) return response400(res, 'Could not delete the employment.');

            PostulationModel.deleteMany({ employment: id_employment }, (err, result) => {
                if (err) return response500(res, err, 'Could not delete the postulations.');
                return res.status(200).json({
                    ok: true,
                    data: employmentDeleted,
                    totalDeleted: result.deletedCount
                });
            });

        });

    }
}


module.exports = {
    Employment
}