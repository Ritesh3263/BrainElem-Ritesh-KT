const mongoose = require("mongoose");
const ContentFile = require("./content_file.model")

const PageElementSchema =  new mongoose.Schema({
    type: {type: String, es_indexed:false},
    subtype: {type: String, es_indexed:false},
    name: {type: String},
    title: {type: String},
    titleLocation: {type: String},
    isRequired: {type: Boolean},
    caseSensitive: {type: Boolean, default: false},
    diacriticSensitive: {type: Boolean, default: false},
    defaultValue: {type: mongoose.Schema.Types.Mixed},
    correctAnswer: {type: mongoose.Schema.Types.Mixed, es_indexed:false},
    pointsForCorrectAnswer: {type: Number},
    choices:  {type: mongoose.Schema.Types.Mixed, es_indexed:false },
    items:  {type: [mongoose.Schema.Types.Mixed], es_indexed:false },
    pipsValues: {type: [Number], es_indexed:false},
    pipsText: {type: [String], es_indexed:false},
    rangeMax: {type: Number, es_indexed:false},
    rangeMin: {type: Number, es_indexed:false},
    //test: {type: mongoose.Schema.Types.ObjectId, ref: "Content"},// Nested test inside presentation
    file: {type: mongoose.Schema.Types.ObjectId, ref: "ContentFile", es_indexed:true, es_schema: ContentFile.schema},// File
    locked: {type: Boolean},

 }, { timestamps: true }
)

PageElementSchema.pre('remove', function(next) {
 console.log("Removing PageElement:", this._id)
 next()
});

module.exports = PageElementSchema;
