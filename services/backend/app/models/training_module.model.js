const mongoose = require("mongoose");
const Chapter = require("./chapter.model")
const utils = require("../utils/models")
const TrainingModuleImage = require("../models/training_module_image.model");

const TrainingModuleSchema =  new mongoose.Schema({
 name: {type: String, required: [ true, 'Training Module name required']},
 category: {type: mongoose.Schema.Types.ObjectId, ref: 'CategoryRef'}, // I leave it so as not to spoil the related dependencies 18.02.2022 Ch.
 categories: [{type: mongoose.Schema.Types.ObjectId, ref: 'CategoryRef'}],
 estimatedTime: {type: Number},
 hours: {type: Number},
 chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter'}],
 module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
 books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
 image: {type: mongoose.Schema.Types.ObjectId, ref: 'TrainingModuleImage'}, // only if origin exist, https://www.figma.com/file/NZtnc4flLPsrusxjrQ9zYD/School(upd)_program%26curr_0322?node-id=47%3A60691
 origin: {type: mongoose.Schema.Types.ObjectId, ref: 'TrainingModule'}, // if missing = not duplicated for program
}, { timestamps: true })

TrainingModuleSchema.pre('remove', async function(next) {
 console.log("Removing TrainingModule", this._id)
 this.chapters.forEach( docId => Chapter.findOne({'_id': docId}, function(err, doc){if (err) console.error(err); else if (doc) doc.remove()}))
 utils.removeScopes(this._id)
 next()
});


const TrainingModule = mongoose.model(
  "TrainingModule", TrainingModuleSchema
);


module.exports = TrainingModule;
