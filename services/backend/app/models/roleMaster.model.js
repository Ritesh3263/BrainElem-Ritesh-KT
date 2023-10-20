const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ModuleModel = require("./module.model");

const roleMasterSchema = new Schema({
  name: { type: String, unique: true },
  description: { type: String },
  protected: { type: Boolean, default: false }, // true = role is protected from deletion  
  status: {
    type: String,
    enum: ["active", "deleted", "inActive"],
    default: "inActive",
  },
  module: { type: Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.model("roleMaster", roleMasterSchema);
