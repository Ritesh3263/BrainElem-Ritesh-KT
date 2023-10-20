const mongoose = require("mongoose");

const EnquirySchema =  new mongoose.Schema({ 
    name: {type: String},
    company: {type: mongoose.Schema.Types.ObjectId, ref: "Company"},
    contact: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    addedByModuleManager: {type: Boolean, default: false },
    externalContact: {
        name:{type: String},
        surname:{type: String},
        position:{type: String},
        email:{type: String},
        phone:{type: String},
    },
    status: {type: String, enum: ["New", "Pending", "In developement", "Active", "Closed"]}, // https://www.figma.com/file/432UZIEOXtrqDKgUeTg3N3/Elia-Platform%3A-Training-Center?node-id=771%3A138046
    architect: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // actually ModuleManager
    digitCode: {type: String},
    startDate: {type: Date},
    endDate: {type: Date},
    // from Partner:
    esitmatedStartDate: {type: Date}, // set by Partner while enquiring
    additionalQuestion: {type: String}, // asked by Partner while enquiring
    traineesCount: {type: Number}, // number provided while enquiring by Partner
    // from ModuleManger: 
    traineesLimit: {type: Number}, // maximum number of students who can attend 'session'/enquiry, set by ModuleManger
    trainees: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    // format: { type: mongoose.Schema.Types.ObjectId, ref: "Format" }, TODO later on
    timeFormat:{type:String},
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
    certificationSession: {type: mongoose.Schema.Types.ObjectId, ref: "CertificationSession"}, // as enquiry is created from session
 }, { timestamps: true }
)
EnquirySchema.pre('remove', function(next) {
 console.log("Removing Enquiry:", this._id)
 next()
});

const Enquiry = mongoose.model("Enquiry", EnquirySchema);
module.exports = Enquiry;
