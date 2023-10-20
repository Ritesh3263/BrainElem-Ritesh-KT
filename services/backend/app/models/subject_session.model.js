const mongoose = require("mongoose");


// Proper way to do it
// const SubjectSessionDetailsSchema =  new mongoose.Schema({
//   description: {type: String}, 
// })


const SubjectSessionSchema =  new mongoose.Schema({ 
    
    // name: {type: String }, // actually name of subject + name of group
    group: {type: mongoose.Schema.Types.ObjectId, ref: "Group"}, // core of SubjectSession
    period: { type: String },
    trainingModule: {type: mongoose.Schema.Types.ObjectId, ref: "TrainingModule"}, // subject identifier/ called originalTrainingModule in trainingpath
    // report , assignedGroup , assignedSubject (to be added to reports)
    // events , assignedGroup + assignedSubject
    // result/gradebook , from events
    // examinate, from events
    //details: [SubjectSessionDetailsSchema],
    image: {type: mongoose.Schema.Types.ObjectId, ref: 'CourseImage'}, // using the same model for images as in TRAINING 
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module",  es_indexed:true},
 }, { timestamps: true }
)


SubjectSessionSchema.pre('remove', function(next) {
 console.log("Removing SubjectSession:", this._id)
 next()
});

SubjectSessionSchema.methods.existInModule = function(moduleId) {
    if (this.module == moduleId) return true;
};

const SubjectSession = mongoose.model("SubjectSession", SubjectSessionSchema);

module.exports = SubjectSession;