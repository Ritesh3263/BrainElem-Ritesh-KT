const mongoose = require("mongoose");
const ModuleSchema = require("./module.model");
const utils = require("../utils/models");
const UserSchema = require("./user.model");



//Ch: I Was add usersList to model for test
const SubscriptionSchema =  new mongoose.Schema({
    name: {type: String, require: true},
    description: {type: String},
    modules: [ ModuleSchema ],
    owner: {type: UserSchema, defaule: {}},

    createdAt: {type: Date, default: Date.now },
    updatedAt: {type: Date, default: Date.now }
}, { timestamps: false })
// due to following error, related to timestamps updatedAt
// subscription.controller.js, exports.update()
// error code: 40
// codeName: "ConflictingUpdateOperators"
// https://stackoverflow.com/a/39405511/9588862


SubscriptionSchema.pre('remove', function(next) {
    console.log("Removing Subsciption", this._id)
    utils.removeScopes(this._id)
    next()
});

// SubscriptionSchema.pre('save', function(next){
//     console.log("is here yet?2", this)
//     now = new Date();
//     this.updatedAt = now;
//     if(!this.createdAt) {
//         this.createdAt = now
//     }
//     next();
// });
module.exports = SubscriptionSchema;
