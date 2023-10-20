const mongoose = require("mongoose");

// Model for storing text/descriptions for all tips
const CognitiveTipSchema =  new mongoose.Schema({
    // Key for tip - the same as in elia-algorithms eg: `X_Y` - where X is the row number and Y is the number of tip in this row 
    'key': {type: String},
    //The reader for which descriptions will be displayed
    'readerType': { type: String, enum: ["student", "teacher", "class-teacher", "parent", "employee", "leader", "team-leader", ""] },
    // Age group of the target(user taking the test)
    // groups 12,15,18 are for Pedagogy test 
    // group 24 - is the only group for all adults
    'ageGroup': { type: String, enum: ["12", "15", "18", "24", ""] },

    // Multi-language object - keys are 2-leters langage codes
    'introduction': {type: mongoose.Schema.Types.Mixed},// {'EN': 'Example of introduction'}
    'text': {type: mongoose.Schema.Types.Mixed},// {'EN': 'Example of text'}
    'reasoning': {type: mongoose.Schema.Types.Mixed},// {'EN': 'Example of reasoning'}

}, { timestamps: true, _id : false })

module.exports = mongoose.model("cognitiveTip", CognitiveTipSchema);