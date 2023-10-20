const mongoose = require("mongoose");
const TrainingModule = require("./training_module.model");
const utils = require("../utils/models");

const TrainingPathSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Training Module name required"],
    },
    description: { type: String},
    level: {
      _id: false, 
      levelName: {type: String},
      // levelNumber: {type: Number},
    },
    type: {
      type: String,
      required: [true, "Type required"],
      enum: ["BLENDED", "ONLINE"],
    },
    assignedYear: {type: mongoose.Schema.Types.ObjectId, ref: "AcademicYearRef"},
    assignedPeriod: {type: String},
    trainingModules: [{
      _id: false, // this is not trainingModuleID but in case a unique ID is needed for easy manipulation/management at the frontend
      newName: { type: String }, 
      estimatedTime: {type: Number},
      image: {type: mongoose.Schema.Types.ObjectId, ref: 'CourseImage'}, // using the same model for images as in TRAINING 
      chosenChapters: [{
        _id: false,
        chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter'},
        chosenContents: [{
          _id: false,
          content: { type: mongoose.Schema.Types.ObjectId, ref: 'Content'},
        }],
      }],
      externalExams: [{
        _id: false,
        name: { type: String },
        createdAt: { type: Date } // as a unique connector to gradebook results 
      }],
      originalTrainingModule: {type: mongoose.Schema.Types.ObjectId, ref: "TrainingModule"},
    }],
    isPublic: { type: Boolean }, // visibility: public/private
    origin: {type: mongoose.Schema.Types.ObjectId, ref: 'TrainingPath'}, // if missing = not duplicated for program
  },
  { timestamps: true }
);

TrainingPathSchema.pre(
  "remove",
  { query: true, document: true },
  async function (next) {
    console.log("Removing TrainingPath", this._id);
    this.trainingModules.forEach((docId) =>
      TrainingModule.findOne({ _id: docId }, function (err, doc) {
        if (err) console.error(err);
        else if (doc) doc.remove();
      })
    );
    utils.removeScopes(this._id);
    next();
  }
);

const TrainingPath = mongoose.model("TrainingPath", TrainingPathSchema);

module.exports = TrainingPath;
