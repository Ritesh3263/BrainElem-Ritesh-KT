const mongoose = require("mongoose");
const SubscriptionSchema = require("./subscription.model");
// const ModuleCoreSchema = require("./module_core.model");
const utils = require("../utils/models")

const EcosystemSchema =  new mongoose.Schema({
 name: {type: String},
 description: {type: String},
 isActive: {type: Boolean},
 isCloudActive: {type: Boolean},
 subscriptions: [ SubscriptionSchema ]
}, { timestamps: true })

EcosystemSchema.pre('remove', function(next) {
 console.log("Removing Ecosystem", this._id)
 utils.removeScopes(this._id)
 next()
});

const Ecosystem = mongoose.model("Ecosystem", EcosystemSchema);
// const ModuleCore = mongoose.model("ModuleCore", ModuleCoreSchema);

// module.exports = {Ecosystem,ModuleCore};
module.exports = Ecosystem;
