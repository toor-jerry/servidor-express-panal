const DownloadModel = require('../models/download');
const { response500, response400, response200, response201 } = require('../utils/utils');

class Download {

    static findAll(res, from, limit) {

        DownloadModel.find({})
            .skip(from)
            .limit(limit)
            .sort('version')
            .exec((err, downloads) => {

                if (err) return response500(res, err);

                DownloadModel.countDocuments((err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: downloads,
                        total: count
                    });

                });

            });
    }

    static findById(res, id) {

        DownloadModel.findById(id)
            .exec((err, download) => {

                if (err) return response500(res, err);
                if (!download) return response400(res, 'Download not found.');

                response200(res, download);
            });
    }

    static findByPlatform(res, platform, architecture) {

        DownloadModel.find({ platform: platform, architecture: architecture })
            .sort(['createAt', 'version'])
            .exec((err, download) => {

                if (err) return response500(res, err);
                if (!download) return response400(res, 'Download not found.');

                response200(res, download);
            });
    }

    static create(res, data) {

        let download = new DownloadModel(data);
        download.save((err, downloadCreated) => {

            if (err) return response500(res, err);
            if (!downloadCreated) return response400(res, 'Could not create the download.');

            response201(res, downloadCreated);
        });
    }

    static update(res, id_download, data) {

        DownloadModel.findOne({ _id: id_download }, (err, download) => {
            if (err) return response500(res, err);
            if (!download) return response400(res, 'Download not found.');

            download.description = data.description;
            download.link = data.link;

            download.save((err, downloadUpdated) => {
                if (err) return response500(res, err);
                if (!downloadUpdated) return response400(res, 'Could not update the download.');
                response200(res, downloadUpdated);
            });
        });
    }

    static delete(res, id_download) {

        DownloadModel.findOneAndRemove({ _id: id_download }, (err, downloadDeleted) => {

            if (err) return response500(res, err);
            if (!downloadDeleted) return response400(res, 'Could not delete the download.');

            response200(res, downloadDeleted);

        });

    }

    static searchDownload = (regex, from = 0, limit = 10) => {

        return new Promise((resolve, reject) => {

            DownloadModel.find({})
                .and([{ 'description': regex }])
                .sort('createAt', 'version')
                .skip(from)
                .limit(limit)
                .exec((err, downloads) => {
                    if (err) reject('Error at find donwloads.', err);
                    DownloadModel.countDocuments({})
                        .and([{ 'description': regex }])
                        .exec((err, total) => {
                            if (err) reject('Error at find download.', err);
                            else resolve({
                                data: downloads,
                                total
                            });
                        });
                });
        });
    }
}


module.exports = {
    Download
}