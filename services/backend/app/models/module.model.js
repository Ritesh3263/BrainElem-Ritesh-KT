const mongoose = require("mongoose");
const GroupSchema = require("./group.model");
const utils = require("../utils/models");

const ModuleSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Module name required"] },
    core: {type: mongoose.Schema.Types.ObjectId, ref: "ModuleCore"},// can remove this line
    moduleType: {
      type: String,
      required: [true, "Module type required"],
      enum: ["SCHOOL", "TRAINING", "COGNITIVE"],
    },
    associatedModule: { type: mongoose.Schema.Types.ObjectId },
    description: { type: String },
    expires: { type: Date, es_type: "date", es_indexed: true },
    isActive: { type: Boolean, default: 1 },
    language: { type: String, enum: ["fr", "en"], default: "fr" },
    usersLimit: { type: Number, min: 0 },
    archived: {type: Boolean, default: false },
  },
  { timestamps: true }
);

ModuleSchema.pre("remove", function (next) {
  console.log("Removing Module", this._id);
  utils.removeScopes(this._id);
  next();
});

module.exports = ModuleSchema;
