const bcrypt = require('bcryptjs');
const { indexOf } = require('underscore');
const _ = require('underscore');

const UserModel = require('../models/user');

const { response500, response400, response200, response201 } = require('../utils/utils');

class User {

    static findAll(res, from, limit) {

        UserModel.find({}, 'user name last_name role photography thumbnail_photography state google')
            .skip(from)
            .limit(limit)
            .sort('name')
            .exec((err, users) => {

                if (err) return response500(res, err);

                UserModel.countDocuments((err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: users,
                        total: count
                    });

                });
            });
    }

    static findEnterprises(res, from, limit) {

        UserModel.find({ role: 'ENTERPRISE_ROLE' })
            .skip(from)
            .limit(limit)
            .exec((err, enterprises) => {

                if (err) return response500(res, err);

                UserModel.countDocuments({ role: 'ENTERPRISE_ROLE' }, (err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: enterprises,
                        total: count
                    });

                });
            });
    }

    static findContacts(res, user, contact, from, limit) {

        UserModel.findById(user, 'contacts')
            .populate('contacts', 'user name last_name email thumbnail_photography')
            .skip(from)
            .limit(limit)
            .exec((err, user) => {

                if (err) return response500(res, err);
                if (!user) return response400(res, 'User not found!');

                const contactRegex = new RegExp(contact, 'i');

                const contacts = user.contacts.filter(contact => {
                    if (contactRegex.test(contact.user) || contactRegex.test(contact.name) || contactRegex.test(contact.last_name)) {
                        return contact;
                    }
                });

                res.status(200).json({
                    ok: true,
                    data: contacts
                });
            });
    }

    static findUsers(res, from, limit) {

        UserModel.find({ $nor: [{ role: 'ADMIN_ROLE' }, { role: 'ENTERPRISE_ROLE' }] })
            .skip(from)
            .limit(limit)
            .sort('name')
            .exec((err, users) => {

                if (err) return response500(res, err);

                UserModel.countDocuments({ $nor: [{ role: 'ADMIN_ROLE' }, { role: 'ENTERPRISE_ROLE' }] }, (err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: users,
                        total: count
                    });

                });
            });
    }

    static findById(res, id) {

        UserModel.findById(id)
            .populate('theme')
            .exec((err, user) => {

                if (err) return response500(res, err);
                if (!user) return response400(res, 'User not found.');

                response200(res, user);
            });

    }

    static findByIdInfoBasic(res, id) {

        UserModel.findById(id, 'user name name last_name role email theme')
            .exec((err, user) => {

                if (err) return response500(res, err);
                if (!user) return response400(res, 'User not found.');

                response200(res, user);
            });

    }

    static getContacts(id) {
        return new Promise((resolve, reject) => {
            UserModel.findById(id, 'contacts')
                .populate('contacts', 'user name last_name email thumbnail_photography photography')
                .exec((err, contacts) => {

                    if (err) return reject({ code: 500, err });

                    resolve({
                        data: contacts,
                    });
                });
        });
    }

    static getContactsOnlyId(id) {
        return new Promise((resolve, reject) => {
            UserModel.findById(id, 'contacts')
                .exec((err, contacts) => {

                    if (err) return reject({ code: 500, err });
                    resolve({
                        data: contacts,
                    });
                });
        });
    }

    static getConversationsChatSimple(id) {
        if (!id) {
            return Promise.reject('User not found');
        }
        return new Promise((resolve, reject) => {
            UserModel.findById(id, 'conversations')
                .populate({
                    path: 'conversations',
                    populate: [{
                            path: 'participants',
                            select: 'name user role email thumbnail_photography',
                            match: {
                                _id: {
                                    $ne: id
                                }
                            }
                        }]
                        // populate: [{ path: 'participants', select: 'name user role email thumbnail_photography' }, { path: 'admins', select: 'name user role email thumbnail_photography' }]
                })
                .exec((err, conversations) => {

                    if (err) return reject({ code: 500, err });
                    resolve({
                        data: conversations,
                    });
                });
        });
    }

    static getNotifications(res, id) {
        UserModel.findById(id, 'notifications')
            .exec((err, notifications) => {

                if (err) return response500(res, err);

                response200(res, notifications);
            });
    }

    static create(data) {
        return new Promise((resolve, reject) => {

            if (!data)
                return reject({ code: 400, msg: 'Could not found the messagess.' });


            let body = _.pick(data, ['name', 'last_name', 'user', 'email', 'nacionality', 'gender', 'date_birth', 'speciality', 'professional_titles', 'last_job', 'description', 'whatsapp', 'movil_phone', 'telephone', 'facebook', 'twitter', 'instagram', 'youtube_channel', 'blog_personal', 'page_web', 'location', 'rfc']);
            if (data.role) {
                if (data.role === 'ADMIN_ROLE')
                    body.role = 'USER_ROLE';
                else
                    body.role = data.role;
            }

            body.domicile = {
                street: data.street,
                number: data.number,
                colony: data.colony,
                municipality: data.municipality,
                country: data.country
            };
            body = _.pick(body, (value) => {
                if (value !== '')
                    return value;
            });

            try {
                const uuid = require('uuid');
                body.password = bcrypt.hashSync(data.password, 10);
            } catch (err) {
                return reject({ code: 500, msg: 'Error at create password.', err });
            }
            let user = new UserModel(body);

            user.save((err, userCreated) => {
                if (err) return reject({ code: 500, msg: 'Error at create user.', err });
                if (!userCreated) return reject({ code: 500, msg: 'Could not create the user.' });

                resolve({ data: userCreated })
            });
        });
    }

    static update(res, id, role_user, data) {
        let userUpdateRole = false;
        let changePassword = false;

        UserModel.findById(id, (err, user) => {
            if (err) return response500(res, err);
            if (!user) return response400(res, 'User not found.');
            user = _.extend(user, _.pick(data, ['name', 'domicile', 'last_name', 'email', 'nacionality', 'gender', 'date_birth', 'speciality', 'professional_titles', 'last_job', 'description', 'whatsapp', 'movil_phone', 'telephone', 'facebook', 'twitter', 'instagram', 'youtube_channel', 'blog_personal', 'page_web', 'location', 'rfc', 'state']));
            if (data.role) {
                if (data.role !== user.role) {
                    userUpdateRole = true;
                }
                if (data.role !== 'ADMIN_ROLE')
                    user.role = data.role;
                else if (data.role === 'ADMIN_ROLE' && role_user === 'ADMIN_ROLE')
                    user.role = 'ADMIN_ROLE';

            }
            let domicile = user.domicile;
            user.domicile = {
                street: data.street || domicile.street || undefined,
                number: data.number || domicile.number || undefined,
                colony: data.colony || domicile.colony || undefined,
                municipality: data.municipality || domicile.municipality || undefined,
                country: data.country || domicile.country || undefined
            };
            if (data.password) {
                if (!bcrypt.compareSync(data.password, user.password)) {
                    try {
                        const uuid = require('uuid');
                        user.seed = uuid.v1();
                        user.password = bcrypt.hashSync(data.password, 10);
                        changePassword = true;
                    } catch (err) {
                        return response500(res, err.toString(), 'Error at create password');
                    }
                }
            }

            user.save((err, userUpdated) => {
                if (err) return response500(res, err);
                if (!userUpdated) return response400(res, 'Could not update the user.');

                if (changePassword) {
                    return response200(res, { changePassword: true });
                } else if (userUpdateRole === false) {
                    response200(res, userUpdated);
                } else {
                    const { Menu } = require('../classes/menu');
                    Menu.searchMenu(userUpdated.role)
                        .then(menu => {
                            return res.status(200).json({
                                ok: true,
                                data: userUpdated,
                                menu
                            });
                        })
                        .catch(err => {
                            return response500(res, 'Could found menu. ' + err.toString());
                        });
                }
            });
        });
    }

    static delete(res, id, list, from, limit, search, regex) {

        const PostulationModel = require('../models/postulation');
        const EmploymentModel = require('../models/employment');
        const ConnectionModel = require('../models/connection');
        const ThemeModel = require('../models/theme');
        const { Upload } = require('../classes/upload');

        UserModel.findById(id, (err, userDB) => {
            if (err) return response500(res, err);
            if (!userDB) return response400(res, 'Could not found the user.');

            try {
                PostulationModel.deleteMany({ user: id }, (err) => console.log(err));
                EmploymentModel.deleteMany({ user: id }, (err) => console.log(err));
                ConnectionModel.deleteMany({ user: id }, (err) => console.log(err));
                if (userDB.theme)
                    ThemeModel.findOneAndRemove({ _id: userDB.theme }, (err) => console.log(err));
            } catch (err) {
                console.log(err);
            };

            try {
                if (userDB.photography)
                    Upload.deleteFile('photography', userDB.photography);

                if (userDB.thumbnail_photography)
                    Upload.deleteFile('photographyChat', userDB.thumbnail_photography);

                if (userDB.cv)
                    Upload.deleteFile('cv', userDB.cv);

                if (userDB.credential)
                    Upload.deleteFile('credential', userDB.credential);
            } catch (err) {
                console.log(err);
            };
            UserModel.findByIdAndDelete({ _id: id }, (err, userDeleted) => {
                if (err) return response500(res, err);

                if (list === false) {
                    return response200(res, userDeleted);
                }

                if (search) {
                    UserModel.find({}, 'name last_name user role')
                        .or([{ 'name': regex }, { 'last_name': regex }, { 'user': regex }, { 'email': regex }])
                        .skip(from)
                        .limit(limit)
                        .exec((err, users) => {

                            if (err) reject(`Could not found ${regex} in users.`, err);
                            UserModel.countDocuments({})
                                .and({ 'role': { $ne: 'ADMIN_ROLE' } })
                                .or([{ 'name': regex }, { 'last_name': regex }, { 'user': regex }, { 'email': regex }])
                                .exec((err, total) => {
                                    if (err) return response500(res, err);
                                    else res.status(200).json({
                                        ok: true,
                                        data: users,
                                        total
                                    });
                                });
                        });
                } else {
                    UserModel.find({}, 'user name last_name role photography thumbnail_photography state google')
                        .skip(from)
                        .limit(limit)
                        .sort('name')
                        .exec((err, users) => {

                            if (err) return response500(res, err);

                            UserModel.countDocuments((err, count) => {
                                if (err) return response500(res, err);
                                res.status(200).json({
                                    ok: true,
                                    data: users,
                                    total: count
                                });
                            });
                        });
                }

            });
        });
    }

    static updateUserAddContact(res, id, contact) {

        UserModel.findByIdAndUpdate(id, { $addToSet: { contacts: contact } }, { new: true })
            .populate('contacts', 'name last_name user email thumbnail_photography')
            .exec((err, user) => {
                if (err)
                    return response500(res, err);

                if (!user)
                    return response400(res, 'Could not add the contact.');

                // add contact to contact
                UserModel.findByIdAndUpdate(contact, { $addToSet: { contacts: id } }, { new: true })
                    .exec((err, contactDB) => {
                        if (err)
                            return response500(res, err);

                        if (!contactDB)
                            return response400(res, 'Could not add the I to contact.');

                        return response201(res, user.contacts);
                    });
            });
    }

    static updateUserDeleteContact(res, id, contact) {

        UserModel.findByIdAndUpdate(id, { $pull: { contacts: contact } }, { new: true })
            .populate('contacts', 'name last_name user email thumbnail_photography')
            .exec((err, user) => {
                if (err)
                    return response500(res, err);

                if (!user)
                    return response400(res, 'Could not remove the contact.');

                // Remove contact of contact
                UserModel.findByIdAndUpdate(contact, { $pull: { contacts: id } }, { new: true })
                    .exec((err, contactDB) => {
                        if (err)
                            return response500(res, err);

                        if (!contactDB)
                            return response400(res, 'Could not remove the I to contact.');
                        return response201(res, user.contacts);
                    });
            });
    }


    static searchUsers = (regex, from = 0, limit = 10) => {
        return new Promise((resolve, reject) => {
            UserModel.find({}, 'name last_name user role')
                .and({ 'role': { $ne: 'ADMIN_ROLE' } })
                .or([{ 'name': regex }, { 'last_name': regex }, { 'user': regex }, { 'email': regex }])
                .skip(from)
                .limit(limit)
                .exec((err, users) => {

                    if (err) reject(`Could not found ${regex} in users.`, err);
                    UserModel.countDocuments({})
                        .and({ 'role': { $ne: 'ADMIN_ROLE' } })
                        .or([{ 'name': regex }, { 'last_name': regex }, { 'user': regex }, { 'email': regex }])
                        .exec((err, total) => {
                            if (err) reject(`Could not found ${regex} in users.`, err);
                            else resolve({
                                data: users,
                                total
                            });
                        });
                });
        });
    };


}

module.exports = {
    User
}