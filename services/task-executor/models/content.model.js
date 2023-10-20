const mongoose = require("mongoose");
const PageSchema = require("./page.model");


const ContentSchema = new mongoose.Schema({
    trainingModule: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingModule" },
    chapter:  { type: mongoose.Schema.Types.ObjectId, ref: "Chapter" },
    tags:  [{ type: Number, ref: "Subinterest"}],
    language: { type: String},
    pages: { type: [PageSchema]},
  }, { timestamps: true }
)


const Content = mongoose.model("Content", ContentSchema);

module.exports = Content;
