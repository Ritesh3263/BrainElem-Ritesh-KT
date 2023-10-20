const mongoose = require("mongoose");
const InternshipSchema =  new mongoose.Schema({
    name: { type: String},
    description: { type: String},
    //subinterests: [{ type: mongoose.Schema.Types.Number, ref: 'Subinterest'}], //CATEGORY on FIGA, https://www.figma.com/file/432UZIEOXtrqDKgUeTg3N3/Elia-Platform:-Training-Center?node-id=95%3A63913
    company: {type: mongoose.Schema.Types.ObjectId, ref: "Company"}, // for location
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'CategoryRef'},
    durationTime: {type: Number}, // in hours 
    isActive: {type: Boolean, default: true },
    online: {type: Boolean, default: false },
    guideline: { type: String},
    guidelineFile: { type: String},
    content:  { type: mongoose.Schema.Types.ObjectId, ref: "Content" },
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
    //trainees: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}], // question to UX, how to 'manage' students inside internship inside session?
}, { timestamps: true })

InternshipSchema.pre('remove', function(next) {
 console.log("Removing Item", this._id)
 next()
});

const Internship = mongoose.model("Internship", InternshipSchema);

module.exports = Internship;
