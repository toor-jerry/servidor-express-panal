const mongoose = require("mongoose");
const sanitizer = require('mongoose-sanitize');

const Schema = mongoose.Schema;

const statesValids = {
    values: ['READ', 'SAVED'],
    message: '{VALUE} not role valid!!'
};

const typesValids = {
    values: ['TXT', 'FILE', 'IMG'],
    message: '{VALUE} not type valid!!'
};
const messageSchema = new Schema({
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: [true, "Room is required!"]
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Sender is required!"]
    },
    message: {
        type: String,
        required: [true, "Message is required!"]
    },
    fileName: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        default: 'TXT',
        required: [true, "Type is required!"],
        enum: typesValids
    },
    status: {
        type: String,
        default: 'SAVED',
        required: [true, "Status is required!"],
        enum: statesValids
    }
});

messageSchema.plugin(sanitizer);
module.exports = mongoose.model("Message", messageSchema);