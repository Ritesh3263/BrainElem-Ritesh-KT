const mongoose = require("mongoose");

const TrainingModuleSchema =  new mongoose.Schema({
 name: {type: String, required: [ true, 'Training Module name required'], es_indexed:true},
}, { timestamps: true })

const TrainingModule = mongoose.model(
  "TrainingModule", TrainingModuleSchema
);

module.exports = TrainingModule;
