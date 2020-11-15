const _ = require('underscore');
const ThemeModel = require('../models/theme');
const UserModel = require('../models/user');
const { response500, response400, response200, response201 } = require('../utils/utils');

class Theme {

    static findAll(res) {

        ThemeModel.find({ custom: false })
            .exec((err, themes) => {

                if (err) return response500(res, err);

                ThemeModel.countDocuments((err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: themes,
                        total: count
                    });

                });

            });
    }

    static findById(res, id) {

        ThemeModel.findById(id)
            .populate({
                path: 'employment',
                populate: { path: 'user', select: 'name user role email thumbnail_photography' }
            })
            .populate('user', 'name username email')
            .exec((err, theme) => {

                if (err) return response500(res, err);
                if (!theme) return response400(res, 'Theme not found.');

                response200(res, theme);
            });

    }

    static create(res, data) {

        let theme = new ThemeModel(data);

        theme.save((err, themeCreated) => {

            if (err) return response500(res, err);
            if (!themeCreated) return response400(res, 'Could not create the theme.');
            response201(res, themeCreated);
        });
    }

    static createUpdateUSer(res, user, data) {

        let theme = new ThemeModel(data);

        theme.save((err, themeCreated) => {

            if (err) return response500(res, err);
            if (!themeCreated) return response400(res, 'Could not create the theme.');

            UserModel.findById(user, (err, user) => {
                if (err) return response500(res, err);
                if (!user) return response400(res, 'User not found.');

                user.theme = themeCreated._id;

                user.save((err, userUpdated) => {
                    if (err) return response500(res, err);
                    if (!userUpdated) return response400(res, 'Could not update the user.');

                    res.status(201).json({
                        ok: true,
                        data: {
                            theme: themeCreated,
                            user: userUpdated.theme
                        }
                    });
                });
            });
        });
    }

    static update(res, id, data) {

        ThemeModel.findById(id, (err, theme) => {
            if (err) return response500(res, err);
            if (!theme) return response400(res, 'Theme not found.');

            theme = _.extend(theme, _.pick(data, ['bg', 'navbar', 'navbarBg', 'workArea', 'breadCrumb', 'sideBar', 'custom']));

            theme.save((err, themeUpdated) => {

                if (err) return response500(res, err);
                if (!themeUpdated) return response400(res, 'Could not update the theme.');
                response200(res, themeUpdated);
            });
        });
    }

    static delete(res, id_theme, user) {

        ThemeModel.findOneAndRemove({ _id: id_theme }, (err, themeDeleted) => {

            if (err) return response500(res, err);
            if (!themeDeleted) return response400(res, 'Could not delete the theme.');


            UserModel.findById(user, (err, user) => {
                if (err) return response500(res, err);
                if (!user) return response400(res, 'User not found.');

                user.theme = undefined;

                user.save((err, userUpdated) => {
                    if (err) return response500(res, err);
                    if (!userUpdated) return response400(res, 'Could not update the user.');

                    res.status(200).json({
                        ok: true,
                        data: {
                            theme: themeDeleted,
                            user: themeDeleted.theme
                        }
                    });
                });

            });
        });

    }
}


module.exports = {
    Theme
}