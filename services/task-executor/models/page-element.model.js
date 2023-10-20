const mongoose = require("mongoose");

const PageElementSchema = new mongoose.Schema({
    file: { type: mongoose.Schema.Types.ObjectId, ref: "ContentFile" },// File
}, { timestamps: true }
)


module.exports = PageElementSchema;
