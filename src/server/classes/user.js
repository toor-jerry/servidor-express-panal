const bcrypt = require('bcryptjs');
const _ = require('underscore');

const UserModel = require('../models/user');

const { response500, response400, response200, response201 } = require('../utils/utils');

class User {

    findAll(res, from, limit) {

        UserModel.find({}, 'user name last_name role')
            .skip(from)
            .limit(limit)
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

    findById(res, id) {

        UserModel.findById(id, 'user name name last_name role email')
            .exec((err, user) => {

                if (err) return response500(res, err);
                if (!user) return response400(res, 'User not found.');

                response200(res, user);
            });

    }

    getContacts(res, id) {
        UserModel.findById(id, 'contacts')
            .populate('contacts', 'user name last_name email')
            .exec((err, contacts) => {

                if (err) return response500(res, err);

                response200(res, contacts);
            });
    }

    create(res, data) {
        let body = _.pick(data, ['name', 'last_name', 'user', 'email', 'domicile', 'nacionality', 'gender', 'date_birth', 'speciality', 'professional_titles', 'last_job', 'description', 'whatsapp', 'movil_phone', 'telephone', 'facebook', 'twitter', 'instagram', 'youtube_channel', 'blog_personal', 'page_web', 'location', 'role', 'rfc']);
        body.password = bcrypt.hashSync(data.password, 10);

        let user = new UserModel(body);

        user.save((err, userCreated) => {

            if (err) return response500(res, err);
            if (!userCreated) return response400(res, 'Could not create the user.');

            response201(res, userCreated);
        });

    }

    update(res, id, data) {
        UserModel.findById(id, (err, user) => {
            if (err) return response500(res, err);
            if (!user) return response400(res, 'User not found.');

            user = _.extend(user, _.pick(data, ['name', 'last_name', 'email', 'role', 'domicile', 'nacionality', 'gender', 'date_birth', 'speciality', 'professional_titles', 'last_job', 'description', 'whatsapp', 'movil_phone', 'telephone', 'facebook', 'twitter', 'instagram', 'youtube_channel', 'blog_personal', 'page_web', 'location', 'rfc']));

            user.save((err, userUpdated) => {
                if (err) return response500(res, err);
                if (!userUpdated) return response400(res, 'Could not update the user.');
                response200(res, userUpdated);
            });
        });
    }

    delete(res, id) {

        UserModel.findByIdAndDelete(id, (err, userDeleted) => {
            if (err) return response500(res, err);
            if (!userDeleted) return response400(res, 'Could not delete the user.');

            response200(res, userDeleted);
        });

    }

    updateUserAddContact(res, id, contact) {

        UserModel.findByIdAndUpdate(id, { $addToSet: { contacts: contact } }, { new: true })
            .populate('contacts', 'name last_name user email chat_photography')
            .exec((err, user) => {
                if (err)
                    return response500(res, err);

                if (!user)
                    return response400(res, 'Could not add the contact.');

                return response201(res, user.contacts);
            });
    }

    updateUserDeleteContact(res, id, contact) {

        UserModel.findByIdAndUpdate(id, { $pull: { contacts: contact } }, { new: true })
            .populate('contacts', 'name last_name user email chat_photography')
            .exec((err, user) => {
                if (err)
                    return response500(res, err);

                if (!user)
                    return response400(res, 'Could not remove the contact.');

                return response201(res, user.contacts);
            });
    }

}

module.exports = {
    User
}