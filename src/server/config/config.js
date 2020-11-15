// ==========================
// Enviroment
// ==========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==========================
// Port
// ==========================
process.env.PORT = process.env.PORT || 3000;

// ==========================
// Token Expiration Date
// ==========================
process.env.TOKEN_EXPIRATION = '48h';

// ==========================
// SEED
// ==========================
process.env.SEED = process.env.SEED || 'seed-de-desarrollo-2020';


// ==========================
// DataBase
// ==========================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost/panalDB';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URL_DB = urlDB;

// ==========================
// Google
// ==========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '266268775348-iqocukp3ju50oc1uunp5odfj1uo2cm5h.apps.googleusercontent.com';

// ==========================
// Size images
// ==========================
module.exports.SIZE_PHOTOGRAPHY = 400;
module.exports.SIZE_FILES_IMG = 400;
module.exports.SIZE_CHAT_PHOTOGRAPHY = 60;