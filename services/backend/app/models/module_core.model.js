const mongoose = require("mongoose");


const ModuleCoreSchema = new mongoose.Schema({
    moduleId: {type: mongoose.Schema.Types.ObjectId, ref: "Module"},
    trainingModules:  [ { type: mongoose.Schema.Types.ObjectId, ref: "TrainingModule" } ],
    trainingPaths:  [ { type: mongoose.Schema.Types.ObjectId, ref: "TrainingPath" } ],
    academicYears: [ { type: mongoose.Schema.Types.ObjectId, ref: "AcademicYearRef" } ],
    categories:[ { type: mongoose.Schema.Types.ObjectId, ref: "CategoryRef" } ],
    rolePermissions:[ { type: mongoose.Schema.Types.ObjectId, ref: "RolePermissionRef" } ],
    gradingScales: [ {type: mongoose.Schema.Types.ObjectId, ref: "GradingScaleRef"} ],
    defaultGradingScale: {type: mongoose.Schema.Types.ObjectId, ref: "GradingScaleRef"},
    gradingScales:  {type: [mongoose.Schema.Types.ObjectId], ref: "GradingScaleRef", default: ['5ca130000000000000000000', '5ca13000000000000000000a']}, 
    levels: [ { levelName: {type: String} } ],
    groups: [ { type: mongoose.Schema.Types.ObjectId, ref: "Group" } ],
    archived: {type: Boolean, default: false },
    credits: [{
        creditType: {type: String, enum: ["BRAINCORE_TEST"]},
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        available: {type: Number, default: 0},
        used: {type: Number, default: 0}
    }]
    
}, {timestamps: true}) // retainKeyOrder: true >> doesn't work!

ModuleCoreSchema.pre('remove', function (next){
    console.log("Removing module setup", this._id)
    next();
})

const ModuleCore = mongoose.model(
    "ModuleCore", ModuleCoreSchema
  );
// module.exports = ModuleCoreSchema;
module.exports = ModuleCore;