const mongoose = require("mongoose");
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const FormatSchema =  new mongoose.Schema({ 
    name: {type: String},
    startDate: {type: Date},
    endDate: {type: Date},
    startsAtTheSameTime: {type: Boolean, default: true },
    daysOfWeek: [{
        day: {type: String, enum: days},
        start: {type: Date},
        end: {type: Date}
     }],
    initFormat: {type: Boolean},
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
 }, { timestamps: true }
)
FormatSchema.pre('remove', function(next) {
 console.log("Removing Format:", this._id)
 next()
});

const Format = mongoose.model("Format", FormatSchema);
module.exports = Format;
