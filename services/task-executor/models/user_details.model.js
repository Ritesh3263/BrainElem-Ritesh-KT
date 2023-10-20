const mongoose = require("mongoose");
const Subinterest = require("./subinterest.model")

const UserDetailsSchema =  new mongoose.Schema({
    subinterests:  [{ type: Number, ref: "Subinterest"}],
    country: {type: String},
    dateOfBirth: {type: String},
 }, { timestamps: true }
)

module.exports = UserDetailsSchema;
