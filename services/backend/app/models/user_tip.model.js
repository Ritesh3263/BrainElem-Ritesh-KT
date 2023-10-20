const mongoose = require("mongoose");

const UserTipSchema =  new mongoose.Schema({
    _id: {type: String, ref: "Tip"},
    displayDate: {type:Date},
    feedback: {type: mongoose.Schema.Types.Mixed}
}, { timestamps: true, _id : false })

module.exports = UserTipSchema;