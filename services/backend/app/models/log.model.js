// Model for storing logs
const mongoose = require("mongoose");

// Creating Schema
const logSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
    status: {type: Boolean, default: true, es_indexed:true}, // if 0 the log is closed, to count how many times user logged out/in 
    action: { type: String },
    actionType: { type: String }, // TODO: add enum, e.g. ['reading', 'watching', 'writing', 'listening'] etc.
    details: {type: mongoose.Schema.Types.Mixed},
    // details: { // some data from window.navigator
    //     totalTime: { type: Number, default: 0 }, 
    //     inactiveTime: { type: Number, default: 0 }, 
    //     inTime: { type: Number, default: 0 },  // opposite of awayTime
    //     awayTime: { type: Number, default: 0 }, 
    //     rawAwayTime: { type: Number, default: 0 },  // calculated by substracting log_creation_time+inTime from Date(now)
    //     inactiveCount: { type: Number, default: 0 }, 
    //     awayCount: { type: Number, default: 0 }, 
    //  },

    accessedURLs: [{ 
        _id: false,
        name: String,
        inTime: { type: Number, default: 0 },
        date: { type: Date },
    }], // TODO: add enum, e.g. ['settings', 'explore', 'content', `test`, 'gradebook', 'profile'] etc., we can push into array every accessed URL path
    timeSpent: { type: Number }, // in seconds/minutes
    timeSpentOnContentCreation: { type: Number }, // in seconds/minutes
    preview: { type: mongoose.Schema.Types.Mixed }, // possibly screenshot of the view/page or some text from the view/page, or some other data
    userDeviceInfo: { // some data from window.navigator
        ip: { type: String }, // internet protocol address
        device: { type: String }, // add enum for device, e.g. mobile, desktop, tablet etc
        platform: { type: String }, // add enum for platform, e.g. android, ios, windows etc
        browser: { type: String }, // add enum for browser, e.g. chrome, firefox, safari etc
        language: { type: String }, // add enum for language, e.g. en, de, fr, es etc.
        timezone: { type: String }, // add enum for timezone, e.g. GMT+01:00, GMT+02:00, GMT+03:00 etc.
        userAgent: { type: String }, // user agent string
     }, 
}, { timestamps: true });

// Creating a Model from that Schema
const Log = mongoose.model("Log", logSchema);

// Exporting the Model
module.exports = Log;
