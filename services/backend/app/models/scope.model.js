const mongoose = require("mongoose");

const ScopeSchema =  new mongoose.Schema({
 name: {type: String, required : true },
}, { timestamps: true })

ScopeSchema.pre('deleteMany', async function(next) {
 console.log("Removing Scopes")
 next()
});



module.exports = ScopeSchema;
