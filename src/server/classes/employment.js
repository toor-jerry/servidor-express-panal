const _ = require('underscore');
const EmploymentModel = require('../models/employment');
const PostulationModel = require('../models/postulation');
const UserModel = require('../models/user');

const { response500, response400, response200, response201 } = require('../utils/utils');

class Employment {

    static findAll(res, params_populate, user, from, limit, auth) {

        EmploymentModel.find({})
            .skip(from)
            .limit(limit)
            .sort('dateCreate')
            .populate('enterprise', params_populate)
            .exec((err, employments) => {

                if (err) return response500(res, err);

                if (auth) {
                    PostulationModel.find({ user: user })
                        .populate('employment')
                        .exec((err, postulations) => {
                            if (err) return response500(res, err);
                            let postulationsTmp = [];
                            _.filter(postulations, (post) => {
                                postulationsTmp.push(post.employment)
                            });
                            // console.log(postulationsTmp);
                            // employments = _.without(employments, postulationsTmp);
                            let whithOutResp = this.whithOut(employments, postulationsTmp)
                            EmploymentModel.countDocuments((err, count) => {

                                if (err) return response500(res, err);

                                PostulationModel.find({ user: user })
                                    .populate('employment')
                                    .skip(from)
                                    .limit(limit)
                                    .exec((err, postulationsDB) => {
                                        if (err) return response500(res, err);
                                        let postulationsTmp2 = [];
                                        _.filter(postulationsDB, (post) => {
                                            postulationsTmp2.push(post.employment)
                                        });
                                        res.status(200).json({
                                            ok: true,
                                            data: {
                                                employments: whithOutResp.employments,
                                                postulations: postulationsTmp2
                                            },
                                            total: count
                                        });
                                    });
                            });
                        });
                } else {

                    EmploymentModel.countDocuments((err, count) => {

                        if (err) return response500(res, err);
                        res.status(200).json({
                            ok: true,
                            data: {
                                employments,
                                postulations: []
                            },
                            total: count
                        });

                    });
                }


            });
    }


    static findOnlyEmployments(res, params_populate, user, from, limit, auth) {

        EmploymentModel.find({ type: 'JOB_OFFER' })
            .skip(from)
            .limit(limit)
            .sort('dateCreate')
            .populate('enterprise', params_populate)
            .exec((err, employments) => {

                if (err) return response500(res, err);

                if (auth) {
                    PostulationModel.find({ user: user })
                        .populate('employment')
                        .exec((err, postulations) => {
                            if (err) return response500(res, err);
                            let postulationsTmp = [];
                            _.filter(postulations, (post) => {
                                postulationsTmp.push(post.employment)
                            });
                            // console.log(postulationsTmp);
                            // employments = _.without(employments, postulationsTmp);
                            let whithOutResp = this.whithOut(employments, postulationsTmp)

                            EmploymentModel.countDocuments({ type: 'JOB_OFFER' }, (err, count) => {
                                if (err) return response500(res, err);
                                res.status(200).json({
                                    ok: true,
                                    data: {
                                        employments: whithOutResp.employments,
                                        // postulations: postulationsTmp
                                    },
                                    total: count - whithOutResp.total
                                });

                            });
                        });
                } else {

                    EmploymentModel.countDocuments({ type: 'JOB_OFFER' }, (err, count) => {

                        if (err) return response500(res, err);
                        res.status(200).json({
                            ok: true,
                            data: {
                                employments,
                                postulations: []
                            },
                            total: count
                        });

                    });
                }


            });
    }


    static findSocialServiceWhitouthPostulations(res, params_populate, user, from, limit, auth) {

        EmploymentModel.find({ type: 'SOCIETY_SERVICE' })
            .skip(from)
            .limit(limit)
            .sort('dateCreate')
            .populate('enterprise', params_populate)
            .exec((err, employments) => {

                if (err) return response500(res, err);

                if (auth) {
                    PostulationModel.find({ user: user })
                        .populate('employment')
                        .exec((err, postulations) => {
                            if (err) return response500(res, err);
                            let postulationsTmp = [];
                            _.filter(postulations, (post) => {
                                postulationsTmp.push(post.employment)
                            });
                            // console.log(postulationsTmp);
                            // employments = _.without(employments, postulationsTmp);
                            let whithOutResp = this.whithOut(employments, postulationsTmp)

                            EmploymentModel.countDocuments({ type: 'SOCIETY_SERVICE' }, (err, count) => {

                                if (err) return response500(res, err);
                                res.status(200).json({
                                    ok: true,
                                    data: {
                                        employments: whithOutResp.employments,
                                        // postulations: postulationsTmp
                                    },
                                    total: count - whithOutResp.total
                                });

                            });
                        });
                } else {

                    EmploymentModel.countDocuments({ type: 'SOCIETY_SERVICE' }, (err, count) => {

                        if (err) return response500(res, err);
                        res.status(200).json({
                            ok: true,
                            data: {
                                employments,
                                postulations: []
                            },
                            total: count
                        });

                    });
                }


            });
    }
    static findProfessionalPracticeWhitouthPostulations(res, params_populate, user, from, limit, auth) {

        EmploymentModel.find({ type: 'PROFESSIONAL_PRACTICES' })
            .skip(from)
            .limit(limit)
            .sort('dateCreate')
            .populate('enterprise', params_populate)
            .exec((err, employments) => {

                if (err) return response500(res, err);

                if (auth) {
                    PostulationModel.find({ user: user })
                        .populate('employment')
                        .exec((err, postulations) => {
                            if (err) return response500(res, err);
                            let postulationsTmp = [];
                            _.filter(postulations, (post) => {
                                postulationsTmp.push(post.employment)
                            });
                            // console.log(postulationsTmp);
                            // employments = _.without(employments, postulationsTmp);
                            let whithOutResp = this.whithOut(employments, postulationsTmp)
                            EmploymentModel.countDocuments({ type: 'PROFESSIONAL_PRACTICES' }, (err, count) => {

                                if (err) return response500(res, err);
                                res.status(200).json({
                                    ok: true,
                                    data: {
                                        employments: whithOutResp.employments
                                            // postulations: postulationsTmp
                                    },
                                    total: count - whithOutResp.total
                                });

                            });
                        });
                } else {

                    EmploymentModel.countDocuments({ type: 'PROFESSIONAL_PRACTICES' }, (err, count) => {

                        if (err) return response500(res, err);
                        res.status(200).json({
                            ok: true,
                            data: {
                                employments,
                                postulations: []
                            },
                            total: count
                        });

                    });
                }


            });
    }


    static findById(res, id) {

        EmploymentModel.findById(id)
            .populate('enterprise', 'name email role domicile description photography category')
            .exec((err, employment) => {

                if (err) return response500(res, err);
                if (!employment) return response400(res, 'Employment not found.');

                PostulationModel.countDocuments({ employment: id }, (err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: employment,
                        total: count
                    });

                });
            });

    }

    static findByEnterprise(res, enterprise, from, limit) {

        EmploymentModel.find({ enterprise: enterprise, type: 'JOB_OFFER' })
            .skip(from)
            .limit(limit)
            .sort({ 'dateCreate': -1 })
            .exec((err, employments) => {

                if (err) return response500(res, err);
                if (!employments) return response400(res, 'Employments not found.');

                EmploymentModel.countDocuments({ enterprise: enterprise }, (err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: employments,
                        total: count
                    });
                });
            });
    }

    static findSocialService(res, from, limit) {

        EmploymentModel.find({ type: 'SOCIETY_SERVICE' })
            .skip(from)
            .limit(limit)
            .sort('dateCreate')
            .populate('enterprise', 'name email role domicile description photography category')
            .exec((err, offers) => {

                if (err) return response500(res, err);
                if (!offers) return response400(res, 'Offers not found.');

                EmploymentModel.countDocuments({ type: 'SOCIETY_SERVICE' }, (err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: offers,
                        total: count
                    });
                });
            });
    }

    static findProfesionalPractices(res, from, limit) {

        EmploymentModel.find({ type: 'PROFESSIONAL_PRACTICES' })
            .skip(from)
            .limit(limit)
            .sort('dateCreate')
            .populate('enterprise', 'name email role domicile description photography category')
            .exec((err, offers) => {

                if (err) return response500(res, err);
                if (!offers) return response400(res, 'Offers not found.');

                EmploymentModel.countDocuments({ type: 'PROFESSIONAL_PRACTICES' }, (err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: offers,
                        total: count
                    });
                });
            });
    }

    static create(data) {
        return new Promise((resolve, reject) => {
            let body = _.pick(data, ['name', 'enterprise', 'salary', 'horary', 'workable_days', 'description', 'vacancy_numbers', 'domicile', 'requeriments', 'dateLimit', 'category', 'type']);
            let employment = new EmploymentModel(body);
            employment.save((err, employmentCreated) => {

                if (err) reject({ code: 500, err });
                if (!employmentCreated) reject({ code: 400, err: 'Could not create the employment.' });
                let notification = {
                    title: 'Se agregó un nuevo empleo.',
                    description: employmentCreated.name,
                    read: false,
                    type: 'employment',
                    create: employmentCreated.dateCreate,
                    _id: employmentCreated._id
                };
                UserModel.updateMany({ 'role': { $ne: 'ENTERPRISE_ROLE' } }, { $addToSet: { notifications: notification } }, (err, raw) => {
                    if (err) console.log(err);
                });
                resolve({
                    data: employmentCreated,
                });
            });
        });
    }

    static update(res, id_employment, enterprise, data) {

        EmploymentModel.findOne({ _id: id_employment, enterprise: enterprise }, (err, employment) => {
            if (err) return response500(res, err);
            if (!employment) return response400(res, 'Employment not found.');

            employment = _.extend(employment, _.pick(data, ['name', 'enterprise', 'salary', 'horary', 'workable_days', 'description', 'vacancy_numbers', 'domicile', 'requeriments', 'dateLimit', 'category', 'type', 'state']));

            employment.save((err, employmentUpdated) => {
                if (err) return response500(res, err);
                if (!employmentUpdated) return response400(res, 'Could not update the employment.');
                response200(res, employmentUpdated);
            });
        });
    }

    static delete(res, id_employment, enterprise) {

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

    static searchEmployments = (regex, from = 0, limit = 10) => {

        return new Promise((resolve, reject) => {

            let state = (regex.source.toLowerCase().trim() == 'true') ? true : false;
            let vacancy_numbers = Number(regex.source) || undefined;

            EmploymentModel.find({}, 'name description category salary horary workable_days vacancy_numbers requeriments domicile state type')
                .populate('enterprise', 'name')
                .or([{ 'name': regex }, { 'description': regex }, { 'category': regex }, { 'salary': regex }, { 'horary': regex }, { 'workable_days': regex }, { 'vacancy_numbers': vacancy_numbers }, { 'requeriments': regex }, { 'domicile': regex }, { 'state': state }, { 'type': regex }])
                .skip(from)
                .limit(limit)
                .exec((err, employments) => {
                    if (err)
                        reject(`Could not found ${regex} in employments.`, err);
                    EmploymentModel.countDocuments({})
                        .or([{ 'name': regex }, { 'description': regex }, { 'category': regex }, { 'salary': regex }, { 'horary': regex }, { 'workable_days': regex }, { 'vacancy_numbers': vacancy_numbers }, { 'requeriments': regex }, { 'domicile': regex }, { 'state': state }, { 'type': regex }])
                        .exec((err, total) => {
                            if (err)
                                reject(`Could not found ${regex} in employments (total).`, err);
                            else resolve({
                                data: employments,
                                total
                            });
                        });

                });
        });
    }

    static searchOnlyEmployments = (regex, from = 0, limit = 10) => {

        return new Promise((resolve, reject) => {

            let state = (regex.source.toLowerCase().trim() == 'true') ? true : false;
            let vacancy_numbers = Number(regex.source) || undefined;

            EmploymentModel.find({ type: 'JOB_OFFER' }, 'name description category salary horary workable_days vacancy_numbers requeriments domicile state type')
                .populate('enterprise', 'name')
                .or([{ 'name': regex }, { 'description': regex }, { 'category': regex }, { 'salary': regex }, { 'horary': regex }, { 'workable_days': regex }, { 'vacancy_numbers': vacancy_numbers }, { 'requeriments': regex }, { 'domicile': regex }, { 'state': state }, { 'type': regex }])
                .skip(from)
                .limit(limit)
                .exec((err, employments) => {

                    if (err)
                        return reject(`Could not found ${regex} in employments.`, err);
                    EmploymentModel.countDocuments({ type: 'JOB_OFFER' })
                        .or([{ 'name': regex }, { 'description': regex }, { 'category': regex }, { 'salary': regex }, { 'horary': regex }, { 'workable_days': regex }, { 'vacancy_numbers': vacancy_numbers }, { 'requeriments': regex }, { 'domicile': regex }, { 'state': state }, { 'type': regex }])
                        .exec((err, total) => {
                            if (err)
                                return reject(`Could not found ${regex} in employments (total).`, err);
                            else resolve({
                                data: employments,
                                total
                            });
                        });

                });
        });
    }

    static searchSocietyService = (regex, from = 0, limit = 10) => {

        return new Promise((resolve, reject) => {

            let state = (regex.source.toLowerCase().trim() == 'true') ? true : false;
            let vacancy_numbers = Number(regex.source) || undefined;

            EmploymentModel.find({ type: 'SOCIETY_SERVICE' }, 'name description category salary horary workable_days vacancy_numbers requeriments domicile state type')
                .populate('enterprise', 'name')
                .or([{ 'name': regex }, { 'description': regex }, { 'category': regex }, { 'salary': regex }, { 'horary': regex }, { 'workable_days': regex }, { 'vacancy_numbers': vacancy_numbers }, { 'requeriments': regex }, { 'domicile': regex }, { 'state': state }, { 'type': regex }])
                .skip(from)
                .limit(limit)
                .exec((err, employments) => {
                    if (err)
                        reject(`Could not found ${regex} in employments.`, err);
                    EmploymentModel.countDocuments({ type: 'SOCIETY_SERVICE' })
                        .or([{ 'name': regex }, { 'description': regex }, { 'category': regex }, { 'salary': regex }, { 'horary': regex }, { 'workable_days': regex }, { 'vacancy_numbers': vacancy_numbers }, { 'requeriments': regex }, { 'domicile': regex }, { 'state': state }, { 'type': regex }])
                        .exec((err, total) => {
                            if (err)
                                reject(`Could not found ${regex} in employments (total).`, err);
                            else resolve({
                                data: employments,
                                total
                            });
                        });

                });
        });
    }

    static searchProfessionalPractice = (regex, from = 0, limit = 10) => {

        return new Promise((resolve, reject) => {

            let state = (regex.source.toLowerCase().trim() == 'true') ? true : false;
            let vacancy_numbers = Number(regex.source) || undefined;

            EmploymentModel.find({ type: 'PROFESSIONAL_PRACTICES' }, 'name description category salary horary workable_days vacancy_numbers requeriments domicile state type')
                .populate('enterprise', 'name')
                .or([{ 'name': regex }, { 'description': regex }, { 'category': regex }, { 'salary': regex }, { 'horary': regex }, { 'workable_days': regex }, { 'vacancy_numbers': vacancy_numbers }, { 'requeriments': regex }, { 'domicile': regex }, { 'state': state }, { 'type': regex }])
                .skip(from)
                .limit(limit)
                .exec((err, employments) => {
                    if (err)
                        reject(`Could not found ${regex} in employments.`, err);
                    EmploymentModel.countDocuments({ type: 'PROFESSIONAL_PRACTICES' })
                        .or([{ 'name': regex }, { 'description': regex }, { 'category': regex }, { 'salary': regex }, { 'horary': regex }, { 'workable_days': regex }, { 'vacancy_numbers': vacancy_numbers }, { 'requeriments': regex }, { 'domicile': regex }, { 'state': state }, { 'type': regex }])
                        .exec((err, total) => {
                            if (err)
                                reject(`Could not found ${regex} in employments (total).`, err);
                            else resolve({
                                data: employments,
                                total
                            });
                        });

                });
        });
    }

    static countSocietyService = (user) => {

        return new Promise((resolve, reject) => {
            EmploymentModel.find({ type: 'SOCIETY_SERVICE' })
                .exec((err, employments) => {

                    if (err) return reject(err);
                    PostulationModel.find({ user: user })
                        .populate('employment')
                        .exec((err, postulations) => {
                            if (err) return reject(err);
                            let totalTmp = 0
                            _.filter(postulations, (post) => {
                                let empl = post.employment
                                if (empl.type === 'SOCIETY_SERVICE') {
                                    employments.forEach(element => {
                                        if ('' + element._id === '' + empl._id) {
                                            totalTmp += 1
                                        }
                                    });
                                }
                            });


                            EmploymentModel.countDocuments({ type: 'SOCIETY_SERVICE' })
                                .exec((err, total) => {
                                    if (err)
                                        reject(`Could not found ${regex} in social service (total).`, err);
                                    else resolve(total - totalTmp);
                                });
                        });
                })

        });
    }

    static countProfessionalPractice = (user) => {

        return new Promise((resolve, reject) => {
            EmploymentModel.find({ type: 'PROFESSIONAL_PRACTICES' })
                .exec((err, employments) => {

                    if (err) return reject(err);
                    PostulationModel.find({ user: user })
                        .populate('employment')
                        .exec((err, postulations) => {
                            if (err) return reject(err);
                            let totalTmp = 0
                            _.filter(postulations, (post) => {
                                let empl = post.employment
                                if (empl.type === 'PROFESSIONAL_PRACTICES') {
                                    employments.forEach(element => {
                                        if ('' + element._id === '' + empl._id) {
                                            totalTmp += 1
                                        }
                                    });
                                }
                            });

                            EmploymentModel.countDocuments({ type: 'PROFESSIONAL_PRACTICES' })
                                .exec((err, total) => {
                                    if (err)
                                        reject(`Could not found ${regex} in social employments (total).`, err);
                                    else resolve(total - totalTmp);
                                });
                        });
                })


        });
    }

    static whithOut(employments, postulations) {
        let postThisEmployment = 0
        let employmentsWhithOut = []
        employments.forEach(empl => {
            let whithout = false
            postulations.forEach(post => {
                if ('' + post._id === '' + empl._id) {
                    postThisEmployment += 1
                    whithout = true
                }
            });
            if (!whithout) {
                employmentsWhithOut.push(empl)
            }
        });
        return {
            employments: employmentsWhithOut,
            total: postThisEmployment
        }
    }
}


module.exports = {
    Employment
}