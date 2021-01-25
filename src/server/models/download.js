const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const platformValids = {
    values: ['WINDOWS', 'IOS', 'ANDROID', 'LINUX'],
    message: '{VALUE} not role valid!!'
};

const downloadSchema = new Schema({
    platform: {
        type: String,
        required: [true, "Platform is required!"],
        default: "WINDOWS",
        enum: platformValids
    },
    architecture: {
        type: String,
        required: [true, "Architecture is required!"],
    },
    description: {
        type: String,
        required: [true, "Description is required!"]
    },
    version: {
        type: String,
        required: [true, "Version is required!"]
    },
    link: {
        type: String,
        unique: true,
        required: [true, "Link is required!"]
    },
    createAt: {
        type: Date,
        default: Date.now,
        required: [true, "Date is required!"]
    }
});

downloadSchema.plugin(uniqueValidator, { message: 'La propiedad "{PATH} debe ser única!!' });
module.exports = mongoose.model("Download", downloadSchema);