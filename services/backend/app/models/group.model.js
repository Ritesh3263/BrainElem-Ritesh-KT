const mongoose = require("mongoose");
const ModuleCore = require("./module_core.model");
const CoursePath = require("./course_path.model");

const GroupSchema =  new mongoose.Schema({ 
    name: {type: String},
    trainees: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}], // consider spliting document in collection - classes/groups
    
    // SCHOOL CENTER
    level: {type: String},
    classManager: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    academicYear: {type: mongoose.Schema.Types.ObjectId, ref: "AcademicYearRef"},
    program: [{ // number of programs = number of periods in academicYear above^
        onGoing: {type: Boolean, default: false}, // only one program can be `true` (onGoing) in a group.
        reprogram: {type: Boolean, default: false}, // only one program can be `true` (onGoing) in a group.
        // var reprogram => `1` delete all the old contents and create new duplicate once more
        // var reprogram => `0` content doesn't change but basic info is edited
        period: {type: String}, // get corresponding period from academicYear above^
        trainingPath: {type: mongoose.Schema.Types.ObjectId, ref: "TrainingPath"}, // keeping original trainingPath just for reference
        duplicatedTrainingPath:{type: mongoose.Schema.Types.ObjectId, ref: "TrainingPath"}, // the instance of trainingPath created for this class, saving process done in backend 
        assignment: [{ // number of assignments = number of trainingModules in original trainingPath above^
            trainingModule: {type: mongoose.Schema.Types.ObjectId, ref: "TrainingModule"}, // in backend - controller, we will replace  originalTrainingModules with the newly created ones 
            trainers: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        }],
    }],
    // TRAINING CENTER ('auth' too needs to consider using this for training center)
    // only one of them can be selected (not empty)
    coursePath:{type: mongoose.Schema.Types.ObjectId, ref: "CoursePath"},
    duplicatedCoursePath: {type: mongoose.Schema.Types.ObjectId, ref: "CoursePath"},
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" }, // needed as initiating group by ModuleManger doesn't have any other atribute (not even name)
 }, { timestamps: true }
)
GroupSchema.pre('remove', function(next) {
 console.log("Removing Group:", this._id)
 next()
});

// Find all trainingPaths associated with the group
GroupSchema.methods.getTrainingPathsIds = function() {
    return this.program.map(p => p.trainingPath);
}

// Find all modules associated with the group
GroupSchema.methods.getModulesIds = async function() {
    // This is not yet implemented, as groups do not have moduleId property
    // Once done, and after updating database, all the code below this line might be removed
    if (this.module) return [this.module]

    // Code below is going to be removed while group.moduleId will be implemented
    let modules = []
    // SchoolCenter
    let trainingPaths = this.getTrainingPathsIds();
    for (const trainingPath of trainingPaths) {
        let moduleCore = await ModuleCore.findOne({ 'trainingPaths': trainingPath}).catch(() => false);
        if (moduleCore && modules.indexOf(moduleCore.moduleId) === -1) modules.push(moduleCore.moduleId)
    }

    // TrainingCenter
    if (this.duplicatedCoursePath){
        let coursePath = await CoursePath.findById(this.duplicatedCoursePath)
        modules.push(coursePath.module);
    }

    return modules;
}

const Group = mongoose.model("Group", GroupSchema);

module.exports = Group;
