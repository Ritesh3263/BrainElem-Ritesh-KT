const mongoose = require("mongoose");
const utils = require("../utils/models")

const ChapterSchema =  new mongoose.Schema({
 name: {type: String, required: [ true, 'Chapter name required']},
 description: {type: String},
 dependantChapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter'}],
 assignedContent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content'}], // all possible contents, can be seen from blue eye in the curriculum creation
 creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
 level: {type: String, enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED",null]},
 type: {type: String},
 durationTime: {type: Number},
 module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
 addedByTrainer: { type: Boolean }, 
 otherContentsByTrainers:[
  {
    contents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content'}],
    trainingModule: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingModule'}, // duplicated tm // future idea: if we ever need to associate this same chapter for multiple trainingModules, we need to add array of trainingModules
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  }
 ],
 isRemoved: { type: Boolean, default: false },
 origin: {type: mongoose.Schema.Types.ObjectId, ref: 'Chapter'}, // if missing = not duplicated for program
 createdAt: {type:Date},
 updatedAt: {type:Date}
}, { timestamps: true })

ChapterSchema.pre('remove', async function(next) {
 console.log("Removing Chapter", this._id)
 //this.contents.forEach( docId => Content.findOne({'_id': docId}, function(err, doc){if (err) console.error(err); else if (doc) doc.remove()}))
 utils.removeScopes(this._id)
 next()
});


const Chapter = mongoose.model(
  "Chapter", ChapterSchema
);


module.exports = Chapter;
