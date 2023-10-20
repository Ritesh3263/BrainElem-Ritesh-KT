const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserModel = require("./user.model");

const teamSchema = new Schema({
    name: String,
    status: {
        type: String,
        enum: ["active", "deleted"],
        default: "active",
    },
    trainee: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    academicYear: Date,
    classManager: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    brainCoreTest: {
        registerDate: Date,
        completionDate: Date,
        status: {
          type: String,
          enum: ["Missed", "Completed", "Not Completed", "Request sent"],
          default: "Request sent"
        },
        completed: Number,
        missed: Number,
        notCompleted: Number,
        requestDate: Date
    }
}, {timestamps: true});

module.exports = mongoose.model("team", teamSchema);