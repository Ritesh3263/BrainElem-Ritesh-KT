const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserModel = require("./user.model");
const ModuleModel = require("./module.model");

// Cognitive Block
const cognitiveBlockSchema = new Schema({
    content: { type: Schema.Types.ObjectId, ref: "Content" }, // solution ID 
    deadline: { type: Date },
    progress: { type: Number, default: 0 },
    status: {type: mongoose.Schema.Types.Mixed},//{<user_id>: status } - status can be ['todo', 'in_progress', 'done']
});

// OPPORTUNITY 
const cognitiveBlockCollectionSchema = new Schema({ 
    users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],// those users are involved in that opportunity
    // opportunityKey: { type: String, required: true},
    opportunity: { type: String },// Reference to cognitveArea.opportunity - but it is nested schema so reference will not work
    progress: { type: Number, default: 0 },
    deadline: { type: Date },
    feedback: {type: mongoose.Schema.Types.Mixed},//{<user_id>: {confirmed: 1, useful: -1}}
    cognitiveBlocks: [{type: cognitiveBlockSchema, required: true}]
});

const projectSchema = new Schema({
    //status [['todo', 'in_progress', 'done', 'delayed']
    //progress <int> in range 0,100
    team: { type: Schema.Types.ObjectId, ref: "team" },
    progress: { type: Number, default: 0 },
    name: { type: String, required: true},
    description: { type: String },
    module: { type: Schema.Types.ObjectId, ref: "module", required: true}, 
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    deadline: { type: Date }, // of whole project 
    cognitiveBlockCollection: [{type: cognitiveBlockCollectionSchema, required: true}],
}, { timestamps: true });

module.exports = mongoose.model("project", projectSchema);
