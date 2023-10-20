const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserModel = require("./user.model");
const ModuleModel = require("./module.model");

const teamSchema = new Schema({
    name: {
        type: String,
    },
    status: {
        type: String,
        enum: ["active", "deleted"],
        default: "active",
    },
    module: { type: Schema.Types.ObjectId, ref: "module" },
    trainee: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    // Demo team - used for marketing purposes
    isDemo: {type: Boolean, default: false},
    academicYear: Date,
    classManager: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
}, {timestamps: true});

module.exports = mongoose.model("team", teamSchema);