const mongoose = require("mongoose");

const Schema = mongoose.Schema;

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
    state: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("Employment", employmentSchema);