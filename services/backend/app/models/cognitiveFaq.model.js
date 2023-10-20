const mongoose = require("mongoose");

// Model for storing text/descriptions for all FAQ
const CognitiveFaqSchema =  new mongoose.Schema({
    // Unique key for each profile - the same as in elia-algorithms eg: ``
    'key': {type: String},
    //The reader for which descriptions will be displayed
    'readerType': { type: String, enum: ["student", "teacher", "class-teacher", "parent", "employee", "leader", "team-leader", ""] },
    // Age group of the target(user taking the test)
    // groups 12,15,18 are for Pedagogy test 
    // group 24 - is the only group for all adults
    'ageGroup': { type: String, enum: ["12", "15", "18", "24", ""] },

    // Whether this question is for mobile or not
    'mobile': Boolean,

    // Multi-language object - keys are 2-leters langage codes
    'question': {type: mongoose.Schema.Types.Mixed},// {'EN': 'Example of question'}
    'answer': {type: mongoose.Schema.Types.Mixed},// {'EN': 'Example of answer'}

    // Divided into levels, multi-language object - keys are levels 1-5 and then 2-leters langage codes
    //'descriptions': {type: mongoose.Schema.Types.Mixed},//'descriptions': {'level_1': {'EN': ['description X', 'description Y'] }}

    
}, { timestamps: true, _id : false })

module.exports = mongoose.model("cognitiveFaq", CognitiveFaqSchema);