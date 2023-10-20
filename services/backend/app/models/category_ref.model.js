const mongoose = require("mongoose");

const CategoryRefSchema =  new mongoose.Schema({
    name: {type: String},
    description: {type: String},
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
}, { timestamps: true })

CategoryRefSchema.pre('remove', function(next) {
 console.log("Removing Item", this._id)
 next()
});

const CategoryRef = mongoose.model("CategoryRef", CategoryRefSchema);

module.exports = CategoryRef;
