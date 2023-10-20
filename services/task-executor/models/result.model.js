const mongoose = require("mongoose");

const ResultSchema =  new mongoose.Schema({
 content: { type: mongoose.Schema.Types.ObjectId, ref: "Content"}, // not mendatory as external exams may be available without the need of content ID
 user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
 timeSpent: {type: Number},
 data: {},
 profiles: {type: mongoose.Schema.Types.Mixed},   // cognitive profiles assigned
 traits: {type: mongoose.Schema.Types.Mixed},   // normalized values of cognitive traits
 opportunities: {type: mongoose.Schema.Types.Mixed},   // assigned opportunities
 tips: {type: mongoose.Schema.Types.Mixed},   // assigned tips
}, { timestamps: true })


const Result = mongoose.model("Result", ResultSchema);

module.exports = Result;
