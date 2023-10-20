const mongoose = require("mongoose");

const types = ['CALENDAR_EVENT','MEETING_STARTED','COMMON', "PUSH"];

const notificationSchema =  new mongoose.Schema({
        name: {type: String},
        content: {type: String},
        type: {type: String, enum: types, default: 'CALENDAR_EVENT' },
        module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
        // I added this propery to save some additional iformation for the notificaion
        // For example I needed an event Id to open the event when user clicks on the notification
        details:  {type: mongoose.Schema.Types.Mixed},
    }, { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
