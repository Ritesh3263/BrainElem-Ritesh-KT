const mongoose = require("mongoose");
const ModuleCore = require("../models/module_core.model");

const AcademicYearRefSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: 'yearName is required'
    },
    periods: [{
        name: {
            type: String,
            required: 'periodName is required'
        },
        startDate: {
            type: Date,
            required: 'startDate is required'
        },
        endDate: {
            type: Date,
            required: 'endDate is required'
        }
    }]
}, { timestamps: true })

AcademicYearRefSchema.pre('findOneAndDelete', function(next) {
    console.log("Removing Item", this._conditions._id)
    ModuleCore.updateOne( // updateMany
        { academicYears: this._conditions._id }, // make empty condition to update many
        { $pull: { academicYears: this._conditions._id } }
    ).exec();
    next()
});

const AcademicYearRef = mongoose.model("AcademicYearRef", AcademicYearRefSchema);

module.exports = AcademicYearRef;
