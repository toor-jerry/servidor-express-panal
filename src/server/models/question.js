const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const sanitizer = require('mongoose-sanitize');

const Schema = mongoose.Schema;


const questionSchema = new Schema({
    question: {
        type: String,
        required: [true, "Question is required!"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

questionSchema.plugin(sanitizer);
questionSchema.plugin(uniqueValidator, { message: 'La propiedad "{PATH} debe ser única!!' });
module.exports = mongoose.model("Question", questionSchema);