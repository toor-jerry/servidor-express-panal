const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: [true, "User is required!"]
    },
    user_agent: {
        type: String
    },
    ip_add: {
        type: String
    },
    hostname: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Connection", connectionSchema);