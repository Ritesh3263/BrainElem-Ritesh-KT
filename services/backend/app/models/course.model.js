const mongoose = require("mongoose");
const Group = require("./group.model");

const Chapter = require("./chapter.model")
const Content = require("./content.model")

const CourseSchema = new mongoose.Schema(
  {
    name: {type: String,default: 'New course name'},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'CategoryRef'},
    description: {type: String},
    level: {type: String, enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"], default: 'BEGINNER'},
    type: { type: String, enum: ["PRIVATE", "PUBLIC","BLENDED", "ONLINE"], default: 'ONLINE'}, //"BLENDED", "ONLINE" to be deleted
    image: {type: mongoose.Schema.Types.ObjectId, ref: 'CourseImage'},
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // LIBRARY
    sendToLibrary: {type: Boolean, es_indexed:true},
    approvedByLibrarian: {type: Boolean, default: false},
    libraryStatus: {type: String, enum: ['PRIVATE', 'AWAITING','ACCEPTED','REJECTED'], es_indexed: true},
    approvedInLibraryAt: {type:Date}, 
    rejectedInLibraryAt: {type:Date},
    version: {type: Number, es_indexed:true}, // first acceptance, version = 1; next acceptance: version += 1; 
   
    chosenChapters: [{
      _id: false,
      chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', es_schema: Chapter.schema, es_select: 'name'},
      chosenContents: [{
        _id: false,
        content: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', es_schema: Content.schema, es_select: 'title contentType'},
      }],
    }],
    origin: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'}, // if missing = not duplicated for session
  },
  { timestamps: true }
);
CourseSchema.pre('remove', function(next) {
  console.log("Removing Course:", this._id)
  next()
});

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;