const mongoose = require("mongoose");
const sanitizer = require('mongoose-sanitize');

const Schema = mongoose.Schema;

const menuSchema = new Schema({
    role: {
        type: String,
        required: [true, "Role is required!"]
    },
    description: {
        type: String,
        required: [true, "Description is required!"]
    },
    menu: {
        type: String,
        required: [true, "Menu is required!"]
    }
});

menuSchema.plugin(sanitizer);
module.exports = mongoose.model("Menu", menuSchema);