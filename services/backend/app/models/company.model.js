const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    name: {type: String},
    // details
    email: {type: String, trim: true, unique: true, sparse: true}, // unique if not null
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
    phone: {type: String},
    street: {type: String},
    buildNr: {type: String},
    postcode: {type: String},
    city: {type: String},
    country: {type: String},
    description: {type: String},
    isActive: {type: Boolean, default: 0 },
    commercialSector: {type: String},
    // branch: {type: String},
    // registrationId: {type: String},
    // members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // members of the company
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    ownerPosition: {type: String},
    trainees: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    examiners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // trainers
    otherUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

CompanySchema.pre('remove', function(next) {
  console.log("Removing Company:", this._id)
  next()
 });
 
const Company = mongoose.model("Company", CompanySchema);

module.exports = Company;