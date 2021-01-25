const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const sanitizer = require('mongoose-sanitize');

const Schema = mongoose.Schema;


const answerSchema = new Schema({
    question: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: [true, "Question is required!"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required!"]
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
answerSchema.plugin(sanitizer);
answerSchema.plugin(uniqueValidator, { message: 'La propiedad "{PATH} debe ser única!!' });
module.exports = mongoose.model("Answer", answerSchema);