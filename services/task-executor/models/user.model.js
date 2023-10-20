const mongoose = require("mongoose");

const UserSettingsSchema = require("./user_settings.model.js");
const UserDetailsSchema = require("./user_details.model.js");
const UserTipSchema = require("./user_tip.model");
const ContentRecommendationSchema = require("./content_recommendation.model");
const TeamModel = require("./team.model");

const UserSchema = new mongoose.Schema({
  tips: [ UserTipSchema ],
  settings: {type: UserSettingsSchema, default: {}},
  contentRecommendations: [ ContentRecommendationSchema ],
  details: {type: UserDetailsSchema, default: {}},
  email: {type: String, trim: true, unique: true, sparse: true},
  teams: {type: [mongoose.Schema.Types.ObjectId], ref: "team"},
  brainCoreTest: {
    registerDate: Date,
    completionDate: Date,
    status: {
      type: String,
      enum: ["Missed", "Completed", "Not Completed", "Request sent"],
    },
    reminderEmailSent: Boolean,
    requestDate: Date
  }
  }, { timestamps: true }
)

const User = mongoose.model("User", UserSchema);

module.exports = User;