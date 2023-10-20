const mongoose = require("mongoose");



const InterestSchema =  new mongoose.Schema({
 _id: { type: Number},
 name: { type: String, required: [ true, 'Interest name is required' ], unique: true},
 subinterests: [{ type: mongoose.Schema.Types.Number, ref: 'Subinterest'}],
}, { timestamps: true })

const Interest = mongoose.model("Interest", InterestSchema);

module.exports = Interest;
