// Model for recording user activity and time spent
const mongoose = require("mongoose");

// possibly to be merge with `logs.model` and removed 
const activitySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String }, // TODO: add enum, e.g. ['reading', 'watching', 'writing', 'listening'] etc.
    accessedURLs: [{ type: String }], // TODO: add enum, e.g. ['settings', 'explore', 'content', `test`, 'gradebook', 'profile'] etc., we can push into array every accessed URL path
    timeSpent: { type: Number }, // in seconds/minutes
    timeSpentOnContentCreation: { type: Number }, // in seconds/minutes
    preview: { type: mongoose.Schema.Types.Mixed }, // possibly screenshot of the view/page or some text from the view/page, or some other data
    device: { type: String }, // add enum for device, e.g. mobile, desktop, tablet etc
    ip: { type: String }, // internet protocol address 
}, { timestamps: true });

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
