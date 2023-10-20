const mongoose = require("mongoose");

const ChapterSchema =  new mongoose.Schema({
 name: {type: String, required: [ true, 'Chapter name required']},
 description: {type: String},

}, { timestamps: true })

const Chapter = mongoose.model(
  "Chapter", ChapterSchema
);

module.exports = Chapter;
