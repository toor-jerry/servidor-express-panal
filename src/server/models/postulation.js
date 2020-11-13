const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');;

const Schema = mongoose.Schema;

const postulationSchema = new Schema({
    employment: {
        type: Schema.Types.ObjectId,
        ref: 'Employment',
        required: [true, "Employment is required!"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User is required!"]
    }
});

postulationSchema.plugin(uniqueValidator, { message: 'La propiedad "{PATH} debe ser única!!' });
module.exports = mongoose.model("Postulation", postulationSchema);