const mongoose = require("mongoose");

const ContentRecommendationSchema =  new mongoose.Schema({
 content: { type: mongoose.Schema.Types.ObjectId, ref: "Content", required: [ true, 'Content ID required' ]},
 score: {type: Number, required : true, min: 0, max: 1 },
}, { timestamps: true })

module.exports = ContentRecommendationSchema;
