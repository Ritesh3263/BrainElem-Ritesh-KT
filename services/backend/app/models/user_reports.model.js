const mongoose = require("mongoose");
const UserReportsSchema =  new mongoose.Schema({
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    comment: {type: String},
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" }, 
    date: {type: Date},
    softSkillsTemplate: {type: mongoose.Schema.Types.ObjectId, ref: "SoftSkillsTemplate"},
    softSkills: [{
            _id: {type: mongoose.Schema.Types.Number, ref: "SoftSkill"}, 
            rate: {type: Number}
            }],
    // activities: [{ }], TODO 
 }, { timestamps: true }
)

module.exports = UserReportsSchema;