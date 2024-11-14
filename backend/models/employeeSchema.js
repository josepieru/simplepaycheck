const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phonenumber: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    sinnumber: { type: Number, required: true },
    bankaccount: { type: Number, required: true },
    transit: { type: Number, required: true },
    hourlyrate: { type: Number, required: true },
    workedhours: { type: Number, required: true },
    taxes: { type: Number, required: true },
});

module.exports = mongoose.model('employee', employeeSchema);
