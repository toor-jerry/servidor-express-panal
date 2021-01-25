const _ = require('underscore');
const menu = require('../models/menu');

const MenuModel = require('../models/menu');

const { response500, response400, response200, response201 } = require('../utils/utils');

class Menu {

    static findAll(res) {

        MenuModel.find({})
            .exec((err, menus) => {

                if (err) return response500(res, err);
                response200(res, menus);
            });
    }

    static findById(res, id) {

        MenuModel.findById(id)
            .exec((err, menu) => {

                if (err) return response500(res, err);
                if (!menu) return response400(res, 'Menu not found.');

                response200(res, {
                    role: menu.role,
                    description: menu.description,
                    menu: JSON.parse(menu.menu)
                });
            });

    }

    static create(res, data) {

        if (!data)
            return response400(res, 'No data');
        let menu = new MenuModel({
            role: data.role,
            description: data.description,
            menu: data.menu
        });
        menu.save((err, menuCreated) => {

            if (err) return response500(res, err);
            if (!menuCreated) return response400(res, 'Could not create the menu.');

            let menuTemp;
            try {
                menuTemp = JSON.parse(menuCreated.menu);
            } catch (err) {
                console.log(err);
            }
            response201(res, {
                role: menu.role,
                description: menu.description,
                menu: menuTemp
            });
        });

    }

    static update(res, id, data) {

        if (!data)
            return response400(res, 'No data');
        let body = _.pick(data, ['role', 'description', 'menu']);

        MenuModel.findById(id, (err, menu) => {

            if (err)
                return response500(res, err);

            if (!menu)
                return response400(res, 'Could not found menu.');

            menu.role = body.role || menu.role;
            menu.description = body.description || menu.description;
            menu.menu = JSON.stringify(body.menu) || menu.menu;

            menu.save((err, menuUpdate) => {

                if (err) return response500(res, err);
                if (!menuUpdate) return response400(res, 'Could not update the menu.');

                response200(res, {
                    role: menu.role,
                    description: menu.description,
                    menu: JSON.parse(menuUpdate.menu)
                });
            });

        });
    }

    static delete(res, id) {

        MenuModel.findByIdAndDelete(id, (err, menuDeleted) => {

            if (err) return response500(res, err);
            if (!menuDeleted) return response400(res, 'Could not delete the menu.');

            response200(res, menuDeleted);

        });

    }


    static searchMenu(role) {
        return new Promise((resolve, reject) => {
            MenuModel.findOne({ role: role })
                .exec((err, menuDB) => {

                    if (err) return reject({
                        message: `Could not found ${role} in menu.`,
                        err: err.toString()
                    });
                    if (!menuDB) return reject({
                        message: `Could not found ${role} in menu.`
                    });

                    try {
                        menuDB.menu = JSON.parse(menuDB.menu);
                    } catch (err) {
                        console.log(err);
                    }
                    resolve(menuDB.menu || []);
                });
        });
    }

}

module.exports = {
    Menu
}