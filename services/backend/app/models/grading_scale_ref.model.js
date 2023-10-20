const mongoose = require("mongoose");

const GradingScaleRefSchema =  new mongoose.Schema({
    name: {type: String},
    description: {type: String},
    passPercentage: {type: Number}, // made for accessing next chapters, for certificates 
    grades: [ 
        {
            _id: false,
            label: {type: String},
            shortLabel: {type: String},
            maxPercentage: {type: Number},
        }
    ],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // to distinguish between custom and built-in scales
}, { timestamps: true })

GradingScaleRefSchema.pre('remove', function(next) {
 console.log("Removing Item", this._id)
 next()
});

const GradingScaleRef = mongoose.model("GradingScaleRef", GradingScaleRefSchema);

module.exports = GradingScaleRef;
