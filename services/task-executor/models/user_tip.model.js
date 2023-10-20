const mongoose = require("mongoose");

const UserTipSchema =  new mongoose.Schema({
    tip: {type: String, ref: "Tip"},
    displayDate: {type:Date},
    //feedback: [{}]
}, { timestamps: true, _id : false })

module.exports = UserTipSchema;