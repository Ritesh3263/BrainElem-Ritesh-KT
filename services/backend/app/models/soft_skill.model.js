const mongoose = require("mongoose");

const SoftSkillSchema =  new mongoose.Schema({
    _id: { type: Number},
    name: { type: String, required: [ true, 'Soft skill name is required' ] }, 
    range: {type: Number, default: 6 },
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },

    // label: { type: Number}, future feature, to set individual values like for grading scales
    // value: { type: Number}, future feature, to set individual values like for grading scales
}, { timestamps: true })

SoftSkillSchema.pre('remove', function(next) {
 console.log("Removing Item", this._id)
 next()
});

const SoftSkill = mongoose.model("SoftSkill", SoftSkillSchema);

module.exports = SoftSkill;