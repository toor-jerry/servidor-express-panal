const mongoose = require("mongoose");

const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    id_conversation: {
        type: String,
        unique: true,
        required: [true, "Conversation is required!"],
    },
    name: {
        type: String
    },
    theme: {
        type: String
    },
    private: {
        type: Boolean,
        default: false
    },
    participants: [{
        type: Schema.Types.ObjectId,
        required: [true, "Participant is required!"],
        ref: 'User'
    }],
    admins: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

chatSchema.plugin(uniqueValidator, { message: 'La propiedad "{PATH} debe ser única!!' });

module.exports = mongoose.model("Chat", chatSchema);