const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const sanitizer = require('mongoose-sanitize');
const uuid = require('uuid');

const Schema = mongoose.Schema;

const rolesValids = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'USER_PLATINO_ROLE', 'ENTERPRISE_ROLE'],
    message: '{VALUE} not role valid!!'
};

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required!"]
    },
    last_name: {
        type: String,
        required: [false, "Lastname is required!"]
    },
    user: {
        type: String,
        unique: true,
        required: [true, "User is required!"]
    },
    email: {
        type: String,
        required: [true, "Email is required!"]
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
    },
    role: {
        type: String,
        required: true,
        default: "USER_ROLE",
        enum: rolesValids
    },
    domicile: {
        street: String,
        number: Number,
        colony: String,
        municipality: String,
        country: String
    },
    nacionality: {
        type: String
    },
    gender: {
        type: String
    },
    date_birth: {
        type: String
    },
    speciality: {
        type: String
    },
    professional_titles: {
        type: String
    },
    last_job: {
        type: String
    },
    description: {
        type: String
    },
    photography: {
        type: String
    },
    cv: {
        type: String
    },
    credential: {
        type: String
    },
    thumbnail_photography: {
        type: String
    },
    whatsapp: {
        type: String
    },
    movil_phone: {
        type: String
    },
    telephone: {
        type: String
    },
    facebook: {
        type: String
    },
    twitter: {
        type: String
    },
    instagram: {
        type: String
    },
    youtube_channel: {
        type: String
    },
    blog_personal: {
        type: String
    },
    page_web: {
        type: String
    },
    location: {
        type: String
    },
    theme: {
        type: Schema.Types.ObjectId,
        ref: 'Theme'
    },
    rfc: {
        type: String
    },
    google: {
        type: Boolean,
        default: false
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    state: {
        type: Boolean,
        default: true
    },
    connections: {
        type: Boolean,
        default: true
    },
    contacts: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    conversations: [{
        type: Schema.Types.ObjectId,
        ref: 'Room'
    }],
    notifications: [{
        type: Object
    }],
    seed: {
        type: String,
        default: uuid.v1()
    }
});

userSchema.plugin(sanitizer);
userSchema.plugin(uniqueValidator, {
    message: 'La propiedad {PATH} debe ser única!!'
});
// No retornan una propiedad
userSchema.methods.toJSON = function() {
    let usuario = this;
    let userObj = usuario.toObject();
    delete userObj.password;
    delete userObj.seed;
    return userObj;
}


module.exports = mongoose.model("User", userSchema);