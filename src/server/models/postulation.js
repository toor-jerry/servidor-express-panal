const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const { SchemaType } = require("mongoose");

const Schema = mongoose.Schema;

const postulationSchema = new Schema({
    employment: {
        type: Schema.Types.ObjectId,
        unique: true,
        required: [true, "Employment is required!"]
    },
    user: {
        type: Schema.Types.ObjectId,
        unique: true,
        required: [true, "User is required!"]
    }
});

postulationSchema.plugin( uniqueValidator, { message: 'La propiedad "{PATH} debe ser única!!' } );
module.exports = mongoose.model("Postulation", postulationSchema);