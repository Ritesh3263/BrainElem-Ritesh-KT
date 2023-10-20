const mongoose = require("mongoose");
const Course = require("./course.model")

const CoursePathSchema =  new mongoose.Schema({ 
    // general information
    name: {type: String},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'CategoryRef'},
    description: {type: String},
    level: {type: String, enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"]},
    type: { type: String, enum: ["BLENDED", "ONLINE"]},
    image: {type: mongoose.Schema.Types.ObjectId, ref: 'CoursePathImage'},
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // content materials
    certificate: {type: mongoose.Schema.Types.ObjectId, ref: "Certificate"},
    internships: [{type: mongoose.Schema.Types.ObjectId, ref: "Internship"}],
    courses: [{type: mongoose.Schema.Types.ObjectId, ref: "Course", es_schema: Course.schema, es_select: 'name chosenChapters'}],
    origin: {type: mongoose.Schema.Types.ObjectId, ref: 'CoursePath'}, // if missing = not duplicated for session
 }, { timestamps: true }
)
CoursePathSchema.pre('remove', function(next) {
 console.log("Removing CoursePath:", this._id)
 next()
});

const CoursePath = mongoose.model("CoursePath", CoursePathSchema);
module.exports = CoursePath;
