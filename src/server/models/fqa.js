const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const fqaSchema = new Schema({
    question: {
        type: Object,
        unique: true,
        required: [true, "Question is required!"]
    },
    answers: [ { type: Object } ]
});

fqaSchema.plugin( uniqueValidator, { message: 'La propiedad "{PATH} debe ser única!!' } );
module.exports = mongoose.model("FQA", fqaSchema);