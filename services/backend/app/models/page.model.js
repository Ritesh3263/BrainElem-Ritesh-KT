const mongoose = require("mongoose");
const PageElementSchema = require("./page-element.model");

const PageSchema =  new mongoose.Schema({
    name: {type: String},
    title: {type: String},
    elements: [PageElementSchema]

 }, { timestamps: true }
)

PageSchema.pre('remove', function(next) {
 console.log("Removing Page:", this._id)
 next()
});

module.exports = PageSchema;
