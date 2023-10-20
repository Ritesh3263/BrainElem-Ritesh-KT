const mongoose = require("mongoose");

const CreditsRequestSchema = new mongoose.Schema({
    // Number of requested credits 
    number: {type: Number, required: true},
    // User who requested credits
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    // Status of request
    status: {type: String, required: true, default: "AWAITING", enum: ['AWAITING', 'ACCEPTED', 'REJECTED']},
  }, { timestamps: true }
)


const CreditsRequest = mongoose.model("CreditsRequest", CreditsRequestSchema);

module.exports = CreditsRequest;
