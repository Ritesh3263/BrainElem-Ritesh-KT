const mongoose = require("mongoose");
const ConnectedDevice = require("./connectedDevice.model");
const roles = ['Root','EcoManager','CloudManager','NetworkManager','ModuleManager','Assistant','Partner','Architect','TrainingManager', 'Librarian', 'Trainer', 'Parent', 'Inspector', 'Trainee','Coordinator','Other']; // other is when user alter role/ when role is undefined
const UserSettingsSchema =  new mongoose.Schema({
    language: {type: String, enum: ['fr', 'en', 'pl'], default: "fr"},
    origin: {type: String, enum: ['fr_FR', 'en_GB','pl_PL'], default: "fr_FR"},
    role: {type: String, enum: roles, default: 'Other'},
    availableRoles: {type: [String], enum: roles},
    connectedDevices:[{type: mongoose.Schema.Types.ObjectId, ref: "ConnectedDevice"}],
    userNotifications:[{
        notification: {type: mongoose.Schema.Types.ObjectId, ref: 'Notification'},
        isRead: {type: Boolean, default: false},
    }],
    timezone: {
        type: String,
        default: 'Europe/Paris'
    }
 }, { timestamps: true, toJSON: { virtuals: true } }
)

module.exports = UserSettingsSchema;
