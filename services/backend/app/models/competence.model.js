const mongoose = require("mongoose");

const CompetenceSchema =  new mongoose.Schema({
    _id: { type: Number},
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
    title: { type: String, required: [ true, 'Competence title is required' ] }, // TODO: unique: true in FRONT, service function added `checkTitle`
    gradingScale: { type: mongoose.Schema.Types.ObjectId, ref: "GradingScaleRef"},
    block: { type: mongoose.Schema.Types.Number, ref: 'CompetenceBlock'}, // this will be useful only if CompetenceBlock-to-Cpmpetence is one-to-many relation, otherwise comment this line
}, { timestamps: true })

CompetenceSchema.pre('remove', function(next) {
 console.log("Removing Item", this._id)
 next()
});

const Competence = mongoose.model("Competence", CompetenceSchema);

module.exports = Competence;