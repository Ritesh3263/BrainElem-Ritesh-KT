const mongoose = require("mongoose");
const Interest = require("./interest.model")

const SubinterestSchema =  new mongoose.Schema({
_id: { type: Number},
 name: { type: String, required: [ true, 'Interest name is required' ]},
 interest: { type: mongoose.Schema.Types.Number},
}, { timestamps: true })

const Subinterest = mongoose.model("Subinterest", SubinterestSchema);

module.exports = Subinterest;
