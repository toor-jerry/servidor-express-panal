const mongoose = require("mongoose");

const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

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

roomSchema.plugin(uniqueValidator, { message: 'La propiedad "{PATH} debe ser única!!' });

module.exports = mongoose.model("Room", roomSchema);