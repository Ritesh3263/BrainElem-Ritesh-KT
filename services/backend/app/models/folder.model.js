const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FolderSchema = new Schema({
    name: {type: String},
    parent: {type: mongoose.Schema.Types.ObjectId, ref: "Folder"}, // parent folder, if it doesn't have a parent, it's a root folder
    children: {type: [mongoose.Schema.Types.ObjectId], ref: "Folder"}, // subfolders
    files: {type:[mongoose.Schema.Types.ObjectId], ref: "Content"}, // now it is contents, or can be other things
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    // createdFor: {type: mongoose.Schema.Types.ObjectId, ref: "User"}, // to discuss
    // periodId: { type: String, required: true }, // to discuss

}, {timestamps: true});

module.exports = mongoose.model("Folder", FolderSchema);