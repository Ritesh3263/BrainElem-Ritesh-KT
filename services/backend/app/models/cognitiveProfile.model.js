const mongoose = require("mongoose");

// Model for storing text/descriptions for all profiles
const CognitiveProfileSchema =  new mongoose.Schema({
    // Unique key for each profile - the same as in elia-algorithms eg: `agent`
    'key': {type: String},
    //The reader for which descriptions will be displayed
    'readerType': { type: String, enum: ["student", "teacher", "class-teacher", "parent", "employee", "leader", "team-leader", ""] },
    // Age group of the target(user taking the test)
    // groups 12,15,18 are for Pedagogy test 
    // group 24 - is the only group for all adults
    'ageGroup': { type: String, enum: ["12", "15", "18", "24", ""] },

    // Multi-language object - keys are 2-leters langage codes
    'name': {type: mongoose.Schema.Types.Mixed},// {'EN': 'Example of text'}


     // Divided into gender, multi-language object - keys are masculine/female and then 2-leters langage codes
    'story': {type: mongoose.Schema.Types.Mixed},//{masculine: {'EN': 'Example of text'}}
    'learningStyleCharacteristics': {type: mongoose.Schema.Types.Mixed},//{masculine: {'EN': 'Example of text'}}
    'learningStyleExplanation': {type: mongoose.Schema.Types.Mixed},//{masculine: {'EN': 'Example of text'}}
    'development': {type: mongoose.Schema.Types.Mixed},//{masculine: {'EN': 'Example of text'}}

    // Array of multi-language object
    'attributes' : {type: mongoose.Schema.Types.Mixed},// {'EN': ['description X', 'description Y'] }

}, { timestamps: true, _id : false })

module.exports = mongoose.model("cognitiveProfile", CognitiveProfileSchema);