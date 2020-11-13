const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const statesValids = {
    values: ['READ', 'SAVED'],
    message: '{VALUE} not role valid!!'
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
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'SAVED',
        required: [true, "Status is required!"],
        enum: statesValids
    }
});

module.exports = mongoose.model("Message", messageSchema);