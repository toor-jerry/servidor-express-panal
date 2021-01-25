const _ = require('underscore');
const UserModel = require('../models/user');

const pdf = require("pdf-creator-node");
const fs = require('fs');
const path = require('path');
const base64Img = require('base64-img');

class PDF {


    static generatePDF(idUser) {
        return new Promise((resolve, reject) => {
            UserModel.findById(idUser, (err, user) => {
                if (err) return reject({ code: 500, err });

                if (!user) return reject({ code: 400, err: 'User not found.' });
                let photoUser, logoWhatsapp, logoFacebook, logoMovil_phone, logoTelephone, logoTwitter, logoInstagram, logoYoutube_channel, logoBlog_personal, logoPage_web;
                if (user.photography) {
                    photoUser = base64Img.base64Sync(path.resolve(__dirname, '../../../uploads/photography/' + user.photography))
                }

                if (user.whatsapp) {
                    logoWhatsapp = base64Img.base64Sync(path.resolve(__dirname, '../utils/assets/whtasapp.jpeg'))
                }

                if (user.facebook) {
                    logoFacebook = base64Img.base64Sync(path.resolve(__dirname, '../utils/assets/facebook.jpeg'))
                }

                if (user.movil_phone) {
                    logoMovil_phone = base64Img.base64Sync(path.resolve(__dirname, '../utils/assets/movil.jpeg'))
                }
                if (user.telephone) {
                    logoTelephone = base64Img.base64Sync(path.resolve(__dirname, '../utils/assets/office.jpeg'))
                }
                if (user.twitter) {
                    logoTwitter = base64Img.base64Sync(path.resolve(__dirname, '../utils/assets/twitter.jpeg'))
                }

                if (user.instagram) {
                    logoInstagram = base64Img.base64Sync(path.resolve(__dirname, '../utils/assets/instagram.jpeg'))
                }

                if (user.youtube_channel) {
                    logoYoutube_channel = base64Img.base64Sync(path.resolve(__dirname, '../utils/assets/youtube.jpeg'))
                }

                if (user.blog_personal) {
                    logoBlog_personal = base64Img.base64Sync(path.resolve(__dirname, '../utils/assets/blog.jpeg'))
                }
                if (user.page_web) {
                    logoPage_web = base64Img.base64Sync(path.resolve(__dirname, '../utils/assets/www.jpeg'))
                }
                const options = {
                    format: "A4",
                    orientation: "portrait",
                    border: "10mm",
                    header: {
                        height: "18mm",
                        contents: `<div style="text-align: center;">
                        Author: Panal del Trabajo
                        </div>`
                    },
                    "footer": {
                        "height": "20mm",
                        "contents": {
                            // first: '',
                            // 2: 'Second page', // Any page number is working. 1-based index
                            default: `
                            <div style="text-align: center;">
                            <span style="color: #444;">Página <b>{{page}}</span>/<span>{{pages}}</b></span>
                            </div>
                            `, // fallback value
                            // last: 'Last Page'
                        }
                    }
                };
                // const nameFile = `${ idUser }-${uuid.v1()}.pdf`
                const nameFile = `${ idUser }.pdf`

                // Read HTML Template
                const html = fs.readFileSync(path.resolve(__dirname, '../utils/templateCVPDF.html'), 'utf8');
                let domicile = user.domicile;
                if (domicile) {
                    let dom = user.domicile;
                    domicile = `${dom.street || ''} # ${dom.number || 'S/N'}, ${ dom.colony || ''}, ${dom.municipality || ''}, ${dom.country || ''}`;
                } else {
                    domicile = '';
                }
                const document = {
                    html: html,
                    data: {
                        photoUser,
                        logoWhatsapp,
                        logoFacebook,
                        logoMovil_phone,
                        logoTelephone,
                        logoTwitter,
                        logoInstagram,
                        logoYoutube_channel,
                        logoBlog_personal,
                        logoPage_web,
                        name: user.name,
                        last_name: user.last_name || '',
                        email: user.email || '',
                        domicile,
                        nacionality: user.nacionality || 'Mexicana',
                        gender: user.gender || '',
                        date_birth: user.date_birth || '',
                        speciality: user.speciality || '',
                        professional_titles: user.professional_titles || '',
                        last_job: user.last_job || '',
                        description: user.description || '',
                        whatsapp: user.whatsapp || '',
                        movil_phone: user.movil_phone || '',
                        telephone: user.telephone || '',
                        facebook: user.facebook || '',
                        twitter: user.twitter || '',
                        instagram: user.instagram || '',
                        youtube_channel: user.youtube_channel || '',
                        blog_personal: user.blog_personal || '',
                        page_web: user.page_web || ''
                    },
                    path: `${this.pathResolveCV()}/${nameFile}`
                };

                let pathFile = `${this.pathResolveCV()}/${nameFile}`;
                if (fs.existsSync(pathFile)) {
                    // console.log('Existe', pathFile);
                    fs.unlinkSync(pathFile);
                }
                pdf.create(document, options)
                    .then(res => {
                        console.log(res)
                        resolve(nameFile);
                    })
                    .catch(error => {
                        console.error(error)
                        reject({ code: 500, err });
                    });
            });
        });
    }

    static pathResolveCV() {
        return path.resolve(__dirname, `../../../uploads/cv/`);
    }
}


module.exports = {
    PDF
}