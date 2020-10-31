const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const settingSchema = new Schema({
    bg: {
        type: String,
        required: [true, "Bg is required!"]
    },
    navbar: {
        type: String,
        required: [true, "Navbar is required!"]
    },
    navbarBg: {
        type: String,
        required: [true, "NavbarBg is required!"]
    },
    workArea: {
        type: String,
        required: [true, "WorkArea is required!"]
    },
    breadCrumb: {
        type: String,
        required: [true, "BreadCrumb is required!"]
    },
    sideBar: {
        type: String,
        required: [true, "SideBar is required!"]
    },
    custom: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Setting", settingSchema);