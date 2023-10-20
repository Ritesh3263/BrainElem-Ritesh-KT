const mongoose = require("mongoose");
const EQFLevels = [null,'','Level 1','Level 2','Level 3','Level 4','Level 5','Level 6','Level 7','Level 8'];
const CertificationSession = require("../models/certification_session.model");

const CertificateSchema =  new mongoose.Schema({
    name: { type: String},
    // identificationCode: { type: String }, seems like we don't have it no more in Figma, https://www.figma.com/file/432UZIEOXtrqDKgUeTg3N3/Elia-Platform%3A-Training-Center?node-id=607%3A97128
    image: { type: mongoose.Schema.Types.ObjectId, ref: 'ContentImage' },
    description: { type: String},
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
    EQFLevel: { type: String, enum: EQFLevels, default: null },
    expires: { type:Date, es_type:'date'}, // Registration deadline ?
    template: { type: String, enum: ['TEMPLATE_1', 'TEMPLATE_2', 'TEMPLATE_3', 'TEMPLATE_4']}, 
    assignedCompetenceBlocks: [{ type: mongoose.Schema.Types.Number, ref: 'CompetenceBlock'}],
    externalCompetences: [{ type: mongoose.Schema.Types.Number, ref: 'Competence'}], // need competence collection
    file: { type: String}, // attachment
    // hasPrerequisite: { type: Boolean },
    // assignedMaterials: [{type: mongoose.Schema.Types.ObjectId, ref: 'Content' }], // or subject/chapter?
    // prerequisiteContents:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }], // or subject/chapter?
    // prerequisiteExams:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }],
}, { timestamps: true, toJSON: { virtuals: true }})

CertificateSchema.pre('remove', function(next) {
 console.log("Removing Item", this._id)
 next()
});

CertificateSchema.virtual('EQFLevels').get(function () {
    return EQFLevels;
});

CertificateSchema.methods.existInModule = function(moduleId) {
    if (this.module == moduleId) return true;
};
CertificateSchema.methods.existInSessionForTrainer = function(userId) {
    return CertificationSession.find({examiners: { $elemMatch: {$eq: userId} }, certificate: this._id}).exec();
};

CertificateSchema.methods.existInSessionForTrainee = function(userId) {
    return CertificationSession.find({trainees: { $elemMatch: {$eq: userId} }, certificate: this._id}).exec();
};

const Certificate = mongoose.model("Certificate", CertificateSchema);
module.exports = Certificate;
