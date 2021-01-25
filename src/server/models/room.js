const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const sanitizer = require('mongoose-sanitize');

const Schema = mongoose.Schema;
const typeValids = {
    values: ['CHAT', 'FORO', 'CHAT_GROUP'],
    message: '{VALUE} not type valid!!'
};
const roomSchema = new Schema({
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
    type: {
        type: String,
        required: true,
        default: "CHAT",
        enum: typeValids
    },
    created: {
        type: Date,
        default: Date.now
    },
    participants: [{
        type: Schema.Types.ObjectId,
        required: [true, "Participant is required!"],
        ref: 'User'
    }],
    admins: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    joinRequest: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

roomSchema.plugin(sanitizer);
roomSchema.plugin(uniqueValidator, { message: 'La propiedad "{PATH} debe ser única!!' });

module.exports = mongoose.model("Room", roomSchema);