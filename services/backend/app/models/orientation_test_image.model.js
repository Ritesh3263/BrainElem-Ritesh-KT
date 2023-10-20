// Model for storing orientationTest covers(images) informations
// Calling the "mongoose" package
const mongoose = require("mongoose");

// Creating a Schema for uploaded files
const orientationTestImageSchema = new mongoose.Schema({
  fileOriginalName: { type: String, required: [true, "Uploaded file must have a fileOriginalName"]},
  fileName: { type: String, required: [true, "Uploaded file must have a fileName"], },
  mimeType: String,
  size: Number
}, { timestamps: true });

// Creating a Model from that Schema
const OrientationTestImage = mongoose.model("OrientationTestImage", orientationTestImageSchema);

// Exporting the Model
module.exports = OrientationTestImage;
