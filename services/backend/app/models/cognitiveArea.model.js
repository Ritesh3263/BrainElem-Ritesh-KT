const mongoose = require("mongoose");



const ExternalResourceSchema = new mongoose.Schema({
    'type': { type: String, enum: ["video", "presentation"] },
    'title': { type: String },
    'url': { type: String },
}, { _id: false })

const OpportunitySchema = new mongoose.Schema({
    // Unique key for each opportunity - # <area>_<opp_type>_<number>_<part> eg: 1_2_1_1
    'key': { type: String },
    //The reader for which descriptions will be displayed
    'readerType': { type: String, enum: ["student", "teacher", "class-teacher", "parent", "employee", "leader", "team-leader", ""] },
    // Age group of the target(user taking the test)
    // groups 12,15,18 are for Pedagogy test 
    // group 24 - is the only group for all adults
    'ageGroup': { type: String, enum: ["12", "15", "18", "24", ""] },
    'type': { type: String, enum: ["sociological", "psychological", "development"] },
    'number': { type: String },// Unique number of opportunity in this area - from spreadsheet
    'area': { type: String, enum: ["1", "2", "3", "4", "5"] },// To which area it belongs
    'imageUrl': { type: String },// From activity

    'text': { type: mongoose.Schema.Types.Mixed },// {'EN': 'Example in EN', FR: 'Example in FR}
    'activities': new mongoose.Schema({// Materials are inserted as contents
        "EN": [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }],
        "PL": [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }],
        "FR": [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }],
    }, { _id: false }),

    'solutions': [new mongoose.Schema({
        'text': { type: mongoose.Schema.Types.Mixed },// {'EN': 'Example in EN', FR: 'Example in FR}
    }, { _id: false })]
}, { _id: false })

// Model for storing text/descriptions for all areas
const CognitiveAreaSchema = new mongoose.Schema({
    // Unique key for each area - from 1-5
    'key': { type: String, enum: ["1", "2", "3", "4", "5"] },
    //The reader for which descriptions will be displayed
    'readerType': { type: String, enum: ["student", "teacher", "class-teacher", "parent", "employee", "leader", "team-leader", ""] },
    // Age group of the target(user taking the test)
    // groups 12,15,18 are for Pedagogy test 
    // group 24 - is the only group for all adults
    'ageGroup': { type: String, enum: ["12", "15", "18", "24", ""] },
    'type': { type: String, enum: ["reading"] },
    // Multi-language objects - keys are 2-leters langage codes ################################################################
    'name': { type: mongoose.Schema.Types.Mixed },// {'EN': 'Example in EN', FR: 'Example in FR}
    'description': { type: mongoose.Schema.Types.Mixed },// {'EN': 'Example in EN', FR: 'Example in FR}
    'impact': { type: mongoose.Schema.Types.Mixed },// {'EN': 'Example in EN', FR: 'Example in FR}
    'benefits': { type: mongoose.Schema.Types.Mixed },// {'EN': 'Example in EN', FR: 'Example in FR}

    'imageUrl': '',
    'materials': new mongoose.Schema({// Materials are inserted as contents
        "EN": [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }],
        "PL": [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }],
        "FR": [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }],
    }, { _id: false }),
    'courses': new mongoose.Schema({// Courses in the system
        "EN": [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
        "PL": [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
        "FR": [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    }, { _id: false }),
    'externalResources': new mongoose.Schema({
        "EN": { type: [ExternalResourceSchema] },
        "PL": { type: [ExternalResourceSchema] },
        "FR": { type: [ExternalResourceSchema] }
    }, { _id: false }),

    'opportunities': { type: [OpportunitySchema] }


}, { timestamps: true, _id: false })

module.exports = mongoose.model("cognitiveArea", CognitiveAreaSchema);