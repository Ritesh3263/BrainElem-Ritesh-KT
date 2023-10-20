const mongoose = require("mongoose");

const TrainingModuleRecommendationSchema =  new mongoose.Schema({
 trainingModule: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingModule", required: [ true, 'TrainingModule ID required' ]},
 label: {type: String, required: [ true, 'Label type required' ], enum: ['NO_FIT', 'BAD_FIT', 'GOOD_FIT', 'EXCELENT_FIT']},
 value: {type: Number, required : true, min: 0, max: 100 },
}, { timestamps: true })

module.exports = TrainingModuleRecommendationSchema;
