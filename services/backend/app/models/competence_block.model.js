const mongoose = require("mongoose");
const Subinterest = require("./subinterest.model")
const CompetenceBlockSchema =  new mongoose.Schema({
    _id: { type: Number},
    title: { type: String, required: [ true, 'Competence Block title is required' ]}, // service function added `checkTitle`
    identificationCode: { type: String }, // TODO: unique: true in FRONT, service function added `identificationCode`
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
    tags:  [{ type: Number, ref: "Subinterest", es_indexed:true, es_schema: Subinterest.schema}],
    competences: [{ type: mongoose.Schema.Types.Number, ref: 'Competence'}],
    assesmentMethod: {
        name: { type: String},
        file: { type: String}, // for the moment we don't use files here
    },
    assesmentCriteria: {
        name: { type: String},
        file: { type: String},
    }
}, { timestamps: true })

CompetenceBlockSchema.pre('remove', function(next) {
 console.log("Removing Item", this._id)
 next()
});

const CompetenceBlock = mongoose.model("CompetenceBlock", CompetenceBlockSchema);

module.exports = CompetenceBlock;