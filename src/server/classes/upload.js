const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const UserModel = require('../models/user');

const { SIZE_PHOTOGRAPHY, SIZE_CHAT_PHOTOGRAPHY, SIZE_FILES_IMG } = require('../config/config');
const { response500, response400, response200, response201 } = require('../utils/utils');

class Upload {

    static uploadPhotography(res, user, img, nameFile, resize = false) {
        UserModel.findById(user, (err, user) => {

            if (err) return response500(res, err);
            if (!user) return response400(res, 'User not found.');

            // Delete old images
            if (user.photography !== nameFile)
                this.deleteFile('photography', user.photography);

            if (user.thumbnail_photography !== nameFile)
                this.deleteFile('photographyChat', user.thumbnail_photography);

            if (resize)
                this.resizeImage(img, 'photography', nameFile, SIZE_PHOTOGRAPHY);

            this.resizeImage(img, 'photographyChat', nameFile, SIZE_CHAT_PHOTOGRAPHY);

            user.photography = nameFile;
            user.thumbnail_photography = nameFile;

            user.save((err, userUpdated) => {

                if (err) return response500(res, err);

                res.status(201).json({
                    ok: true,
                    data: {
                        photography: userUpdated.photography,
                        thumbnail_photography: userUpdated.thumbnail_photography
                    }
                });

            });

        });
    }

    static uploadCV(res, user, nameFile) {
        UserModel.findById(user, (err, user) => {

            if (err) return response500(res, err);
            if (!user) return response400(res, 'User not found.');

            // Delete old cv
            if (user.cv !== nameFile)
                this.deleteFile('cv', user.cv);

            user.cv = nameFile;

            user.save((err, userUpdated) => {

                if (err) return response500(res, err);

                response201(res, { cv: userUpdated.cv });

            });
        });
    }


    static uploadCredential(res, user, nameFile) {
        UserModel.findById(user, (err, user) => {

            if (err) return response500(res, err);
            if (!user) return response400(res, 'User not found.');

            // Delete old files
            if (user.credential !== nameFile)
                this.deleteFile('credential', user.credential);

            user.credential = nameFile;

            user.save((err, userUpdated) => {
                if (err) return response500(res, err);
                response201(res, { credential: userUpdated.credential });
            });
        });
    }


    static deletePhotography(res, user) {
        UserModel.findById(user, (err, user) => {

            if (err) return response500(res, err);
            if (!user) return response400(res, 'User not found.');

            if (user.photography)
                this.deleteFile('photography', user.photography);

            if (user.thumbnail_photography)
                this.deleteFile('photographyChat', user.thumbnail_photography);

            user.photography = undefined;
            user.thumbnail_photography = undefined;

            user.save((err, userUpdated) => {

                if (err) return response500(res, err);
                response201(res, userUpdated.photography);

            });

        });
    }

    static deleteCV(res, user) {
        UserModel.findById(user, (err, user) => {

            if (err) return response500(res, err);
            if (!user) return response400(res, 'User not found.');

            if (user.cv)
                this.deleteFile('cv', user.cv);

            user.cv = undefined;

            user.save((err, userUpdated) => {

                if (err) return response500(res, err);
                response201(res, userUpdated.cv);

            });

        });
    }

    static deleteCredential(res, user) {
        UserModel.findById(user, (err, user) => {

            if (err) return response500(res, err);
            if (!user) return response400(res, 'User not found.');

            if (user.credential)
                this.deleteFile('credential', user.credential);

            user.credential = undefined;

            user.save((err, userUpdated) => {

                if (err) return response500(res, err);
                response201(res, userUpdated.credential);

            });

        });
    }

    static deleteFile(dirName, nameFile) {
        let pathOld = path.resolve(__dirname, `../../../uploads/${dirName}/${nameFile}`);
        if (fs.existsSync(pathOld)) {
            fs.unlinkSync(pathOld);
        }
    }

    static resizeImage(img, dirName, fileName, width = SIZE_FILES_IMG) {
        sharp(img)
            .resize({
                width: width
            })
            .toFile(`./uploads/${dirName}/${fileName}`)
            .catch(err => console.log('Err ' + err));
    }

}

module.exports = {
    Upload
}