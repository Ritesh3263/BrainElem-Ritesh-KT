const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ModuleModel = require("./module.model");

const permissionsModuleList = require("./../utils/permissionsModuleList");

const permissionsSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    module: {
        type: Schema.Types.Mixed,
    },
    status: {
        type: String,
        enum: ["active", "deleted"],
        default: "active",
    },
    moduleName: {
        type: String,
        enum: permissionsModuleList
    },
    access: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    description: String,
    protected: { type: Boolean, default: false }, // true = permission is protected from deletion  
}, { timestamps: true });

module.exports = mongoose.model("permissions", permissionsSchema);