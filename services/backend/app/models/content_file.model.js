// Calling the "mongoose" package
const mongoose = require("mongoose");

// Creating a Schema for uploaded files
const contentFileSchema = new mongoose.Schema({
  fileOriginalName: { type: String, required: [true, "Uploaded file must have a fileOriginalName"]},
  fileName: { type: String, required: [true, "Uploaded file must have a fileName"], },
  mimeType: String,
  fileTextExtracted: String,
  size: Number
}, { timestamps: true });

// Creating a Model from that Schema
const ContentFile = mongoose.model("ContentFile", contentFileSchema);

// Exporting the Model
module.exports = ContentFile;
