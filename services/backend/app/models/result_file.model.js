// Calling the "mongoose" package
const mongoose = require("mongoose");
const fs = require('fs')

// Creating a Schema for uploaded files
const resultFileSchema = new mongoose.Schema({
  fileOriginalName: { type: String, required: [true, "Uploaded file must have a fileOriginalName"]},
  fileName: { type: String, required: [true, "Uploaded file must have a fileName"], },
  mimeType: String,
  size: Number,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"}
}, { timestamps: true });


resultFileSchema.pre('remove', function(next) {
  console.log(`Removing result file ${this._id}.`)
  console.log(this)
  fs.unlinkSync(`./public/result/files/${this.fileName}`)
  next()
});

// Creating a Model from that Schema
const ResultFile = mongoose.model("ResultFile", resultFileSchema);

// Exporting the Model
module.exports = ResultFile;
