const mongoose = require("mongoose");
const sanitizer = require('mongoose-sanitize');

const Schema = mongoose.Schema;

const typesValids = {
    values: ['JOB_OFFER', 'SOCIETY_SERVICE', 'PROFESSIONAL_PRACTICES'],
    message: '{VALUE} not role valid!!'
};


const employmentSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required!"]
    },
    enterprise: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Enterprise is required!"]
    },
    salary: {
        type: String,
        required: [true, "Salary is required!"]
    },
    horary: {
        type: String
    },
    workable_days: {
        type: String
    },
    description: {
        type: String
    },
    vacancy_numbers: {
        type: Number
    },
    domicile: {
        type: String
    },
    category: {
        type: String
    },
    requeriments: {
        type: String
    },
    dateCreate: {
        type: Date,
        default: Date.now
    },
    dateLimit: {
        type: Date
    },
    type: {
        type: String,
        required: true,
        default: "JOB_OFFER",
        enum: typesValids
    },
    state: {
        type: Boolean,
        default: true
    }
});

employmentSchema.plugin(sanitizer);
module.exports = mongoose.model("Employment", employmentSchema);