const mongoose = require("mongoose");
const PageElementSchema = require("./page-element.model");

const PageSchema =  new mongoose.Schema({
    elements: [PageElementSchema]
 }, { timestamps: true }
)

module.exports = PageSchema;
