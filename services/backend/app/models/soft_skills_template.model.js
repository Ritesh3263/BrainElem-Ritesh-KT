const mongoose = require("mongoose");
const Group = require("./group.model");

const SoftSkillsTemplateSchema = new mongoose.Schema(
  {
    name: {type: String},
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    softSkills: [{ type: mongoose.Schema.Types.Number, ref: 'SoftSkill'}],
  },
  { timestamps: true }
);
SoftSkillsTemplateSchema.pre('remove', function(next) {
  console.log("Removing SoftSkillsTemplate:", this._id)
  next()
});

SoftSkillsTemplateSchema.methods.belongsViaGroup = async function(userId) {
    return await Group.exists({ _id:this.group,  $or: [{classManager: userId},{'program.assignment.trainers': userId}]})
};
 
const SoftSkillsTemplate = mongoose.model("SoftSkillsTemplate", SoftSkillsTemplateSchema);

module.exports = SoftSkillsTemplate;