const mongoose = require("mongoose");
const sanitizer = require('mongoose-sanitize');

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

connectionSchema.plugin(sanitizer);
module.exports = mongoose.model("Connection", connectionSchema);