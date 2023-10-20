const mongoose = require("mongoose");

// Model for storing text/descriptions for all traits
const CognitiveTraitSchema =  new mongoose.Schema({
    // Unique key for each trait - the same as in elia-algorithms eg: `self-motivation`
    'key': {type: String},
    //The reader for which descriptions will be displayed
    'readerType': { type: String, enum: ["student", "teacher", "class-teacher", "parent", "employee", "leader", "team-leader", ""] },
    // Age group of the target(user taking the test)
    // groups 12,15,18 are for Pedagogy test 
    // group 24 - is the only group for all adults
    'ageGroup': { type: String, enum: ["12", "15", "18", "24", ""] },

    // Multi-language object - keys are 2-leters langage codes
    'abbreviation': {type: mongoose.Schema.Types.Mixed},// 'shortName': {'EN': 'N1'}
    'shortName': {type: mongoose.Schema.Types.Mixed},// 'shortName': {'EN': 'Example of shortName'}
    'shortDescription': {type: mongoose.Schema.Types.Mixed},// 'shortDescription': {'EN': 'Example of shortDescription'}
    'mainDefinition': {type: mongoose.Schema.Types.Mixed},// 'mainDescription': {'EN': 'Example of definition'}
    'lowestDefinition':{type: mongoose.Schema.Types.Mixed},// 'lowestDescription': {'EN': 'Example of definition'}
    'highestDefinition': {type: mongoose.Schema.Types.Mixed},// 'highestDescription': {'EN': 'Example of definition'}

    // Multi-language object with arrays
    'neurobiologicalEffects': {type: mongoose.Schema.Types.Mixed},// {'PL': ["Effect 1", "Effect 2"], 'EN': [], 'FR': []},

    // Divided into levels, multi-language object - keys are levels 1-5 and then 2-leters langage codes
    'descriptions': {type: mongoose.Schema.Types.Mixed},//'descriptions': {'level_1': {'EN': ['description X', 'description Y'] }}
    'actions': {type: mongoose.Schema.Types.Mixed},//'actions': {'level_1': {'EN': ['action X', 'action Y'] }}
    
}, { timestamps: true, _id : false })


module.exports = mongoose.model("cognitiveTrait", CognitiveTraitSchema);