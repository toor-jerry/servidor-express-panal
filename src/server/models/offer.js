const mongoose = require("mongoose");
const rolesValids = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'USER_PLATINO_ROLE', 'ENTERPRISE_ROLE', 'ALL', 'USER_PLATINO_ROLE__AND__ENTERPRISE_ROLE'],
    message: '{VALUE} not role valid!!'
};
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required!"]
    },
    description: {
        type: String,
        required: [true, "Description is required!"]
    },
    role: {
        type: String,
        required: [true, "Role is required!"],
        default: "USER_ROLE",
        enum: rolesValids
    },
    duration: {
        type: Date
    }
});

module.exports = mongoose.model("Offer", offerSchema);