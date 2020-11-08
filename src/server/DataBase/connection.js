const mongoose = require('mongoose');

mongoose.connect(process.env.URL_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(db => console.log('DB \x1b[36m%s\x1b[0m', 'connected!!'))
    .catch(err => {
        throw new Error(err);
    });